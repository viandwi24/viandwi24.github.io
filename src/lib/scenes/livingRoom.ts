import * as THREE from 'three'
import { VoxelGrid, hash3 } from '../voxel/VoxelGrid'
import { profile } from '../content'
import { C, ISO, RES, VD, VW, floor, interiorDoor, mountDoor, rng, shelf, speech, spikyPlant, taggedMesh, v3, walls, wiggle, windowAt } from './common'
import { VoxelFire, type FireBox } from './fx/VoxelFire'
import { VoxelSmoke } from './fx/VoxelSmoke'
import { WindowLight } from './fx/WindowLight'
import { Pet } from './pets'
import type { RoomScene } from './types'

const L = {
  planks: ['#d99c59', '#d49553', '#dda260', '#d0904f'],
  groove: '#b97a40',
  notch: '#8f5a30',
  wall: '#f1d2a3',
  terracotta: '#c56e43',
  terracottaLight: '#cf7a4c',
  terracottaDark: '#a9562f',
  recess: '#7e3a20',
  soot: '#2b1810',
  sootWarm: '#5a2a16',
  chair: '#8e3f40',
  chairDark: '#73302f',
  chairLight: '#9d4a4a',
  rug: '#8a3b3e',
  rugLight: '#a8575a',
  rugDark: '#6a2a2f',
  rugPink: '#c58a7f',
  mug: '#8b4a2b',
  steam: '#fff6e8',
  stone: ['#b8b0a3', '#aea698', '#c1b9ab'],
  grout: '#8c8478',
  kamachi: '#7a4626',
  riser: '#5a321b',
}

