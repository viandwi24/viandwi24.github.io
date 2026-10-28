import * as THREE from 'three'
import { VoxelGrid, hash3 } from '../voxel/VoxelGrid'
import { C, RES, VD, VH, VW, blob, interiorDoor, mountDoor, rng, taggedMesh, v3, wiggle } from './common'
import { Pet } from './pets'
import type { RoomScene } from './types'

const G = {
  grass: ['#7fae4f', '#76a548', '#88b757', '#6f9c42'],
  grassDark: '#5f8a38',
  dirt: '#6b4526',
  dirtDark: '#4e3019',
  stone: ['#c9c0b0', '#b9b0a0', '#d3cbbb'],
  plaster: '#f1dfbf',
  plasterDark: '#e3cca5',
  beam: '#7a4626',
  brick: '#b8603d',
  mortar: '#d9c4a3',
  plank: ['#8a5a34', '#7e5230', '#94623a'],
  plankGap: '#5a3820',
  roofRed: '#c0473f',
  roofDark: '#962f2a',
  bark: ['#6b4428', '#5c3a22', '#7a4e2e'],
  leaves: ['#4f8a3a', '#5c9a43', '#6aa94c', '#437a31'],
  water: '#5fa8d3',
  lily: '#5f9442',
  flowers: ['#ff8fa3', '#ffd36b', '#ffffff', '#c58aff', '#ff7a5a'],
  window: '#ffe2a4',
}

const FIREFLIES = 26
const LEAVES = 40

