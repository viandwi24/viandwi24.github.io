import * as THREE from 'three'
import { VoxelGrid } from '../voxel/VoxelGrid'
import { C, RES, floor, interiorDoor, mountDoor, rng, spikyPlant, speech, taggedMesh, v3, walls, wiggle, windowAt } from './common'
import { WindowLight } from './fx/WindowLight'
import type { RoomScene } from './types'

const M = {
  planks: ['#d8b07a', '#cfa671', '#e0b884', '#c99f6a'],
  groove: '#b08850',
  notch: '#8f6a3a',
  wall: '#cfe0e8',
  wallStripe: '#c3d6e0',
  wainscot: '#f4efe4',
  wainscotGroove: '#e0d8c8',
  rail: '#9ab4c4',
  board: '#e8d8b8',
  paper: '#fbf6ea',
  envelope: '#f0dfb8',
  seal: '#c8443d',
  ink: '#1f2430',
  mailbox: '#c8443d',
  mailboxDark: '#962f2a',
  phone: '#d9534a',
  parcel: '#c99a68',
  tape: '#e8d0a0',
  rug: '#5f7fbf',
  rugLight: '#8aa6d8',
}

// Social cards on the pinboard, in the same order as profile.links
const CARDS = ['#24292e', '#0a66c2', '#c8443d', '#39b54a', '#d6249f']

