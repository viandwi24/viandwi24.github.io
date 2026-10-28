import * as THREE from 'three'
import type { House } from '../scenes/house'
import type { Town } from '../scenes/town'
import type { Door, Hotspot, RoomScene, Toy, ToySound, ViewDef } from '../scenes/types'
import { SUN_DIR } from '../scenes/fx/WindowLight'

/** Where the visitor is: outside the house (room null), inside a room, or looking at one item. */
export interface Route {
  room: string | null
  item: string | null
}

export interface Marker {
  id: string
  kind: 'knock' | 'hotspot' | 'door' | 'sign' | 'eject' | 'toy' | 'fx'
  route: Route | null
  label: string
  short?: string
  x: number
  y: number
  visible: boolean
  hovered: boolean
  active: boolean
  /** Toy markers act in place instead of navigating. */
  action?: () => void
  icon?: 'play' | 'pause'
  /** Hang the label under the point instead of above it. */
  below?: boolean
}

/** Circular "iris" wipe used when walking through a door; null when fully open. */
export interface Iris {
  x: number
  y: number
  radius: number
}

export interface WorldEvents {
  onSelect(route: Route): void
  onMarkers(markers: Marker[]): void
  onIris(iris: Iris | null): void
  /** `indoor`: 0 outside in daylight, 1 inside, dim and cozy. `night`: 0 day, 1 night. */
  onAmbient(indoor: number, night: number): void
  /** One-shot sounds. */
  onCue?(cue: Cue): void
}

export type Cue = 'knock' | 'door' | 'poke' | ToySound

interface CamState {
  target: THREE.Vector3
  azimuth: number
  polar: number
  zoom: number
  /** Screen-space shift (fractions of the view) that keeps the focused item clear of the panel. */
  shiftX: number
  shiftY: number
}

const CAMERA_DISTANCE = 90

const AMBIENT = {
  sky: new THREE.Color('#fff3e2'),
  nightSky: new THREE.Color('#7f95c8'),
  ground: new THREE.Color('#7a5238'),
  groundIn: new THREE.Color('#3a2014'),
  nightGround: new THREE.Color('#251d33'),
  sun: new THREE.Color('#ffe2b5'),
  key: new THREE.Color('#fff0dc'),
  moon: new THREE.Color('#a9bcff'),
  hazeDay: new THREE.Color('#e0a560'),
  hazeNight: new THREE.Color('#1d2546'),
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000))

