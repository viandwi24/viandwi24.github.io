<script lang="ts">
  import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut'
  import EnvelopeSimple from 'phosphor-svelte/lib/EnvelopeSimple'
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo'
  import InstagramLogo from 'phosphor-svelte/lib/InstagramLogo'
  import LinkedinLogo from 'phosphor-svelte/lib/LinkedinLogo'
  import LinktreeLogo from 'phosphor-svelte/lib/LinktreeLogo'

  /** Picks a brand icon from the link's address, falling back to "opens elsewhere". */
  let { url, size = '1.15em' }: { url: string; size?: string } = $props()

  const Icon = $derived(
    url.startsWith('mailto:') ? EnvelopeSimple
    : url.includes('github.com') ? GithubLogo
    : url.includes('linkedin.com') ? LinkedinLogo
    : url.includes('linktr.ee') ? LinktreeLogo
    : url.includes('instagram.com') ? InstagramLogo
    : ArrowSquareOut,
  )
</script>

<Icon {size} weight="bold" aria-hidden="true" />
