import * as THREE from 'three'
import { VoxelGrid } from '../voxel/VoxelGrid'
import { projects } from '../content'
import { C, RES, blob, floor, interiorDoor, mountDoor, rng, shelf, spikyPlant, taggedMesh, v3, walls, wiggle, windowAt } from './common'
import { WindowLight } from './fx/WindowLight'
import { MonitorScreen } from './fx/MonitorScreen'
import type { Hotspot, RoomScene } from './types'

const K = {
  planks: ['#a86a3c', '#9e6236', '#b07344', '#a46638'],
  groove: '#82502b',
  notch: '#6a3f22',
  wall: '#ead9b9',
  wainscot: ['#a86f3e', '#9f683a'],
  wainscotGroove: '#94602f',
  rail: '#7b4524',
  desk: '#9a6235',
  deskTop: '#b07443',
  deskDark: '#6e4224',
  crt: '#d8ccb2',
  crtDark: '#bfb194',
  screen: '#1c2430',
  keys: '#8f866f',
  console: '#8d8f98',
  consoleDark: '#5f6169',
  slot: '#1a1a1e',
  chair: '#c0473f',
  chairDark: '#8f302b',
  chairBase: '#2e2a2c',
  pole: '#8a8a90',
  peg: '#c99a68',
  pegHole: '#9c7449',
  rug: '#3f6f73',
  rugLight: '#5a8c8c',
  rugDark: '#2c5155',
  beanbag: '#d9a441',
  beanbagDark: '#b9862c',
  posterBg: '#1d2b4a',
  invader: '#7fe0c0',
  pc: '#3a3f4a',
  neon: '#7fe0c0',
}

// 3x5 pixel font for the neon sign
const FONT: Record<string, string[]> = {
  P: ['111', '101', '111', '100', '100'],
  R: ['111', '101', '110', '101', '101'],
  O: ['111', '101', '101', '101', '111'],
  J: ['001', '001', '001', '101', '111'],
  E: ['111', '100', '110', '100', '111'],
  C: ['111', '100', '100', '100', '111'],
  T: ['111', '010', '010', '010', '010'],
  S: ['111', '100', '111', '001', '111'],
}

const INVADER = ['00100000100', '00010001000', '00111111100', '01101110110', '11111111111', '10111111101', '10100000101', '00011011000']

const shade = (hex: string, l: number) => '#' + new THREE.Color(hex).offsetHSL(0, 0, l).getHexString()

