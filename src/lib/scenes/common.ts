import * as THREE from 'three'
import { VoxelGrid, hash3 } from '../voxel/VoxelGrid'
import type { WindowSpot } from './fx/WindowLight'
import type { Bubble } from './types'

/** Voxels per world unit. Room layouts are written in voxel coordinates for RES = 4. */
export const RES = 4

// Every room shares the same shell. Walls sit at x = 0 (left) and z = 0 (right).
export const ROOM = { W: 24, D: 24, H: 17 }
export const VW = ROOM.W * RES
export const VD = ROOM.D * RES
export const VH = ROOM.H * RES

/** Isometric camera angles. */
export const ISO = { azimuth: Math.PI / 4, polar: 0.96 }

export const C = {
  base: '#5e3419',
  baseDark: '#46250f',
  wallOuter: '#6b3a1f',
  wood: '#b5733c',
  woodDark: '#7b4524',
  frame: '#f6e7cc',
  glass: '#fff3e0',
  pot: '#b9603a',
  potDark: '#9c4e2e',
  soil: '#4a2e1e',
  leaves: ['#2f5a24', '#3f6b2e', '#4f7f37', '#5f9442'],
  cream: '#f3e2c0',
  creamDark: '#dcc59d',
  iron: '#2e2724',
  brass: '#c99a4a',
  books: ['#6b8f5e', '#d0a85a', '#a24a3d', '#3f5f73', '#e0cfa8', '#7c4f6e', '#c97c4a', '#8a3b3e', '#4f6f5f'],
}

/** Small seeded RNG so rooms look identical on every load. */
export function rng(seed: number) {
  const next = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Object.assign(next, {
    range: (a: number, b: number) => a + next() * (b - a),
    pick: <T>(arr: T[]) => arr[Math.floor(next() * arr.length)],
  })
}
export type Rng = ReturnType<typeof rng>

/** Voxel coordinates -> local world-space vector. */
export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x / RES, y / RES, z / RES)

export function floor(g: VoxelGrid, planks: string[], groove: string, notch: string) {
  g.box(0, -6, 0, VW - 1, -1, VD - 1, (_x, y) => (y === -6 ? C.baseDark : C.base))
  for (let z = 0; z < VD; z++) {
    const row = Math.floor(z / 4)
    const offset = (row * 11) % 30
    for (let x = 0; x < VW; x++) {
      const plankId = Math.floor((x + offset) / 30)
      let c = planks[Math.floor(hash3(plankId, row, 1) * planks.length)]
      if (z % 4 === 0) c = groove
      else if ((x + offset) % 30 === 0) c = notch
      g.set(x, 0, z, c, { jitter: 0.006 })
    }
  }
}

/** Two walls, 3 voxels thick, dark on the outside. `inner(u, y)` colors the room-facing side. */
export function walls(g: VoxelGrid, inner: (u: number, y: number) => string) {
  g.box(0, 1, 0, 2, VH - 1, VD - 1, (x, y, z) => (x === 0 ? C.wallOuter : inner(z, y)))
  g.box(0, 1, 0, VW - 1, VH - 1, 2, (x, y, z) => (z === 0 || x === 0 ? C.wallOuter : inner(x, y)))
}

