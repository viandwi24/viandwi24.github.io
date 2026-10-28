import * as THREE from 'three'

export interface FireBox {
  /** Inclusive voxel bounds of the flame volume. */
  x0: number
  x1: number
  y0: number
  y1: number
  z0: number
  z1: number
  /** Whether a flame voxel may appear at (y, z), used to keep flames inside the arch. */
  allowed: (y: number, z: number) => boolean
}

// Heat level -> color. Index 0 is "no flame".
const PALETTE = [
  '', '#7a1a08', '#a8260c', '#d03a10', '#f05414', '#ff6f1a', '#ff8a22',
  '#ffa22c', '#ffb838', '#ffcc4a', '#ffdc6a', '#ffeb98', '#fff7d0',
].map((c) => (c ? new THREE.Color(c) : null))
const MAX_HEAT = PALETTE.length - 1
/** Heat below this is treated as hot air: not drawn. */
const MIN_VISIBLE = 4
const TICK = 1 / 22
const SPARKS = 18

/**
 * Pixel fire: a classic "doom fire" heat simulation on the (z, y) plane,
 * extruded into a few depth slices that get cooler toward the edges.
 */
export class VoxelFire {
  readonly group = new THREE.Group()
  /** 0..1, how strong the fire currently is. Drive lights with it. */
  strength = 1

  private heat: Uint8Array
  private width: number
  private height: number
  private mesh: THREE.InstancedMesh
  private sparks: THREE.InstancedMesh
  private sparkState: { x: number; y: number; z: number; vy: number; vz: number; life: number; age: number }[] = []
  private acc = 0
  private time = 0
  /** Seconds of roaring fire left, after a poke. */
  private roar = 0
  private dummy = new THREE.Object3D()

  constructor(private box: FireBox, private voxelSize: number) {
    this.width = box.z1 - box.z0 + 1
    this.height = box.y1 - box.y0 + 1
    this.heat = new Uint8Array(this.width * this.height)

    const depth = box.x1 - box.x0 + 1
    const geo = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize)
    const mat = new THREE.MeshBasicMaterial({ toneMapped: false })
    this.mesh = new THREE.InstancedMesh(geo, mat, this.width * this.height * depth)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.setColorAt(0, new THREE.Color())
    this.mesh.frustumCulled = false
    this.group.add(this.mesh)

    const sparkGeo = new THREE.BoxGeometry(voxelSize * 0.5, voxelSize * 0.5, voxelSize * 0.5)
    const sparkMat = new THREE.MeshBasicMaterial({ color: '#ffc45a', toneMapped: false })
    this.sparks = new THREE.InstancedMesh(sparkGeo, sparkMat, SPARKS)
    this.sparks.frustumCulled = false
    this.group.add(this.sparks)
    for (let i = 0; i < SPARKS; i++) this.sparkState.push(this.newSpark(true))

