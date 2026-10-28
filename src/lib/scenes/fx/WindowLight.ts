import * as THREE from 'three'

/** A window in the z = 0 wall, in voxel coordinates (see `windowAt`). */
export interface WindowSpot {
  x0: number
  y0: number
}

/** Direction sunlight travels: from behind the window wall, down into the room. Shared with the sun light. */
export const SUN_DIR = new THREE.Vector3(-12, -40, 30).normalize()

const W = 22 // window outer width, voxels
const H = 33 // window outer height, voxels
const WALL = 3 // the wall's inner face (z), voxels
const DUST = 140

const GLASS_DAY = new THREE.Color('#ffffff')
const GLASS_NIGHT = new THREE.Color('#33416e')
const BEAM_DAY = new THREE.Color('#ffd9a0')
const BEAM_NIGHT = new THREE.Color('#8fa8ff')
const DUST_DAY = new THREE.Color('#fff1c9')
const DUST_NIGHT = new THREE.Color('#9fb4ff').multiplyScalar(0.5)

/** Panes between the mullions: 2 columns x 3 rows, as [u0, u1) x [v0, v1) offsets from the window corner. */
const PANES: [number, number, number, number][] = []
for (const [u0, u1] of [[1, 11], [12, W]])
  for (const [v0, v1] of [[1, 11], [12, 22], [23, H]]) PANES.push([u0, u1, v0, v1])