/** The cozy living room: the About scene. */
export function createLivingRoom(): RoomScene {
  const g = new VoxelGrid(1 / RES)
  const r = rng(24)

  floor(g, L.planks, L.groove, L.notch)
  walls(g, () => L.wall)

  // ---- Corner bookshelf (hotspot: skills) --------------------------------
  g.tagged('bookshelf', () => {
    shelf(g, r, 3, 22, 3, 13, 1, 59)
    for (let z = 6; z <= 13; z++) {
      const h = Math.floor(r.range(5, 9))
      g.box(5, 60, z, 11, 59 + h, z, r.pick(C.books))
    }
    for (let k = 0; k < 3; k++) g.box(5 + (k % 2), 60 + k * 2, 15, 11 - (k % 2), 61 + k * 2, 20, C.books[(k * 3) % C.books.length])
  })

  // Door through to the Projects room, beside the corner shelf
  const door = interiorDoor(g, 14, 'projects')

  // ---- Front shelf with a trailing plant and a photo (hotspot: profile) --
  shelf(g, r, 64, 85, 3, 13, 1, 46)
  g.tagged('plant-shelf', () => {
    g.box(5, 47, 66, 11, 52, 72, (x, y, z) => (y === 52 && x > 5 && x < 11 && z > 66 && z < 72 ? C.soil : (x + y + z) % 5 === 0 ? C.potDark : C.pot))
    for (let i = 0; i < 9; i++) {
      const cx = r.range(5, 12), cz = r.range(65, 73), cy = r.range(53, 57), rad = r.range(1.6, 2.6)
      for (let x = Math.floor(cx - rad); x <= cx + rad; x++)
        for (let y = Math.floor(cy - rad); y <= cy + rad; y++)
          for (let z = Math.floor(cz - rad); z <= cz + rad; z++)
            if ((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= rad * rad && r() > 0.15) g.set(x, y, z, r.pick(C.leaves))
    }
    for (const [vz, len] of [[66, 14], [68, 20], [70, 11], [72, 17]]) {
      for (let k = 0; k < len; k++) {
        const y = 52 - k
        const x = 12 + (k > 2 ? 1 : 0)
        g.set(x, y, vz, C.leaves[1])
        if (k % 3 === 0) g.set(x + 1, y, vz + (k % 2), r.pick(C.leaves))
      }
    }
  })
  // Photo frame: a raised 2-voxel border around an opening where the avatar sits, recessed
  g.tagged('photo', () => {
    g.box(4, 47, 74, 6, 58, 83, '#5e3620')
    g.box(7, 47, 74, 7, 58, 83, (_x, y, z) => {
      if (y >= 49 && y <= 56 && z >= 76 && z <= 81) return null // the opening
      const inner = y === 48 || y === 57 || z === 75 || z === 82
      return inner ? '#8a5232' : C.woodDark
    })
  })

  // ---- Fireplace ---------------------------------------------------------
  g.tagged('fireplace', () => {
    const tc = (x: number, y: number, z: number) => (hash3(x >> 2, y >> 2, z >> 2) > 0.7 ? '#c97447' : L.terracotta)
    g.box(3, 1, 25, 26, 3, 58, L.terracottaLight) // hearth
    g.box(3, 4, 27, 19, 30, 56, tc) // firebox body
    g.box(3, 31, 25, 21, 33, 58, L.terracottaDark) // mantel
    g.box(3, 34, 28, 17, 46, 55, tc) // upper block
    g.box(3, 47, 31, 15, 57, 52, tc) // chimney
    g.box(3, 58, 30, 16, 60, 53, L.terracottaDark) // chimney cap
    g.clear(6, 54, 35, 12, 60, 48)
    g.box(6, 53, 35, 12, 53, 48, L.soot)

    // Opening with a pixel arch
    const arch: [number, number, number][] = [[4, 17, 34], [18, 18, 35], [19, 19, 36], [20, 20, 37], [21, 21, 39]]
    for (const [ya, yb, za] of arch) g.clear(9, ya, za, 19, yb, 83 - za)
    g.box(8, 4, 34, 8, 21, 49, L.soot)
    g.box(9, 3, 34, 19, 3, 49, L.soot)
    for (const z of [33, 50]) g.box(9, 4, z, 19, 17, z, L.sootWarm)

    // Recessed notches, the little dark slots on the brickwork
    const notchX = (xf: number, y: number, z: number, w = 4) => {
      g.clear(xf, y, z, xf, y + 1, z + w - 1)
      g.box(xf - 1, y, z, xf - 1, y + 1, z + w - 1, L.recess)
    }
    const notchZ = (zf: number, y: number, x: number, w = 4) => {
      g.clear(x, y, zf, x + w - 1, y + 1, zf)
      g.box(x, y, zf - 1, x + w - 1, y + 1, zf - 1, L.recess)
    }
    notchX(19, 9, 28, 3); notchX(19, 15, 52, 3); notchX(19, 25, 29); notchX(19, 26, 50)
    notchX(17, 38, 31); notchX(17, 42, 48); notchX(17, 37, 41, 3)
    notchX(15, 50, 34); notchX(15, 52, 40, 3); notchX(15, 49, 46)
    notchZ(56, 12, 8); notchZ(56, 22, 13, 3); notchZ(55, 40, 6); notchZ(52, 51, 8)
  })

  // Logs: rounded cross-section, bark grooves and ringed ends
  const bark = (a: number, b: number) => ['#6b3d22', '#5e3620', '#7a4528'][Math.floor(hash3(a, b, 9) * 3)]
  const round3 = (a: number, b: number) => !((a === 0 || a === 2) && (b === 0 || b === 2))
  for (let z = 35; z <= 48; z++)
    for (let x = 10; x <= 12; x++)
      for (let y = 4; y <= 6; y++) {
        if (!round3(x - 10, y - 4)) continue
        const end = z === 35 || z === 48
        g.set(x, y, z, end ? (x === 11 && y === 5 ? '#a87848' : '#c79a66') : bark(z >> 1, x + y))
      }
  for (const lz of [37, 44])
    for (let x = 13; x <= 18; x++)
      for (let z = lz; z <= lz + 2; z++)
        for (let y = 4; y <= 6; y++) {
          if (!round3(z - lz, y - 4)) continue
          const end = x === 18
          g.set(x, y, z, end ? (z === lz + 1 && y === 5 ? '#a87848' : '#c79a66') : bark(x >> 1, z + y))
        }
  // Glowing char on top of the logs and a bed of embers between them
  const emberColors = ['#ff5a1f', '#e0400f', '#a8260a', '#ff8a2a']
  const ember = { kind: 'glow', tag: 'embers', jitter: 0 } as const
  for (let z = 36; z <= 47; z++) if (hash3(z, 6, 1) > 0.55) g.set(11, 6, z, r.pick(emberColors), ember)
  for (const lz of [37, 44])
    for (let x = 13; x <= 17; x++) if (hash3(x, lz, 2) > 0.5) g.set(x, 6, lz + 1, r.pick(emberColors), ember)
  for (let x = 13; x <= 18; x++)
    for (let z = 35; z <= 48; z++) {
      if (g.has(x, 4, z)) continue
      if (hash3(x, 4, z) > 0.3) g.set(x, 4, z, r.pick(emberColors), ember)
      else g.set(x, 4, z, '#5a4a42', { height: 0.6 })
    }
  for (const z of [35, 48]) g.box(18, 4, z, 18, 5, z, C.iron)

  // Flame volume, simulated at runtime by VoxelFire
  const fireBox: FireBox = {
    x0: 12, x1: 16, y0: 6, y1: 21, z0: 35, z1: 48,
    allowed: (y, z) => {
      if (y <= 17) return z >= 34 && z <= 49
      const inset = [1, 2, 3, 5][y - 18]
      return inset !== undefined && z >= 34 + inset && z <= 49 - inset
    },
  }

  // ---- Windows -----------------------------------------------------------
  const windows = [windowAt(g, 64, 28)]
  g.tagged('plant-window', () => spikyPlant(g, r, 65, 28, 3))

  // Little wooden radio on the sill (poke: plays the lofi track)
  g.tagged('radio', () => {
    g.box(80, 28, 4, 88, 34, 8, (x, y, z) => {
      if (z === 8 && x >= 81 && x <= 84 && y >= 29 && y <= 33) return (x + y) % 2 ? '#3a2216' : '#5e3a22' // speaker grille
      if (z === 8 && y === 29 && (x === 86 || x === 87)) return C.brass // knobs
      return y === 34 || y === 28 ? '#6b3d22' : '#8a5232'
    })
    for (let k = 0; k < 8; k++) g.set(87 - Math.floor(k / 3), 35 + k, 5, '#b9bec6') // antenna
  })
  g.box(85, 31, 9, 87, 33, 9, '#ffcf7a', { kind: 'glow', tag: 'radio-dial', jitter: 0 })

  // Back door out to the garden
  const backDoor = interiorDoor(g, 44, 'garden')

  // ---- Genkan: sunken stone entryway inside the front door, a wooden step up to the room
  // Clicking it steps back outside.
  const gx0 = 72, gz0 = 58 // the step's edge; the stone pit starts one voxel further in
  g.tagged('genkan', () => {
    g.clear(gx0, -2, gz0, VW - 1, 0, VD - 1)
    // Stone tiles, with a sill under the house walls so the front walls sit on solid ground
    g.box(gx0 + 1, -3, gz0 + 1, VW - 1, -3, VD - 1, (x, _y, z) =>
      (x - gx0) % 7 === 0 || (z - gz0) % 7 === 0 ? L.grout : L.stone[Math.floor(hash3(Math.floor(x / 7), Math.floor(z / 7), 4) * 3)])
    g.box(gx0, -2, VD - 3, VW - 1, 0, VD - 1, (x, y) => (y === 0 && x % 6 === 0 ? L.grout : L.stone[1]))
    g.box(VW - 3, -2, gz0, VW - 1, 0, VD - 1, (_x, y, z) => (y === 0 && z % 6 === 0 ? L.grout : L.stone[1]))
    // Agarikamachi: the polished step board along the two open edges
    for (let x = gx0; x < VW - 3; x++) g.box(x, -2, gz0, x, 0, gz0, (_x, y) => (y === 0 ? L.kamachi : L.riser))
    for (let z = gz0; z < VD - 3; z++) g.box(gx0, -2, z, gx0, 0, z, (_x, y) => (y === 0 ? L.kamachi : L.riser))

    // Shoes on the stone: sneakers and boots, toes pointing at the door
    const shoe = (x: number, z: number, body: string, trim: string, tall = 2) => {
      g.box(x, -2, z, x + 2, -2, z + 6, '#f2ece0') // sole
      g.box(x, -1, z, x + 2, -2 + tall, z + 3, (_x, y) => (y === -2 + tall ? trim : body))
      g.box(x, -1, z + 4, x + 2, -1, z + 6, body)
    }
    shoe(77, 74, '#e8e2d6', '#c8443d')
    shoe(81, 75, '#e8e2d6', '#c8443d')
    shoe(79, 84, '#7a4a2a', '#5a321b', 5)
    shoe(83, 83, '#7a4a2a', '#5a321b', 5)

    // Getabako: low shoe cabinet against the wall, with a little vase on top
    g.box(85, -2, 60, 92, 14, 71, (x, y, z) => {
      if (y === 14) return C.woodDark
      if (x === 92 && (z === 65 || z === 66)) return C.woodDark
      if (x === 92 && y === 9 && (z === 63 || z === 68)) return C.brass
      return C.wood
    })
    g.box(88, 15, 63, 90, 19, 65, (_x, y) => (y >= 18 ? '#3f6e8c' : '#4a82a6'))
    g.box(89, 20, 64, 89, 23, 64, C.leaves[0])
    g.set(89, 24, 64, '#f2c14e')
  })
  // Slippers waiting on the step
  for (const z of [64, 68]) {
    g.box(66, 1, z, 70, 1, z + 2, '#d8cfc0', { height: 0.5 })
    g.box(69, 1, z, 70, 2, z + 2, '#6f8fa8', { height: 0.5 })
  }

  // ---- Rug ---------------------------------------------------------------
  const rx0 = 22, rx1 = 64, rz0 = 44, rz1 = 86
  g.box(rx0, 1, rz0, rx1, 1, rz1, (x, _y, z) => {
    const ex = Math.min(x - rx0, rx1 - x)
    const ez = Math.min(z - rz0, rz1 - z)
    if (ex <= 1 || ez <= 1) return L.rugDark
    if (ez <= 3) return (x + z) % 4 < 2 ? L.rugPink : L.rugDark
    if (ez <= 5) return L.rug
    if (ez <= 7) return L.rugLight
    if (ez === 8) return L.rugDark
    if (ez <= 10) return L.rugLight
    if (ex <= 3) return (x + z) % 4 < 2 ? L.rugPink : L.rugDark
    return L.rug
  }, { jitter: 0.005 })
  for (let x = rx0 + 1; x <= rx1 - 1; x += 3) g.box(x, 1, rz1 + 1, x + 1, 1, rz1 + 3, C.cream, { height: 0.6 })

  // ---- Coffee table on the rug, with a steaming mug -----------------------
  // Centred on the rug; legs stand on the rug (its top is y = 2)
  const tx0 = 36, tx1 = 50, tz0 = 58, tz1 = 72, top = 10
  for (const [x, z] of [[tx0 + 1, tz0 + 1], [tx0 + 1, tz1 - 2], [tx1 - 2, tz0 + 1], [tx1 - 2, tz1 - 2]]) g.box(x, 2, z, x + 1, top - 2, z + 1, C.woodDark)
  g.box(tx0, top - 1, tz0, tx1, top, tz1, (_x, y) => (y === top ? C.wood : C.woodDark))
  g.tagged('mug', () => {
    g.box(41, top + 1, 63, 44, top + 5, 66, (x, y, z) => (y === top + 5 && x > 41 && x < 44 && z > 63 && z < 66 ? '#3b2215' : L.mug))
    g.box(45, top + 2, 64, 45, top + 4, 65, L.mug)
  })
  for (const [x, dy, z] of [[42, 7, 64], [43, 8, 64], [43, 9, 65], [42, 10, 65], [42, 11, 64], [43, 12, 64], [43, 13, 65]])
    g.set(x, top + dy, z, L.steam, { kind: 'glow', tag: 'steam', jitter: 0 })

  // ---- Armchair (sized to sit with the coffee table) ----------------------
  const ax0 = 60, ax1 = 82, az0 = 22, az1 = 42
  const seat = 11, arm = 20, back = 31
  for (const [x, z] of [[ax0, az0], [ax0, az1 - 1], [ax1 - 1, az0], [ax1 - 1, az1 - 1]]) g.box(x, 1, z, x + 1, 2, z + 1, C.woodDark)
  g.box(ax0, 3, az0, ax1, seat, az1, (_x, y) => (y === 3 ? L.chairDark : L.chair))
  g.box(ax0 + 5, seat + 1, az0 + 6, ax1 - 5, seat + 3, az1, (_x, y, z) => (z === az1 && y === seat + 3 ? null : L.chairLight))
  g.box(ax0, seat + 1, az0, ax1, back, az0 + 5, (x, y) => {
    const fromEdge = Math.min(x - ax0, ax1 - x)
    if (y >= back - 1 && fromEdge < 2) return null
    if (y === back && fromEdge < 3) return null
    return L.chair
  })
  for (const [x0, x1] of [[ax0, ax0 + 4], [ax1 - 4, ax1]]) {
    g.box(x0, seat + 1, az0, x1, arm, az1, (x, y, z) => {
      const outer = x === x0 || x === x1
      if (y === arm && outer) return null
      if (z === az1 && y === arm) return null
      if (z === az1 && x > x0 && x < x1 && y > seat + 2 && y < arm - 1) return L.chairDark
      return L.chair
    })
  }
  g.box(ax0 + 6, seat + 4, az0 + 6, ax0 + 12, seat + 11, az0 + 8, L.chairDark) // pillow
  // Throw blanket over the back and one arm
  g.box(ax0 + 4, back - 4, az0 - 1, ax1 - 4, back + 1, az0 + 6, (_x, y, z) => (y === back + 1 && (z === az0 - 1 || z === az0 + 6) ? null : C.cream))
  g.box(ax0 + 4, back - 9, az0 + 6, ax1 - 4, back - 5, az0 + 6, C.cream)
  g.box(ax1 - 5, arm + 1, az0 + 9, ax1 + 1, arm + 1, az1 + 1, C.cream)
  g.box(ax1 - 5, 9, az1 + 1, ax1 + 1, arm, az1 + 1, (_x, y) => (y === 11 ? C.creamDark : C.cream))
  for (let x = ax1 - 5; x <= ax1 + 1; x += 2) g.box(x, 6, az1 + 1, x, 8, az1 + 1, C.cream)

  // ---- Build + runtime effects -------------------------------------------
  const built = g.build()
  const group = built.group

  const flames = new VoxelFire(fireBox, 1 / RES)
  group.add(flames.group)
  const smoke = new VoxelSmoke({ x0: 6 / RES, x1: 13 / RES, z0: 35 / RES, z1: 49 / RES, y: 59 / RES }, 1 / RES)
  group.add(smoke.group)

  const windowLight = new WindowLight(windows, 1 / RES)
  group.add(windowLight.group)

  const fireLight = new THREE.PointLight('#ff8a2a', 40, 22, 1.6)
  fireLight.position.copy(v3(17, 12, 41.5))
  group.add(fireLight)

  const doorLeaf = mountDoor(group, built.meshes, door.tag, door.hinge)
  const backLeaf = mountDoor(group, built.meshes, backDoor.tag, backDoor.hinge)

  // Things to poke: the fire roars, the mug steams, plants wobble, the cat wakes up
  const shelfPlant = mountDoor(group, built.meshes, 'plant-shelf', v3(8, 47, 69))
  const windowPlant = mountDoor(group, built.meshes, 'plant-window', v3(68.5, 28, 6))
  const wobbles = [wiggle(shelfPlant.pivot), wiggle(windowPlant.pivot)]
  let radioOn = true // starts playing as soon as the browser allows audio
  let noteIn = 0
  const words = speech()
  const dial = built.meshes.get('glow:radio-dial')
  let steamRush = 0
  let steamPhase = 0
  // Starts napping on the rug, in front of the coffee table
  const cat = new Pet('cat', [[28, 2, 50], [52, 2, 50], [60, 2, 62], [58, 2, 80], [40, 2, 80], [28, 2, 72]], 4)
  group.add(cat.group)

  // Avatar in the photo frame; a child of the frame so it moves with the hover pop
  const photoMesh = taggedMesh(built.meshes, 'photo')
  const avatarTex = new THREE.TextureLoader().load(profile.avatar)
  avatarTex.colorSpace = THREE.SRGBColorSpace
  avatarTex.repeat.set(0.75, 1) // crop the square avatar to the 6:8 frame
  avatarTex.offset.set(0.125, 0)
  const avatar = new THREE.Mesh(new THREE.PlaneGeometry(6 / RES, 8 / RES), new THREE.MeshStandardMaterial({ map: avatarTex, roughness: 0.7 }))
  avatar.position.copy(v3(7, 53, 79)).add(new THREE.Vector3(0.002, 0, 0))
  avatar.rotation.y = Math.PI / 2
  photoMesh.add(avatar)

  const embers = built.meshes.get('glow:embers')
  const steam = built.meshes.get('glow:steam')
  if (steam) {
    const m = steam.material as THREE.MeshBasicMaterial
    m.transparent = true
    m.depthWrite = false
  }

  let flicker = 1

  return {
    id: 'about',
    label: 'About me',
    group,
    view: { target: v3(48, 30, 48), ...ISO, zoom: 1 },
    hotspots: [
      {
        id: 'profile',
        label: 'Profile',
        mesh: photoMesh,
        marker: v3(5, 62, 78.5),
        view: { target: v3(6, 48, 78.5), azimuth: 1.2, polar: 1.1, zoom: 2.5 },
        pop: v3(1.5, 0, 0),
      },
      {
        id: 'skills',
        label: 'Skills',
        mesh: taggedMesh(built.meshes, 'bookshelf'),
        marker: v3(14, 34, 15),
        view: { target: v3(8, 30, 12.5), azimuth: 1.15, polar: 1.05, zoom: 1.9 },
      },
    ],

    exit: { label: 'Step outside', mesh: taggedMesh(built.meshes, 'genkan'), marker: v3(88, 2, 88) },

    doors: [
      { to: 'projects', label: 'Projects', ...doorLeaf, openAngle: 1.35, marker: door.marker, view: door.view },
      { to: 'garden', label: 'Garden', ...backLeaf, openAngle: 1.35, marker: backDoor.marker, view: backDoor.view },
    ],
    ambience: ['fire'],
    toys: [
      { meshes: [taggedMesh(built.meshes, 'fireplace')], poke: () => flames.stoke() },
      { meshes: [taggedMesh(built.meshes, 'mug')], poke: () => (steamRush = 2.5) },
      { meshes: shelfPlant.meshes, poke: wobbles[0].poke },
      { meshes: windowPlant.meshes, poke: wobbles[1].poke },
      cat.toy,
      {
        meshes: [taggedMesh(built.meshes, 'radio')],
        poke: () => {
          radioOn = !radioOn
          noteIn = 0
          if (!radioOn) words.say('click', v3(84, 40, 6))
        },
        sound: () => (radioOn ? 'radio-on' : 'radio-off'),
        marker: { at: v3(84, 24, 9), label: 'Radio', icon: () => (radioOn ? 'pause' : 'play'), below: true },
      },
    ],
    bubbles: () => [...cat.bubbles(), ...words.list()],
    setNight: (n) => windowLight.setNight(n),

    update(dt, t) {
      // Fire light follows the simulated flame strength, smoothed so it breathes instead of strobing
      flames.update(dt)
      windowLight.update(dt, t)
      if (smoke.group.visible) smoke.update(dt)
      flicker += (flames.strength - flicker) * Math.min(1, dt * 12)
      fireLight.intensity = 26 + 26 * flicker + 4 * Math.sin(t * 17)
      if (embers) (embers.material as THREE.MeshBasicMaterial).color.setScalar(0.75 + 0.2 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 7.9))
      steamRush = Math.max(0, steamRush - dt)
      steamPhase += dt * (steamRush > 0 ? 1.2 : 0.35)
      if (steam) {
        const k = steamPhase % 1
        steam.position.y = k * (steamRush > 0 ? 1.4 : 0.6)
        ;(steam.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * (steamRush > 0 ? 1 : 0.85)
      }
      wobbles.forEach((w) => w.update(dt))
      // Music notes drift up from the radio while it plays; the dial glows
      words.update(dt)
      if (radioOn && (noteIn -= dt) <= 0) {
        noteIn = 1.1
        words.say(Math.random() < 0.5 ? '♪' : '♫', v3(82 + Math.random() * 6, 38, 6))
      }
      if (dial) (dial.material as THREE.MeshBasicMaterial).color.setScalar(radioOn ? 0.9 + 0.1 * Math.sin(t * 8) : 0.35)
      cat.update(dt)
    },

    // The chimney smoke would poke through the house roof, so only show it when the roof is off
    setExposed(open) {
      smoke.group.visible = open
    },

    dispose() {
      built.dispose()
      flames.dispose()
      windowLight.dispose()
      smoke.dispose()
      cat.dispose()
      avatarTex.dispose()
      avatar.geometry.dispose()
      ;(avatar.material as THREE.Material).dispose()
    },
  }
}
