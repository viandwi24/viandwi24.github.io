import * as THREE from 'three'
import { VoxelGrid } from '../voxel/VoxelGrid'
import { RES, mountDoor, v3 } from './common'
import type { Bubble, Toy } from './types'

type Kind = 'cat' | 'husky'

interface Model {
  group: THREE.Group
  meshes: THREE.Mesh[]
  head: THREE.Object3D
  tail: THREE.Object3D
  dispose(): void
}

/** Grey tabby with white socks, ~14 voxels long, facing +x. Grey reads well on the warm rugs. */
function catModel(g: VoxelGrid) {
  const fur = '#8f949e', stripe = '#666b75', cream = '#f2efe8', pink = '#e89a9a'
  for (const [x, z] of [[-5, -3], [-5, 2], [3, -3], [3, 2]]) g.box(x, 0, z, x + 1, 2, z + 1, (_x, y) => (y === 0 ? cream : fur))
  g.box(-6, 3, -3, 5, 7, 3, (x, y) => (y === 3 ? cream : x % 3 === 0 && y > 4 ? stripe : fur))
  g.tagged('head', () => {
    g.box(5, 6, -3, 10, 11, 3, (x, y, z) => {
      if (x === 10 && y === 9 && Math.abs(z) === 2) return '#2f5a24' // eyes
      if (x === 10 && y === 8 && z === 0) return pink // nose
      if (x === 10 && y <= 8 && Math.abs(z) <= 1) return cream
      return y === 11 && x % 2 === 0 ? stripe : fur
    })
    for (const z of [-3, 2]) g.box(6, 12, z, 7, 13, z + 1, (x, y) => (x === 7 && y === 12 ? pink : fur))
  })
  g.tagged('tail', () => {
    const curve: [number, number][] = [[-7, 6], [-8, 7], [-9, 8], [-9, 9], [-9, 10], [-9, 11], [-8, 12]]
    curve.forEach(([x, y], i) => g.box(x, y, 0, x, y, 0, i % 2 ? stripe : fur))
  })
  return { headPivot: [6, 7, 0], tailPivot: [-6, 6, 0] }
}

/** Grey and white husky with blue eyes, ~26 voxels long, facing +x. */
function huskyModel(g: VoxelGrid) {
  const grey = '#7d8592', dark = '#5c6370', white = '#f1efe9', blue = '#5fb4ff', pink = '#e8a0a0'
  for (const [x, z] of [[-8, -4], [-8, 2], [5, -4], [5, 2]]) g.box(x, 0, z, x + 2, 5, z + 2, white)
  g.box(-9, 6, -4, 8, 13, 4, (_x, y) => (y === 13 ? dark : y >= 10 ? grey : white))
  g.tagged('head', () => {
    g.box(8, 11, -4, 15, 19, 4, (x, y, z) => {
      if (x === 15 && y === 16 && Math.abs(z) === 2) return blue
      if (x >= 13 && y <= 16) return white
      if (x === 15 && y === 17 && Math.abs(z) <= 1) return white // the white blaze between the eyes
      return y >= 18 ? dark : grey
    })
    g.box(16, 11, -2, 18, 14, 2, (x, y, z) => (x === 18 && y === 14 && Math.abs(z) <= 1 ? '#1d1a1a' : white))
    for (const z of [-4, 2])
      g.box(9, 20, z, 11, 22, z + 2, (x, y, zz) => {
        if (y - 20 > 2 - Math.abs(x - 10) - (zz === z + 1 ? 0 : 1)) return null // pointy ears
        return x === 11 && y < 22 && zz === z + 1 ? pink : grey
      })
  })
  g.tagged('tail', () => {
    const curve: [number, number][] = [[-10, 12], [-11, 13], [-11, 14], [-11, 15], [-10, 16], [-9, 16], [-8, 15]]
    curve.forEach(([x, y], i) => g.box(x, y, -1, x, y, 1, i === curve.length - 1 ? white : grey))
  })
  return { headPivot: [9, 13, 0], tailPivot: [-9, 12, 0] }
}

function buildModel(kind: Kind): Model {
  const g = new VoxelGrid(1 / RES)
  const pivots = kind === 'cat' ? catModel(g) : huskyModel(g)
  const built = g.build()
  const group = built.group
  for (const m of built.meshes.values()) m.castShadow = true
  const [hx, hy, hz] = pivots.headPivot
  const [tx, ty, tz] = pivots.tailPivot
  const head = mountDoor(group, built.meshes, 'head', v3(hx, hy, hz)).pivot
  const tail = mountDoor(group, built.meshes, 'tail', v3(tx, ty, tz)).pivot
  return { group, meshes: [...built.meshes.values()], head, tail, dispose: built.dispose }
}

const VOICE: Record<Kind, string[]> = { cat: ['meow!', 'mrrp?', 'purr~'], husky: ['woof!', 'awoo~', 'arf!'] }

