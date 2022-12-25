<script lang="ts" setup>
import { Application as Spline } from '@splinetool/runtime'
import { useLoading } from '~/stores/loading'

let spline: Spline | undefined

// set size follow wrapper
const onResize = () => {
  if (!spline) return
  const screenWidth = window.innerWidth
  const wrapper = spline.canvas.parentElement
  // wrapper.style.backgroundColor = '#000'

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
  useLoading().isLoading.value = true
  const canvas = document.getElementById('page-section-home-canvas') as HTMLCanvasElement
  if (canvas) {
    const app = new Spline(canvas)
    await app.load('/scene.splinecode')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    useLoading().isLoading.value = false
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
  <section class="page-section page-section-home pt-4 position-relative overflow-hidden d-flex">
    <div class="page-section-home-canvas-wrapper">
      <canvas id="page-section-home-canvas"></canvas>
    </div>
    <div class="container py-4 px-4 mx-auto d-flex flex-column justify-content-center flex-1">
      <div class="wrapper-with-tag">
        <div class="container-with-tag" style="--tag: 'h1';">
          <div class="mb-4">
            <div class="text-primary font-mono">Hi, my name is</div>
          </div>
          <div class="display-4 fw-bolder mb-4">
            <div class="text-custom-1">Alfian Dwi Nugraha.</div>
            <div class="text-custom-2">A website engraver for artists.</div>
          </div>
          <div class="text-sm fw-light mb-4 w-50">
            I am a web developer, who can handle web design, server side web, web games, and some desktop
            programming. now focusing on the web front end.
          </div>
          <div class="mb-4 d-flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 font-mono">
            <NuxtLink to="about" class="btn btn-primary d-flex gap-1">
              <i class="bi-play-fill"></i>
              <span>Lets Close About Me</span>
            </NuxtLink>
            <a href="https://github.com/viandwi24" target="_blank" class="btn btn-dark d-flex gap-2">
              <i class="bi-github mr-2"></i>
              <span>Github</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
