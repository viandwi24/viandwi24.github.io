import * as THREE from 'three'
import { VoxelGrid, hash3 } from '../voxel/VoxelGrid'
import { rng, type Rng } from './common'

/**
 * The neighbourhood around the house, shown only from outside: a narrow Japanese street with
 * neighbours' houses, a ramen shop, a little shrine, poles and wires, and city blocks behind.
 * World units here (1 = 4 room voxels). The house occupies x 0..24, z 0..24 and faces +z.
 *
 * Two grids: a coarse one (1 voxel = 1 unit) for the ground and the far blocks, and a fine one
 * (2 voxels per unit) for everything near the street.
 */

const T = {
  asphalt: ['#56575f', '#5b5c64', '#515259', '#5f5f66'],
  patch: '#4a4b52',
  line: '#ece8de',
  sidewalk: ['#c2bdb2', '#bab5aa'],
  joint: '#a8a397',
  curb: '#9c978d',
  gravel: ['#a59b88', '#9d937f', '#aba18e'],
  grass: ['#7fa05a', '#76964f', '#86a862'],
  concrete: ['#8e8a84', '#86827c'],
  block: ['#bdb8ad', '#b2ada2'],
  buildings: ['#d6cfc2', '#c4bcae', '#e2dccf', '#a9adb2', '#cdb99f', '#b3bdc4', '#c9b8a3', '#9aa2ab', '#d9c7b0'],
  winOff: '#3b4656',
  winOn: ['#ffe2a4', '#fff0c8', '#ffd27a', '#e8f2ff'],
  signs: ['#e8394f', '#1fa6d6', '#f2b51f', '#ef6c2a', '#3cbf5a', '#9b4fd6'],
  roofTile: ['#2f333a', '#2b2f36', '#353941'],
  houseWall: ['#efebe2', '#e8d9bd', '#dfe3e6', '#f0e4d2'],
  wood: '#7a4a2a',
  woodDark: '#5a341c',
  frame: '#5a5f68',
  glass: '#9fb8c8',
  pole: '#9a958c',
  wire: '#262222',
  sakura: ['#ffc0d0', '#ffb0c4', '#ffd2dd', '#ffe3ea'],
  bark: '#5c3a22',
  leaves: ['#4f8a3a', '#5c9a43', '#437a31'],
  torii: '#d8452e',
  toriiDark: '#2a2222',
  stone: ['#b9b3a6', '#a9a395'],
  lantern: '#ff5a3a',
  noren: '#2c3e6b',
}

const GROUND = { x0: -84, x1: 120, z0: -84, z1: 96 }
const ROAD = { z0: 26, z1: 35 }
export const POLES = [-44, -16, 40, 62, 88]

// 5x5 pixel glyphs: 止まれ ("stop") painted on the road, and sign lettering
const GLYPHS: Record<string, string[]> = {
  止: ['00100', '00111', '10100', '10100', '11111'],
  ま: ['00100', '11111', '00100', '01111', '01101'],
  れ: ['10000', '11110', '10010', '10011', '10010'],
  ラ: ['01110', '00000', '11111', '00010', '00100'],
  ー: ['00000', '00000', '11111', '00000', '00000'],
  メ: ['00010', '10010', '01100', '00110', '01001'],
  ン: ['10000', '01001', '00010', '00100', '11000'],
}

// ---------------------------------------------------------------------------
// Coarse grid
// ---------------------------------------------------------------------------

function buildCity(g: VoxelGrid, r: Rng) {
  for (let x = GROUND.x0; x <= GROUND.x1; x++)
    for (let z = GROUND.z0; z <= GROUND.z1; z++) {
      if (x >= 0 && x < 24 && z >= 0 && z < 24) continue // the house's own slab
      const n = hash3(x, 0, z)
      let c: string
      if (z >= ROAD.z0 && z <= ROAD.z1) {
        const edge = z === ROAD.z0 + 1 || z === ROAD.z1 - 1
        const zebra = x >= 27 && x <= 32 && z > ROAD.z0 + 1 && z < ROAD.z1 - 1 && z % 2 === 0
        c = edge || zebra ? T.line : hash3(x >> 2, 1, z >> 1) > 0.9 ? T.patch : T.asphalt[Math.floor(n * 4)]
      } else if (z === 24 || z === ROAD.z1 + 1) c = T.sidewalk[(x >> 1) % 2]
      else if (z === 25 || z === ROAD.z1 + 2) c = T.curb
      else if (z < -6 || x < GROUND.x0 + 10) c = (x % 8 === 0 || z % 8 === 0) ? T.joint : T.concrete[Math.floor(n * 2)]
      else if (z >= -6 && z <= -3) c = T.asphalt[Math.floor(n * 4)] // back alley
      else if (x >= 26 && x <= 33 && z < 24) c = T.asphalt[Math.floor(n * 4)] // side street
      else if (z > ROAD.z1 + 2 && x < 18) c = T.grass[Math.floor(n * 3)] // park
      else if (z > ROAD.z1 + 2 && x >= 44 && x <= 68 && z >= 40 && z <= 56) c = (x - 44) % 6 === 0 && z <= 47 ? T.line : T.asphalt[Math.floor(n * 4)]
      else c = T.gravel[Math.floor(n * 3)]
      g.set(x, -1, z, c, { jitter: 0.012 })
    }

  for (let bx = -80; bx < 116; bx += 17)
    for (let bz = -80; bz <= -29; bz += 17) {
      if (r() < 0.1) continue
      const w = Math.floor(r.range(10, 15)), d = Math.floor(r.range(10, 15))
      const depth = (-bz - 29) / 51
      building(g, r, bx, bz, w, d, Math.floor(r.range(14, 26) + depth * r.range(15, 34)))
    }
  for (let bz = -8; bz <= 20; bz += 14) {
    building(g, r, -82, bz, 12, 12, Math.floor(r.range(16, 26)))
    if (bz < 12) building(g, r, 104, bz, 12, 12, Math.floor(r.range(16, 26)))
  }
}

