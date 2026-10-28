<script lang="ts">
  import { onMount } from 'svelte'
  import { Ambience } from './lib/audio/Ambience'
  import { createContact } from './lib/scenes/contact'
  import { createExperience } from './lib/scenes/experience'
  import { createGarden } from './lib/scenes/garden'
  import { House } from './lib/scenes/house'
  import { createTown } from './lib/scenes/town'
  import { createLivingRoom } from './lib/scenes/livingRoom'
  import { createWorkshop } from './lib/scenes/workshop'
  import Controls from './lib/ui/Controls.svelte'
  import Intro from './lib/ui/Intro.svelte'
  import Markers from './lib/ui/Markers.svelte'
  import Nav from './lib/ui/Nav.svelte'
  import Panel from './lib/ui/Panel.svelte'
  import { World, type Iris, type Marker, type Route } from './lib/world/World'

  const ROOMS = ['about', 'projects', 'garden', 'experience', 'contact']

  // Routes live in the URL hash: #/, #/about, #/projects/project-one
  function parse(hash: string): Route {
    const [room, item] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
    if (!room || !ROOMS.includes(room)) return { room: null, item: null }
    return { room, item: item ?? null }
  }
  const toHash = (r: Route) => '#/' + [r.room, r.item].filter(Boolean).join('/')

  // Per-visitor preferences; storage may be unavailable (private mode), so never rely on it
  const load = (k: string) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  }
  const save = (k: string, v: string) => {
    try {
      localStorage.setItem(k, v)
    } catch {
      /* not persisted, that's fine */
    }
  }

  let container: HTMLDivElement
  let route = $state(parse(location.hash))
  let markers = $state<Marker[]>([])
  let iris = $state<Iris | null>(null)
  // Light or dark. A first visit follows the visitor's clock; after a toggle, their choice sticks.
  const hour = new Date().getHours()
  const savedTheme = load('theme')
  let night = $state(savedTheme ? savedTheme === 'dark' : hour >= 18 || hour < 6)
  let sound = $state(load('sound') !== 'off')

  const navigate = (r: Route) => {
    location.hash = toHash(r)
  }
  const back = () => {
    if (route.item) navigate({ room: route.room, item: null })
    else if (route.room) navigate({ room: null, item: null })
  }


  const audio = new Ambience()
  let world: World | undefined
  /** Runs when the visitor clicks through the intro clouds: that click also unlocks audio. */
  let begin = () => {}
  let started = $state(false)

  $effect(() => {
    world?.setNight(night)
    audio.setNight(night)
  })
  $effect(() => {
    audio.setEnabled(sound)
    save('sound', sound ? 'on' : 'off')
  })

  onMount(() => {
    const rooms = [createLivingRoom(), createWorkshop(), createGarden(), createExperience(), createContact()]
    // Outside the house you still hear the garden birds
    const bedsFor = (r: Route) => rooms.find((x) => x.id === r.room)?.ambience ?? ['garden']
    // The radio sits in the living room: full there, muffled through the walls elsewhere
    const radioFor = (r: Route) => (r.room === 'about' ? 0.25 : r.room ? 0.17 : 0.15)
    const hear = (r: Route) => {
      audio.setBeds(bedsFor(r))
      audio.setRadioLevel(radioFor(r))
    }
    world = new World(container, rooms, new House(), {
      onSelect: navigate,
      onMarkers: (m) => (markers = m),
      onIris: (i) => (iris = i),
      // CSS variables rather than state: they change every frame during transitions
      onAmbient: (k, n) => {
        const s = document.documentElement.style
        s.setProperty('--indoor', k.toFixed(3))
        s.setProperty('--night', n.toFixed(3))
        s.setProperty('--dark', Math.max(k, n).toFixed(3))
      },
      onCue: (c) => audio.cue(c),
    }, createTown())
    world.setNight(night)
    // The house builds itself (or the room opens) once the clouds part
    begin = () => {
      started = true
      audio.unlock()
      world!.start(route)
      hear(route)
      // Landing on the street: the house builds itself (~1s) while the clouds part, then knock and go in
      if (!route.room)
        window.setTimeout(() => {
          if (!route.room) navigate({ room: 'about', item: null })
        }, 1400)
    }

    const onHash = () => {
      route = parse(location.hash)
      world!.go(route)
      hear(route)
    }
    const onKey = (e: KeyboardEvent) => {
      audio.unlock()
      if (e.key === 'Escape') back()
      else if ((e.key === ' ' || e.key === 'ArrowUp') && world!.press()) e.preventDefault()
    }
    // Audio may only start after a gesture
    const onPointer = () => audio.unlock()
    window.addEventListener('hashchange', onHash)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
      world!.dispose()
      audio.dispose()
    }
  })
</script>

<main>
  <div class="sky-night" aria-hidden="true"></div>
  <div class="dusk" aria-hidden="true"></div>
  <div class="stage" bind:this={container}></div>

  <div class="overlay">
    {#if started}<Markers {markers} onNavigate={navigate} />{/if}
    <Nav {route} onNavigate={navigate} />
    <Controls
      dark={night}
      {sound}
      onDark={(d) => {
        night = d
        save('theme', d ? 'dark' : 'light')
      }}
      onSound={(on) => (sound = on)}
    />

    <Panel {route} onNavigate={navigate} />
  </div>

  <Intro dark={night} onContinue={() => begin()} />

  {#if iris}
    <!-- Iris wipe: everything outside the circle goes dark; the radius snaps to 8px steps for a pixel feel -->
    <div
      class="iris"
      style="background: radial-gradient(circle at {iris.x}px {iris.y}px, transparent {Math.floor(iris.radius / 8) * 8}px, #1f130c {Math.floor(iris.radius / 8) * 8 + 1}px)"
    ></div>
  {/if}
</main>

<style>
  main,
  .sky-night,
  .dusk,
  .stage,
  .overlay {
    position: fixed;
    inset: 0;
  }
  /* Night sky behind the house: deep blue with pixel stars */
  .sky-night {
    background:
      radial-gradient(#fff 1px, transparent 1.5px) 0 0 / 97px 89px,
      radial-gradient(#cfe0ff 1px, transparent 1.5px) 40px 30px / 131px 113px,
      radial-gradient(#fff6d0 1.5px, transparent 2px) 70px 10px / 211px 173px,
      radial-gradient(circle at 50% 40%, #2a3560 0%, #161d3a 60%, #0c1024 100%);
    opacity: var(--night, 0);
    pointer-events: none;
  }
  /* Indoors the backdrop fades to a warm dark room with a vignette */
  .dusk {
    background:
      radial-gradient(circle at 50% 45%, transparent 30%, rgba(10, 5, 2, 0.55) 100%),
      radial-gradient(circle at 50% 45%, #5a3520 0%, #2e1a0f 60%, #1c0f08 100%);
    opacity: var(--indoor, 0);
    pointer-events: none;
  }
  .overlay {
    pointer-events: none;
  }
  .iris {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }
</style>