/** The post room: write a letter at the desk, or pick a channel from the pinboard. */
export function createContact(): RoomScene {
  const g = new VoxelGrid(1 / RES)
  const r = rng(77)

  floor(g, M.planks, M.groove, M.notch)
  walls(g, (u, y) => {
    if (y <= 20) return u % 5 === 0 ? M.wainscotGroove : M.wainscot
    if (y <= 22) return M.rail
    return u % 10 < 1 ? M.wallStripe : M.wall
  })

  const door = interiorDoor(g, 14, 'garden')
  const windows = [windowAt(g, 66, 28)]
  spikyPlant(g, r, 72, 28, 3)

  // ---- Writing desk against the z = 0 wall (hotspot: letter) ---------------
  g.tagged('letter', () => {
    g.box(30, 23, 3, 58, 24, 20, C.wood)
    for (const x of [31, 56]) g.box(x, 1, 4, x + 1, 22, 19, C.woodDark)
    g.box(33, 17, 19, 55, 22, 20, C.woodDark)
    g.box(43, 19, 21, 45, 20, 21, C.brass) // drawer knob
    g.box(38, 25, 8, 46, 25, 15, M.paper, { height: 0.3 })
    for (const z of [10, 12, 14]) g.box(39, 25, z, 44, 25, z, '#9ab4c4', { height: 0.4 })
    g.box(48, 25, 10, 54, 25, 14, M.envelope, { height: 0.5 })
    g.box(50, 26, 11, 51, 26, 12, M.seal, { height: 0.4 })
    g.box(34, 25, 6, 35, 27, 7, M.ink)
    // Quill leaning out of the ink pot
    for (let k = 0; k < 7; k++) g.set(35 + Math.floor(k / 2), 28 + k, 7 + Math.floor(k / 3), k < 2 ? '#3b2a1a' : '#ffffff')
  })
  // Chair at the desk
  g.box(38, 12, 24, 48, 13, 32, C.wood)
  for (const [x, z] of [[38, 24], [47, 24], [38, 31], [47, 31]]) g.box(x, 1, z, x + 1, 11, z + 1, C.woodDark)
  g.box(38, 14, 32, 48, 30, 33, (_x, y) => (y % 4 === 0 ? C.woodDark : C.wood))

  // ---- Pinboard with social cards on the x = 0 wall (hotspot: socials) ----
  g.tagged('socials', () => {
    g.box(3, 28, 22, 3, 58, 74, (_x, y, z) => (y === 28 || y === 58 || z === 22 || z === 74 ? C.woodDark : M.board))
    CARDS.forEach((c, i) => {
      const z1 = 70 - i * 10, z0 = z1 - 7
      const y0 = i % 2 ? 44 : 34
      g.box(4, y0, z0, 4, y0 + 7, z1, (_x, y, z) => {
        if (y === y0 + 2 && z > z0 + 1 && z < z1 - 1) return '#ffffff' // a name line
        if (y === y0 + 5 && z > z0 + 1 && z < z0 + 4) return '#ffffff' // an icon
        return c
      })
      g.box(5, y0 + 6, z0 + 3, 5, y0 + 7, z0 + 4, '#ffd36b') // pin
    })
  })

  // ---- Mailbox on a post (poke: the flag pops up) -----------------------------
  g.box(79, 1, 74, 81, 17, 76, C.woodDark)
  g.box(74, 18, 71, 86, 25, 79, (x, y, z) => {
    if (y === 25 && (z === 71 || z === 79)) return null
    if (x === 86 && y < 24 && y > 19 && z > 72 && z < 78) return M.mailboxDark // door
    return M.mailbox
  })
  g.tagged('flag', () => {
    g.box(75, 20, 80, 75, 32, 80, '#7a7f88')
    g.box(75, 28, 80, 75, 32, 85, '#ffd36b')
  })

  // ---- Rotary phone on a side table ---------------------------------------
  g.box(6, 14, 80, 18, 15, 90, C.wood)
  for (const [x, z] of [[7, 81], [16, 81], [7, 88], [16, 88]]) g.box(x, 1, z, x + 1, 13, z + 1, C.woodDark)
  g.tagged('phone', () => {
    g.box(9, 16, 82, 15, 19, 88, M.phone)
    g.box(15, 17, 84, 15, 18, 86, '#fbf6ea') // dial
    g.box(9, 20, 82, 15, 21, 83, '#b8403a')
    g.box(9, 20, 87, 15, 21, 88, '#b8403a')
    g.box(10, 22, 82, 14, 22, 88, '#b8403a') // handset
  })

  // ---- Parcels by the window and a round rug ---------------------------------
  g.box(62, 1, 4, 74, 9, 14, (x, y) => (x === 68 || y === 9 ? M.tape : M.parcel))
  g.box(64, 10, 6, 72, 15, 12, (x, y) => (x === 68 || y === 15 ? M.tape : '#b8875a'))
  for (let x = 30; x <= 74; x++)
    for (let z = 40; z <= 84; z++) {
      const d = Math.hypot((x + 0.5 - 52) / 22, (z + 0.5 - 62) / 22)
      if (d > 1) continue
      g.set(x, 1, z, Math.floor(d * 6) % 2 ? M.rugLight : M.rug, { jitter: 0.005 })
    }

  // ---- Paper plane (built here, flown around at runtime) ------------------
  g.tagged('plane', () => {
    g.box(0, 0, 0, 6, 0, 0, M.paper)
    for (let k = 0; k < 5; k++) g.box(k, 0, -Math.floor((6 - k) / 2), k, 0, Math.floor((6 - k) / 2), M.paper)
    g.box(1, 1, 0, 5, 1, 0, '#e0d8c8')
  })

  // ---- Build -----------------------------------------------------------------
  const built = g.build()
  const group = built.group
  const windowLight = new WindowLight(windows, 1 / RES)
  group.add(windowLight.group)

  const doorLeaf = mountDoor(group, built.meshes, door.tag, door.hinge)
  // The flag rests flat along the mailbox and swings upright when poked
  const flag = mountDoor(group, built.meshes, 'flag', v3(75, 20, 80))
  flag.pivot.rotation.z = -Math.PI / 2
  const phone = mountDoor(group, built.meshes, 'phone', v3(12, 16, 85))
  const ring = wiggle(phone.pivot, 0.12)
  const plane = mountDoor(group, built.meshes, 'plane', v3(3, 0, 0))
  const words = speech(1.4)
  let flagUp = 0
  let loop = -1
  let planeT = 0

  return {
    id: 'contact',
    label: 'Contact',
    group,
    view: { target: v3(48, 30, 48), azimuth: Math.PI / 4, polar: 0.96, zoom: 1 },
    hotspots: [
      {
        id: 'letter',
        label: 'Write me a letter',
        mesh: taggedMesh(built.meshes, 'letter'),
        marker: v3(44, 40, 12),
        view: { target: v3(44, 26, 14), azimuth: 0.3, polar: 0.95, zoom: 2.0 },
      },
      {
        id: 'socials',
        label: 'Find me online',
        mesh: taggedMesh(built.meshes, 'socials'),
        marker: v3(4, 62, 48),
        view: { target: v3(6, 43, 48), azimuth: 1.25, polar: 1.08, zoom: 1.7 },
      },
    ],
    doors: [{ to: 'garden', label: 'Garden', ...doorLeaf, openAngle: 1.35, marker: door.marker, view: door.view }],
    toys: [
      {
        meshes: flag.meshes,
        poke: () => {
          flagUp = 4
          words.say("you've got mail!", v3(80, 40, 76))
        },
      },
      {
        meshes: phone.meshes,
        poke: () => {
          ring.poke()
          words.say('ring ring!', v3(12, 32, 85))
        },
      },
      { meshes: plane.meshes, poke: () => (loop = 0) },
    ],
    bubbles: () => words.list(),
    setNight: (n) => windowLight.setNight(n),

    update(dt, t) {
      windowLight.update(dt, t)
      words.update(dt)
      ring.update(dt)
      flagUp = Math.max(0, flagUp - dt)
      flag.pivot.rotation.z += ((flagUp > 0 ? 0 : -Math.PI / 2) - flag.pivot.rotation.z) * Math.min(1, dt * 8)

      // The paper plane glides in a lazy oval above the rug; poked, it does a loop
      planeT += dt * 0.35
      const a = planeT
      plane.pivot.position.copy(v3(52 + Math.cos(a) * 20, 44 + Math.sin(a * 2) * 3, 60 + Math.sin(a) * 18))
      plane.pivot.rotation.set(0, Math.atan2(-Math.cos(a) * 18, -Math.sin(a) * 20), Math.sin(a * 2) * 0.15)
      if (loop >= 0) {
        loop += dt / 0.9
        plane.pivot.rotation.z += loop * Math.PI * 2
        plane.pivot.position.y += Math.sin(Math.min(1, loop) * Math.PI) * 1.2
        if (loop >= 1) loop = -1
      }
    },

    dispose() {
      built.dispose()
      windowLight.dispose()
    },
  }
}