    // Warm up so the fire is already burning on the first frame
    for (let i = 0; i < 40; i++) this.step()
    this.render()
  }

  private idx(z: number, y: number) {
    return y * this.width + z
  }

  private step() {
    const { width: w, height: h, heat } = this
    this.time += TICK

    // Fuel row: hottest in the middle, flickering, tapering toward the sides
    for (let z = 0; z < w; z++) {
      const u = (z + 0.5) / w
      const profile = Math.sin(u * Math.PI) ** 1.1
      const gust = 0.85 + 0.15 * Math.sin(this.time * 3.1 + z * 0.9)
      // Random dips in the fuel split the flame into separate tongues
      const dip = Math.random() < (this.roar > 0 ? 0.05 : 0.18) ? 6 : 0
      const v = MAX_HEAT * profile * gust - Math.random() * 3 - dip
      heat[this.idx(z, 0)] = Math.max(0, Math.min(MAX_HEAT, Math.round(v)))
    }

    // Spread heat upward with random cooling and sideways drift
    const wind = Math.sin(this.time * 1.7) * 0.6
    for (let y = 1; y < h; y++)
      for (let z = 0; z < w; z++) {
        const src = heat[this.idx(z, y - 1)]
        const r = Math.random()
        const drift = Math.round(r * 2 - 1 + wind * 0.5)
        const dz = Math.min(w - 1, Math.max(0, z + drift))
        // A roaring fire cools slower, so the flames climb higher
        const cool = this.roar > 0 ? (r < 0.55 ? 0 : 1) : r < 0.3 ? 0 : r < 0.75 ? 1 : 2
        heat[this.idx(dz, y)] = Math.max(0, src - cool)
      }
  }

  private render() {
    const { box, voxelSize: s, heat, width: w, height: h } = this
    const cx = (box.x0 + box.x1) / 2
    const halfDepth = (box.x1 - box.x0) / 2 || 1
    let n = 0
    let total = 0

    for (let y = 0; y < h; y++)
      for (let z = 0; z < w; z++) {
        const v = heat[this.idx(z, y)]
        if (y < 3) total += v
        const wy = box.y0 + y
        const wz = box.z0 + z
        if (v < MIN_VISIBLE || !box.allowed(wy, wz)) continue
        for (let x = box.x0; x <= box.x1; x++) {
          // Outer slices need more heat to show, which rounds the flame into a 3D body
          // with a bright core instead of a flat sheet
          const falloff = (Math.abs(x - cx) / halfDepth) ** 2
          if (v < MIN_VISIBLE + falloff * 4) continue
          const hv = Math.max(1, Math.round(v - falloff))
          this.dummy.position.set((x + 0.5) * s, (wy + 0.5) * s, (wz + 0.5) * s)
          this.dummy.updateMatrix()
          this.mesh.setMatrixAt(n, this.dummy.matrix)
          this.mesh.setColorAt(n, PALETTE[hv]!)
          n++
        }
      }

    this.mesh.count = n
    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
    this.strength = Math.min(1.5, total / (w * 3 * MAX_HEAT * 0.55))
  }

  private newSpark(randomAge = false) {
    const { box } = this
    return {
      x: box.x0 + Math.random() * (box.x1 - box.x0 + 2),
      y: box.y0 + 4 + Math.random() * 4,
      z: box.z0 + 2 + Math.random() * (box.z1 - box.z0 - 4),
      vy: (4 + Math.random() * 5) * (this.roar > 0 ? 1.8 : 1),
      vz: (Math.random() - 0.5) * 3,
      life: 0.6 + Math.random() * 0.9,
      age: randomAge ? Math.random() * 1.5 : 0,
    }
  }

  /** Stoke the fire: taller flames and a burst of sparks for a few seconds. */
  stoke() {
    this.roar = 3
    this.sparkState.forEach((p) => Object.assign(p, this.newSpark(), { age: Math.random() * 0.3 }))
  }

  update(dt: number) {
    this.roar = Math.max(0, this.roar - dt)
    this.acc += dt
    let stepped = false
    while (this.acc >= TICK) {
      this.acc -= TICK
      this.step()
      stepped = true
    }
    if (stepped) this.render()

    const s = this.voxelSize
    this.sparkState.forEach((p, i) => {
      p.age += dt
      if (p.age > p.life || !this.box.allowed(Math.floor(p.y), Math.floor(p.z))) Object.assign(p, this.newSpark())
      p.y += p.vy * dt
      p.z += (p.vz + Math.sin(p.age * 9 + i) * 2) * dt
      const k = 1 - p.age / p.life
      this.dummy.position.set(p.x * s, p.y * s, p.z * s)
      this.dummy.scale.setScalar(Math.max(0.001, k))
      this.dummy.updateMatrix()
      this.sparks.setMatrixAt(i, this.dummy.matrix)
    })
    this.dummy.scale.setScalar(1)
    this.sparks.instanceMatrix.needsUpdate = true
  }

  dispose() {
    this.mesh.geometry.dispose()
    ;(this.mesh.material as THREE.Material).dispose()
    this.mesh.dispose()
    this.sparks.geometry.dispose()
    ;(this.sparks.material as THREE.Material).dispose()
    this.sparks.dispose()
  }
}
