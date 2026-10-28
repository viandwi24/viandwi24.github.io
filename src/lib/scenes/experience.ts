import * as THREE from 'three'
import { VoxelGrid, hash3 } from '../voxel/VoxelGrid'
import { experience } from '../content'
import { C, RES, blob, floor, interiorDoor, mountDoor, rng, spikyPlant, speech, taggedMesh, v3, walls, windowAt } from './common'
import { WindowLight } from './fx/WindowLight'
import type { RoomScene } from './types'

const X = {
  planks: ['#7a4a2c', '#704428', '#845232', '#6c4226'],
  groove: '#5a361e',
  notch: '#4a2c18',
  paper: ['#2f5a4a', '#33604f'],
  paperStripe: '#3d6e5b',
  wainscot: ['#6b3f22', '#633a1f'],
  rail: '#c99a4a',
  cork: ['#c9955a', '#be8a50', '#d29f63'],
  velvet: '#6a2a2f',
  gold: '#e8b53a',
  goldDark: '#b8862a',
  silver: '#cfd6dd',
  bronze: '#c07a43',
  glass: '#dff0ff',
  string: '#d23a3a',
  photos: ['#9cc4d6', '#e8c08a', '#a8c98a', '#d6a0b8', '#f0d58a', '#8fb0d8', '#c9a0e0', '#e0a88a'],
  rug: '#8a6a3a',
  rugLight: '#b08a4a',
  rugDark: '#5e4424',
  globe: '#3f7fbf',
  land: '#6aa94c',
}

