<script lang="ts">
  import Moon from 'phosphor-svelte/lib/Moon'
  import MusicNotes from 'phosphor-svelte/lib/MusicNotes'
  import SpeakerSlash from 'phosphor-svelte/lib/SpeakerSlash'
  import Sun from 'phosphor-svelte/lib/Sun'

  let { dark, sound, onDark, onSound }: { dark: boolean; sound: boolean; onDark: (dark: boolean) => void; onSound: (on: boolean) => void } = $props()
</script>

<!-- Two icon toggles, not a menu -->
<div class="controls">
  <button class="pixel-btn" onclick={() => onDark(!dark)} title={dark ? 'Switch to day' : 'Switch to night'} aria-label={dark ? 'Switch to day' : 'Switch to night'}>
    {#if dark}<Moon size="18" weight="fill" />{:else}<Sun size="18" weight="fill" />{/if}
  </button>
  <button class="pixel-btn" onclick={() => onSound(!sound)} title={sound ? 'Mute' : 'Play sound'} aria-label={sound ? 'Mute' : 'Play sound'} aria-pressed={sound}>
    {#if sound}<MusicNotes size="18" weight="fill" />{:else}<SpeakerSlash size="18" weight="fill" />{/if}
  </button>
</div>

<style>
  .controls {
    position: absolute;
    top: 22px;
    right: 28px;
    display: flex;
    gap: 14px;
    pointer-events: auto;
  }
  .pixel-btn {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
  }
  @media (max-width: 560px) {
    .controls {
      top: 16px;
      right: 16px;
      gap: 10px;
    }
  }
</style>