/** The back garden: an outdoor hub, with doors back into the house and out to the annex rooms. */
export function createGarden(): RoomScene {
  const g = new VoxelGrid(1 / RES)
  const r = rng(31)

  // ---- Ground: grass on a dirt slab ---------------------------------------
  g.box(0, -6, 0, VW - 1, -1, VD - 1, (_x, y) => (y === -6 ? G.dirtDark : G.dirt))
  for (let x = 0; x < VW; x++)
    for (let z = 0; z < VD; z++) {
      const n = hash3(x >> 1, 0, z >> 1)
      g.set(x, 0, z, n > 0.93 ? G.grassDark : G.grass[Math.floor(hash3(x, 1, z) * G.grass.length)], { jitter: 0.01 })
      // Tufts
      if (n > 0.975 && x > 4 && z > 4) g.set(x, 1, z, G.grassDark, { height: 0.6 })
    }

  // ---- House back wall (z = 0): plaster over a brick plinth, warm window --
  g.box(0, 1, 0, VW - 1, VH - 1, 2, (x, y) => {
    if (y <= 6) return y === 3 || (x + (y > 3 ? 3 : 0)) % 6 === 0 ? G.mortar : G.brick
    if (y >= VH - 4 || x <= 3) return G.beam
    return hash3(x >> 1, y >> 1, 7) > 0.92 ? G.plasterDark : G.plaster
  })
  // Window glowing from inside the house
  g.box(40, 26, 0, 64, 58, 3, (x, y) => (x <= 41 || x >= 63 || y <= 27 || y >= 57 ? C.frame : null))
  g.clear(42, 28, 0, 62, 56, 2)
  g.box(42, 28, 1, 62, 56, 1, (x, y) => (x === 52 || y === 42 ? C.frame : null))
  g.box(42, 28, 1, 62, 56, 1, (x, y) => (x === 52 || y === 42 ? null : G.window), { kind: 'glow' })
  g.box(38, 23, 0, 66, 25, 6, C.frame)

  // ---- Annex wall (x = 0): dark vertical planks --------------------------
  g.box(0, 1, 3, 2, VH - 1, VD - 1, (x, y, z) => {
    if (x === 0) return C.wallOuter
    if (y >= VH - 3) return G.beam
    return z % 5 === 0 ? G.plankGap : G.plank[Math.floor(hash3(Math.floor(z / 5), 0, 3) * 3)]
  })

  // Doors: back into the house, and the two annex rooms
  const back = interiorDoor(g, 24, 'about')
  const exp = interiorDoor(g, 22, 'experience', 'x')
  const contact = interiorDoor(g, 62, 'contact', 'x')

  // ---- Stepping-stone path linking the doors ------------------------------
  const stone = (cx: number, cz: number) => {
    for (let x = cx - 3; x <= cx + 3; x++)
      for (let z = cz - 3; z <= cz + 3; z++) {
        if (Math.abs(x - cx) + Math.abs(z - cz) > 5) continue
        g.set(x, 1, z, G.stone[Math.floor(hash3(x, 2, z) * 3)], { height: 0.5 })
      }
  }
  for (const [x, z] of [[30, 9], [27, 17], [19, 23], [10, 28], [16, 36], [18, 46], [15, 56], [10, 66]]) stone(x, z)

  // ---- Flower bed under the window ----------------------------------------
  g.box(40, 1, 3, 62, 3, 10, (x, y, z) => (y === 3 && x > 40 && x < 62 && z > 3 && z < 10 ? G.dirtDark : C.woodDark))
  for (let x = 42; x <= 60; x += 2)
    for (let z = 5; z <= 8; z += 3) {
      const h = 2 + Math.floor(hash3(x, 5, z) * 3)
      g.box(x, 4, z, x, 3 + h, z, G.leaves[1])
      g.set(x, 4 + h, z, G.flowers[Math.floor(hash3(x, z, 9) * G.flowers.length)])
    }

  // ---- Pond with lily pads -------------------------------------------------
  const pond = { cx: 32, cz: 66, rx: 12, rz: 9 }
  for (let x = pond.cx - pond.rx - 2; x <= pond.cx + pond.rx + 2; x++)
    for (let z = pond.cz - pond.rz - 2; z <= pond.cz + pond.rz + 2; z++) {
      const d = Math.hypot((x + 0.5 - pond.cx) / pond.rx, (z + 0.5 - pond.cz) / pond.rz)
      if (d <= 1) {
        g.clear(x, 0, z, x, 1, z)
        g.set(x, -2, z, '#3d6f8a')
        g.set(x, -1, z, G.water, { kind: 'glass', tag: 'water', jitter: 0 })
      } else if (d <= 1.22) g.set(x, 1, z, G.stone[Math.floor(hash3(x, 3, z) * 3)], { height: hash3(z, 3, x) > 0.5 ? 1 : 0.6 })
    }
  for (const [x, z] of [[28, 62], [37, 70], [30, 72]]) g.box(x, 0, z, x + 2, 0, z + 2, G.lily, { height: 0.3 })
  g.set(29, 1, 63, G.flowers[0])

  // ---- Tree in the back corner (poke it to shake loose some leaves) ---------
  const tree = { x: 82, z: 15 }
  g.box(tree.x - 2, 1, tree.z - 2, tree.x + 3, 32, tree.z + 3, (x, y, z) => G.bark[Math.floor(hash3(x, y >> 2, z) * 3)])
  g.box(tree.x - 3, 1, tree.z - 3, tree.x + 4, 2, tree.z + 4, G.bark[0])
  g.tagged('canopy', () => {
    for (const [cx, cy, cz, rad] of [[81, 42, 15, 10], [74, 37, 11, 7], [86, 46, 22, 6], [80, 50, 12, 7]])
      blob(g, cx, cy, cz, rad, rad * 0.8, rad, (_dx, dy) => (r() < 0.06 ? null : G.leaves[Math.min(3, Math.floor((1 - dy) * 1.6 + r() * 1.2))]))
  })

  // ---- Doghouse against the house, under the window's edge -----------------
  const dh = { x0: 64, x1: 76, z0: 5, z1: 19 }
  g.box(dh.x0, 1, dh.z0, dh.x1, 13, dh.z1, (x) => (x % 3 === 0 ? '#b86a42' : '#c97a4c'))
  // Entrance facing the garden, dark inside
  g.clear(68, 1, dh.z1 - 1, 72, 9, dh.z1)
  g.box(68, 1, dh.z1 - 2, 72, 9, dh.z1 - 2, '#3a2216')
  for (let i = 0; i <= 8; i++) g.box(dh.x0 - 2, 14 + i, dh.z0 - 1 + i, dh.x1 + 2, 14 + i, dh.z1 + 1 - i, i === 8 ? G.roofDark : i % 2 ? G.roofRed : G.roofDark)
  g.box(67, 11, dh.z1 + 1, 73, 12, dh.z1 + 1, C.cream) // name plate
  g.box(57, 1, 22, 62, 2, 26, (x, y) => (y === 2 && x > 57 && x < 62 ? '#d9cfc0' : '#5f7fbf')) // bowl

  // ---- Bench and lamp post -------------------------------------------------
  g.box(10, 1, 82, 11, 8, 83, C.woodDark)
  g.box(10, 1, 89, 11, 8, 90, C.woodDark)
  g.box(8, 9, 80, 16, 10, 91, C.wood)
  g.box(6, 11, 80, 7, 20, 91, (_x, y) => (y % 3 === 0 ? C.woodDark : C.wood))
  const lampAt = { x: 46, z: 40 }
  g.box(lampAt.x - 1, 1, lampAt.z - 1, lampAt.x + 1, 2, lampAt.z + 1, C.iron)
  g.box(lampAt.x, 3, lampAt.z, lampAt.x, 40, lampAt.z, C.iron)
  g.box(lampAt.x - 2, 41, lampAt.z - 2, lampAt.x + 2, 41, lampAt.z + 2, C.iron)
  g.box(lampAt.x - 1, 42, lampAt.z - 1, lampAt.x + 1, 45, lampAt.z + 1, '#ffe2a4', { kind: 'glow', tag: 'lamp', jitter: 0 })
  g.box(lampAt.x - 2, 46, lampAt.z - 2, lampAt.x + 2, 46, lampAt.z + 2, C.iron)

  // ---- Build + runtime ---------------------------------------------------------
  const built = g.build()
  const group = built.group

  const doors = [
    { d: back, to: 'about', label: 'Living room' },
    { d: exp, to: 'experience', label: 'Experience' },
    { d: contact, to: 'contact', label: 'Contact' },
  ].map(({ d, to, label }) => ({ to, label, ...mountDoor(group, built.meshes, d.tag, d.hinge), openAngle: 1.35, marker: d.marker, view: d.view }))

  const canopy = mountDoor(group, built.meshes, 'canopy', v3(tree.x, 32, tree.z))
  const shake = wiggle(canopy.pivot, 0.06)

  const water = built.meshes.get('glass:water')
  const lamp = built.meshes.get('glow:lamp')
  const lampLight = new THREE.PointLight('#ffcf7a', 0, 16, 1.6)
  lampLight.position.copy(v3(lampAt.x, 43, lampAt.z))
  group.add(lampLight)

  // Leaves that fall when the tree is shaken (and the odd one on its own)
  const leafGeo = new THREE.BoxGeometry(1 / RES, 0.4 / RES, 1 / RES)
  const leafMat = new THREE.MeshStandardMaterial({ color: G.leaves[2], roughness: 0.9 })
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, LEAVES)
  leaves.frustumCulled = false
  group.add(leaves)
  const leafState = Array.from({ length: LEAVES }, () => ({ p: new THREE.Vector3(), age: 9, spin: 0 }))
  const dummy = new THREE.Object3D()
  const dropLeaf = (l: (typeof leafState)[number]) => {
    l.p.copy(v3(tree.x + r.range(-10, 8), r.range(32, 44), tree.z + r.range(-8, 10)))
    l.age = 0
    l.spin = r.range(0, Math.PI * 2)
  }

  // Fireflies at night
  const flyPos = new Float32Array(FIREFLIES * 3)
  const flySeed = Array.from({ length: FIREFLIES }, () => [r.range(10, 90), r.range(4, 30), r.range(30, 92), r.range(0, 6.28)])
  const flyGeo = new THREE.BufferGeometry()
  flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPos, 3))
  const flyMat = new THREE.PointsMaterial({ color: '#e8ff8a', size: 0.7 / RES, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const flies = new THREE.Points(flyGeo, flyMat)
  flies.frustumCulled = false
  group.add(flies)

  const husky = new Pet('husky', [[62, 1, 32], [78, 1, 40], [78, 1, 64], [70, 1, 82], [54, 1, 80], [52, 1, 50]])
  group.add(husky.group)

  let night = 0
  let ambientLeaf = 3

  return {
    id: 'garden',
    label: 'Garden',
    group,
    view: { target: v3(48, 26, 48), azimuth: Math.PI / 4, polar: 0.96, zoom: 1 },
    hotspots: [],
    doors,
    signs: [{ label: 'Say hi to Kopi', at: v3(70, 30, 12) }],
    outdoor: true,
    ambience: ['garden'],
    toys: [
      {
        meshes: canopy.meshes,
        poke: () => {
          shake.poke()
          leafState.filter((l) => l.age > 4).slice(0, 14).forEach(dropLeaf)
        },
      },
      husky.toy,
    ],
    bubbles: () => husky.bubbles(),

    setNight(n) {
      night = n
      lampLight.intensity = n * 10
      if (lamp) (lamp.material as THREE.MeshBasicMaterial).color.setScalar(0.35 + 0.65 * n)
      flyMat.opacity = n
    },

    update(dt, t) {
      shake.update(dt)
      husky.update(dt)
      if (water) (water.material as THREE.MeshStandardMaterial).opacity = 0.62 + 0.06 * Math.sin(t * 1.4)

      ambientLeaf -= dt
      if (ambientLeaf <= 0) {
        ambientLeaf = r.range(2, 6)
        const idle = leafState.find((l) => l.age > 4)
        if (idle) dropLeaf(idle)
      }
      leafState.forEach((l, i) => {
        l.age += dt
        const falling = l.age < 4 && l.p.y > 0.3
        if (falling) {
          l.p.y -= dt * 0.9
          l.p.x += Math.sin(l.age * 3 + i) * dt * 0.6
          l.p.z += Math.cos(l.age * 2.3 + i) * dt * 0.4
        }
        dummy.position.copy(l.p)
        dummy.rotation.set(Math.sin(l.age * 4 + i) * 0.6, l.spin + l.age, 0)
        dummy.scale.setScalar(l.age < 4 ? 1 : 0.0001)
        dummy.updateMatrix()
        leaves.setMatrixAt(i, dummy.matrix)
      })
      leaves.instanceMatrix.needsUpdate = true

      if (night > 0.01) {
        flySeed.forEach(([x, y, z, ph], i) => {
          flyPos[i * 3] = (x + Math.sin(t * 0.5 + ph) * 6) / RES
          flyPos[i * 3 + 1] = (y + Math.sin(t * 0.8 + ph * 2) * 4) / RES
          flyPos[i * 3 + 2] = (z + Math.cos(t * 0.4 + ph) * 6) / RES
        })
        flyGeo.attributes.position.needsUpdate = true
        flyMat.size = (0.5 + 0.3 * Math.sin(t * 3)) / RES
      }
    },

    dispose() {
      built.dispose()
      leafGeo.dispose()
      leafMat.dispose()
      flyGeo.dispose()
      flyMat.dispose()
      husky.dispose()
    },
  }
}