/** The trophy study: the career timeline on a corkboard and a cabinet of awards. */
export function createExperience(): RoomScene {
  const g = new VoxelGrid(1 / RES)
  const r = rng(52)

  floor(g, X.planks, X.groove, X.notch)
  walls(g, (u, y) => {
    if (y <= 20) return u % 4 === 0 ? X.wainscot[1] : X.wainscot[0]
    if (y <= 22) return X.rail
    return u % 8 < 2 ? X.paperStripe : X.paper[Math.floor(u / 8) % 2]
  })

  const door = interiorDoor(g, 14, 'garden')
  const windows = [windowAt(g, 66, 28)]
  spikyPlant(g, r, 72, 28, 3)

  // ---- Corkboard timeline on the x = 0 wall --------------------------------
  const pins: [number, number][] = []
  g.tagged('timeline', () => {
    g.box(3, 26, 16, 3, 60, 80, (_x, y, z) =>
      y === 26 || y === 60 || z === 16 || z === 80 ? C.woodDark : X.cork[Math.floor(hash3(z >> 1, y >> 1, 3) * 3)])
    // One polaroid per job, oldest at the front (high z), zig-zagging up and down
    experience.forEach((_job, i) => {
      const z0 = 72 - i * 7, y0 = i % 2 ? 44 : 32
      g.box(4, y0, z0 - 5, 4, y0 + 8, z0, (_x, y, z) => {
        if (y === y0 || y >= y0 + 7 || z === z0 - 5 || z === z0) return '#fbf6ea'
        return hash3(z, y, i) > 0.8 ? '#ffffff' : X.photos[i % X.photos.length]
      })
      g.box(5, y0 + 7, z0 - 3, 5, y0 + 8, z0 - 2, X.string) // pin
      pins.push([y0 + 8, z0 - 2.5])
    })
    // Red string from pin to pin
    for (let i = 0; i + 1 < pins.length; i++) {
      const [ya, za] = pins[i], [yb, zb] = pins[i + 1]
      const steps = Math.ceil(Math.abs(zb - za)) * 2
      for (let s = 0; s <= steps; s++) {
        const k = s / steps
        g.set(4, Math.round(ya + (yb - ya) * k + Math.sin(k * Math.PI) * -1.5), Math.round(za + (zb - za) * k), X.string, { jitter: 0 })
      }
    }
  })

  // ---- Desk under the corkboard, with a globe and a lamp ---------------------
  g.box(3, 18, 28, 14, 19, 68, C.wood)
  for (const z of [29, 66]) g.box(4, 1, z, 12, 17, z + 1, C.woodDark)
  g.box(4, 20, 58, 10, 21, 64, X.paper[0])
  g.box(5, 22, 59, 9, 23, 63, '#a24a3d')
  g.box(4, 20, 30, 7, 20, 34, C.brass)
  g.box(5, 21, 31, 6, 28, 32, C.brass)
  g.box(4, 29, 30, 9, 30, 34, '#2f5a4a')
  g.box(6, 28, 31, 8, 28, 33, '#ffe2a4', { kind: 'glow', jitter: 0 })
  g.box(7, 20, 44, 11, 20, 48, C.brass)
  g.box(9, 21, 46, 9, 22, 46, C.brass)
  g.tagged('globe', () =>
    blob(g, 9, 27.5, 46.5, 4.5, 4.5, 4.5, (dx, dy, dz) =>
      hash3(Math.floor(dx * 4), Math.floor(dy * 4), Math.floor(dz * 4)) > 0.55 ? X.land : X.globe))

  // ---- Trophy cabinet against the z = 0 wall ---------------------------------
  g.tagged('trophies', () => {
    const x0 = 32, x1 = 56
    g.box(x0, 1, 3, x1, 47, 12, (x, y, z) => {
      const frame = x <= x0 + 1 || x >= x1 - 1 || y <= 2 || y >= 46
      const shelf = y === 15 || y === 30
      if (frame || shelf) return y >= 46 ? C.woodDark : C.wood
      if (z === 3) return X.velvet
      return null
    })
    g.box(x0 + 2, 3, 12, x1 - 2, 45, 12, X.glass, { kind: 'glass' })
    const cup = (cx: number, y: number, cz: number, metal: string, dark: string, size = 1) => {
      g.box(cx - 2, y, cz - 2, cx + 2, y, cz + 2, dark)
      g.box(cx, y + 1, cz, cx, y + 2, cz, metal)
      const top = y + 3 + Math.round(3 * size)
      g.box(cx - 2, y + 3, cz - 2, cx + 2, top, cz + 2, (x, yy, z) => (yy === top && Math.abs(x - cx) < 2 && Math.abs(z - cz) < 2 ? dark : metal))
      g.box(cx - 3, top - 2, cz, cx - 3, top - 1, cz, metal)
      g.box(cx + 3, top - 2, cz, cx + 3, top - 1, cz, metal)
    }
    cup(38, 31, 7, X.gold, X.goldDark, 1.4)
    cup(46, 31, 7, X.silver, '#9aa3ab')
    cup(52, 31, 7, X.bronze, '#8f5a30', 0.7)
    // Framed certificates and medals on the lower shelves
    for (const [x, y] of [[36, 17], [45, 17]]) g.box(x, y, 5, x + 6, y + 9, 5, (xx, yy) => (xx === x || xx === x + 6 || yy === y || yy === y + 9 ? C.woodDark : yy === y + 6 ? X.gold : '#fbf6ea'))
    for (const [x, c] of [[37, X.gold], [43, X.silver], [49, X.bronze]] as const) {
      g.box(x, 8, 4, x + 1, 13, 4, x === 37 ? '#3f7fbf' : '#d23a3a')
      g.box(x - 1, 5, 4, x + 2, 7, 5, c)
    }
  })

  // ---- Grandfather clock in the front corner ---------------------------------
  g.box(3, 1, 80, 11, 52, 90, (x, y, z) => {
    if (x === 11 && y >= 38 && y <= 47 && z >= 82 && z <= 88) {
      const cx = 85, cy = 42.5
      if (Math.abs(z - cx) <= 0 && y >= cy && y <= cy + 3) return '#1d1a1a'
      if (y === Math.floor(cy) && z > cx && z <= cx + 2) return '#1d1a1a'
      return '#fbf6ea'
    }
    if (x === 11 && y >= 8 && y <= 34 && z >= 83 && z <= 87) return '#2a1810'
    return y >= 50 || y <= 3 ? C.woodDark : '#8a5232'
  })
  g.tagged('pendulum', () => {
    g.box(12, 14, 85, 12, 33, 85, C.brass)
    g.box(12, 10, 84, 12, 13, 86, X.gold)
  })

  // ---- Rug and a floor plant --------------------------------------------------
  for (let x = 30; x <= 74; x++)
    for (let z = 34; z <= 78; z++) {
      const ex = Math.min(x - 30, 74 - x), ez = Math.min(z - 34, 78 - z)
      const e = Math.min(ex, ez)
      g.set(x, 1, z, e === 0 ? X.rugDark : e === 2 ? X.rugLight : (x + z) % 8 === 0 && e > 4 ? X.rugLight : X.rug, { jitter: 0.005 })
    }
  spikyPlant(g, r, 80, 1, 82, 1.3)

  // ---- Build -------------------------------------------------------------------
  const built = g.build()
  const group = built.group
  const windowLight = new WindowLight(windows, 1 / RES)
  group.add(windowLight.group)
  const lampLight = new THREE.PointLight('#ffcf8a', 7, 10, 1.6)
  lampLight.position.copy(v3(8, 27, 32))
  group.add(lampLight)

  const doorLeaf = mountDoor(group, built.meshes, door.tag, door.hinge)
  const globe = mountDoor(group, built.meshes, 'globe', v3(9, 27.5, 46.5))
  const pendulum = mountDoor(group, built.meshes, 'pendulum', v3(12.5, 34, 85.5))
  const words = speech()
  let spin = 0.3
  let chime = 0

  return {
    id: 'experience',
    label: 'Experience',
    group,
    view: { target: v3(48, 30, 48), azimuth: Math.PI / 4, polar: 0.96, zoom: 1 },
    hotspots: [
      {
        id: 'timeline',
        label: 'Career timeline',
        mesh: taggedMesh(built.meshes, 'timeline'),
        marker: v3(4, 64, 48),
        view: { target: v3(6, 42, 48), azimuth: 1.25, polar: 1.08, zoom: 1.7 },
      },
      {
        id: 'awards',
        label: 'Awards',
        mesh: taggedMesh(built.meshes, 'trophies'),
        marker: v3(44, 52, 12),
        view: { target: v3(44, 26, 12), azimuth: 0.35, polar: 1.08, zoom: 1.9 },
      },
    ],
    doors: [{ to: 'garden', label: 'Garden', ...doorLeaf, openAngle: 1.35, marker: door.marker, view: door.view }],
    toys: [
      { meshes: globe.meshes, poke: () => (spin = 9) },
      {
        meshes: pendulum.meshes,
        poke: () => {
          chime = 1.5
          words.say('dong!', v3(8, 58, 85))
        },
      },
    ],
    bubbles: () => words.list(),
    setNight: (n) => windowLight.setNight(n),

    update(dt, t) {
      windowLight.update(dt, t)
      words.update(dt)
      spin += (0.3 - spin) * Math.min(1, dt * 0.8)
      globe.pivot.rotation.y += spin * dt
      chime = Math.max(0, chime - dt)
      pendulum.pivot.rotation.x = Math.sin(t * Math.PI) * (0.18 + chime * 0.12)
    },

    dispose() {
      built.dispose()
      windowLight.dispose()
    },
  }
}
