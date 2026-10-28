import * as THREE from 'three'

export interface SmokeSource {
  /** World-space rectangle of the chimney mouth. */
  x0: number
  x1: number
  z0: number
  z1: number
  y: number
}

const PUFFS = 34
const CUBES_PER_PUFF = 3

interface Puff {
  x: number
  y: number
  z: number
  vy: number
  life: number
  age: number
  size: number
  seed: number
  /** Offsets of the cubes that make up one puff, so it reads as a lumpy cloud. */
  parts: [number, number, number, number][]
}

/** Chunky voxel smoke: puffs rise, grow, drift with the wind and shrink away. */
export class VoxelSmoke {
  readonly group = new THREE.Group()
  private mesh: THREE.InstancedMesh
  private puffs: Puff[] = []
  private dummy = new THREE.Object3D()
  private color = new THREE.Color()

  constructor(private source: SmokeSource, private voxelSize: number) {
    const geo = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ roughness: 1, transparent: true, opacity: 0.78, depthWrite: false })
    this.mesh = new THREE.InstancedMesh(geo, mat, PUFFS * CUBES_PER_PUFF)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.frustumCulled = false
    this.group.add(this.mesh)

    // Stagger ages so the column is already full on the first frame
    for (let i = 0; i < PUFFS; i++) {
      const p = this.spawn()
      p.age = (i / PUFFS) * p.life
      this.advance(p, p.age)
      this.puffs.push(p)
    }
  }

  private spawn(): Puff {
    const { source: s } = this
    const parts: Puff['parts'] = []
    for (let k = 0; k < CUBES_PER_PUFF; k++)
      parts.push([(Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.9, 0.6 + Math.random() * 0.5])
    return {
      x: s.x0 + Math.random() * (s.x1 - s.x0),
      y: s.y,
      z: s.z0 + Math.random() * (s.z1 - s.z0),
      vy: 1.9 + Math.random() * 0.6,
      life: 5.5 + Math.random() * 2,
      age: 0,
      size: 0.55 + Math.random() * 0.35,
      seed: Math.random() * 100,
      parts,
    }
  }

  private advance(p: Puff, dt: number) {
    const k = p.age / p.life
    // Rises fast out of the chimney, then slows and gets pushed by the breeze
    p.y += p.vy * (1 - k * 0.55) * dt
    p.x += (0.6 * k + Math.sin(p.age * 0.9 + p.seed) * 0.15) * dt
    p.z += (0.15 * k + Math.cos(p.age * 0.7 + p.seed) * 0.12) * dt
  }

  update(dt: number) {
    const snap = (v: number) => Math.round(v / this.voxelSize) * this.voxelSize
    let n = 0
    for (const p of this.puffs) {
      p.age += dt
      if (p.age >= p.life) Object.assign(p, this.spawn())
      this.advance(p, dt)

      const k = p.age / p.life
      // Grow quickly, then shrink away at the end of its life
      const grow = Math.min(1, k * 5) * (1 - Math.pow(k, 1.6))
      const scale = p.size * (0.5 + k * 2.2) * grow
      // Fresh smoke is darker, it lightens as it rises
      this.color.setRGB(0.42 + k * 0.3, 0.4 + k * 0.3, 0.39 + k * 0.3)

      for (const [ox, oy, oz, os] of p.parts) {
        const size = Math.max(0, snap(scale * os))
        this.dummy.position.set(snap(p.x + ox * scale), snap(p.y + oy * scale), snap(p.z + oz * scale))
        this.dummy.scale.setScalar(size || 0.0001)
        this.dummy.updateMatrix()
        this.mesh.setMatrixAt(n, this.dummy.matrix)
        this.mesh.setColorAt(n, this.color)
        n++
      }
    }
    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
  }

  dispose() {
    this.mesh.geometry.dispose()
    ;(this.mesh.material as THREE.Material).dispose()
    this.mesh.dispose()
  }
}