/** Concrete block: recessed windows and balconies on the faces the camera sees, roof clutter, signs. */
function building(g: VoxelGrid, r: Rng, x0: number, z0: number, w: number, d: number, h: number) {
  const base = r.pick(T.buildings)
  const trim = new THREE.Color(base).offsetHSL(0, 0, -0.1).getStyle()
  const x1 = x0 + w - 1, z1 = z0 + d - 1
  const balconies = r() < 0.5
  g.box(x0, 0, z0, x1, h, z1, (_x, y) => (y === 0 ? '#6e6a64' : y === h ? trim : y % 3 === 1 ? trim : base))
  // Parapet
  g.box(x0, h + 1, z0, x1, h + 1, z1, (x, _y, z) => (x === x0 || x === x1 || z === z0 || z === z1 ? trim : null))

  // Two-voxel-tall windows with a little sill ledge under each one; lit or dark per window
  const pane = (x: number, y: number, z: number, onX: boolean) => {
    const on = hash3(x, y, z) > 0.45
    const c = on ? r.pick(T.winOn) : T.winOff
    for (const yy of [y, y + 1]) g.set(x, yy, z, c, { kind: 'glow', tag: on ? 'win-on' : 'win-off', jitter: 0 })
    if (!balconies || onX) g.set(onX ? x + 1 : x, y - 1, onX ? z : z + 1, trim, { height: 0.35 })
  }
  for (let y = 2; y < h - 2; y += 3) {
    for (let u = 1; u < d - 1; u += 2) pane(x1, y, z0 + u, true)
    for (let u = 1; u < w - 1; u += 2) pane(x0 + u, y, z1, false)
    // Balcony on the +z face: slab, solid rail, the odd AC unit
    if (balconies && y > 2) {
      g.box(x0 + 1, y - 1, z1 + 1, x1 - 1, y - 1, z1 + 1, '#d9d4ca')
      g.box(x0 + 1, y, z1 + 1, x1 - 1, y, z1 + 1, '#ece8df', { height: 0.6 })
      if (hash3(x0, y, z1) > 0.5) g.set(x0 + 2, y, z1 + 1, '#c3beb4', { height: 0.8 })
    }
  }

  // Rooftop: water tank on legs, AC units, sometimes a billboard
  if (r() < 0.6) {
    g.box(x0 + 2, h + 1, z0 + 2, x0 + 2, h + 2, z0 + 2, '#7d7a74')
    g.box(x0 + 2, h + 3, z0 + 2, x0 + 4, h + 4, z0 + 4, '#dcd8d0')
  }
  for (let k = 0; k < 3; k++) if (r() < 0.6) g.set(x1 - 2 - k * 2, h + 1, z1 - 2, '#c3beb4')
  if (r() < 0.3) {
    const c = r.pick(T.signs)
    g.box(x0 + 1, h + 2, z1, x1 - 1, h + 5, z1, (x, y) => (y === h + 2 || y === h + 5 ? '#3a3a40' : (x + y) % 3 === 0 ? '#ffffff' : c), {
      kind: 'glow', tag: 'sign', jitter: 0,
    })
    g.box(x0 + 2, h + 1, z1 - 1, x0 + 2, h + 4, z1 - 1, '#5a5a60')
    g.box(x1 - 2, h + 1, z1 - 1, x1 - 2, h + 4, z1 - 1, '#5a5a60')
  }
  // Vertical shop sign with blocky lettering on the street-facing corner
  if (r() < 0.5 && h > 14) {
    const c = r.pick(T.signs)
    const top = Math.min(h - 2, Math.floor(r.range(10, 18)))
    const onX = r() < 0.5
    for (let y = top - 9; y <= top; y++) {
      const stroke = y % 3 !== 0 && hash3(x0, y, z0) > 0.35
      const [x, z] = onX ? [x1 + 1, z1 - 1] : [x1 - 1, z1 + 1]
      g.set(x, y, z, stroke ? '#ffffff' : c, { kind: 'glow', tag: 'sign', jitter: 0 })
    }
  }
}

