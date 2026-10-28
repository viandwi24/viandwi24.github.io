import * as THREE from 'three'

export type VoxelKind = 'solid' | 'glow' | 'glass'

export interface VoxelOptions {
  kind?: VoxelKind
  /** Voxels sharing a tag are built into their own mesh so they can be animated. */
  tag?: string
  /** Random lightness variation per voxel. Keep small for a clean, rendered look. */
  jitter?: number
  /** Height of the voxel (0..1), anchored to the bottom of the cell. */
  height?: number
}

type ColorFn = (x: number, y: number, z: number) => THREE.ColorRepresentation | null

interface Voxel {
  x: number
  y: number
  z: number
  color: THREE.Color
  kind: VoxelKind
  tag: string
  jitter: number
  height: number
}

/** Deterministic 0..1 hash so colors stay stable between reloads. */
export function hash3(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

// Coordinates must stay within -256..255 on every axis.
const key = (x: number, y: number, z: number) => ((x + 256) * 512 + (y + 256)) * 512 + (z + 256)

// Each face: outward normal + its 4 corners (unit cube), counter-clockwise from outside.
const FACES = [
  { n: [1, 0, 0], c: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { n: [-1, 0, 0], c: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { n: [0, 1, 0], c: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]] },
  { n: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { n: [0, 0, 1], c: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { n: [0, 0, -1], c: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]] },
] as const

/** Brightness per corner by number of occluding neighbours (classic voxel AO). */
const AO_CURVE = [0.5, 0.68, 0.85, 1]

export class VoxelGrid {
  private voxels = new Map<number, Voxel>()
  private scopeTag = ''

  /** @param voxelSize world-space edge length of one voxel */
  constructor(readonly voxelSize = 1) {}

  /** Everything set inside `fn` gets `tag` (unless it passes its own), making it a separate, clickable mesh. */
  tagged(tag: string, fn: () => void) {
    const prev = this.scopeTag
    this.scopeTag = tag
    try {
      fn()
    } finally {
      this.scopeTag = prev
    }
  }

  set(x: number, y: number, z: number, color: THREE.ColorRepresentation, opts: VoxelOptions = {}) {
    this.voxels.set(key(x, y, z), {
      x,
      y,
      z,
      color: new THREE.Color(color),
      kind: opts.kind ?? 'solid',
      tag: opts.tag ?? this.scopeTag,
      jitter: opts.jitter ?? 0.008,
      height: opts.height ?? 1,
    })
  }

  /** Fill an inclusive box. `color` may be a function returning null to skip a cell. */
  box(
    x0: number, y0: number, z0: number,
    x1: number, y1: number, z1: number,
    color: THREE.ColorRepresentation | ColorFn,
    opts: VoxelOptions = {},
  ) {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
        for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++) {
          const c = typeof color === 'function' ? color(x, y, z) : color
          if (c !== null) this.set(x, y, z, c, opts)
        }
  }

  clear(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
        for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++) this.voxels.delete(key(x, y, z))
  }

  has(x: number, y: number, z: number) {
    return this.voxels.has(key(x, y, z))
  }

  get size() {
    return this.voxels.size
  }

  private opaque(x: number, y: number, z: number) {
    const v = this.voxels.get(key(x, y, z))
    return !!v && v.kind === 'solid' && v.height === 1
  }

  /**
   * Mesh the grid: only faces that can be seen are emitted, with per-vertex AO.
   * One mesh per (kind, tag) bucket.
   */
  build() {
    const s = this.voxelSize
    const materials: Record<VoxelKind, THREE.Material> = {
      solid: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }),
      glow: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      glass: new THREE.MeshStandardMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        roughness: 0.3,
        depthWrite: false,
      }),
    }

    const buckets = new Map<string, Voxel[]>()
    for (const v of this.voxels.values()) {
      const k = `${v.kind}:${v.tag}`
      let list = buckets.get(k)
      if (!list) buckets.set(k, (list = []))
      list.push(v)
    }

    const group = new THREE.Group()
    const meshes = new Map<string, THREE.Mesh>()
    const color = new THREE.Color()

    for (const [bucketKey, list] of buckets) {
      const { kind, tag } = list[0]
      const positions: number[] = []
      const normals: number[] = []
      const colors: number[] = []
      const indices: number[] = []

      for (const v of list) {
        color.copy(v.color).offsetHSL(0, 0, (hash3(v.x, v.y, v.z) - 0.5) * v.jitter * 2)

        for (const face of FACES) {
          const [nx, ny, nz] = face.n
          const px = v.x + nx, py = v.y + ny, pz = v.z + nz
          const n = this.voxels.get(key(px, py, pz))
          // Solid faces are only hidden by neighbours in the same mesh, so tagged
          // meshes can move (hover pop) without exposing holes
          if (n && n.kind === 'solid' && n.height === 1 && (kind !== 'solid' || n.tag === tag)) continue
          if (n && kind !== 'solid' && n.kind === kind && n.tag === tag) continue

          const axis = nx !== 0 ? 0 : ny !== 0 ? 1 : 2
          const t1 = (axis + 1) % 3
          const t2 = (axis + 2) % 3
          const base = positions.length / 3
          const ao: number[] = []

          for (const c of face.c) {
            positions.push((v.x + c[0]) * s, (v.y + c[1] * v.height) * s, (v.z + c[2]) * s)
            normals.push(nx, ny, nz)

            let level = 3
            if (kind === 'solid') {
              const d1 = [0, 0, 0], d2 = [0, 0, 0]
              d1[t1] = c[t1] ? 1 : -1
              d2[t2] = c[t2] ? 1 : -1
              const side1 = this.opaque(px + d1[0], py + d1[1], pz + d1[2])
              const side2 = this.opaque(px + d2[0], py + d2[1], pz + d2[2])
              const corner = this.opaque(px + d1[0] + d2[0], py + d1[1] + d2[1], pz + d1[2] + d2[2])
              level = side1 && side2 ? 0 : 3 - (+side1 + +side2 + +corner)
            }
            ao.push(level)
            const b = AO_CURVE[level]
            colors.push(color.r * b, color.g * b, color.b * b)
          }

          // Flip the quad diagonal so AO gradients interpolate without seams
          if (ao[0] + ao[2] >= ao[1] + ao[3]) indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
          else indices.push(base + 1, base + 2, base + 3, base + 1, base + 3, base)
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geometry.setIndex(indices)
      geometry.computeBoundingSphere()

      // Tagged buckets get their own material so they can be animated independently
      const mesh = new THREE.Mesh(geometry, tag ? materials[kind].clone() : materials[kind])
      mesh.castShadow = kind === 'solid'
      mesh.receiveShadow = kind !== 'glow'
      if (kind === 'glass') mesh.renderOrder = 1
      group.add(mesh)
      meshes.set(bucketKey, mesh)
    }

    const dispose = () => {
      meshes.forEach((m) => {
        m.geometry.dispose()
        if (!Object.values(materials).includes(m.material as THREE.Material)) (m.material as THREE.Material).dispose()
      })
      Object.values(materials).forEach((m) => m.dispose())
    }

    return { group, meshes, dispose }
  }
}
