<script lang="ts">
  import { onMount } from 'svelte'

  /**
   * Opening veil. The scene shows first, then blocky clouds slide in from both sides with a vignette
   * and a prompt; a click parts them back out to the sides.
   */
  let { onContinue, dark }: { onContinue: () => void; dark: boolean } = $props()

  let phase = $state<'out' | 'in' | 'parting'>('out')
  let gone = $state(false)
  const layers: { side: 'left' | 'right'; depth: number; canvas?: HTMLCanvasElement }[] = $state([
    { side: 'left', depth: 1 },
    { side: 'right', depth: 1 },
    { side: 'left', depth: 0 },
    { side: 'right', depth: 0 },
  ])

  /**
   * Crossy Road style clouds: stacks of flat boxes with a shaded extrusion to the lower right,
   * drawn at low resolution and scaled up with crisp pixels.
   */
  function paint(canvas: HTMLCanvasElement, side: 'left' | 'right', depth: number) {
    // Keep pixels square: match the canvas aspect to its on-screen box
    const W = 160
    const H = Math.round((W * canvas.clientHeight) / Math.max(1, canvas.clientWidth))
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    let seed = side === 'left' ? 11 + depth * 7 : 53 + depth * 7
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647

    // One cloud per row band, anchored to this side and reaching toward the middle
    const ROWS = 4
    const clouds = Array.from({ length: ROWS }, (_, i) => {
      const w = Math.round(W * (0.6 + rand() * 0.3))
      const reach = Math.round(W * (0.4 + rand() * 0.35)) // how far past the edge it pokes in
      const x = side === 'left' ? reach - w : W - reach
      const h = Math.round(16 + rand() * 8)
      const y = Math.round(((i + 0.55 + (depth ? 0.5 : 0)) / ROWS) * H + (rand() - 0.5) * 10)
      // Stepped silhouette: each tier narrower and set back from the inner end
      const tiers: (readonly [number, number, number, number])[] = [[x, y, w, h]]
      let tw = w, ty = y, th = h
      for (let k = 0; k < 2; k++) {
        const nw = Math.round(tw * (0.55 + rand() * 0.2))
        const nh = Math.round(th * 0.75)
        const nx = side === 'left' ? x + Math.round((tw - nw) * (0.1 + rand() * 0.4)) : x + w - nw - Math.round((tw - nw) * (0.1 + rand() * 0.4))
        ty -= nh - 1
        tiers.push([nx, ty, nw, nh])
        tw = nw
        th = nh
      }
      return tiers
    })

    // Day: bright white with cool shading. Night: moonlit blue-grey.
    const [shade, under, face, top] = dark
      ? depth ? ['#1f2640', '#2c3556', '#3c4770', '#4c5886'] : ['#262e4c', '#36416a', '#4b578a', '#6573a6']
      : depth ? ['#aab6cc', '#d3dae8', '#eef2f9', '#ffffff'] : ['#bcc7da', '#dfe5f0', '#ffffff', '#ffffff']
    const ext = depth ? 4 : 6
    const all = clouds.flat()
    // Chunky extrusion down and to the side, then underside band, faces, and a lit top edge
    ctx.fillStyle = shade
    for (const [x, y, w, h] of all) ctx.fillRect(x + (side === 'left' ? ext : -ext), y + ext, w, h)
    ctx.fillStyle = under
    for (const [x, y, w, h] of all) ctx.fillRect(x, y + h - 3, w, 3)
    ctx.fillStyle = face
    for (const [x, y, w, h] of all) ctx.fillRect(x, y, w, h - 3)
    ctx.fillStyle = top
    for (const [x, y, w] of all) ctx.fillRect(x, y, w, 1)
  }

  // Repaint whenever the theme changes, so the clouds match day or night
  $effect(() => {
    void dark
    for (const l of layers) if (l.canvas) paint(l.canvas, l.side, l.depth)
  })

  onMount(() => {
    // Let the scene be seen for a moment, then roll the clouds in
    const t = window.setTimeout(() => phase === 'out' && (phase = 'in'), 700)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        go()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  })

  function go() {
    if (phase === 'parting') return
    phase = 'parting'
    onContinue()
    window.setTimeout(() => (gone = true), 1500)
  }
</script>

{#if !gone}
  <button class="intro {phase}" onclick={go} aria-label="Click to continue">
    <span class="backdrop" class:dark aria-hidden="true"></span>
    <span class="vignette" class:dark aria-hidden="true"></span>
    {#each layers as l}
      <canvas bind:this={l.canvas} class="cloud {l.side} d{l.depth}" aria-hidden="true"></canvas>
    {/each}
    <span class="prompt">
      <span class="name">Alfian Dwi Nugraha</span>
      <span class="cta">click to continue</span>
    </span>
  </button>
{/if}

<style>
  .intro {
    position: fixed;
    inset: 0;
    z-index: 20;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    overflow: hidden;
  }
  /* A tint over the whole scene, then a heavy vignette toward the corners */
  .backdrop,
  .vignette {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 1.2s ease;
  }
  .backdrop {
    background: rgba(40, 24, 12, 0.35);
  }
  .backdrop.dark {
    background: rgba(6, 8, 22, 0.45);
  }
  .vignette {
    background: radial-gradient(ellipse at 50% 50%, rgba(30, 18, 10, 0.15) 20%, rgba(20, 12, 6, 0.92) 100%);
  }
  .vignette.dark {
    background: radial-gradient(ellipse at 50% 50%, rgba(8, 10, 26, 0.2) 20%, rgba(4, 5, 14, 0.95) 100%);
  }
  .cloud {
    position: absolute;
    top: -4%;
    height: 108%;
    width: 72%;
    image-rendering: pixelated;
    opacity: 0.96;
    transition: transform 1.3s cubic-bezier(0.55, 0, 0.25, 1), opacity 1.3s ease;
  }
  .cloud.d1 {
    top: 6%;
    opacity: 0.85;
  }
  .cloud.left {
    left: -4%;
    transform: translateX(-110%);
  }
  .cloud.right {
    right: -4%;
    transform: translateX(110%);
  }
  /* In: clouds roll in from the sides, the far layer a beat later */
  .in .cloud,
  .in .cloud.left,
  .in .cloud.right {
    transform: none;
  }
  .in .cloud.d1 {
    transition-delay: 0.15s;
  }
  .in .vignette,
  .in .backdrop {
    opacity: 1;
  }
  /* Parting: back out to their sides */
  .parting .cloud.left {
    transform: translateX(-110%);
    opacity: 0;
  }
  .parting .cloud.right {
    transform: translateX(110%);
    opacity: 0;
  }
  .parting .cloud.d1 {
    transition-delay: 0s;
  }
  .prompt {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    display: grid;
    gap: 14px;
    justify-items: center;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
  .in .prompt {
    opacity: 1;
    transition-delay: 0.9s;
  }
  .name {
    font-family: var(--pixel);
    font-size: clamp(20px, 3.4vw, 34px);
    color: var(--ink);
    white-space: nowrap;
    background: var(--paper);
    padding: 12px 20px;
    box-shadow:
      0 -4px 0 0 var(--ink),
      0 4px 0 0 var(--ink),
      -4px 0 0 0 var(--ink),
      4px 0 0 0 var(--ink),
      0 10px 0 0 var(--drop);
  }
  .cta {
    font-family: var(--pixel);
    font-size: 14px;
    color: var(--paper);
    background: var(--ink);
    padding: 10px 16px;
    box-shadow: 0 6px 0 0 var(--drop);
    animation: blink 1.2s steps(2) infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0.45;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .cta {
      animation: none;
    }
  }
</style>
