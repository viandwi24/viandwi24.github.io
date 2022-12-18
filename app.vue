<script lang="ts" setup>
import { useLoading } from '~/stores/loading'

const { isLoading } = useLoading()
</script>

<template>
  <div :style="{
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    color: '#fff',
  }">
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
    <!-- loader -->
    <div v-if="isLoading" class="loader-wrapper">
      <div class="lds-ripple"><div></div><div></div></div>
    </div>
  </div>
</template>
