<script lang="ts">
  import type { Route } from '../world/World'

  let { route, onNavigate }: { route: Route; onNavigate: (r: Route) => void } = $props()
</script>

<!-- No menu: rooms are reached through doors. The name always leads back outside. -->
<header>
  <button class="logo" onclick={() => onNavigate({ room: null, item: null })} title={route.room ? 'Step outside' : undefined}>
    Alfian Dwi Nugraha
  </button>
</header>

<style>
  header {
    position: absolute;
    top: 22px;
    left: 28px;
    pointer-events: auto;
  }
  /* A small pixel plate, so the name stays readable over the town */
  .logo {
    font-family: var(--pixel);
    font-size: 18px;
    color: var(--ink);
    background: var(--paper);
    border: 0;
    padding: 8px 14px;
    cursor: pointer;
    text-align: left;
    box-shadow:
      0 -3px 0 0 var(--ink),
      0 3px 0 0 var(--ink),
      -3px 0 0 0 var(--ink),
      3px 0 0 0 var(--ink),
      0 7px 0 0 var(--drop);
  }
  @media (max-width: 560px) {
    header {
      top: 16px;
      left: 16px;
    }
    .logo {
      font-size: 14px;
      padding: 6px 10px;
    }
  }
</style>