// ---------------------------------------------------------------------------
// Fine grid (coordinates are half units)
// ---------------------------------------------------------------------------

const U = (v: number) => Math.round(v * 2)

function buildStreet(g: VoxelGrid, r: Rng) {
  for (const lx of [-58, -30, 44]) japaneseHouse(g, r, U(lx), 0, r.pick(T.houseWall))
  ramenShop(g, U(72), 0)
  sakura(g, r, U(-5), U(-4))
  sakura(g, r, U(38), U(-3))
  sakura(g, r, U(-60), U(58))
  shrine(g, U(-34), U(42))

  // Utility poles: concrete, with crossarms, insulators and a transformer
  for (const px of POLES) {
    const x = U(px), z = U(24.5)
    g.box(x, 0, z, x, 30, z, T.pole)
    for (const y of [27, 24]) g.box(x - 3, y, z, x + 3, y, z, '#77736c')
    for (const dx of [-3, 0, 3]) g.set(x + dx, 28, z, '#e7e2d8')
    g.box(x + 1, 19, z - 1, x + 2, 22, z, '#6e6a64')
    g.box(x - 1, 8, z, x - 1, 10, z, '#f2d24a') // yellow guard tag
  }

  // Road paint: stop line and 止まれ in the side street, a couple of manholes
  g.box(U(26), 0, U(22), U(33.5), 0, U(22.5), T.line, { height: 0.15, jitter: 0 })
  ;['止', 'ま', 'れ'].forEach((ch, i) => paintGlyph(g, ch, U(28.5), U(11) + i * 7, 1))
  for (const [mx, mz] of [[-30, 30], [12, 31], [52, 30], [29, 10]])
    g.box(U(mx), 0, U(mz), U(mx) + 1, 0, U(mz) + 1, '#3e3f45', { height: 0.2, jitter: 0 })

  // Red post box, traffic mirror and bicycles by the house
  g.box(U(25), 0, U(24.2), U(25) + 2, 4, U(24.2) + 1, (_x, y) => (y === 4 ? '#b8302a' : y === 3 ? '#1d1a1a' : '#d8392f'))
  g.box(U(33.8), 0, U(24.6), U(33.8), 12, U(24.6), '#ef6c2a')
  g.box(U(33.8) - 1, 12, U(24.6) + 1, U(33.8) + 1, 14, U(24.6) + 1, '#ef6c2a')
  g.box(U(33.8), 13, U(24.6) + 2, U(33.8), 13, U(24.6) + 2, '#cfe4f2')
  bicycle(g, U(-2), U(24.4), '#3f7fbf')
  bicycle(g, U(41), U(24.4), '#e8e4da')
  bicycle(g, U(43.5), U(24.4), '#d8392f')

  // Vending machines beside the side street, lit day and night
  for (const [k, body] of [[0, '#c8443d'], [1, '#3f7fbf'], [2, '#f1efe8']] as const) {
    const x0 = U(34 + k * 2)
    g.box(x0, 0, U(23), x0 + 3, 7, U(23.5), body)
    g.box(x0 + 1, 3, U(23.5) + 1, x0 + 2, 6, U(23.5) + 1, '#eaf6ff', { kind: 'glow', tag: 'vend', jitter: 0 })
    g.box(x0 + 1, 1, U(23.5) + 1, x0 + 2, 1, U(23.5) + 1, '#1d1a1a')
  }

  // Street lamps across the road
  for (const lx of LAMPS) {
    const x = U(lx), z = U(ROAD.z1 + 1.5)
    g.box(x, 0, z, x, 20, z, T.pole)
    g.box(x, 20, z - 3, x, 20, z, T.pole)
    g.box(x, 19, z - 4, x, 19, z - 3, '#ffe9b0', { kind: 'glow', tag: 'lamp', jitter: 0 })
  }

  // Konbini: striped band, glowing glass front, a bench and bikes
  const k = { x0: U(72), x1: U(94), z0: U(41), z1: U(54), h: 16 }
  g.box(k.x0, 0, k.z0, k.x1, k.h, k.z1, (x, y, z) => {
    const face = x === k.x1 || z === k.z1
    if (y === k.h) return '#b9b4aa' // roof
    if (face && y >= k.h - 4) return y === k.h - 4 ? '#2f9e5a' : y === k.h - 3 ? '#ffffff' : '#3f7fbf' // the chain's stripes
    if (face && y >= 2 && y <= 10) return null
    return '#f1efe8'
  })
  g.box(k.x0 + 1, 2, k.z1, k.x1, 10, k.z1, (x) => (x % 6 === 0 ? '#c9c5bc' : '#e8f6ff'), { kind: 'glow', tag: 'shop', jitter: 0 })
  g.box(k.x1, 2, k.z0 + 1, k.x1, 10, k.z1, (_x, _y, z) => (z % 6 === 0 ? '#c9c5bc' : '#e8f6ff'), { kind: 'glow', tag: 'shop', jitter: 0 })
  g.box(k.x0 + 2, k.h + 1, k.z1 - 2, k.x0 + 5, k.h + 3, k.z1 - 1, '#c3beb4') // AC on the roof
  bicycle(g, U(68), U(55), '#2f9e5a')

  // Parked kei cars
  keiCar(g, U(48), U(42), '#e8e4da')
  keiCar(g, U(60), U(42), '#c8443d')

  // Park: hedge, benches, trees
  // Hedge with a gap at the shrine's torii
  for (let x = U(-76); x < U(18); x++)
    if (x % 18 !== 0 && (x < U(-36) || x > U(-26))) g.box(x, 0, U(38), x, 2, U(38.5), T.leaves[Math.floor(hash3(x, 1, 76) * 3)])
  for (const bx of [-15, 4]) {
    g.box(U(bx), 0, U(43), U(bx) + 8, 2, U(44), T.wood)
    g.box(U(bx), 3, U(44), U(bx) + 8, 5, U(44), T.wood)
  }
  for (const [tx, tz] of [[-75, 55], [-55, 75], [-10, 80], [10, 62]]) tree(g, U(tx), U(tz))
}