/** Blurry view through frosted glass: sky, a sun glare and soft trees, behind milky white. */
function frostTexture() {
  const w = 44, h = 66
  const sharp = document.createElement('canvas')
  sharp.width = w
  sharp.height = h
  const s = sharp.getContext('2d')!
  const sky = s.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#cfe6f5')
  sky.addColorStop(0.6, '#f4ead4')
  sky.addColorStop(1, '#e8dcc0')
  s.fillStyle = sky
  s.fillRect(0, 0, w, h)
  const glare = s.createRadialGradient(w * 0.75, h * 0.18, 0, w * 0.75, h * 0.18, w * 0.6)
  glare.addColorStop(0, 'rgba(255,248,225,1)')
  glare.addColorStop(1, 'rgba(255,248,225,0)')
  s.fillStyle = glare
  s.fillRect(0, 0, w, h)
  s.fillStyle = '#8fb07a'
  for (const [x, y, r] of [[4, 52, 12], [16, 58, 10], [34, 55, 13], [44, 50, 9]]) {
    s.beginPath()
    s.arc(x, y, r, 0, Math.PI * 2)
    s.fill()
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const c = canvas.getContext('2d')!
  c.filter = 'blur(4px)'
  c.drawImage(sharp, 0, 0)
  c.filter = 'none'
  // Milky frost on top, with a faint grain
  c.fillStyle = 'rgba(255, 252, 244, 0.5)'
  c.fillRect(0, 0, w, h)
  for (let i = 0; i < 260; i++) {
    c.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.12})`
    c.fillRect(Math.floor(Math.random() * w), Math.floor(Math.random() * h), 1, 1)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const beamVertex = /* glsl */ `
  attribute float along;
  varying float vAlong;
  varying vec3 vPos;
  void main() {
    vAlong = along;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const beamFragment = /* glsl */ `
  uniform vec3 color;
  uniform float strength;
  uniform float time;
  varying float vAlong;
  varying vec3 vPos;
  void main() {
    float fade = pow(1.0 - vAlong, 1.4) * smoothstep(0.0, 0.08, vAlong + 0.02);
    float shimmer = 0.85 + 0.15 * sin(time * 0.7 + vPos.x * 1.7 + vPos.z * 0.9);
    gl_FragColor = vec4(color * strength * fade * shimmer, 1.0);
  }
`

/**
 * Frosted panes for the windows in the z = 0 wall, and soft shafts of sunlight falling from each pane.
 * Shafts are additive hulls from the pane to its footprint on the floor.
 */
export class WindowLight {
  readonly group = new THREE.Group()
  private glass: THREE.MeshBasicMaterial
  private beams: THREE.ShaderMaterial
  private texture = frostTexture()
  private geometries: THREE.BufferGeometry[] = []
  private night = 0
  // Pane openings on the wall's inner face, world units: [x0, x1, y0, y1]
  private openings: [number, number, number, number][] = []
  private wallZ: number
  private dust: { pos: Float32Array; col: Float32Array; vel: Float32Array; life: Float32Array; geo: THREE.BufferGeometry; mat: THREE.PointsMaterial }

  constructor(windows: WindowSpot[], private voxel: number, private floorY = 1) {
    this.wallZ = WALL * voxel
    this.glass = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, opacity: 0.9, depthWrite: false })
    this.beams = new THREE.ShaderMaterial({
      vertexShader: beamVertex,
      fragmentShader: beamFragment,
      uniforms: { color: { value: new THREE.Color('#ffd9a0') }, strength: { value: 0.09 }, time: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    const toFloor = (p: THREE.Vector3) => p.clone().addScaledVector(SUN_DIR, (p.y - floorY * voxel) / -SUN_DIR.y)

    for (const { x0, y0 } of windows) {
      // One frosted plane behind the mullions, inside the wall
      const pane = new THREE.Mesh(new THREE.PlaneGeometry((W - 1) * voxel, (H - 1) * voxel), this.glass)
      pane.position.set((x0 + W / 2 + 0.5) * voxel, (y0 + H / 2 + 0.5) * voxel, 1.5 * voxel)
      pane.renderOrder = 2
      this.geometries.push(pane.geometry)
      this.group.add(pane)

      // A shaft per pane, so the mullions leave dark stripes in the light
      for (const [u0, u1, v0, v1] of PANES) {
        const z = WALL * voxel
        const top = [new THREE.Vector3((x0 + u0) * voxel, (y0 + v1) * voxel, z), new THREE.Vector3((x0 + u1) * voxel, (y0 + v1) * voxel, z)]
        const bottom = [new THREE.Vector3((x0 + u0) * voxel, (y0 + v0) * voxel, z), new THREE.Vector3((x0 + u1) * voxel, (y0 + v0) * voxel, z)]
        this.openings.push([(x0 + u0) * voxel, (x0 + u1) * voxel, (y0 + v0) * voxel, (y0 + v1) * voxel])
        const ring = [bottom[0], bottom[1], top[1], top[0]]
        const positions: number[] = []
        const along: number[] = []
        for (let i = 0; i < 4; i++) {
          const a = ring[i], b = ring[(i + 1) % 4]
          const a2 = toFloor(a), b2 = toFloor(b)
          for (const [p, k] of [[a, 0], [b, 0], [b2, 1], [a, 0], [b2, 1], [a2, 1]] as const) {
            positions.push(p.x, p.y, p.z)
            along.push(k)
          }
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geo.setAttribute('along', new THREE.Float32BufferAttribute(along, 1))
        this.geometries.push(geo)
        const beam = new THREE.Mesh(geo, this.beams)
        beam.renderOrder = 3
        this.group.add(beam)
      }
    }

    // Dust: drifts through the shafts and only glints while it's inside one
    const pos = new Float32Array(DUST * 3)
    const col = new Float32Array(DUST * 3)
    const vel = new Float32Array(DUST * 3)
    const life = new Float32Array(DUST)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const mat = new THREE.PointsMaterial({
      size: voxel * 0.45,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.dust = { pos, col, vel, life, geo, mat }
    for (let i = 0; i < DUST; i++) this.spawn(i, true)
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    this.group.add(points)
  }

  /** Put a mote somewhere inside a random shaft. */
  private spawn(i: number, randomAge = false) {
    const { pos, vel, life } = this.dust
    const [x0, x1, y0, y1] = this.openings[Math.floor(Math.random() * this.openings.length)]
    const p = new THREE.Vector3(x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0), this.wallZ)
    const reach = (p.y - this.floorY * this.voxel) / -SUN_DIR.y
    p.addScaledVector(SUN_DIR, Math.random() * reach * 0.9)
    pos.set([p.x, p.y, p.z], i * 3)
    vel.set([(Math.random() - 0.5) * 0.05, (Math.random() - 0.3) * 0.04, (Math.random() - 0.5) * 0.05], i * 3)
    life[i] = randomAge ? Math.random() * 8 : 8
  }

  /** How strongly the sun lights a point: 1 deep inside a shaft, fading to 0 at its edges. */
  private lit(x: number, y: number, z: number) {
    if (z < this.wallZ || y < this.floorY * this.voxel) return 0
    // Trace back toward the sun to the wall plane, then check which pane it came through
    const s = (z - this.wallZ) / SUN_DIR.z
    const wx = x - SUN_DIR.x * s, wy = y - SUN_DIR.y * s
    let best = 0
    for (const [x0, x1, y0, y1] of this.openings) {
      const edge = Math.min(wx - x0, x1 - wx, wy - y0, y1 - wy)
      if (edge > 0) best = Math.max(best, Math.min(1, edge / (this.voxel * 2)))
    }
    return best
  }

  update(dt: number, t: number) {
    this.beams.uniforms.time.value = t
    const { pos, col, vel, life, geo } = this.dust
    const warm = DUST_DAY.clone().lerp(DUST_NIGHT, this.night)
    for (let i = 0; i < DUST; i++) {
      life[i] -= dt
      if (life[i] <= 0) this.spawn(i)
      const k = i * 3
      pos[k] += (vel[k] + Math.sin(t * 0.5 + i) * 0.02) * dt
      pos[k + 1] += (vel[k + 1] + Math.cos(t * 0.4 + i * 1.7) * 0.015) * dt
      pos[k + 2] += vel[k + 2] * dt
      // Fade in and out over a mote's life, twinkle a little
      const fade = Math.min(1, life[i] / 1.5, (8 - life[i]) / 1.5)
      const b = this.lit(pos[k], pos[k + 1], pos[k + 2]) * fade * (0.6 + 0.4 * Math.sin(t * 3 + i * 2.3))
      col[k] = warm.r * b
      col[k + 1] = warm.g * b
      col[k + 2] = warm.b * b
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true
  }

  /** Day: milky white glass and warm shafts. Night: deep blue glass and faint moonlight. */
  setNight(n: number) {
    this.night = n
    this.glass.color.lerpColors(GLASS_DAY, GLASS_NIGHT, n)
    this.beams.uniforms.color.value.lerpColors(BEAM_DAY, BEAM_NIGHT, n)
    this.beams.uniforms.strength.value = THREE.MathUtils.lerp(0.09, 0.035, n)
  }

  dispose() {
    this.geometries.forEach((g) => g.dispose())
    this.glass.dispose()
    this.beams.dispose()
    this.texture.dispose()
    this.dust.geo.dispose()
    this.dust.mat.dispose()
  }
}