export class World {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400)
  private timer = new THREE.Timer()
  private ro: ResizeObserver
  private raycaster = new THREE.Raycaster()

  private frustum = { w: 1, h: 1, portrait: false }
  private cur: CamState
  private flight: { from: CamState; to: CamState; t: number; dur: number; resolve: () => void } | null = null

  // Visitor input
  private dragAz = 0
  private dragPolar = 0
  private userZoom = 1
  private parallax = new THREE.Vector2()
  private pointer = new THREE.Vector2(9, 9)
  private pointerDirty = false
  private down: { x: number; y: number; dragging: boolean } | null = null

  private route: Route = { room: null, item: null }
  /** The room currently built inside the house (it stays there while the house is closed). */
  private inside: RoomScene
  /** A house transition is playing: clicks and markers are paused. */
  private busy = false
  private seq = 0
  private hovered: { house?: boolean; hotspot?: Hotspot; door?: Door; eject?: boolean; exit?: boolean; toy?: Toy } = {}
  private iris: { anchor: THREE.Vector3; k: number } | null = null
  private irisToken = 0
  private lights!: { hemi: THREE.HemisphereLight; sun: THREE.DirectionalLight; key: THREE.DirectionalLight; lamps: THREE.PointLight }
  private indoor = -1
  private night = -1
  private nightGoal = 0
  private tweens: { t: number; dur: number; delay: number; step: (k: number) => void; resolve: () => void }[] = []

  constructor(
    private container: HTMLElement,
    private rooms: RoomScene[],
    private house: House,
    private events: WorldEvents,
    private town?: Town,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    this.renderer.localClippingEnabled = true
    container.appendChild(this.renderer.domElement)

    for (const room of rooms) this.scene.add(room.group)
    this.scene.add(house.group)
    if (town) this.scene.add(town.group)
    // Distance haze so the far city melts into the sky. Always on (toggling fog recompiles shaders);
    // only the town is far enough away to be touched by it.
    this.scene.fog = new THREE.Fog(AMBIENT.hazeDay, 105, 180)
    this.inside = rooms[0]
    this.showInside(this.inside)
    this.setupLights()

    this.cur = this.stateFor(this.route)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(container)
    this.resize()

    const el = this.renderer.domElement
    el.addEventListener('pointerdown', this.onPointerDown)
    el.addEventListener('pointermove', this.onPointerMove)
    el.addEventListener('pointerleave', this.onPointerLeave)
    window.addEventListener('pointerup', this.onPointerUp)
    el.addEventListener('wheel', this.onWheel, { passive: false })

    this.renderer.setAnimationLoop(this.frame)
  }

  // ---- Public API --------------------------------------------------------

  /** Jump straight to a route on first load. Outside, the house builds itself up. */
  start(route: Route) {
    this.route = { ...route }
    const room = this.findRoom(route.room)
    if (room) {
      this.showInside(room)
      this.house.setOpen(true)
      if (route.item) room.focus?.(route.item)
    } else {
      void this.house.assemble()
    }
    this.cur = this.stateFor(route)
  }

  /** Switch between day (false) and night (true); the light eases over. */
  setNight(on: boolean) {
    this.nightGoal = on ? 1 : 0
  }

  /** A key press for the open item (e.g. Space to flap). Returns true when the room used it. */
  press() {
    return !!this.route.item && !this.busy && !!this.findRoom(this.route.room)?.press?.(null)
  }

  /** Animate to a route, playing whatever house transition it needs. */
  go(route: Route) {
    const prev = this.route
    this.route = { ...route }
    void this.transition(++this.seq, prev, route)
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.ro.disconnect()
    const el = this.renderer.domElement
    el.removeEventListener('pointerdown', this.onPointerDown)
    el.removeEventListener('pointermove', this.onPointerMove)
    el.removeEventListener('pointerleave', this.onPointerLeave)
    window.removeEventListener('pointerup', this.onPointerUp)
    el.removeEventListener('wheel', this.onWheel)
    for (const room of this.rooms) room.dispose()
    this.house.dispose()
    this.town?.dispose()
    this.renderer.dispose()
    el.remove()
  }

  // ---- Transitions -------------------------------------------------------

  private async transition(id: number, prev: Route, next: Route) {
    const alive = () => id === this.seq
    if (this.iris && this.iris.k < 1) void this.irisTo(this.iris.anchor, 1, 0.3)
    const from = this.findRoom(prev.room)
    const to = this.findRoom(next.room)
    if (from && (from !== to || prev.item !== next.item)) from.focus?.(null)

    // Same room (or staying outside): only the camera moves
    if (from === to) {
      this.busy = false
      if (to && next.item) to.focus?.(next.item)
      await this.fly(this.stateFor(next), 0.85)
      return
    }

    this.busy = true

    // Room to room through a connecting door
    const door = from && to ? from.doors.find((d) => d.to === to.id) : undefined
    if (from && to && door) {
      await this.walkThrough(alive, from, door, to, next)
      return
    }

    // Leaving a room: close the house around it while backing out
    if (from) {
      await Promise.all([this.house.close(), this.fly(this.stateFor({ room: null, item: null }), 1)])
      if (!alive()) return
    }

    if (!to) {
      this.busy = false
      return
    }

    // Entering: knock first if we came from outside, then swap the room in while the house is shut
    this.showInside(to)
    if (!from) {
      this.events.onCue?.('knock')
      await this.house.knock()
      if (!alive()) return
      this.events.onCue?.('door')
      await this.house.swingDoor()
      if (!alive()) return
    } else {
      await wait(0.1)
      if (!alive()) return
    }
    if (next.item) to.focus?.(next.item)
    await Promise.all([this.house.open(), this.fly(this.stateFor(next), 1.3)])
    if (alive()) this.busy = false
  }

  /** Walk up to the door, open it, iris out, and arrive through the matching door of the next room. */
  private async walkThrough(alive: () => boolean, from: RoomScene, door: Door, to: RoomScene, next: Route) {
    const arrival = to.doors.find((d) => d.to === from.id)
    // One motion: the camera closes in on the door while it swings open and the iris shuts on it
    this.events.onCue?.('door')
    await Promise.all([
      this.fly(this.viewState(from, door.view), 0.7),
      this.tween(door.openAngle, 0.35, (v) => (door.pivot.rotation.y = v), door.pivot.rotation.y, 0.1),
      this.irisTo(from.group.localToWorld(door.view.target.clone()), 0, 0.65),
    ])
    if (!alive()) return

    this.showInside(to)
    door.pivot.rotation.y = 0
    if (next.item) to.focus?.(next.item)
    if (arrival) {
      arrival.pivot.rotation.y = arrival.openAngle
      this.flight?.resolve()
      this.flight = null
      this.cur = this.viewState(to, arrival.view)
      this.iris = { anchor: to.group.localToWorld(arrival.view.target.clone()), k: 0 }
    }
    await Promise.all([
      this.irisTo(this.iris?.anchor ?? new THREE.Vector3(), 1, 0.4),
      arrival ? this.tween(0, 0.45, (v) => (arrival.pivot.rotation.y = v), arrival.openAngle, 0.35) : null,
      this.fly(this.stateFor(next), 1.1),
    ])
    if (alive()) this.busy = false
  }

  private irisTo(anchor: THREE.Vector3, k: number, dur: number) {
    // Only the latest iris animation may drive it, so an interrupted walk can't leave the screen dark
    const token = ++this.irisToken
    const from = this.iris?.k ?? 1
    this.iris = { anchor, k: from }
    return this.tween(k, dur, (v) => {
      if (this.iris && token === this.irisToken) this.iris.k = v
    }, from).then(() => {
      if (k >= 1 && token === this.irisToken) this.iris = null
    })
  }

  /** Animate a number from `from` to `to`, feeding each value to `step`. */
  private tween(to: number, dur: number, step: (v: number) => void, from: number, delay = 0) {
    return new Promise<void>((resolve) => {
      this.tweens.push({ t: 0, dur, delay, step: (k) => step(from + (to - from) * k), resolve })
    })
  }

  private showInside(room: RoomScene) {
    this.inside = room
    for (const r of this.rooms) r.group.visible = r === room
  }

  private fly(to: CamState, dur: number) {
    this.flight?.resolve()
    return new Promise<void>((resolve) => {
      this.flight = { from: this.cloneState(this.cur), to, t: 0, dur, resolve }
    })
  }

  // ---- Setup -------------------------------------------------------------

  private setupLights() {
    const center = new THREE.Vector3(12, 5, 12)
    const hemi = new THREE.HemisphereLight('#fff3e2', '#7a5238', 1.6)
    this.scene.add(hemi)

    const shadowed = (light: THREE.DirectionalLight, size: number) => {
      light.castShadow = true
      light.shadow.mapSize.set(size, size)
      Object.assign(light.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 })
      light.shadow.bias = -0.0003
      light.shadow.normalBias = 0.02
      light.target.position.copy(center)
      this.scene.add(light, light.target)
    }
    // Sun from behind the window wall; key light from the viewer's side lights the facade
    const sun = new THREE.DirectionalLight('#ffe2b5', 2.6)
    sun.position.copy(center).addScaledVector(SUN_DIR, -50)
    shadowed(sun, 4096)
    const key = new THREE.DirectionalLight('#fff0dc', 1.3)
    key.position.set(center.x + 34, 50, center.z + 22)
    shadowed(key, 2048)
    // Indoors at night the house lamps are on: a warm, soft light from the middle of the ceiling
    const lamps = new THREE.PointLight('#ffc98a', 0, 0, 1.1)
    lamps.position.set(center.x + 2, 14, center.z + 2)
    this.scene.add(lamps)
    this.lights = { hemi, sun, key, lamps }
  }

  /** Half-size of the area the sun and key light cast shadows over: the room, or the whole street. */
  private setShadowReach(half: number) {
    for (const light of [this.lights.sun, this.lights.key]) {
      // Back the light off far enough that everything in reach sits in front of its shadow camera
      const dist = half * 2 + 20
      const dir = light.position.clone().sub(light.target.position).normalize()
      light.position.copy(light.target.position).addScaledVector(dir, dist)
      Object.assign(light.shadow.camera, { left: -half, right: half, top: half, bottom: -half, far: dist + half * 2 })
      light.shadow.camera.updateProjectionMatrix()
    }
  }

  /**
   * Daylight outside; inside, the fill dims so the window, fire and lamps carry the room.
   * At night the sun becomes a cool moon and everything dims further.
   */
  private applyAmbient(dt: number) {
    const goal = this.inside.outdoor ? 0 : 1 - this.house.roofCover
    const ease = (cur: number, to: number, rate: number) => (cur < 0 ? to : cur + (to - cur) * Math.min(1, dt * rate))
    const k = ease(this.indoor, goal, 2.5)
    const n = ease(this.night, this.nightGoal, 1.5)
    if (Math.abs(k - this.indoor) < 0.001 && Math.abs(n - this.night) < 0.001) return
    const nightChanged = Math.abs(n - this.night) >= 0.001
    this.indoor = k
    this.night = n
    const mix = (dayOut: number, dayIn: number, nightOut: number, nightIn: number) =>
      THREE.MathUtils.lerp(THREE.MathUtils.lerp(dayOut, dayIn, k), THREE.MathUtils.lerp(nightOut, nightIn, k), n)
    const { hemi, sun, key, lamps } = this.lights
    lamps.intensity = (this.inside.outdoor ? 0 : 1) * k * n * 22
    hemi.intensity = mix(1.6, 0.55, 0.5, 0.2)
    hemi.color.lerpColors(AMBIENT.sky, AMBIENT.nightSky, n)
    hemi.groundColor.lerpColors(AMBIENT.ground, AMBIENT.groundIn, k).lerp(AMBIENT.nightGround, n)
    key.intensity = mix(1.3, 0.3, 0.4, 0.1)
    key.color.lerpColors(AMBIENT.key, AMBIENT.moon, n)
    sun.intensity = mix(2.6, 3.0, 0.7, 0.9)
    sun.color.lerpColors(AMBIENT.sun, AMBIENT.moon, n)
    this.renderer.toneMappingExposure = mix(1.1, 1.0, 1.0, 1.05)
    if (nightChanged) {
      for (const r of this.rooms) r.setNight?.(n)
      this.town?.setNight(n)
      ;(this.scene.fog as THREE.Fog).color.lerpColors(AMBIENT.hazeDay, AMBIENT.hazeNight, n)
    }
    this.house.setNight(n)
    this.events.onAmbient(k, n)
  }

  private resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    const aspect = w / h
    const viewH = aspect < 1 ? 46 / aspect : 44
    this.frustum = { w: viewH * aspect, h: viewH, portrait: aspect < 1 }
    Object.assign(this.camera, { left: -this.frustum.w / 2, right: this.frustum.w / 2, top: viewH / 2, bottom: -viewH / 2 })
    this.renderer.setSize(w, h)
    // Panel shift and fit depend on aspect: re-aim the resting view
    if (!this.flight) this.cur = this.stateFor(this.route)
    else this.flight.to = this.stateFor(this.route)
  }

  // ---- Views -------------------------------------------------------------

  private findRoom(id: string | null) {
    return this.rooms.find((r) => r.id === id)
  }

  private stateFor(route: Route): CamState {
    const room = this.findRoom(route.room)
    if (!room) {
      // Outside: the whole house, roof and chimney included
      // Pulled back a little so the street and the city around the house show too
      const zoom = Math.min(this.frustum.w / 46, this.frustum.h / 50) * 0.72
      return { target: new THREE.Vector3(12, 10.5, 12), azimuth: 0.66, polar: 1.0, zoom, shiftX: 0, shiftY: 0 }
    }
    const itemView = route.item ? (room.hotspots.find((h) => h.id === route.item)?.view ?? room.itemView?.(route.item)) : undefined
    return this.viewState(room, itemView ?? room.view, !!itemView)
  }

  /** Camera state for a room view. `withPanel` leaves room for the content panel. */
  private viewState(room: RoomScene, view: ViewDef, withPanel = false): CamState {
    // On portrait screens, zoom so the room fills the width
    const fit = this.frustum.portrait ? this.frustum.w / 33 : 1
    return {
      target: room.group.localToWorld(view.target.clone()),
      azimuth: view.azimuth,
      polar: view.polar,
      zoom: view.zoom * fit,
      // Desktop: panel on the right, push the item left. Mobile: sheet at the bottom, push it up.
      shiftX: withPanel && !this.frustum.portrait ? 0.17 : 0,
      shiftY: withPanel && this.frustum.portrait ? 0.2 : 0,
    }
  }

  private cloneState(s: CamState): CamState {
    return { ...s, target: s.target.clone() }
  }

  private applyCamera() {
    const s = this.cur
    const az = s.azimuth + this.dragAz + this.parallax.x * 0.035
    const polar = clamp(s.polar + this.dragPolar + this.parallax.y * 0.02, 0.35, 1.4)
    const zoom = s.zoom * this.userZoom

    const dir = new THREE.Vector3(Math.sin(polar) * Math.sin(az), Math.cos(polar), Math.sin(polar) * Math.cos(az))
    const forward = dir.clone().negate()
    const right = new THREE.Vector3(Math.cos(az), 0, -Math.sin(az))
    const up = new THREE.Vector3().crossVectors(right, forward)

    const target = s.target.clone()
      .addScaledVector(right, (s.shiftX * this.frustum.w) / zoom)
      .addScaledVector(up, (-s.shiftY * this.frustum.h) / zoom)

    this.camera.position.copy(target).addScaledVector(dir, CAMERA_DISTANCE)
    this.camera.up.set(0, 1, 0)
    this.camera.lookAt(target)
    this.camera.zoom = zoom
    this.camera.updateProjectionMatrix()
  }

  // ---- Input -------------------------------------------------------------

  private setPointer(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    this.pointerDirty = true
  }

  private onPointerDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY, dragging: false }
    this.setPointer(e)
  }

  private onPointerMove = (e: PointerEvent) => {
    this.setPointer(e)
    if (!this.down) return
    const dx = e.clientX - this.down.x
    const dy = e.clientY - this.down.y
    if (!this.down.dragging && Math.hypot(dx, dy) > 6) this.down.dragging = true
    if (this.down.dragging) {
      this.dragAz = clamp(this.dragAz - e.movementX * 0.004, -0.45, 0.45)
      this.dragPolar = clamp(this.dragPolar - e.movementY * 0.003, -0.3, 0.3)
    }
  }

  private onPointerLeave = () => {
    this.pointer.set(9, 9)
    this.pointerDirty = true
  }

  private onPointerUp = () => {
    const wasClick = this.down && !this.down.dragging
    this.down = null
    if (!wasClick || this.busy) return
    // An open item may want the click for itself (the arcade)
    const room = this.findRoom(this.route.room)
    if (this.route.item && room?.press) {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = this.raycaster.intersectObject(room.group, true)[0]?.object ?? null
      if (room.press(hit)) return
    }
    const { house, hotspot, door, eject, exit, toy } = this.hovered
    if (toy) {
      this.pokeToy(toy)
    } else if (house) this.events.onSelect({ room: this.inside.id, item: null })
    else if (exit) this.events.onSelect({ room: null, item: null })
    else if (eject) this.events.onSelect({ room: this.route.room, item: null })
    else if (door) this.events.onSelect({ room: door.to, item: null })
    else if (hotspot && this.route.room) this.events.onSelect({ room: this.route.room, item: hotspot.id })
    else if (this.route.item) this.events.onSelect({ room: this.route.room, item: null }) // click away closes the item
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.userZoom = clamp(this.userZoom * Math.exp(-e.deltaY * 0.0012), 0.75, 2.2)
  }

  private pokeToy(toy: Toy) {
    toy.poke()
    this.events.onCue?.((typeof toy.sound === 'function' ? toy.sound() : toy.sound) ?? 'poke')
  }

  private pick() {
    this.hovered = {}
    if (this.busy || this.flight || Math.abs(this.pointer.x) > 1 || Math.abs(this.pointer.y) > 1) return
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const room = this.findRoom(this.route.room)
    if (!room) {
      if (this.raycaster.intersectObjects(this.house.hitMeshes, false).length) this.hovered.house = true
      return
    }
    const meshes = room.hotspots.filter((h) => h.mesh.visible).map((h) => h.mesh)
    const doorMeshes = room.doors.flatMap((d) => d.meshes)
    const eject = this.route.item && room.eject?.mesh.visible ? [room.eject.mesh] : []
    const exit = !this.route.item && room.exit ? [room.exit.mesh] : []
    const toys = !this.route.item ? (room.toys ?? []).flatMap((t) => t.meshes) : []
    const hit = this.raycaster.intersectObjects([...meshes, ...doorMeshes, ...eject, ...exit, ...toys], false)[0]
    if (!hit) return
    this.hovered.toy = room.toys?.find((t) => t.meshes.includes(hit.object as THREE.Mesh))
    this.hovered.eject = hit.object === room.eject?.mesh
    this.hovered.exit = hit.object === room.exit?.mesh
    this.hovered.hotspot = room.hotspots.find((h) => h.mesh === hit.object)
    this.hovered.door = room.doors.find((d) => d.meshes.includes(hit.object as THREE.Mesh))
  }

  // ---- Frame -------------------------------------------------------------

  private frame = () => {
    this.timer.update()
    // Clamp loosely: slow devices should still finish camera flights on time
    const dt = Math.min(this.timer.getDelta(), 0.1)
    const t = this.timer.getElapsed()

    // Camera flight
    const f = this.flight
    if (f) {
      f.t = Math.min(1, f.t + dt / f.dur)
      const k = ease(f.t)
      this.cur.target.lerpVectors(f.from.target, f.to.target, k)
      this.cur.azimuth = THREE.MathUtils.lerp(f.from.azimuth, f.to.azimuth, k)
      this.cur.polar = THREE.MathUtils.lerp(f.from.polar, f.to.polar, k)
      // Zoom interpolates in log space so zooming in and out feel equally paced
      this.cur.zoom = Math.exp(THREE.MathUtils.lerp(Math.log(f.from.zoom), Math.log(f.to.zoom), k))
      this.cur.shiftX = THREE.MathUtils.lerp(f.from.shiftX, f.to.shiftX, k)
      this.cur.shiftY = THREE.MathUtils.lerp(f.from.shiftY, f.to.shiftY, k)
      // Ease visitor offsets back to the authored view while flying
      const back = Math.min(1, dt * 4)
      this.dragAz -= this.dragAz * back
      this.dragPolar -= this.dragPolar * back
      this.userZoom += (1 - this.userZoom) * back
      if (f.t >= 1) {
        this.flight = null
        f.resolve()
      }
    }

    // Gentle parallax that follows the mouse
    const px = Math.abs(this.pointer.x) <= 1 ? this.pointer.x : 0
    const py = Math.abs(this.pointer.y) <= 1 ? this.pointer.y : 0
    this.parallax.x += (px - this.parallax.x) * Math.min(1, dt * 2)
    this.parallax.y += (py - this.parallax.y) * Math.min(1, dt * 2)

    this.applyCamera()
    if (this.pointerDirty || this.flight) {
      this.pick()
      this.pointerDirty = false
    }
    const clickable = this.hovered.house || this.hovered.hotspot || this.hovered.door || this.hovered.eject || this.hovered.exit || this.hovered.toy
    this.renderer.domElement.style.cursor = this.down?.dragging ? 'grabbing' : clickable ? 'pointer' : 'grab'

    // Hover feedback
    this.house.setHover(!!this.hovered.house, t)
    for (const h of this.inside.hotspots) {
      const on = this.hovered.hotspot === h
      const mat = h.mesh.material as THREE.MeshStandardMaterial
      const glow = on ? 0.18 + 0.06 * Math.sin(t * 6) : 0
      mat.emissive.setRGB(glow, glow * 0.75, glow * 0.4)
      h.mesh.position.lerp(on && h.pop ? h.pop : new THREE.Vector3(), Math.min(1, dt * 10))
    }
    for (const d of this.inside.doors) {
      const glow = this.hovered.door === d ? 0.16 + 0.06 * Math.sin(t * 6) : 0
      for (const m of d.meshes) (m.material as THREE.MeshStandardMaterial).emissive?.setRGB(glow, glow * 0.75, glow * 0.4)
    }
    // Toys glow more gently: some are big (the fireplace) and would wash out
    const glowing: [THREE.Mesh[], boolean, number][] = [
      [this.inside.eject ? [this.inside.eject.mesh] : [], !!this.hovered.eject, 1],
      [this.inside.exit ? [this.inside.exit.mesh] : [], !!this.hovered.exit, 1],
      ...(this.inside.toys ?? []).map((toy): [THREE.Mesh[], boolean, number] => [toy.meshes, this.hovered.toy === toy, 0.45]),
    ]
    for (const [meshes, on, strength] of glowing) {
      const glow = on ? (0.18 + 0.06 * Math.sin(t * 6)) * strength : 0
      for (const m of meshes) (m.material as THREE.MeshStandardMaterial).emissive?.setRGB(glow, glow * 0.75, glow * 0.4)
    }

    // Generic tweens (door swings, iris)
    this.tweens = this.tweens.filter((tw) => {
      if (tw.delay > 0) {
        tw.delay -= dt
        return true
      }
      tw.t = Math.min(1, tw.t + dt / tw.dur)
      tw.step(ease(tw.t))
      if (tw.t >= 1) tw.resolve()
      return tw.t < 1
    })

    this.house.update(dt)
    // The town only shows around the closed house; inside, rooms stay little dioramas
    if (this.town) {
      const show = this.house.roofCover > 0.6
      if (show !== this.town.group.visible) this.setShadowReach(show ? 75 : 30)
      this.town.group.visible = show
      if (show) this.town.update(dt, t)
    }
    this.applyAmbient(dt)
    this.inside.setExposed?.(this.house.roofCover < 0.3)
    this.inside.update(dt, t)

    this.renderer.render(this.scene, this.camera)
    this.emitMarkers()
  }

  private emitMarkers() {
    const rect = this.renderer.domElement.getBoundingClientRect()
    const project = (local: THREE.Vector3, obj: THREE.Object3D) => {
      const p = obj.localToWorld(local.clone()).project(this.camera)
      return { x: ((p.x + 1) / 2) * rect.width, y: ((1 - p.y) / 2) * rect.height, visible: Math.abs(p.x) < 1.05 && Math.abs(p.y) < 1.05 }
    }
    const settled = !this.busy && !this.flight
    const markers: Marker[] = []
    const room = this.findRoom(this.route.room)

    if (!room) {
      const p = project(this.house.knockAnchor, this.house.group)
      markers.push({
        id: 'knock', kind: 'knock', label: 'Knock knock', route: { room: this.inside.id, item: null },
        ...p, visible: p.visible && settled && this.house.closed, hovered: !!this.hovered.house, active: false,
      })
    } else {
      for (const h of room.hotspots) {
        const p = project(h.marker, room.group)
        markers.push({
          id: h.id, kind: 'hotspot', label: h.label, short: h.short, route: { room: room.id, item: h.id },
          ...p, visible: p.visible && settled && this.route.item !== h.id && (!h.quiet || this.hovered.hotspot === h),
          hovered: this.hovered.hotspot === h, active: this.route.item === h.id,
        })
      }
      for (const [i, s] of (room.signs ?? []).entries()) {
        const p = project(s.at, room.group)
        markers.push({ id: `sign-${i}`, kind: 'sign', label: s.label, route: null, ...p, visible: p.visible && settled && !this.route.item, hovered: false, active: false })
      }
      if (room.eject) {
        const p = project(room.eject.marker, room.group)
        markers.push({
          id: 'eject', kind: 'eject', label: room.eject.label, route: { room: room.id, item: null },
          ...p, visible: p.visible && settled && !!this.route.item && room.eject.mesh.visible, hovered: !!this.hovered.eject, active: false,
        })
      }
      if (room.exit) {
        const p = project(room.exit.marker, room.group)
        markers.push({
          id: 'exit', kind: 'door', label: room.exit.label, route: { room: null, item: null },
          ...p, visible: p.visible && settled && !this.route.item, hovered: !!this.hovered.exit, active: false,
        })
      }
      for (const [i, toy] of (room.toys ?? []).entries()) {
        if (!toy.marker) continue
        const p = project(toy.marker.at, room.group)
        const icon = typeof toy.marker.icon === 'function' ? toy.marker.icon() : toy.marker.icon
        markers.push({
          id: `toy-${i}`, kind: 'toy', label: toy.marker.label, route: null, icon, below: toy.marker.below, action: () => this.pokeToy(toy),
          ...p, visible: p.visible && settled && !this.route.item, hovered: this.hovered.toy === toy, active: false,
        })
      }
      for (const d of room.doors) {
        const p = project(d.marker, room.group)
        markers.push({
          id: `door-${d.to}`, kind: 'door', label: d.label, route: { room: d.to, item: null },
          ...p, visible: p.visible && settled && !this.route.item, hovered: this.hovered.door === d, active: false,
        })
      }
    }
    // Room pop-ups ("meow!"), drifting up as they age
    if (room) for (const b of room.bubbles?.() ?? []) {
      const p = project(b.at.clone().add(new THREE.Vector3(0, b.age * 0.8, 0)), room.group)
      markers.push({ id: `fx-${b.id}`, kind: 'fx', label: b.label, route: null, ...p, hovered: false, active: false })
    }
    // "knock!" pop-ups that drift up beside the door
    this.house.knockAges().forEach((age, i) => {
      const p = project(this.house.knockAnchor.clone().add(new THREE.Vector3(i ? 1.4 : -1.4, -2 + age * 3, 0)), this.house.group)
      markers.push({ id: `fx-${i}`, kind: 'fx', label: 'knock!', route: null, ...p, hovered: false, active: false })
    })
    this.events.onMarkers(markers)

    if (this.iris) {
      const c = this.iris.anchor.clone().project(this.camera)
      const x = ((c.x + 1) / 2) * rect.width
      const y = ((1 - c.y) / 2) * rect.height
      // Radius that just covers the farthest screen corner
      const far = Math.max(Math.hypot(x, y), Math.hypot(rect.width - x, y), Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y))
      this.events.onIris({ x, y, radius: far * this.iris.k })
    } else this.events.onIris(null)
  }
}
