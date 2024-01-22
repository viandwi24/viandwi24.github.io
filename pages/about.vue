<script lang="ts" setup>
import { Application as Spline } from '@splinetool/runtime'

useSeoMeta({
  title: 'About Me',
})

const $loading = useLoading()

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
  $loading.setLoading(true)
  const canvas = document.getElementById('page-section-about-canvas') as HTMLCanvasElement
  if (canvas) {
    const app = new Spline(canvas)
    // await app.load('/scene_2.splinecode')
    await app.load('https://prod.spline.design/6802b1zHNeLBVZJK/scene.splinecode')
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
  <section class="flex-1 flex flex-col justify-center page-section page-section-about">
    <div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4">
      <div class="page-section-header mb-4 text-custom-1">
        <span>02.</span>
        <span>About Me</span>
      </div>
      <div class="flex flex-col-reverse lg:flex-row">
        <div class="px-4 flex-1 lg:pr-6 mb-4">
          <p>
            Hello, my name is <span class="text-primary">Alfian Dwi Nugraha</span>! I have a passion in
            the internet world since I was 10 years old. I was browsing blogs
            and then trying to make some desktop applications, then again
            met this web-based programming.
          </p>
          <ul>
            <li>🔭 I’m currently working on Freelance as <span class="text-primary">Web Dev Programmer</span></li>
            <li>🌱 I’m currently learning Golang, Python and Web3 Solana</li>
            <li>🎓 I’m currently studying at the <span class="text-primary">Surabaya State University</span></li>
          </ul>
          <p>
            You can see detail of my journey and experiences <NuxtLink to="/experience" class="border-b hover:bg-yellow-300/50 border-primary-500 border-dotted">clik this</NuxtLink>.
          </p>
        </div>
        <div class="w-full lg:w-1/4 lg:pl-4 flex justify-center items-center lg:justify-end flex-1 mb-4 lg:mb-0">
          <div class="relative mypic-wrapper">
            <NuxtImg src="/mypic.jpg" alt="My Avatar" class="block w-auto rounded mypic" />
          </div>
        </div>
        <!-- <img src="https://avatars.githubusercontent.com/u/41994283?s=400&u=0e8f0bce9bc6b0edd4c43c329c8f04945d55baaa&v=4" alt="My Avatar" height="256px"> -->
      </div>
    </div>
    <div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4">
      <div class="page-section-header mb-4">
        <span>My Avatar</span>
      </div>
      <div class="flex flex-col-reverse lg:flex-row">
        <div class="flex-1 pr-6 col-md">
          <div>
            <p>
              The <span class="text-purple">avatars</span> that I use on almost a lot of social media, are taken from some anime characters that I like.
              In the form of <span class="text-primary">Shiroe</span> (Log Horizon), <span class="text-primary">Killua</span> (Hunter x Hunter),
              and <span class="text-primary">Kirito</span> (Sword Art online).
            </p>
          </div>
        </div>
        <div class="w-full lg:w-1/4 col-md-4 col-md page-section-about-canvas-wrapper h-50 flex justify-center lg:justify-end lg:pl-4 mb-4 lg:mb-0">
          <canvas id="page-section-about-canvas"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>
