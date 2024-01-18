<script lang="ts" setup>
import { Application as Spline } from '@splinetool/runtime'

useSeoMeta({
  title: 'Alfian Dwi Nugraha (viandwi24)',
  titleTemplate: '',
})

definePageMeta({
  keepalive: true,
})


const $loading = useLoading()
let spline: Spline | undefined

// set size follow wrapper
const onResize = () => {
  if (!spline) return
  const screenWidth = window.innerWidth
  const wrapper = spline.canvas.parentElement

  // update size
  if (wrapper) {
    spline.canvas.style.width = '100%'
    spline.canvas.style.height = '100%'
  }
  if (screenWidth < 836) {
    spline.canvas.style.display = 'none'
  } else {
    spline.canvas.style.display = 'block'
  }
}

onMounted(async () => {
  $loading.setLoading(true)
  const canvas = document.getElementById('page-section-home-canvas') as HTMLCanvasElement
  if (canvas) {
    const app = new Spline(canvas)
    // await app.load('/scene.splinecode')
    await app.load('https://prod.spline.design/ftN8iqMHiFJT3atP/scene.splinecode')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    $loading.setLoading(false)
    window.addEventListener('resize', onResize)
    spline = app
  }
})

onBeforeUnmount(() => {
  if (spline) {
    spline.dispose()
    spline = undefined
    window.removeEventListener('resize', onResize)
  }
})
</script>

<template>
  <KeepAlive>
    <div class="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
      <div class="page-section-home-canvas-wrapper">
        <canvas id="page-section-home-canvas"></canvas>
      </div>
      <div class="w-full sm:max-w-screen-sm lg:max-w-screen-xl mx-auto px-4 pb-20">
        <div class="wrapper-with-tag">
          <div class="container-with-tag" style="--tag: 'h1';">
            <div class="mb-4">
              <div class="text-primary font-mono">Hi, my name is {{ $loading.$state.isLoading }}</div>
            </div>
            <div class="text-[3.5rem] font-bold mb-4 leading-[4rem]">
              <div class="text-blue-200">Alfian Dwi Nugraha.</div>
              <div class="text-orange-200">A website engraver for artists.</div>
            </div>
            <div class="text-sm font-light mb-4 max-w-xl leading-[1.3rem] tracking-wide">
              I am a web developer, who can handle web design, server side web, web games, and some desktop
              programming. now focusing on the web front end & solana web3.
            </div>
            <div class="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 font-mono justify-start items-start">
              <NuxtLink to="about" class="w-auto flex items-center px-4 py-2 rounded bg-primary-400 inline-block sm:flex space-x-1">
                <Icon name="ic:sharp-emoji-people" />
                <span>About Me</span>
              </NuxtLink>
              <a href="https://linktr.ee/viandwi24" target="_blank" class="w-auto flex items-center px-4 py-2 rounded bg-green-400 inline-block sm:flex space-x-1">
                <Icon name="mdi:pine-tree-variant-outline" />
                <span>Linktr.ee</span>
              </a>
              <a href="https://github.com/viandwi24" target="_blank" class="w-auto flex items-center px-4 py-2 rounded bg-gray-600 inline-block sm:flex space-x-1">
                <Icon name="bi:github" class="mr-2" />
                <span>Github</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </KeepAlive>
</template>
