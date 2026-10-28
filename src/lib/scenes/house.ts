import * as THREE from 'three'
import { VoxelGrid, hash3 } from '../voxel/VoxelGrid'
import { C, RES, VH, VW, v3 } from './common'
import { VoxelSmoke } from './fx/VoxelSmoke'

const H = {
  plaster: '#efd6ab',
  stone: '#a39382',
  mortar: '#8a7b6b',
  beam: '#7b4524',
  doorFrame: '#6b3a1f',
  door: '#9a5530',
  doorGroove: '#7d4325',
  windowGlow: '#ffd98a',
  shutter: '#5f8a5a',
  shutterDark: '#4a7046',
  tile: '#b5553b',
  tileAlt: '#a34a33',
  tileSeam: '#8a3b29',
  ridge: '#7a3424',
  barge: '#6b3a1f',
  brick: '#c56e43',
  brickDark: '#a9562f',
  step: '#9c8f80',
  stepTop: '#b3a697',
  mat: '#b0603a',
  matDark: '#8a4528',
  flowers: ['#e0574f', '#f2c14e', '#f08fb0', '#ffffff'],
}

// Gable roof: ridge runs along z at the middle of the house, 4 voxels of overhang
const OVERHANG = 4
const roofY = (x: number) => VH + Math.round((VW / 2 + OVERHANG - Math.abs(x + 0.5 - VW / 2)) * 0.75)

type AnimKey = 'wallsUp' | 'roofDown' | 'door'
type Ease = (t: number) => number

const easeInOut: Ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeIn: Ease = (t) => t * t * t
const bounce: Ease = (t) => {
  const n = 7.5625, d = 2.75
  if (t < 1 / d) return n * t * t
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375
  return n * (t -= 2.625 / d) * t + 0.984375
}
const delay = (s: number) => new Promise((r) => setTimeout(r, s * 1000))

/**
 * The outside of the house: the two front walls (with the front door), the roof and the chimney.
 * Opening it sinks the walls into the floor and lifts the roof away, revealing whichever room is inside.
 */
export class House {
  readonly group = new THREE.Group()
  /** Meshes that count as "the house" for hover/click. */
  readonly hitMeshes: THREE.Mesh[] = []
  readonly doorMeshes: THREE.Mesh[] = []
  readonly knockAnchor = v3(81.5, 50, 97)

  private walls = new THREE.Group()
  private roof = new THREE.Group()
  private porch = new THREE.Group()
  private doorPivot = new THREE.Group()
  private smoke: VoxelSmoke
  private porchLight = new THREE.PointLight('#ffcf7a', 0, 9, 1.6)
  private dispose_: () => void

  private state: Record<AnimKey, number> = { wallsUp: 1, roofDown: 1, door: 0 }
  private anims = new Map<AnimKey, { from: number; to: number; t: number; dur: number; ease: Ease; resolve: () => void }>()
  private knocks: number[] = []
  private time = 0