const LAMPS = [-20, 18, 58]

function paintGlyph(g: VoxelGrid, ch: string, x0: number, z0: number, scale: number) {
  // Read toward the main road: rows run along z
  GLYPHS[ch].forEach((row, i) => {
    for (let j = 0; j < row.length; j++)
      if (row[j] === '1') g.box(x0 + j * scale, 0, z0 + i * scale, x0 + j * scale + scale - 1, 0, z0 + i * scale + scale - 1, T.line, { height: 0.15, jitter: 0 })
  })
}

/** Two-storey house: grey tiled roof with ridge, block wall with a nameplate, potted plants, balcony laundry. */
function japaneseHouse(g: VoxelGrid, r: Rng, ox: number, oz: number, wall: string) {
  const w = 40, d = 34, h = 24
  const x0 = ox + 4, z0 = oz + 4, x1 = x0 + w - 1, z1 = z0 + d - 1
  g.box(x0, 0, z0, x1, h, z1, (x, y, z) => {
    if (y <= 1) return '#8e8a84'
    const front = z === z1, side = x === x1
    if (front && y >= 2 && y <= 15 && x >= x0 + 4 && x <= x0 + 10) return y === 15 || x === x0 + 4 || x === x0 + 10 ? T.woodDark : x === x0 + 7 ? T.woodDark : '#a07850' // genkan door
    if ((front || side) && ((y >= 6 && y <= 11) || (y >= 16 && y <= 21))) {
      const u = front ? x - x0 : z - z0
      const m = u % 10
      if (u > 12 && m >= 2 && m <= 7) return m === 2 || m === 7 || y === 6 || y === 16 || y === 11 || y === 21 ? T.frame : T.glass
    }
    if (y === 13) return '#c9c2b6'
    return wall
  })
  // Little awning over the entrance
  g.box(x0 + 3, 16, z1 + 1, x0 + 11, 16, z1 + 3, T.roofTile[0])
  // Gabled tiled roof along x with tile rows and a ridge
  for (let i = 0; i <= 12; i++) {
    g.box(x0 - 2, h + 1 + i, z0 - 2 + i, x1 + 2, h + 1 + i, z1 + 2 - i, (x, _y, z) => {
      const edge = z === z0 - 2 + i || z === z1 + 2 - i
      if (!(edge || x === x0 - 2 || x === x1 + 2 || i === 12)) return null
      if (i === 12) return '#30343c'
      return x % 2 === 0 && edge ? T.roofTile[1] : T.roofTile[(i + (x >> 2)) % 3]
    })
  }
  for (const x of [x0 - 3, x1 + 3]) g.box(x, h + 12, z0 + 10, x, h + 14, z1 - 10, '#30343c') // onigawara ends
  // Balcony with laundry
  g.box(x0 + 22, 14, z1 + 1, x1 - 3, 14, z1 + 4, '#c9c2b6')
  g.box(x0 + 22, 15, z1 + 4, x1 - 3, 17, z1 + 4, (x) => (x % 2 ? '#d8d4cc' : '#b9b4aa'))
  g.box(x0 + 22, 22, z1 + 3, x1 - 3, 22, z1 + 3, T.pole)
  for (let k = 0; k < 4; k++) if (r() < 0.75) g.box(x0 + 24 + k * 3, 18, z1 + 3, x0 + 25 + k * 3, 21, z1 + 3, r.pick(['#ffffff', '#9fc3e8', '#ffb0b0', '#f5e08a']))
  g.box(x1 + 1, 2, z0 + 8, x1 + 2, 4, z0 + 12, '#e7e2d8') // AC unit
  // Block wall, gate, nameplate, plants
  for (let x = ox; x < ox + 48; x++) {
    if (x >= x0 + 3 && x <= x0 + 11) continue
    g.box(x, 0, oz + 46, x, 3, oz + 47, (_x, y) => (y === 3 ? '#9c978d' : T.block[(x >> 2) % 2]))
  }
  g.box(x0 + 12, 2, oz + 48, x0 + 13, 2, oz + 48, '#e8dcc0')
  for (let k = 0; k < 3; k++) {
    const px = x0 + 14 + k * 3
    g.box(px, 4, oz + 46, px + 1, 5, oz + 47, '#b9603a')
    g.box(px, 6, oz + 46, px + 1, 7, oz + 47, T.leaves[k % 3])
  }
}