/** The workshop: the Projects scene. Each cartridge on the wall is a project. */
export function createWorkshop(): RoomScene {
  const g = new VoxelGrid(1 / RES)
  const r = rng(7)

  floor(g, K.planks, K.groove, K.notch)
  walls(g, (u, y) => {
    if (y <= 22) return u % 4 === 0 ? K.wainscotGroove : K.wainscot[Math.floor(u / 4) % 2]
    if (y <= 24) return K.rail
    return K.wall
  })

  const windows = [windowAt(g, 66, 28)]
  g.tagged('plant-window', () => spikyPlant(g, r, 72, 28, 3))

  // Door back to the living room
  const door = interiorDoor(g, 6, 'about')

  // ---- Poster with a space invader ---------------------------------------
  g.box(28, 44, 3, 52, 56, 3, (x, y) => (x === 28 || x === 52 || y === 44 || y === 56 ? C.cream : K.posterBg))
  INVADER.forEach((row, i) => {
    for (let j = 0; j < row.length; j++) if (row[j] === '1') g.set(35 + j, 53 - i, 3, K.invader)
  })

  // ---- Desk (top at y = D) ---------------------------------------------
  const D = 21
  g.box(20, D - 1, 3, 60, D, 24, (_x, _y, z) => (z === 24 ? K.desk : K.deskTop))
  for (const x0 of [20, 58]) g.box(x0, 1, 4, x0 + 2, D - 2, 23, K.deskDark)
  g.box(23, 9, 3, 57, D - 2, 3, K.deskDark)

  // CRT monitor
  g.box(36, D + 1, 10, 44, D + 1, 16, K.crtDark)
  g.box(30, D + 2, 10, 50, D + 20, 18, (x, y) => ((x === 30 || x === 50) && (y === D + 2 || y === D + 20) ? null : K.crt))
  g.box(33, D + 4, 4, 47, D + 18, 9, K.crtDark)
  g.clear(33, D + 6, 18, 47, D + 17, 18)
  g.box(33, D + 6, 17, 47, D + 17, 17, K.screen)
  g.set(48, D + 4, 18, '#5dff8a', { kind: 'glow', jitter: 0 })

  // Keyboard + mouse + mug
  g.box(32, D + 1, 20, 48, D + 1, 23, (x, _y, z) => (x % 2 === 0 && z % 2 === 1 ? K.keys : K.crt))
  g.box(51, D + 1, 21, 52, D + 1, 22, K.crt)
  g.box(24, D + 1, 17, 26, D + 4, 19, (x, y, z) => (y === D + 4 && x === 25 && z === 18 ? '#3b2215' : '#3f7fbf'))

  // Game console with a cartridge slot (hotspot: the arcade)
  g.tagged('console', () => {
    g.box(51, D + 1, 6, 57, D + 4, 14, (_x, y) => (y === D + 1 ? K.consoleDark : K.console))
    g.clear(52, D + 4, 9, 56, D + 4, 11)
    g.box(52, D + 3, 9, 56, D + 3, 11, K.slot)
  })
  g.set(56, D + 3, 14, '#ff5a4a', { kind: 'glow', jitter: 0 })

  // Desk lamp
  g.box(23, D + 1, 6, 27, D + 1, 9, C.brass)
  g.box(25, D + 2, 7, 25, D + 10, 7, C.brass)
  g.box(24, D + 11, 6, 29, D + 12, 9, K.deskDark)
  g.box(26, D + 10, 7, 28, D + 10, 8, '#ffe2a4', { kind: 'glow', jitter: 0 })

  // PC tower under the desk, with RGB that cycles at runtime
  g.box(48, 1, 6, 56, 17, 16, K.pc)
  g.box(50, 3, 16, 50, 15, 16, '#ffffff', { kind: 'glow', tag: 'rgb', jitter: 0 })
  for (const fy of [6, 12]) {
    g.box(56, fy - 2, 9, 56, fy + 2, 13, (_x, y, z) => (y === fy && z === 11 ? K.pc : '#ffffff'), { kind: 'glow', tag: 'rgb', jitter: 0 })
  }

  // ---- Gaming chair (facing the desk) --------------------------------------
  g.box(35, 1, 34, 45, 1, 35, K.chairBase)
  g.box(39, 1, 29, 40, 1, 40, K.chairBase)
  g.box(39, 2, 34, 40, 6, 35, K.pole)
  g.box(35, 7, 29, 45, 9, 39, (x, y, z) => ((x === 35 || x === 45) && (z === 29 || z === 39) && y === 9 ? null : y === 7 ? K.chairDark : K.chair))
  g.box(36, 10, 39, 44, 24, 41, (x, y) => {
    if (y === 24 && (x <= 37 || x >= 43)) return null
    return x >= 39 && x <= 41 && y > 11 && y < 23 ? K.chairDark : K.chair
  })
  for (const x of [34, 46]) {
    g.box(x, 10, 34, x, 12, 35, K.chairBase)
    g.box(x, 13, 31, x, 13, 37, K.chairBase)
  }

  // ---- Rug ---------------------------------------------------------------
  for (let x = 16; x <= 68; x++)
    for (let z = 24; z <= 72; z++) {
      const d = Math.hypot((x + 0.5 - 42) / 26, (z + 0.5 - 48) / 24)
      if (d > 1) continue
      const ring = Math.floor(d * 10)
      const c = ring >= 9 ? K.rugDark : ring === 7 ? K.rugLight : ring === 4 ? K.rugLight : ring === 1 ? K.rugDark : K.rug
      g.set(x, 1, z, c, { jitter: 0.005 })
    }

  // ---- Beanbag -----------------------------------------------------------
  blob(g, 74, 8.5, 70, 10, 7.5, 10, (dx, dy, dz) => {
    if (dy > 0.55 && Math.hypot(dx, dz) < 0.45) return null // sat-in dent
    return dy < -0.55 || Math.abs(dx - dz) < 0.06 ? K.beanbagDark : K.beanbag
  })

  // ---- Low cabinet, pegboard and cartridges ------------------------------
  // The low cabinet is the archive of every project
  g.tagged('archive', () => shelf(g, r, 20, 76, 3, 11, 1, 23))
  g.box(3, 26, 20, 3, 56, 76, (_x, y, z) => {
    if (y === 26 || y === 56 || z === 20 || z === 76) return C.woodDark
    return z % 4 === 2 && y % 4 === 2 ? K.pegHole : K.peg
  })

  // Featured projects as cartridges: two rows of four, read left to right (toward -z)
  const featured = projects.filter((p) => p.cartridge).slice(0, 8)
  const cartPos = (i: number) => ({ y0: i < 4 ? 43 : 28, z0: 26 + (3 - (i % 4)) * 12 })
  featured.forEach((p, i) => {
    const color = p.cartridge!
    const { y0, z0 } = cartPos(i)
    const z1 = z0 + 8, y1 = y0 + 11
    g.box(4, y0 - 1, z0 - 1, 8, y0 - 1, z1 + 1, C.wood) // ledge
    g.tagged(`cart-${p.id}`, () => {
      g.box(4, y0, z0, 7, y1, z1, (x, y, z) => {
        if (y === y1 && (z === z0 || z === z1)) return null
        if (y === y1) return z % 2 ? shade(color, -0.12) : color
        if (x === 7 && y >= y0 + 2 && y <= y1 - 2 && z > z0 && z < z1) {
          if (y >= y1 - 3) return color
          if (y === y0 + 5 || (y === y0 + 3 && z < z1 - 2)) return '#5a4a3a'
          return C.cream
        }
        return y === y0 ? shade(color, -0.1) : color
      })
    })
  })

  // ---- Neon sign ---------------------------------------------------------
  'PROJECTS'.split('').forEach((ch, i) => {
    const start = 82 - i * 8
    FONT[ch].forEach((row, ri) => {
      for (let col = 0; col < 3; col++) {
        if (row[col] !== '1') continue
        const z = start - col * 2
        const y = 66 - ri * 2
        g.box(3, y - 1, z - 1, 3, y, z, K.neon, { kind: 'glow', tag: 'neon', jitter: 0 })
      }
    })
  })

  // Tall plant in the front corner
  spikyPlant(g, r, 4, 1, 82, 1.5)

  // ---- Build + runtime bits ----------------------------------------------
  const built = g.build()
  const group = built.group

  const screen = new MonitorScreen(15 / RES, 12 / RES)
  screen.mesh.position.copy(v3(40.5, D + 12, 18)).add(new THREE.Vector3(0, 0, 0.005))
  group.add(screen.mesh)

  // Cartridge that appears in the console when a project is open
  const slotCart = new THREE.Mesh(new THREE.BoxGeometry(5 / RES, 6 / RES, 2 / RES), new THREE.MeshStandardMaterial({ roughness: 0.9 }))
  const slotHome = v3(54.5, D + 6, 10.5)
  slotCart.position.copy(slotHome)
  slotCart.castShadow = true
  slotCart.visible = false
  group.add(slotCart)
  // Slides in from above when a project opens and pops back out on eject; 0 = seated, 1 = out
  let cartLift = 1
  let cartGoal = 1

  const windowLight = new WindowLight(windows, 1 / RES)
  group.add(windowLight.group)

  const screenLight = new THREE.PointLight('#8fe8ff', 5, 9, 1.6)
  screenLight.position.copy(v3(40, D + 12, 26))
  group.add(screenLight)
  const lampLight = new THREE.PointLight('#ffcf8a', 8, 10, 1.6)
  lampLight.position.copy(v3(27, D + 8, 10))
  group.add(lampLight)
  const neonLight = new THREE.PointLight(K.neon, 6, 10, 1.6)
  neonLight.position.copy(v3(10, 62, 52))
  group.add(neonLight)

  const doorLeaf = mountDoor(group, built.meshes, door.tag, door.hinge)
  const plant = mountDoor(group, built.meshes, 'plant-window', v3(75.5, 28, 6))
  const wobble = wiggle(plant.pivot)
  const rgb = built.meshes.get('glow:rgb')
  const neon = built.meshes.get('glow:neon')

  const monitorView = { target: v3(40.5, D + 10, 16), azimuth: 0.38, polar: 1.12, zoom: 2.6 }
  const hotspots: Hotspot[] = featured.map((p, i) => ({
    id: p.id,
    label: p.title,
    short: String(i + 1).padStart(2, '0'),
    mesh: taggedMesh(built.meshes, `cart-${p.id}`),
    marker: v3(6, cartPos(i).y0 + 13, cartPos(i).z0 + 4.5),
    view: monitorView,
    pop: v3(2, 0, 0),
    quiet: true,
  }))
  hotspots.push({
    id: 'arcade',
    label: 'Arcade',
    mesh: taggedMesh(built.meshes, 'console'),
    marker: v3(54, D + 9, 10),
    view: monitorView,
    quiet: true,
  })
  hotspots.push({
    id: 'archive',
    label: `Archive · ${projects.length} projects`,
    mesh: taggedMesh(built.meshes, 'archive'),
    marker: v3(13, 2, 46),
    view: { target: v3(8, 14, 48), azimuth: 1.2, polar: 1.02, zoom: 1.7 },
  })

  return {
    id: 'projects',
    label: 'Projects',
    group,
    view: { target: v3(48, 30, 48), azimuth: 0.72, polar: 0.96, zoom: 1 },
    hotspots,
    signs: [{ label: 'Pick a cartridge', at: v3(5, 57, 48) }],
    doors: [{ to: 'about', label: 'Living room', ...doorLeaf, openAngle: 1.35, marker: door.marker, view: door.view }],

    // Projects opened from the archive have no cartridge of their own: show them on the monitor too
    itemView: (id) => (projects.some((p) => p.id === id) ? monitorView : undefined),

    eject: { label: 'Eject', mesh: slotCart, marker: v3(54.5, D + 11, 10.5) },

    toys: [{ meshes: plant.meshes, poke: wobble.poke }],
    setNight: (n) => windowLight.setNight(n),

    // In the arcade every click (or Space) is a flap
    press: () => {
      if (!screen.playing) return false
      screen.flap()
      return true
    },

    update(dt, t) {
      wobble.update(dt)
      screen.update(dt)
      windowLight.update(dt, t)
      if (cartLift !== cartGoal) {
        cartLift = cartGoal > cartLift ? Math.min(cartGoal, cartLift + dt * 5) : Math.max(cartGoal, cartLift - dt * 4)
        // Snap to whole voxels so the cartridge moves in chunky steps
        slotCart.position.y = slotHome.y + Math.round(cartLift * 10) / RES
        if (cartLift >= 1) slotCart.visible = false
      }
      if (rgb) (rgb.material as THREE.MeshBasicMaterial).color.setHSL((t * 0.12) % 1, 0.85, 0.6)
      // Neon hums, with the odd stutter
      const stutter = Math.sin(t * 0.7) > 0.97 && Math.sin(t * 40) > 0 ? 0.35 : 1
      if (neon) (neon.material as THREE.MeshBasicMaterial).color.setScalar((0.9 + 0.1 * Math.sin(t * 3)) * stutter)
      neonLight.intensity = 6 * stutter
    },

    focus(id) {
      // The arcade plays the Flappy Bird AI cartridge
      const arcade = id === 'arcade'
      const p = projects.find((q) => q.id === (arcade ? 'flappy-bird-ai' : id))
      // The chosen cartridge leaves the wall for the console
      hotspots.forEach((h) => (h.mesh.visible = !(h.id === p?.id && featured.includes(p))))
      if (arcade && p) {
        slotCart.visible = true
        cartLift = 1
        cartGoal = 0
        ;(slotCart.material as THREE.MeshStandardMaterial).color.set(p.cartridge ?? '#7d7f88')
        screen.startGame()
      } else if (p) {
        slotCart.visible = true
        cartLift = 1
        cartGoal = 0
        const color = p.cartridge ?? '#7d7f88'
        ;(slotCart.material as THREE.MeshStandardMaterial).color.set(color)
        screen.show({ title: p.title, subtitle: `${p.year} · ${p.type}`, color, image: p.image })
      } else {
        cartGoal = 1
        screen.show(null)
      }
    },

    dispose() {
      built.dispose()
      screen.dispose()
      windowLight.dispose()
      slotCart.geometry.dispose()
      ;(slotCart.material as THREE.Material).dispose()
    },
  }
}
