<script lang="ts">
  import DoorOpen from 'phosphor-svelte/lib/DoorOpen'
  import Eject from 'phosphor-svelte/lib/Eject'
  import Pause from 'phosphor-svelte/lib/Pause'
  import Play from 'phosphor-svelte/lib/Play'
  import SignOut from 'phosphor-svelte/lib/SignOut'
  import type { Marker, Route } from '../world/World'

  let { markers, onNavigate }: { markers: Marker[]; onNavigate: (r: Route) => void } = $props()

  // Measured label sizes, keyed like the #each below
  const widths: Record<string, number> = $state({})
  const heights: Record<string, number> = $state({})

  // Lower number wins when two labels overlap
  const rank = (m: Marker) => (m.hovered ? 0 : m.kind === 'knock' ? 1 : m.kind === 'eject' ? 2 : m.kind === 'door' || m.kind === 'toy' ? 3 : m.kind === 'hotspot' ? 4 : 5)
  const PAD = 6

  /** Labels hidden because a more important one sits on top of them. */
  const covered = $derived.by(() => {
    const placed: { l: number; r: number; t: number; b: number }[] = []
    const hidden = new Set<string>()
    const order = markers.filter((m) => m.visible && m.kind !== 'fx').sort((a, b) => rank(a) - rank(b))
    for (const m of order) {
      const key = m.kind + m.id
      const w = widths[key] ?? 0, h = heights[key] ?? 0
      const top = m.below ? m.y : m.y - h
      const box = { l: m.x - w / 2 - PAD, r: m.x + w / 2 + PAD, t: top - PAD, b: top + h + PAD }
      if (placed.some((p) => box.l < p.r && box.r > p.l && box.t < p.b && box.b > p.t)) hidden.add(key)
      else placed.push(box)
    }
    return hidden
  })
</script>