/** Ramen shop: shop front with noren and red lanterns, a ラーメン sign, a flat on top. */
function ramenShop(g: VoxelGrid, ox: number, oz: number) {
  const x0 = ox + 4, z0 = oz + 4, x1 = x0 + 38, z1 = z0 + 33, h = 24
  g.box(x0, 0, z0, x1, h, z1, (x, y, z) => {
    if (y <= 1) return '#6e6a64'
    const front = z === z1
    if (front && y >= 2 && y <= 11) {
      if (x >= x0 + 6 && x <= x0 + 24) return x % 4 === 0 ? T.woodDark : '#c9a46a' // wooden sliding doors
      return T.wood
    }
    if (y === 12 || y === 13) return T.woodDark
    if ((front || x === x1) && y >= 16 && y <= 21) {
      const u = front ? x - x0 : z - z0
      if (u % 10 >= 2 && u % 10 <= 7) return u % 10 === 2 || u % 10 === 7 || y === 16 || y === 21 ? T.frame : T.glass
    }
    return '#e2d6c0'
  })
  // Noren: indigo cloth strips over the door with a white mark
  for (let x = x0 + 8; x <= x0 + 22; x++)
    if ((x - x0) % 4 !== 3) g.box(x, 8, z1 + 1, x, 11, z1 + 1, (_x, y) => (y === 10 && (x - x0) % 4 === 1 ? '#ffffff' : T.noren))
  // Eave
  for (let k = 0; k < 3; k++) g.box(x0 - 1, 12 + k, z1 + 3 - k, x1 + 1, 12 + k, z1 + 3 - k, T.roofTile[k])
  // Red lanterns (chochin)
  for (const lx of [x0 + 3, x0 + 27]) {
    g.box(lx, 13, z1 + 2, lx + 2, 13, z1 + 2, '#1d1a1a')
    g.box(lx, 9, z1 + 2, lx + 2, 12, z1 + 3, (_x, y) => (y === 9 || y === 12 ? '#1d1a1a' : T.lantern), { kind: 'glow', tag: 'lantern', jitter: 0 })
  }
  // Vertical sign: ラーメン
  g.box(x1 + 1, 4, z1 - 3, x1 + 1, 25, z1, '#f2b51f', { kind: 'glow', tag: 'sign', jitter: 0 })
  ;['ラ', 'ー', 'メ', 'ン'].forEach((ch, i) => {
    GLYPHS[ch].forEach((row, ri) => {
      for (let j = 1; j < 4; j++) if (row[j] === '1') g.set(x1 + 2, 24 - i * 5 - ri, z1 - 3 + (j - 1), '#c8302a', { kind: 'glow', tag: 'sign', jitter: 0 })
    })
  })
  // Flat roof with a railing and an extractor fan (the steam comes out of it)
  g.box(x0, h + 1, z0, x1, h + 2, z1, (x, y, z) => (y === h + 2 && !(x === x0 || x === x1 || z === z0 || z === z1) ? null : '#cfc7b6'))
  g.box(x0 + 30, h + 1, z0 + 6, x0 + 33, h + 4, z0 + 9, '#8f8b84')
}

