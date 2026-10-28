<script lang="ts">
  import CaretLeft from 'phosphor-svelte/lib/CaretLeft'
  import CaretRight from 'phosphor-svelte/lib/CaretRight'
  import GameController from 'phosphor-svelte/lib/GameController'
  import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt'
  import SquaresFour from 'phosphor-svelte/lib/SquaresFour'
  import X from 'phosphor-svelte/lib/X'
  import { fly } from 'svelte/transition'
  import LinkIcon from './LinkIcon.svelte'
  import { experience, profile, projects, skills } from '../content'
  import type { Route } from '../world/World'

  let { route, onNavigate }: { route: Route; onNavigate: (r: Route) => void } = $props()

  const narrow = window.matchMedia('(max-aspect-ratio: 1/1)').matches
  const projectIndex = $derived(route.room === 'projects' ? projects.findIndex((p) => p.id === route.item) : -1)
  const project = $derived(projectIndex >= 0 ? projects[projectIndex] : undefined)
  // Room/item pairs that open a panel, keyed "room/item"
  const PANELS: Record<string, string> = {
    'about/profile': 'profile',
    'about/skills': 'skills',
    'projects/archive': 'archive',
    'projects/arcade': 'arcade',
    'experience/timeline': 'timeline',
    'experience/awards': 'awards',
    'contact/letter': 'letter',
    'contact/socials': 'socials',
  }
  const kind = $derived(PANELS[`${route.room}/${route.item}`] ?? (project ? 'project' : null))

  // Social cards in the contact room use these colors, in profile.links order
  const CARD_COLORS = ['#24292e', '#0a66c2', '#c8443d', '#39b54a', '#d6249f']
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))?.url.slice('mailto:'.length) ?? ''
  let from = $state('')
  let message = $state('')
  // No backend: the letter opens in the visitor's own mail app
  const send = (e: SubmitEvent) => {
    e.preventDefault()
    const subject = `Hello from ${from || 'your website'}`
    location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  }

  // Archive grouped by year, newest first
  const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a)
  const byYear = years.map((y) => [y, projects.filter((p) => p.year === y)] as const)

  const close = () => onNavigate({ room: route.room, item: null })
  const open = (id: string) => onNavigate({ room: 'projects', item: id })
  const step = (d: number) => open(projects[(projectIndex + d + projects.length) % projects.length].id)
</script>

