<script lang="ts" setup>
import { useLoading } from '~/stores/loading'

useSeoMeta({
  titleTemplate: '%s | Alfian Dwi Nugraha (viandwi24)',
  description: 'Hi, I\'m Alfian Dwi Nugraha (viandwi24), a passionate self-taught FrontEnd web developer from Indonesia.',
})

const $loading = useLoading()
</script>

<template>
  <div>
    <div class="z-[60] w-screen top-0 left-0 fixed h-4">
      <NuxtLoadingIndicator :height="5" :throttle="0" />
    </div>
    <NuxtLayout>
      <div v-if="$loading.$state.isLoading" class="fixed w-screen h-screen bg-gray-950/90 flex items-center justify-center text-gray-100 z-[60]">
        <div class="flex flex-col items-center justify-center gap-4">
          <Icon name="eos-icons:loading" class="text-6xl" />
          <div>Loading Assets</div>
        </div>
      </div>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