/** Bookshelf against the x = 0 wall. u runs along the wall (z), d away from it (x). */
export function shelf(g: VoxelGrid, r: Rng, u0: number, u1: number, d0: number, d1: number, y0: number, y1: number, gap = 11) {
  const put = (u: number, d: number, y: number, c: string) => g.set(d, y, u, c)
  for (let u = u0; u <= u1; u++)
    for (let d = d0; d <= d1; d++)
      for (let y = y0; y <= y1; y++) {
        const side = u <= u0 + 1 || u >= u1 - 1
        const board = y >= y1 - 1 || (y - y0) % gap === 0
        if (side || board) put(u, d, y, C.wood)
        else if (d === d0) put(u, d, y, C.woodDark)
      }
  for (let s = y0; s + gap <= y1 - 1; s += gap) {
    let u = u0 + 2
    while (u < u1 - 1) {
      const roll = r()
      const room = u1 - 1 - u
      if (roll < 0.12) {
        u += 3 // empty gap
      } else if (roll < 0.24 && room >= 7) {
        // a flat stack of books
        for (let k = 0; k < 3; k++) {
          const c = r.pick(C.books)
          for (let w = k % 2; w < 7 - (k % 2); w++)
            for (let d = d0 + 1; d < d1 - 1; d++) put(u + w, d, s + 1 + k * 2, c), put(u + w, d, s + 2 + k * 2, c)
        }
        u += 7
      } else {
        const w = Math.min(room, r() < 0.65 ? 2 : 1)
        const h = Math.floor(r.range(6, 10))
        const c = r.pick(C.books)
        for (let k = 0; k < w; k++)
          for (let d = d0 + 1; d < d1 - 1; d++) for (let y = s + 1; y <= s + h; y++) put(u + k, d, y, c)
        u += w
      }
    }
  }
}

/** Window in the z = 0 wall with a 2x3 pane grid and a deep sill. */
export function windowAt(g: VoxelGrid, x0: number, y0: number): WindowSpot {
  const x1 = x0 + 22, y1 = y0 + 33
  const mx = x0 + 11
  g.clear(x0, y0, 0, x1, y1, 2)
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++) {
      if (x === x0 || x === x1 || y === y0 || y === y1) g.box(x, y, 0, x, y, 3, C.frame)
      else if (x === mx || y === y0 + 11 || y === y0 + 22) g.box(x, y, 1, x, y, 2, C.frame)
      // Panes are left open: WindowLight fills them with frosted glass
    }
  g.box(x0 - 3, y0 - 3, 0, x1 + 3, y0 - 1, 9, C.frame)
  return { x0, y0 }
}

/** Potted plant with long arching leaves. */
export function spikyPlant(g: VoxelGrid, r: Rng, x0: number, y0: number, z0: number, size = 1) {
  const pw = Math.round(7 * size), ph = Math.round(6 * size), pd = Math.round(6 * size)
  g.box(x0, y0, z0, x0 + pw, y0 + ph, z0 + pd, (x, y, z) =>
    y === y0 + ph && x > x0 && x < x0 + pw && z > z0 && z < z0 + pd ? C.soil : y === y0 + ph ? C.potDark : C.pot,
  )
  const cx = x0 + pw / 2, cz = z0 + pd / 2, top = y0 + ph + 1
  const leaves = Math.round(11 * size)
  for (let i = 0; i < leaves; i++) {
    const a = (i / leaves) * Math.PI * 2 + r.range(-0.2, 0.2)
    const L = r.range(12, 19) * size
    const spread = r.range(0.35, 0.6)
    for (let t = 0; t < L; t += 0.5) {
      const x = Math.floor(cx + Math.cos(a) * t * spread)
      const z = Math.floor(cz + Math.sin(a) * t * spread)
      const y = Math.floor(top + t - (t * t) / (L * 1.25))
      if (z < 3 || x < 3) continue
      g.set(x, y, z, C.leaves[Math.min(3, Math.floor((t / L) * 3.2))], { jitter: 0.02 })
    }
  }
}

/** Filled ellipsoid; `color` gets offsets normalized to -1..1. */
export function blob(
  g: VoxelGrid,
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
  color: (dx: number, dy: number, dz: number) => string | null,
) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, dz = (z + 0.5 - cz) / rz
        if (dx * dx + dy * dy + dz * dz > 1) continue
        const c = color(dx, dy, dz)
        if (c) g.set(x, y, z, c)
      }
}

/** Mesh for a tagged bucket; throws early if a layout forgot to tag something. */
export function taggedMesh(meshes: Map<string, THREE.Mesh>, tag: string) {
  const m = meshes.get(`solid:${tag}`)
  if (!m) throw new Error(`No voxels tagged "${tag}"`)
  return m
}

/**
 * Doorway in one of the room's walls, leading to another room. `u0` is where the 12-wide opening
 * starts along the wall: x for the z = 0 wall, z for the x = 0 wall. The leaf is tagged `door-<to>`.
 */