{#if kind}
  {#key route.item}
    <aside
      class="panel pixel-box"
      in:fly={narrow ? { y: 40, duration: 350, delay: 250 } : { x: 40, duration: 350, delay: 250 }}
      out:fly={narrow ? { y: 40, duration: 180 } : { x: 40, duration: 180 }}
      aria-live="polite"
    >
      <button class="close pixel-btn" onclick={close} aria-label="Close"><X size="16" weight="bold" /></button>

      {#if kind === 'profile'}
        <div class="who">
          <img class="avatar" src={profile.avatar} alt="" width="72" height="72" />
          <div>
            <p class="eyebrow">About me · @{profile.handle}</p>
            <h2>{profile.name}</h2>
            <p class="role">{profile.role}</p>
          </div>
        </div>
        {#each profile.bio as para}<p>{para}</p>{/each}
        <h3>Right now</h3>
        <ul class="now">
          {#each profile.now as line}<li>{line}</li>{/each}
        </ul>
        <h3>Highlights</h3>
        <div class="photos">
          {#each profile.highlights as h}
            <figure>
              <img src={h.image} alt={h.caption} loading="lazy" />
              <figcaption>{h.caption}</figcaption>
            </figure>
          {/each}
        </div>
        <div class="links">
          {#each profile.links as l}<a class="pixel-btn" href={l.url} target="_blank" rel="noreferrer"><LinkIcon url={l.url} />{l.label}</a>{/each}
        </div>
      {:else if kind === 'skills'}
        <p class="eyebrow">Inventory</p>
        <h2>Skills</h2>
        <p>Tools I reach for, and the year I picked each one up.</p>
        {#each skills as group}
          <h3>{group.title}</h3>
          <ul class="slots">
            {#each group.items as [name, since]}<li>{name} <small>{since}</small></li>{/each}
          </ul>
        {/each}
      {:else if kind === 'archive'}
        <p class="eyebrow">Archive</p>
        <h2>All projects</h2>
        <p>Not everything is here: plenty of client work is private.</p>
        {#each byYear as [year, list]}
          <h3>{year}</h3>
          <ul class="archive">
            {#each list as p}
              <li>
                <button onclick={() => open(p.id)}>
                  <span class="dot" style="--c: {p.cartridge ?? 'var(--paper-2)'}"></span>
                  <span class="name">{p.title}</span>
                  <span class="type">{p.type}</span>
                </button>
              </li>
            {/each}
          </ul>
        {/each}
      {:else if kind === 'arcade'}
        <p class="eyebrow">Arcade</p>
        <h2>Flappy Voxel</h2>
        <p>The Flappy Bird AI cartridge, playable. Click the screen or press Space to flap, and dodge the pipes.</p>
        <p>The real project trains birds to play by themselves with a neural network.</p>
        <div class="links">
          <button class="pixel-btn primary" onclick={() => open('flappy-bird-ai')}><GameController weight="bold" />See the AI version</button>
        </div>
      {:else if kind === 'timeline'}
        <p class="eyebrow">Experience</p>
        <h2>Career timeline</h2>
        <ol class="timeline">
          {#each experience as job}
            <li>
              <p class="when">{job.date}</p>
              <h3>{job.role}</h3>
              <p class="org">{job.company}</p>
              <ul>
                {#each job.tasks as task}<li>{task}</li>{/each}
              </ul>
            </li>
          {/each}
        </ol>
      {:else if kind === 'awards'}
        <p class="eyebrow">Trophy cabinet</p>
        <h2>Awards</h2>
        <p>A few moments I'm proud of.</p>
        <div class="photos">
          {#each profile.highlights as h}
            <figure>
              <img src={h.image} alt={h.caption} loading="lazy" />
              <figcaption>{h.caption}</figcaption>
            </figure>
          {/each}
        </div>
      {:else if kind === 'letter'}
        <p class="eyebrow">Contact</p>
        <h2>Write me a letter</h2>
        <p>It opens in your mail app, addressed to <strong>{email}</strong>.</p>
        <form class="letter" onsubmit={send}>
          <label>
            Your name
            <input bind:value={from} autocomplete="name" placeholder="Who's writing?" />
          </label>
          <label>
            Message
            <textarea bind:value={message} rows="6" required placeholder="Hi Alfian, ..."></textarea>
          </label>
          <button class="pixel-btn primary" type="submit"><PaperPlaneTilt weight="bold" />Seal & send</button>
        </form>
      {:else if kind === 'socials'}
        <p class="eyebrow">Contact</p>
        <h2>Find me online</h2>
        <ul class="socials">
          {#each profile.links as l, i}
            <li>
              <a href={l.url} target="_blank" rel="noreferrer" style="--c: {CARD_COLORS[i % CARD_COLORS.length]}">
                <span class="card"><LinkIcon url={l.url} size="20" /></span>
                <span>{l.label}</span>
                <small>{l.url.replace(/^(mailto:|https?:\/\/(www\.)?)/, '')}</small>
              </a>
            </li>
          {/each}
        </ul>
      {:else if project}
        <p class="eyebrow" style="--c: {project.cartridge ?? 'var(--paper-2)'}">
          <span class="swatch"></span> {project.type} · {project.year}
        </p>
        <h2>{project.title}</h2>
        {#if project.image}
          <img class="shot" src={project.image} alt="Screenshot of {project.title}" loading="lazy" />
        {/if}
        <p>{project.description}</p>
        <ul class="slots">
          {#each project.tech as t}<li>{t}</li>{/each}
        </ul>
        {#if project.links.length}
          <div class="links">
            {#each project.links as l}<a class="pixel-btn primary" href={l.url} target="_blank" rel="noreferrer"><LinkIcon url={l.url} />{l.label}</a>{/each}
          </div>
        {/if}
        <div class="pager">
          <button class="pixel-btn" onclick={() => step(-1)}><CaretLeft weight="bold" />Prev</button>
          <button class="pixel-btn" onclick={() => onNavigate({ room: 'projects', item: 'archive' })}><SquaresFour weight="bold" />All</button>
          <button class="pixel-btn" onclick={() => step(1)}>Next<CaretRight weight="bold" /></button>
        </div>
      {/if}
    </aside>
  {/key}
{/if}

<style>
  .panel {
    position: absolute;
    top: 96px;
    right: 32px;
    bottom: 40px;
    width: min(420px, 36vw);
    overflow-y: auto;
    padding: 26px 26px 30px;
    pointer-events: auto;
    box-sizing: border-box;
  }
  @media (max-aspect-ratio: 1/1) {
    .panel {
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 20px;
      width: auto;
      max-height: 50vh;
    }
  }
  .close {
    position: sticky;
    top: 0;
    float: right;
    margin: -6px -6px 0 12px;
    padding: 4px 8px;
    z-index: 1;
  }
  .who {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-bottom: 12px;
  }
  .avatar {
    width: 72px;
    height: 72px;
    image-rendering: pixelated;
    box-shadow: 0 0 0 3px var(--ink);
  }
  .eyebrow {
    font-family: var(--pixel);
    font-size: 11px;
    text-transform: uppercase;
    color: var(--accent-dark);
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .swatch,
  .dot {
    flex: none;
    width: 10px;
    height: 10px;
    background: var(--c);
    box-shadow: 0 0 0 2px var(--ink);
  }
  h2 {
    font-family: var(--pixel);
    font-weight: 400;
    font-size: 24px;
    line-height: 1.1;
    margin: 0 0 6px;
  }
  h3 {
    font-family: var(--pixel);
    font-weight: 400;
    font-size: 13px;
    text-transform: uppercase;
    margin: 20px 0 8px;
  }
  .role {
    font-weight: 600;
    color: var(--ink-soft);
    margin: 0;
  }
  p {
    font-size: 17px;
    line-height: 1.45;
    margin: 0 0 12px;
  }
  .now {
    margin: 0;
    padding-left: 18px;
    font-size: 16px;
    line-height: 1.5;
    list-style: square;
  }
  .photos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  figure {
    margin: 0;
  }
  figure img,
  .shot {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    box-shadow: 0 0 0 3px var(--ink);
  }
  .shot {
    aspect-ratio: 16 / 10;
    margin: 10px 0 16px;
  }
  figcaption {
    font-size: 13px;
    line-height: 1.3;
    margin-top: 8px;
    color: var(--ink-soft);
  }
  .slots {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 10px 0 0;
  }
  .slots li {
    font-family: var(--pixel);
    font-size: 11px;
    padding: 6px 9px;
    background: var(--paper-2);
    box-shadow:
      0 -2px 0 0 var(--ink-soft),
      0 2px 0 0 var(--ink-soft),
      -2px 0 0 0 var(--ink-soft),
      2px 0 0 0 var(--ink-soft);
  }
  .slots small {
    color: var(--accent-dark);
    margin-left: 4px;
  }
  .archive {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .archive button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 7px 4px;
    border: 0;
    border-bottom: 2px dashed var(--paper-2);
    background: none;
    font: inherit;
    font-size: 16px;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .archive button:hover {
    background: var(--paper-2);
  }
  .archive .name {
    flex: 1;
  }
  .archive .type {
    font-size: 13px;
    color: var(--ink-soft);
  }
  /* Icon + label buttons */
  .links .pixel-btn,
  .pager .pixel-btn,
  .letter button,
  .close {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .links,
  .pager {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 22px;
  }
  .timeline {
    list-style: none;
    margin: 16px 0 0;
    padding: 0 0 0 18px;
    border-left: 3px dashed var(--paper-2);
  }
  .timeline > li {
    position: relative;
    margin-bottom: 18px;
  }
  .timeline > li::before {
    content: '';
    position: absolute;
    left: -25px;
    top: 4px;
    width: 10px;
    height: 10px;
    background: #d23a3a;
    box-shadow: 0 0 0 2px var(--ink);
  }
  .timeline h3 {
    margin: 2px 0;
    text-transform: none;
  }
  .when,
  .org {
    font-size: 14px;
    margin: 0;
    color: var(--ink-soft);
  }
  .timeline ul {
    margin: 6px 0 0;
    padding-left: 18px;
    font-size: 15px;
    line-height: 1.4;
    list-style: square;
  }
  .letter {
    display: grid;
    gap: 14px;
    margin-top: 12px;
  }
  .letter label {
    display: grid;
    gap: 6px;
    font-family: var(--pixel);
    font-size: 11px;
    text-transform: uppercase;
  }
  .letter input,
  .letter textarea {
    font: inherit;
    font-family: var(--body);
    font-size: 16px;
    text-transform: none;
    padding: 8px 10px;
    border: 0;
    background: #fffaf0;
    box-shadow: inset 0 0 0 3px var(--ink-soft);
    resize: vertical;
  }
  .letter button {
    justify-self: start;
  }
  .socials {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: grid;
    gap: 12px;
  }
  .socials a {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 12px;
    align-items: center;
    padding: 10px 12px;
    color: inherit;
    text-decoration: none;
    font-family: var(--pixel);
    font-size: 13px;
    background: var(--paper-2);
  }
  .socials a:hover {
    background: var(--c);
    color: #fff;
  }
  .socials .card {
    grid-row: span 2;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    color: #fff;
    background: var(--c);
    box-shadow: 0 0 0 2px var(--ink);
  }
  .socials a:hover .card {
    box-shadow: 0 0 0 2px #fff;
  }
  .socials small {
    font-family: var(--body);
    font-size: 13px;
    opacity: 0.8;
  }
  .pager {
    justify-content: space-between;
    padding-top: 18px;
    border-top: 3px dashed var(--paper-2);
  }
</style>