/** Small shrine in the park: red torii, stone path and lanterns, a little hokora. */
function shrine(g: VoxelGrid, x: number, z: number) {
  // Torii, facing the road
  for (const dx of [0, 10]) g.box(x + dx, 0, z, x + dx + 1, 14, z + 1, T.torii)
  g.box(x - 2, 15, z, x + 13, 16, z + 1, T.toriiDark)
  g.box(x - 3, 17, z - 1, x + 14, 17, z + 2, T.toriiDark)
  g.box(x - 1, 12, z, x + 12, 12, z + 1, T.torii)
  g.box(x + 5, 12, z, x + 6, 15, z + 1, T.torii)
  // Stone path away from the road to the hokora, flanked by stone lanterns
  for (let k = 0; k < 6; k++) g.box(x + 3, 0, z + 3 + k * 4, x + 8, 0, z + 5 + k * 4, T.stone[k % 2], { height: 0.4 })
  for (const dx of [-3, 13]) {
    g.box(x + dx, 0, z + 9, x + dx + 1, 4, z + 10, T.stone[0])
    g.box(x + dx - 1, 5, z + 8, x + dx + 2, 6, z + 11, T.stone[1])
    g.set(x + dx, 5, z + 11, '#ffd27a', { kind: 'glow', tag: 'lantern', jitter: 0 })
    g.box(x + dx - 1, 7, z + 8, x + dx + 2, 7, z + 11, T.stone[0])
  }
  const hz = z + 26
  g.box(x + 1, 0, hz, x + 10, 2, hz + 7, T.stone[1])
  g.box(x + 2, 3, hz + 1, x + 9, 9, hz + 6, T.wood)
  g.box(x + 4, 4, hz, x + 7, 7, hz, '#2a1810') // its door faces the torii
  for (let i = 0; i < 4; i++) g.box(x + 1 - i, 10 + i, hz - 1 + i, x + 10 + i, 10 + i, hz + 8 - i, T.toriiDark)
  g.box(x + 3, 12, hz - 1, x + 8, 12, hz - 1, '#f4f0e6') // shimenawa paper
}

function sakura(g: VoxelGrid, r: Rng, x: number, z: number) {
  g.box(x, 0, z, x + 1, 14, z + 1, T.bark)
  g.box(x - 2, 10, z, x - 1, 12, z, T.bark)
  for (let i = 0; i < 7; i++) {
    const cx = x + r.range(-7, 7), cy = r.range(14, 23), cz = z + r.range(-7, 7), rad = r.range(3, 5.5)
    for (let a = Math.floor(cx - rad); a <= cx + rad; a++)
      for (let b = Math.floor(cy - rad); b <= cy + rad; b++)
        for (let c = Math.floor(cz - rad); c <= cz + rad; c++)
          if ((a - cx) ** 2 + (b - cy) ** 2 + (c - cz) ** 2 <= rad * rad && r() > 0.2) g.set(a, b, c, r.pick(T.sakura))
  }
}

function tree(g: VoxelGrid, x: number, z: number) {
  g.box(x, 0, z, x + 1, 8, z + 1, T.bark)
  for (let a = -5; a <= 5; a++)
    for (let b = 0; b <= 8; b++)
      for (let c = -5; c <= 5; c++)
        if (a * a + (b - 4) ** 2 * 1.4 + c * c <= 26 && hash3(x + a, b, z + c) > 0.15) g.set(x + a, 8 + b, z + c, T.leaves[Math.floor(hash3(a, b, c) * 3)])
}

function bicycle(g: VoxelGrid, x: number, z: number, color: string) {
  for (const dx of [0, 5]) {
    g.box(x + dx, 1, z, x + dx + 2, 1, z, '#1d1a1a')
    g.box(x + dx, 3, z, x + dx + 2, 3, z, '#1d1a1a')
    g.box(x + dx, 2, z, x + dx, 2, z, '#1d1a1a')
    g.box(x + dx + 2, 2, z, x + dx + 2, 2, z, '#1d1a1a')
  }
  g.box(x + 1, 4, z, x + 6, 4, z, color)
  g.box(x + 6, 5, z, x + 7, 5, z, '#8f8b84') // basket
  g.set(x + 2, 5, z, '#1d1a1a') // saddle
}

function keiCar(g: VoxelGrid, x: number, z: number, body: string) {
  g.box(x, 1, z, x + 8, 3, z + 13, body)
  g.box(x + 1, 4, z + 3, x + 7, 6, z + 10, (_x, y) => (y === 6 ? body : '#3b4656'))
  for (const [wx, wz] of [[x, z + 2], [x + 8, z + 2], [x, z + 10], [x + 8, z + 10]]) g.box(wx, 0, wz, wx, 1, wz + 1, '#1d1a1a')
}

// ---------------------------------------------------------------------------
// Runtime bits: wires, light pools, petals, steam, a car driving by
// ---------------------------------------------------------------------------

