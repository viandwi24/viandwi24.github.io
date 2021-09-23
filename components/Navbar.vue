<template>
  <div class="navbar">
    <div class="flex justify-between">
      <div class="font-semibold text-lg text-gray-50">
        VIANDWI24
      </div>
      <div class="navbar-menu flex-1 hidden md:flex space-x-8 justify-end">
        <template v-for="(item, i) in menu">
          <NuxtLink v-if="typeof item.to === 'object'" tag="a" :key="i" class="item" :class="{ 'active': routeCheckActive(item) }" :to="item.to">{{ item.text }}</NuxtLink>
          <a v-else :key="i" class="item" :href="item.to">{{ item.text }}</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, useContext, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { menu, routeCheckActive } = useNavbar()

    return {
      menu,
      routeCheckActive,
    }
  }
})

function useNavbar() {
  const { route, $gsap, $sleep } = useContext()

  //
  const routeCheckActive = (item) => {
    return (item.to.name === route.value.name)
  }
  const menu = [
    { text: 'About Me', to: {name: 'index'} },
    { text: 'Experience', to: {name: 'experience'} },
    { text: 'Projects', to: {name: 'projects'} },
    { text: 'Projects', to: 'https://viandwi24.medium.com' },
    { text: 'Github', to: 'https://github.com/viandwi24' }
  ]

  //
  const oldRoute = route
  watch(route, (val) => {
    if (val.path === oldRoute.path) {
      oldRoute = val
      return
    }
    $gsap.to('.navbar', {
      y: -50,
      duration: 1,
      opacity: 0,
      ease: 'power2.out',
      onComplete: async () => {
        await $sleep(1000)
        animate()
      }
    })
  })

  //
  const animate = async () => {
    document.querySelector('.navbar').style.opacity = 0
    await $sleep(100)
    $gsap.fromTo('.navbar', {
      y: -50,
      opacity: 0,
    },{
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
  }

  //
  onMounted(() => animate())

  return {
    menu,
    routeCheckActive
  }
}
</script>