export function interiorDoor(g: VoxelGrid, u0: number, to: string, wall: 'z' | 'x' = 'z') {
  const u1 = u0 + 11
  const tag = `door-${to}`
  // (u along the wall, y, d away from the wall) -> grid
  const box = (ua: number, ya: number, da: number, ub: number, yb: number, db: number, c: Parameters<VoxelGrid['box']>[6]) =>
    wall === 'z' ? g.box(ua, ya, da, ub, yb, db, c) : g.box(da, ya, ua, db, yb, ub, c && typeof c === 'function' ? (x, y, z) => c(z, y, x) : c)
  if (wall === 'z') g.clear(u0, 1, 0, u1, 37, 2)
  else g.clear(0, 1, u0, 2, 37, u1)
  box(u0, 1, -1, u1, 37, -1, '#1f130c') // darkness on the other side
  box(u0 - 2, 1, 0, u0 - 1, 40, 3, C.woodDark)
  box(u1 + 1, 1, 0, u1 + 2, 40, 3, C.woodDark)
  box(u0 - 2, 38, 0, u1 + 2, 40, 3, C.woodDark)
  g.tagged(tag, () => {
    box(u0, 1, 1, u1, 37, 2, (u, y, d) => {
      const inPanel = u > u0 + 1 && u < u1 - 1 && ((y > 4 && y < 17) || (y > 20 && y < 34))
      return d === 2 && inPanel ? '#8d5532' : '#a8683d'
    })
    // Knob on the side away from the hinge
    if (wall === 'z') box(u1 - 2, 18, 3, u1 - 1, 19, 3, C.brass)
    else box(u0 + 1, 18, 3, u0 + 2, 19, 3, C.brass)
  })
  const mid = u0 + 6
  return wall === 'z'
    ? {
        tag,
        hinge: v3(u0, 0, 1),
        marker: v3(mid, 45, 4),
        view: { target: v3(mid, 22, 6), azimuth: 0.22, polar: 1.12, zoom: 2.4 },
      }
    : {
        tag,
        // Hinged on the far end so a positive angle swings the leaf away from the viewer, like the z-wall door
        hinge: v3(1, 0, u1 + 1),
        marker: v3(4, 45, mid),
        view: { target: v3(6, 22, mid), azimuth: Math.PI / 2 - 0.22, polar: 1.12, zoom: 2.4 },
      }
}

/** Re-parent a tagged mesh (a door leaf, a plant) onto a pivot so it can swing or wiggle around that point. */
export function mountDoor(group: THREE.Group, meshes: Map<string, THREE.Mesh>, tag: string, hinge: THREE.Vector3) {
  const pivot = new THREE.Group()
  pivot.position.copy(hinge)
  const leaf = [...meshes].filter(([key]) => key.endsWith(`:${tag}`)).map(([, m]) => m)
  for (const m of leaf) {
    m.position.copy(hinge).negate()
    pivot.add(m)
  }
  group.add(pivot)
  return { pivot, meshes: leaf }
}

/** Springy wiggle for a pivot: `poke()` it and call `update` every frame. */
export function wiggle(pivot: THREE.Object3D, amount = 0.22) {
  let t = -1
  return {
    poke: () => (t = 0),
    update(dt: number) {
      if (t < 0) return
      t += dt
      const k = amount * Math.exp(-t * 2.6)
      pivot.rotation.z = Math.sin(t * 17) * k
      pivot.rotation.x = Math.sin(t * 13 + 1) * k * 0.6
      if (t > 2.5) {
        t = -1
        pivot.rotation.set(0, 0, 0)
      }
    },
  }
}

/** Pop-up words for toys ("ring ring!"): `say` one, `update` every frame, hand `list` to the room's `bubbles`. */
export function speech(life = 1.2) {
  let list: Bubble[] = []
  let n = 0
  return {
    say: (label: string, at: THREE.Vector3) => list.push({ id: `say-${n++}`, label, at: at.clone(), age: 0 }),
    update: (dt: number) => (list = list.map((b) => ({ ...b, age: b.age + dt / life })).filter((b) => b.age < 1)),
    list: () => list,
  }
}