function wires() {
  const pts: number[] = []
  for (let i = 0; i + 1 < POLES.length; i++)
    for (const [dx, y] of [[-1.5, 14], [0, 14], [1.5, 14], [0, 12.2]] as const) {
      const a = new THREE.Vector3(POLES[i] + dx, y, 24.5)
      const b = new THREE.Vector3(POLES[i + 1] + dx, y, 24.5)
      const SEG = 18
      for (let s = 0; s < SEG; s++)
        for (const k of [s / SEG, (s + 1) / SEG]) {
          const p = a.clone().lerp(b, k)
          p.y -= Math.sin(k * Math.PI) * 1.8
          pts.push(p.x, p.y, p.z)
        }
    }
  // A drop wire from the nearest pole to the house
  for (let s = 0; s < 12; s++)
    for (const k of [s / 12, (s + 1) / 12]) {
      const p = new THREE.Vector3(40, 12.2, 24.5).lerp(new THREE.Vector3(23.6, 11, 20), k)
      p.y -= Math.sin(k * Math.PI) * 0.8
      pts.push(p.x, p.y, p.z)
    }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: T.wire }))
}

/** Soft round glow texture for light pools on the ground. */
function poolTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.45)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

const WIN_DAY = new THREE.Color('#6f8399')
const WIN_NIGHT = new THREE.Color('#ffffff')
const PETALS = 140
const STEAM = 18