  constructor() {
    const g = new VoxelGrid(1 / RES)
    const front = VW - 3 // first voxel of the front walls

    // Facade color as a function of the position along the wall (u) and height
    const facade = (u: number, y: number) => {
      if (y <= 6) return y === 4 || (u + (y > 4 ? 3 : 0)) % 6 === 0 ? H.mortar : H.stone
      if (y >= VH - 4) return H.beam
      if (u <= 3 || u >= VW - 4) return H.beam
      return hash3(u >> 1, y >> 1, 5) > 0.92 ? '#e8cda0' : H.plaster
    }

    /** Window cut into a front wall. `axis` is the wall's normal: 'z' for wall A, 'x' for wall B. */
    const windowAt = (axis: 'x' | 'z', u0: number, u1: number, y0: number, y1: number, tag: string, shutters = false) => {
      const put = (u: number, d: number, y: number, c: string, kind: 'solid' | 'glow' = 'solid') =>
        axis === 'z' ? g.set(u, y, d, c, { tag, kind }) : g.set(d, y, u, c, { tag, kind })
      const cut = (u: number, d: number, y: number) => (axis === 'z' ? g.clear(u, y, d, u, y, d) : g.clear(d, y, u, d, y, u))
      const mu = Math.floor((u0 + u1) / 2), my = Math.floor((y0 + y1) / 2)
      for (let u = u0; u <= u1; u++)
        for (let y = y0; y <= y1; y++) {
          for (let d = front; d < VW; d++) cut(u, d, y)
          const edge = u <= u0 + 1 || u >= u1 - 1 || y <= y0 + 1 || y >= y1 - 1
          if (edge) for (let d = front; d <= VW; d++) put(u, d, y, C.frame)
          else if (u === mu || y === my) put(u, VW - 1, y, C.frame)
          else put(u, front, y, H.windowGlow, 'glow')
        }
      if (shutters)
        for (const [s0, s1] of [[u0 - 5, u0 - 1], [u1 + 1, u1 + 5]])
          for (let u = s0; u <= s1; u++)
            for (let y = y0; y <= y1; y++) put(u, VW, y, y % 3 === 0 ? H.shutterDark : H.shutter)
    }

    const flowerBox = (axis: 'x' | 'z', u0: number, u1: number, y: number, tag: string) => {
      const put = (u: number, d: number, yy: number, c: string) => (axis === 'z' ? g.set(u, yy, d, c, { tag }) : g.set(d, yy, u, c, { tag }))
      for (let u = u0; u <= u1; u++) {
        for (let d = VW; d <= VW + 2; d++) for (let yy = y - 3; yy <= y; yy++) put(u, d, yy, yy === y - 3 ? C.woodDark : C.wood)
        for (let d = VW; d <= VW + 2; d++) {
          const roll = hash3(u, d, y)
          if (roll > 0.35) put(u, d, y + 1, C.leaves[Math.floor(roll * 4)])
          if (roll > 0.72) put(u, d, y + 2, H.flowers[Math.floor(hash3(d, u, 3) * H.flowers.length)])
        }
      }
    }

    // ---- Wall A: faces +z, has the front door ------------------------------
    g.tagged('wallA', () => {
      g.box(0, 1, front, VW - 1, VH - 1, VW - 1, (x, y) => facade(x, y))
      windowAt('z', 12, 36, 22, 48, 'wallA')
      flowerBox('z', 11, 37, 20, 'wallA')
      // Door opening + frame
      g.clear(74, 1, front, 89, 40, VW - 1)
      g.box(72, 1, front, 73, 42, VW, H.doorFrame)
      g.box(90, 1, front, 91, 42, VW, H.doorFrame)
      g.box(72, 41, front, 91, 42, VW, H.doorFrame)
      // Porch lamp
      g.box(66, 30, VW, 66, 31, VW + 1, C.iron)
      g.box(65, 32, VW + 1, 67, 35, VW + 2, '#ffe2a4', { kind: 'glow', tag: 'wallA' })
      g.box(65, 36, VW + 1, 67, 36, VW + 2, C.iron)
    })

    // ---- Front door (its own mesh so it can knock and swing) --------------
    g.tagged('door', () => {
      g.box(74, 1, VW - 2, 89, 40, VW - 1, (x) => ((x - 74) % 4 === 0 ? H.doorGroove : H.door))
      g.box(75, 12, VW, 88, 13, VW, H.doorGroove)
      g.box(78, 29, VW - 2, 85, 36, VW - 1, (x, y) => (x === 81 || x === 82 || y === 32 ? H.doorGroove : H.windowGlow), { kind: 'glow', tag: 'door' })
      g.box(86, 19, VW, 87, 20, VW, C.brass)
    })

    // ---- Wall B: faces +x ----------------------------------------------
    g.tagged('wallB', () => {
      g.box(front, 1, 0, VW - 1, VH - 1, front - 1, (_x, y, z) => facade(z, y))
      windowAt('x', 16, 38, 22, 48, 'wallB', true)
      windowAt('x', 56, 78, 22, 48, 'wallB', true)
      flowerBox('x', 55, 79, 20, 'wallB')
    })

    // ---- Doorstep + mat (hidden while the house is open) -------------------
    g.tagged('porch', () => {
      g.box(70, -6, VW, 93, 0, VW + 6, (_x, y) => (y === 0 ? H.stepTop : H.step))
      g.box(75, 1, VW, 88, 1, VW + 4, (x) => ((x - 75) % 4 < 2 ? H.mat : H.matDark), { height: 0.5 })
    })

    // ---- Roof, gables and chimney ------------------------------------------
    g.tagged('roof', () => {
      for (let x = -OVERHANG; x < VW + OVERHANG; x++) {
        const top = roofY(x)
        const d = Math.abs(x + 0.5 - VW / 2)
        const band = Math.floor(d / 4)
        for (let z = -OVERHANG; z < VW + OVERHANG; z++) {
          const edge = z === -OVERHANG || z === VW + OVERHANG - 1
          let c = band % 2 ? H.tileAlt : H.tile
          if ((z + band * 3) % 8 === 0) c = H.tileSeam
          if (d < 1.5) c = H.ridge
          if (edge) c = H.barge
          g.box(x, top - 2, z, x, top, z, c)
          if (d < 1.5) g.set(x, top + 1, z, H.ridge)
        }
      }
      // Gable ends with vertical boards
      for (const [z0, z1] of [[0, 2], [front, VW - 1]])
        for (let x = 0; x < VW; x++) g.box(x, VH, z0, x, roofY(x) - 3, z1, x % 4 === 0 ? '#dcc095' : H.plaster)
      // Round attic window on the front gable
      for (let x = 40; x <= 56; x++)
        for (let y = 76; y <= 92; y++) {
          const dist = Math.hypot(x + 0.5 - 48, y + 0.5 - 84)
          if (dist > 7.5) continue
          if (dist > 5.5) g.box(x, y, front, x, y, VW, C.frame)
          else if (Math.abs(x + 0.5 - 48) < 1 || Math.abs(y + 0.5 - 84) < 1) g.set(x, y, VW - 1, C.frame)
          else {
            g.clear(x, y, front + 1, x, y, VW - 1)
            g.set(x, y, front, H.windowGlow, { kind: 'glow' })
          }
        }
      // Chimney through the roof, above the fireplace
      g.box(6, VH, 36, 17, 96, 47, (x, y, z) => ((y % 3 === 0 || (x + z + (Math.floor(y / 3) % 2) * 3) % 6 === 0) ? H.brickDark : H.brick))
      g.box(5, 97, 35, 18, 98, 48, H.brickDark)
      g.clear(8, 92, 38, 15, 98, 45)
      g.box(8, 91, 38, 15, 91, 45, '#2b1810')
    })

    const built = g.build()
    for (const [key, mesh] of built.meshes) {
      const tag = key.split(':')[1]
      if (tag === 'wallA' || tag === 'wallB') this.walls.add(mesh)
      else if (tag === 'door') this.doorMeshes.push(mesh)
      else if (tag === 'roof') this.roof.add(mesh)
      else this.porch.add(mesh)
      if (mesh.material instanceof THREE.MeshStandardMaterial) this.hitMeshes.push(mesh)
    }

    // Door hinges on its left edge (x = 74)
    const hinge = v3(74, 0, VW - 1)
    this.doorPivot.position.copy(hinge)
    for (const m of this.doorMeshes) {
      m.position.copy(hinge).negate()
      this.doorPivot.add(m)
    }
    this.walls.add(this.doorPivot)
    this.porchLight.position.copy(v3(66, 33, VW + 4))
    this.walls.add(this.porchLight)
    this.group.add(this.walls, this.roof, this.porch)

    // Walls sink below the floor: clip anything under floor level
    const clip = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.24)]
    this.walls.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const m = o.material as THREE.Material
        m.clippingPlanes = clip
        m.clipShadows = true
      }
    })

    this.smoke = new VoxelSmoke({ x0: 8 / RES, x1: 16 / RES, z0: 38 / RES, z1: 46 / RES, y: 96 / RES }, 1 / RES)
    this.roof.add(this.smoke.group)

    this.dispose_ = () => {
      built.dispose()
      this.smoke.dispose()
    }
    this.apply()
  }

  get closed() {
    return this.state.wallsUp > 0.99 && this.state.roofDown > 0.99
  }

  /** How much of the roof covers the room (0 = lifted away). */
  get roofCover() {
    return this.state.roofDown
  }

  setOpen(open: boolean) {
    this.anims.forEach((a) => a.resolve())
    this.anims.clear()
    this.state = { wallsUp: open ? 0 : 1, roofDown: open ? 0 : 1, door: 0 }
    this.apply()
  }

  /** Build-up animation for the first visit: walls rise, roof drops in. */
  async assemble() {
    this.setOpen(true)
    await this.close()
  }

  async open() {
    await Promise.all([
      this.animate('roofDown', 0, 0.55, easeIn),
      delay(0.2).then(() => this.animate('wallsUp', 0, 0.7, easeInOut)),
    ])
    this.state.door = 0
  }

  async close() {
    await Promise.all([
      this.animate('door', 0, 0.25, easeInOut),
      this.animate('wallsUp', 1, 0.55, easeInOut),
      delay(0.25).then(() => this.animate('roofDown', 1, 0.7, bounce)),
    ])
  }

  async knock() {
    const start = this.time
    this.knocks = [start + 0.1, start + 0.45]
    await delay(0.95)
  }

  /** Recent knocks, for the "knock!" pop-ups: age in seconds. */
  knockAges() {
    return this.knocks.map((k) => this.time - k).filter((a) => a >= 0 && a < 0.7)
  }

  /** The porch lamp comes on at night. */
  setNight(n: number) {
    this.porchLight.intensity = n * 7
  }

  async swingDoor() {
    await this.animate('door', 1, 0.4, easeInOut)
  }

  setHover(on: boolean, t: number) {
    const glow = on ? 0.16 + 0.06 * Math.sin(t * 6) : 0
    for (const m of this.doorMeshes) {
      const mat = m.material as THREE.MeshStandardMaterial
      if (mat.emissive) mat.emissive.setRGB(glow, glow * 0.75, glow * 0.4)
    }
  }

  private animate(key: AnimKey, to: number, dur: number, ease: Ease) {
    this.anims.get(key)?.resolve()
    return new Promise<void>((resolve) => {
      this.anims.set(key, { from: this.state[key], to, t: 0, dur, ease, resolve })
    })
  }

  update(dt: number) {
    this.time += dt
    for (const [key, a] of this.anims) {
      a.t = Math.min(1, a.t + dt / a.dur)
      this.state[key] = a.from + (a.to - a.from) * a.ease(a.t)
      if (a.t >= 1) {
        this.anims.delete(key)
        a.resolve()
      }
    }
    this.apply()
    if (this.roof.visible) this.smoke.update(dt)
  }

  private apply() {
    const { wallsUp, roofDown, door } = this.state
    this.walls.position.y = -(1 - wallsUp) * (VH / RES + 0.5)
    this.walls.visible = wallsUp > 0.001
    // The step sinks with the front wall's first stretch, then disappears
    this.porch.position.y = -Math.min(1, (1 - wallsUp) * 4) * 2
    this.porch.visible = wallsUp > 0.25
    this.roof.position.y = (1 - roofDown) * 40
    this.roof.rotation.z = (1 - roofDown) * 0.08
    this.roof.visible = roofDown > 0.001

    // Knock: a quick shudder per knock, then the swing
    let shake = 0
    for (const k of this.knocks) {
      const a = this.time - k
      if (a > 0 && a < 0.35) shake += Math.sin(a * 70) * Math.exp(-a * 12) * 0.05
    }
    this.doorPivot.rotation.y = door * 1.4 + shake
  }

  dispose() {
    this.dispose_()
  }
}