{#each markers as m (m.kind + m.id)}
  {#if m.kind === 'fx'}
    <!-- Positioned with left/top: its pop animation scales, and scale would also scale a transform offset -->
    <span class="marker fx" style="left: {m.x}px; top: {m.y}px" aria-hidden="true">{m.label}</span>
  {:else if m.kind === 'sign'}
    <span
      class="marker sign"
      class:hidden={!m.visible || covered.has(m.kind + m.id)}
      bind:offsetWidth={widths[m.kind + m.id]}
      bind:offsetHeight={heights[m.kind + m.id]}
      style="transform: translate({m.x}px, {m.y}px)">
      <span class="tag">{m.label}</span>
      <span class="arrow" aria-hidden="true"></span>
    </span>
  {:else}
    <button
      class="marker {m.kind}"
      class:below={m.below}
      class:hovered={m.hovered}
      class:hidden={!m.visible || covered.has(m.kind + m.id)}
      bind:offsetWidth={widths[m.kind + m.id]}
      bind:offsetHeight={heights[m.kind + m.id]}
      style="transform: translate({m.x}px, {m.y}px)"
      tabindex={m.visible && !covered.has(m.kind + m.id) ? 0 : -1}
      onclick={() => (m.action ? m.action() : m.route && onNavigate(m.route))}
    >
      <span class="tag">
        {#if m.kind === 'door'}
          <span class="to">{#if m.id === 'exit'}<SignOut weight="bold" />{:else}<DoorOpen weight="bold" />{/if}</span>
        {:else if m.kind === 'eject'}
          <span class="to"><Eject weight="fill" /></span>
        {:else if m.kind === 'toy'}
          <span class="to">{#if m.icon === 'pause'}<Pause weight="fill" />{:else}<Play weight="fill" />{/if}</span>
        {/if}
        {m.short && !m.hovered ? m.short : m.label}
        {#if m.kind === 'knock'}<span class="enter">click the door</span>{/if}
        {#if m.kind === 'eject'}<span class="hint">back to the room</span>{/if}
      </span>
      <span class="arrow" aria-hidden="true"></span>
    </button>
  {/if}
{/each}

<style>
  /* Positioned by transform; `translate` puts the arrow tip on the projected point */
  .marker {
    position: absolute;
    left: 0;
    top: 0;
    translate: -50% -100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    pointer-events: auto;
    transition: opacity 0.25s;
  }
  .marker.hovered,
  .marker:hover {
    z-index: 2;
  }
  /* Label hanging under its point, arrow pointing up */
  .marker.below {
    translate: -50% 0;
    flex-direction: column-reverse;
  }
  .marker.below .arrow {
    margin: 0 0 10px;
    rotate: 180deg;
  }
  .marker.hidden {
    opacity: 0;
    pointer-events: none;
  }
  .tag {
    font-family: var(--pixel);
    font-size: 12px;
    white-space: nowrap;
    color: var(--ink);
    background: var(--paper);
    padding: 5px 9px;
    box-shadow:
      0 -3px 0 0 var(--ink),
      0 3px 0 0 var(--ink),
      -3px 0 0 0 var(--ink),
      3px 0 0 0 var(--ink),
      0 7px 0 0 var(--drop);
    transition: transform 0.12s steps(2), background 0.12s;
  }
  .knock .tag {
    font-size: 18px;
    padding: 10px 16px;
    text-align: center;
    animation: wobble 2.4s steps(4) infinite;
  }
  .enter {
    display: block;
    font-size: 10px;
    margin-top: 4px;
    color: var(--accent-dark);
  }
  .sign {
    cursor: default;
    pointer-events: none;
  }
  .sign .tag {
    background: var(--paper-2);
    font-size: 11px;
  }
  .door .tag,
  .toy .tag {
    background: var(--ink);
    color: var(--paper);
  }
  .toy.hovered .tag,
  .toy:hover .tag {
    background: var(--accent);
  }
  .toy.hovered .to,
  .toy:hover .to {
    color: var(--paper);
  }
  .to {
    display: inline-flex;
    vertical-align: -2px;
    margin-right: 6px;
    color: var(--accent);
  }
  .door.hovered .tag,
  .door:hover .tag {
    background: var(--accent);
  }
  .door.hovered .to,
  .door:hover .to,
  .eject.hovered .to,
  .eject:hover .to {
    color: var(--paper);
  }
  .eject .tag {
    background: var(--ink);
    color: var(--paper);
    text-align: center;
  }
  .hint {
    display: block;
    font-size: 9px;
    margin-top: 3px;
    color: var(--accent);
  }
  .eject.hovered .hint,
  .eject:hover .hint {
    color: var(--paper);
  }
  @keyframes wobble {
    0%, 70%, 100% { rotate: 0deg; }
    76% { rotate: -3deg; }
    82% { rotate: 3deg; }
    88% { rotate: -2deg; }
  }
  .fx {
    font-family: var(--pixel);
    font-size: 20px;
    color: var(--paper);
    text-shadow: 3px 0 var(--ink), -3px 0 var(--ink), 0 3px var(--ink), 0 -3px var(--ink), 3px 3px var(--ink);
    pointer-events: none;
    animation: pop 1.2s steps(6) forwards;
  }
  @keyframes pop {
    from { scale: 0.4; opacity: 1; }
    30% { scale: 1.2; }
    to { scale: 1; opacity: 0; }
  }
  .hovered .tag,
  .marker:hover .tag {
    background: var(--accent);
    color: var(--paper);
    transform: translateY(-3px);
  }
  .hovered .enter,
  .marker:hover .enter {
    color: var(--paper);
  }

  /* Pixel down-arrow that bobs */
  .arrow {
    width: 12px;
    height: 12px;
    margin-top: 10px;
    background: var(--ink);
    clip-path: polygon(0 0, 100% 0, 100% 34%, 84% 34%, 84% 67%, 67% 67%, 67% 100%, 34% 100%, 34% 67%, 17% 67%, 17% 34%, 0 34%);
    animation: bob 1.1s steps(2) infinite;
  }
  @keyframes bob {
    50% {
      transform: translateY(4px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .arrow,
    .knock .tag {
      animation: none;
    }
  }
</style>