export function createTown() {
  const r = rng(808)
  const group = new THREE.Group()

  const city = new VoxelGrid(1)
  buildCity(city, r)
  const cityBuilt = city.build()
  const street = new VoxelGrid(0.5)
  buildStreet(street, r)
  const streetBuilt = street.build()
  const lines = wires()
  group.add(cityBuilt.group, streetBuilt.group, lines)
  // Solid voxels cast shadows onto the street; glowing windows and signs don't
  for (const [key, m] of [...cityBuilt.meshes, ...streetBuilt.meshes]) m.castShadow = key.startsWith('solid:')

  const glow = (b: typeof cityBuilt, tag: string) => b.meshes.get(`glow:${tag}`)?.material as THREE.MeshBasicMaterial | undefined
  const winOn = glow(cityBuilt, 'win-on')
  const winOff = glow(cityBuilt, 'win-off')
  const signs = [glow(cityBuilt, 'sign'), glow(streetBuilt, 'sign')]
  const lamps = glow(streetBuilt, 'lamp')
  const lanterns = glow(streetBuilt, 'lantern')

  // ---- Light pools on the ground (night) --------------------------------
  const poolTex = poolTexture()
  const pools: { mesh: THREE.Mesh; base: number }[] = []
  const pool = (x: number, z: number, size: number, color: string, base = 1) => {
    const mat = new THREE.MeshBasicMaterial({ map: poolTex, color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat)
    m.rotation.x = -Math.PI / 2
    m.position.set(x, 0.05, z)
    m.renderOrder = 4
    group.add(m)
    pools.push({ mesh: m, base })
  }
  for (const lx of LAMPS) pool(lx, ROAD.z1 - 1, 10, '#ffd79a')
  pool(36, 25.5, 6, '#cfe8ff', 0.8) // vending machines
  pool(83, 56, 16, '#d8f0ff', 0.9) // konbini front
  pool(81.5, 21, 14, '#ff8a5a', 0.9) // ramen lanterns
  pool(-31.5, 47, 10, '#ffd27a', 0.6) // shrine lanterns

  // ---- Sakura petals drifting across the street --------------------------
  const petalGeo = new THREE.PlaneGeometry(0.22, 0.16)
  const petalMat = new THREE.MeshStandardMaterial({ color: '#ffc3d2', side: THREE.DoubleSide, roughness: 0.8 })
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, PETALS)
  petals.frustumCulled = false
  group.add(petals)
  const trees = [[-5, 0, -4], [38, 0, -3], [-60, 0, 58]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  const petalState = Array.from({ length: PETALS }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), spin: 0, age: 0, life: 1 }))
  const spawnPetal = (s: (typeof petalState)[number], scatter = false) => {
    const t = trees[Math.floor(Math.random() * trees.length)]
    s.p.set(t.x + (Math.random() - 0.5) * 8, 8 + Math.random() * 4, t.z + (Math.random() - 0.5) * 8)
    s.v.set(1.2 + Math.random() * 1.2, -0.5 - Math.random() * 0.4, 0.6 + Math.random() * 0.8)
    s.spin = Math.random() * 6
    s.life = 10 + Math.random() * 8
    s.age = scatter ? Math.random() * s.life : 0
    if (scatter) s.p.addScaledVector(s.v, s.age * 0.6)
  }
  petalState.forEach((s) => spawnPetal(s, true))

  // ---- Steam from the ramen shop ----------------------------------------
  const steamGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6)
  const steamMat = new THREE.MeshStandardMaterial({ color: '#f4f2ee', transparent: true, opacity: 0.55, depthWrite: false })
  const steam = new THREE.InstancedMesh(steamGeo, steamMat, STEAM)
  steam.frustumCulled = false
  group.add(steam)
  const vent = new THREE.Vector3(89.8, 14.2, 5.8) // the ramen shop's extractor fan
  const steamState = Array.from({ length: STEAM }, (_, i) => ({ age: (i / STEAM) * 3, drift: Math.random() }))

  // ---- A kei car driving along the road ------------------------------------
  const car = new VoxelGrid(0.5)
  keiCar(car, 0, 0, '#f2b51f')
  for (const hx of [1, 6]) car.box(hx, 2, 14, hx + 1, 2, 14, '#fff6d0', { kind: 'glow', jitter: 0 }) // headlights
  const carBuilt = car.build()
  const carGroup = new THREE.Group()
  // Model is built along z; turn it to drive along +x
  carBuilt.group.rotation.y = Math.PI / 2
  carBuilt.group.position.set(-3.25, 0, 2)
  carGroup.add(carBuilt.group)
  for (const m of carBuilt.meshes.values()) m.castShadow = true
  const headPool = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.5), new THREE.MeshBasicMaterial({
    map: poolTex, color: '#fff2c8', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
  }))
  headPool.rotation.x = -Math.PI / 2
  headPool.position.set(4.5, 0.06, 0)
  carGroup.add(headPool)
  group.add(carGroup)
  let carX = -90

  const dummy = new THREE.Object3D()
  let night = 0

  return {
    group,

    /** Day: windows read as dark glass. Night: windows, signs, lamps and their pools light up. */
    setNight(n: number) {
      night = n
      winOn?.color.lerpColors(WIN_DAY, WIN_NIGHT, n)
      winOff?.color.copy(WIN_DAY).multiplyScalar(1 - n * 0.5)
      lamps?.color.setScalar(0.4 + 0.6 * n)
      lanterns?.color.setScalar(0.7 + 0.3 * n)
      for (const { mesh, base } of pools) (mesh.material as THREE.MeshBasicMaterial).opacity = n * 0.55 * base
      ;(headPool.material as THREE.MeshBasicMaterial).opacity = n * 0.6
    },

    update(dt: number, t: number) {
      for (const s of signs) s?.color.setScalar((0.7 + 0.3 * night) * (1 - 0.05 * night * (Math.sin(t * 9) * 0.5 + 0.5)))

      petalState.forEach((s, i) => {
        s.age += dt
        if (s.age > s.life || s.p.y < 0.05) {
          if (s.p.y < 0.05 && s.age < s.life) s.p.y = 0.05 // rest on the ground for a while
          else spawnPetal(s)
        }
        if (s.p.y > 0.05) {
          s.p.x += (s.v.x + Math.sin(t * 0.7 + i) * 0.6) * dt
          s.p.y += (s.v.y + Math.sin(t * 2 + i * 1.3) * 0.25) * dt
          s.p.z += (s.v.z + Math.cos(t * 0.6 + i) * 0.4) * dt
        }
        dummy.position.copy(s.p)
        dummy.rotation.set(s.spin + t * 2 * (s.p.y > 0.05 ? 1 : 0), s.spin * 1.7, Math.sin(t + i) * (s.p.y > 0.05 ? 1 : 0))
        dummy.scale.setScalar(Math.min(1, (s.life - s.age) / 2))
        dummy.updateMatrix()
        petals.setMatrixAt(i, dummy.matrix)
      })
      petals.instanceMatrix.needsUpdate = true

      steamState.forEach((s, i) => {
        s.age = (s.age + dt) % 3
        const k = s.age / 3
        dummy.position.set(vent.x + Math.sin(k * 5 + s.drift * 6) * 0.4 + k * 1.2, vent.y + k * 5, vent.z + k * 0.8)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(Math.sin(k * Math.PI) * (0.6 + k))
        dummy.updateMatrix()
        steam.setMatrixAt(i, dummy.matrix)
      })
      steam.instanceMatrix.needsUpdate = true

      carX += dt * 9
      if (carX > 125) carX = -90
      carGroup.position.set(carX, 0, 31.5)
    },

    dispose() {
      cityBuilt.dispose()
      streetBuilt.dispose()
      carBuilt.dispose()
      lines.geometry.dispose()
      ;(lines.material as THREE.Material).dispose()
      poolTex.dispose()
      for (const { mesh } of pools) {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      }
      headPool.geometry.dispose()
      ;(headPool.material as THREE.Material).dispose()
      petalGeo.dispose()
      petalMat.dispose()
      steamGeo.dispose()
      steamMat.dispose()
    },
  }
}

export type Town = ReturnType<typeof createTown>