/**
 * A pet that wanders between `spots` (walking only to a neighbour in the list, so the paths can be
 * laid around furniture), naps, wags its tail, and hops and talks when clicked.
 * Spots are voxel coordinates on the floor.
 */
export class Pet {
  readonly group = new THREE.Group()
  readonly toy: Toy
  private model: Model
  private spots: THREE.Vector3[]
  private at: number
  private from = new THREE.Vector3()
  private to = new THREE.Vector3()
  private walkT = 1
  private walkDur = 1
  private heading = 0
  private wait: number
  private asleep = false
  private hop = -1
  private happy = 0
  private talk: Bubble[] = []
  private time = 0
  private said = 0

  constructor(private kind: Kind, spots: [number, number, number][], start = 0) {
    this.model = buildModel(kind)
    this.group.add(this.model.group)
    this.spots = spots.map(([x, y, z]) => v3(x, y, z))
    this.at = start
    this.group.position.copy(this.spots[start])
    this.heading = Math.random() * Math.PI * 2
    this.wait = 2 + Math.random() * 4
    this.asleep = kind === 'cat'
    this.toy = { meshes: this.model.meshes, poke: () => this.poke(), sound: kind === 'cat' ? 'meow' : 'woof' }
  }

  poke() {
    this.asleep = false
    this.hop = 0
    this.happy = 3
    this.say(VOICE[this.kind][this.said++ % VOICE[this.kind].length])
    // Hop, then trot off somewhere
    this.wait = 0.7
  }

  private say(label: string) {
    const top = this.kind === 'cat' ? 16 : 26
    this.talk.push({ id: `${this.kind}-${this.time.toFixed(2)}`, label, at: this.group.position.clone().add(v3(0, top, 0)), age: 0 })
  }

  bubbles() {
    return this.talk
  }

  private wander() {
    const n = this.spots.length
    const next = (this.at + (Math.random() < 0.5 ? 1 : n - 1)) % n
    this.from.copy(this.group.position)
    this.to.copy(this.spots[next])
    this.at = next
    const dist = this.from.distanceTo(this.to)
    const speed = this.kind === 'cat' ? 1.8 : 3.2
    this.walkDur = Math.max(0.4, dist / speed)
    this.walkT = 0
    this.heading = Math.atan2(-(this.to.z - this.from.z), this.to.x - this.from.x)
  }

  update(dt: number) {
    this.time += dt
    const t = this.time
    const { group, model } = this
    this.happy = Math.max(0, this.happy - dt)
    this.talk = this.talk.map((b) => ({ ...b, age: b.age + dt / 1.2 })).filter((b) => b.age < 1)

    // Turn smoothly toward the heading
    const turn = Math.atan2(Math.sin(this.heading - group.rotation.y), Math.cos(this.heading - group.rotation.y))
    group.rotation.y += turn * Math.min(1, dt * 6)

    let lift = 0
    if (this.hop >= 0) {
      this.hop += dt / 0.45
      lift = Math.sin(Math.min(1, this.hop) * Math.PI) * 0.6
      if (this.hop >= 1) this.hop = -1
    }

    if (this.walkT < 1) {
      this.walkT = Math.min(1, this.walkT + dt / this.walkDur)
      group.position.lerpVectors(this.from, this.to, this.walkT)
      lift += Math.abs(Math.sin(t * (this.kind === 'cat' ? 11 : 14))) * 0.08
      if (this.walkT >= 1) {
        this.wait = 4 + Math.random() * 8
        if (this.kind === 'cat' && Math.random() < 0.5) this.asleep = true
      }
    } else if (this.hop < 0) {
      this.wait -= dt
      if (this.wait <= 0 && (!this.asleep || Math.random() < dt * 0.05)) {
        this.asleep = false
        this.wander()
      }
    }

    // Napping: sink down so the legs tuck under, head drooped, the odd "z"
    const sink = this.asleep ? -2.5 / RES : 0
    group.position.y = this.spots[this.at].y + lift + sink
    if (this.walkT < 1) group.position.y = THREE.MathUtils.lerp(this.from.y, this.to.y, this.walkT) + lift
    model.head.rotation.z = this.asleep ? -0.25 : Math.sin(t * 1.3) * 0.05
    if (this.asleep && t - this.lastZ > 2.6) {
      this.lastZ = t
      this.say('z')
    }

    // Breathing and tail
    const breathe = 1 + Math.sin(t * (this.asleep ? 1.6 : 2.6)) * 0.02
    model.group.scale.set(1, breathe, 1)
    const wagSpeed = this.happy > 0 || this.kind === 'husky' ? 12 : 2
    const wagSize = this.happy > 0 ? 0.6 : this.kind === 'husky' ? 0.35 : 0.3
    model.tail.rotation.y = Math.sin(t * wagSpeed) * wagSize
  }

  private lastZ = 0

  dispose() {
    this.model.dispose()
  }
}
