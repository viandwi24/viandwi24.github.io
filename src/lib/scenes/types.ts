import type * as THREE from 'three'

/** Where the camera looks from. Positions are local to the room's group. */
export interface ViewDef {
  target: THREE.Vector3
  /** Angle around the vertical axis, measured from +z toward +x. π/4 is the classic isometric corner. */
  azimuth: number
  /** Angle down from straight above. ~0.96 is isometric. */
  polar: number
  /** Multiplier on the zoom that fits one room on screen. */
  zoom: number
}

export interface Hotspot {
  id: string
  label: string
  /** Compact label shown until hovered, for hotspots that sit close together. */
  short?: string
  /** Mesh that can be hovered/clicked; it glows on hover. */
  mesh: THREE.Mesh
  /** Local point the on-screen marker is pinned to. */
  marker: THREE.Vector3
  /** Camera view when this hotspot is opened. */
  view: ViewDef
  /** Local offset the mesh slides to while hovered. */
  pop?: THREE.Vector3
  /** Only show the marker while hovered, for objects that sit close together. */
  quiet?: boolean
}

/** A door in the room's back wall that leads to another room. */
export interface Door {
  to: string
  label: string
  /** Door leaf meshes, children of `pivot`. */
  meshes: THREE.Mesh[]
  /** Rotating `pivot.rotation.y` to `openAngle` swings the door away from the viewer. */
  pivot: THREE.Object3D
  openAngle: number
  marker: THREE.Vector3
  /** Close-up in front of the door: where we walk up to, and where we arrive from. */
  view: ViewDef
}

/** Something you can click just for fun: no marker, no route. It glows on hover. */
export interface Toy {
  meshes: THREE.Mesh[]
  poke(): void
  /** Sound to play after a poke; a function can pick one from the toy's new state. */
  sound?: ToySound | (() => ToySound)
  /** Toys that do something useful (the radio) get a clickable label like a door's. */
  marker?: { at: THREE.Vector3; label: string; icon: 'play' | 'pause' | (() => 'play' | 'pause'); below?: boolean }
}

export type ToySound = 'meow' | 'woof' | 'radio-on' | 'radio-off'

/** A little pop-up word ("meow!") pinned to a local point. `age` runs 0..1 and drives the fade. */
export interface Bubble {
  id: string
  label: string
  at: THREE.Vector3
  age: number
}

/** Background sound beds a room asks for. */
export type Ambience = 'fire' | 'garden'

export interface RoomScene {
  id: string
  label: string
  group: THREE.Group
  view: ViewDef
  hotspots: Hotspot[]
  doors: Door[]
  /** Non-clickable hints pinned in the room, e.g. "Pick a cartridge". */
  signs?: { label: string; at: THREE.Vector3 }[]
  /** Clickable object that closes the open item, e.g. the cartridge sitting in the console. Shown while `mesh` is visible. */
  eject?: { label: string; mesh: THREE.Mesh; marker: THREE.Vector3 }
  /** Clickable spot that leads back outside the house, e.g. the entryway. */
  exit?: { label: string; mesh: THREE.Mesh; marker: THREE.Vector3 }
  /** View for an item that has no hotspot of its own (e.g. a project from the archive). */
  itemView?(id: string): ViewDef | undefined
  update(dt: number, t: number): void
  /** Called when an item is opened (id) or closed (null). */
  focus?(id: string | null): void
  /** Whether the room is open to the sky (house roof lifted). */
  setExposed?(open: boolean): void
  /** Outdoor scenes skip the indoor dimming. */
  outdoor?: boolean
  toys?: Toy[]
  bubbles?(): Bubble[]
  ambience?: Ambience[]
  /** 0 = day, 1 = night. */
  setNight?(n: number): void
  /**
   * A click (with what it hit) or a key press (null) while an item is open.
   * Return true to keep it, e.g. to flap in the arcade, instead of closing the item.
   */
  press?(hit: THREE.Object3D | null): boolean
  dispose(): void
}
