<template>
  <div class="bg-secondary">
    <div v-if="showParent" class="screen max-h-screen max-w-screen h-screen w-screen flex flex-col">
      <div class="bg-container">
        <div class="bg flex flex-col md:flex-row">
          <div class="w-full md:w-1/2 bg-primary"></div>
          <div class="hidden md:block w-full md:w-1/2 bg-secondary"></div>
        </div>
      </div>
      <template v-if="showChid">
        <Navbar />
        <Nuxt v-if="showNuxt" />
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(_props, { root }) {
    const showParent = ref(false)
    const showChid = ref(false)
    const showNuxt = ref(false)

    //
    const { animate } = useBackgroundAnimation({ showParent, showChid, showNuxt })

    onMounted(() => {
      setTimeout(() => {
        animate()
      }, 100)
    })

    return {
      showParent,
      showChid,
      showNuxt
    }
  }
})

function useBackgroundAnimation({ showParent, showChid, showNuxt }) {
  const { $gsap, $sleep, route } = useContext()
  const tl = $gsap.timeline({})

  watch(route, () => {
    showNuxt.value = false
    tl.pause()
    if (route.value.name === 'index') {
      if (document.querySelector('.bg .bg-primary').style.width !== '0%') {
        tl.fromTo(
          '.bg .bg-primary',
          {
            width: '100%',
          },
          {
            width: '0%',
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          }
        )
      }
      tl.fromTo(
        '.bg',
        {
          left: '0%',
          opacity: 1,
        },
        {
          left: '100%',
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            document.querySelector('.bg-primary').style.width = '100%'
            animate()
          }
        }
      )
    } else {
      animate()
    }
    tl.resume()
  })

  const transitionIndex = () => {
    tl.fromTo(
      '.bg',
      {
        left: '100%',
      },
      {
        left: '0%',
        opacity: 1,
        duration: 1,
      }
    )
    tl.fromTo(
      '.bg .bg-secondary',
      {
        width: '0%',
      },
      {
        width: '100%',
        duration: 1,
        onComplete: async () => {
          await $sleep(100)
          showNuxt.value = true
        }
      }
    )
  }

  const animate = async () => {
    showParent.value = true
    showChid.value = true
    await $sleep(100)
    if (route.value.name === 'index') {
      transitionIndex()
    } else {
      // document.querySelector('.bg-primary').style.width = '0%'
      tl.fromTo(
        '.bg .bg-primary',
        {
          width: '100%',
        },
        {
          width: '0%',
          opacity: 1,
          duration: 1,
        }
      )
      tl.fromTo(
        '.bg',
        {
          left: '0%',
          opacity: 1,
        },
        {
          left: '100%',
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            showNuxt.value = true
          }
        }
      )
    }
  }

  return {
    animate
  }
}
</script>

<style lang="scss">
.show-enter-active,
.show-leave-enter {
  transform: translateX(0);
  transition: all .3s linear;
}
.show-enter,
.show-leave-to {
  transform: translateX(100%);
}

$paddingContainerSm: 0.6rem;
$paddingContainerMd: 5rem;

.screen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  & > .navbar {
    z-index: 2;
    padding: $paddingContainerSm;

    .navbar-menu {
      & > .item {
        @apply transition-all duration-500 ease-in-out;
        font-size: 1.125rem/* 18px */;
        line-height: 1.75rem/* 28px */;
        color: theme('colors.gray.200');

        &:hover {
          color: theme('colors.gray.50');
        }

        &.active {
          color: theme('colors.gray.50');
          font-weight: 700;
        }
      }
    }
  }

  & > .bg-container {
    z-index: 1;
    overflow: hidden;
    position: absolute;
    & > .bg {
      width: 100vw;
      height: 100vh;
      position: relative;

      & > div {
        width: 100vw;
        height: 100vh;
      }
    }
  }

  & > .page {
    z-index: 2;
  }
}

@screen md {
  .screen {
    & > .navbar {
      padding-left: $paddingContainerMd;
      padding-right: $paddingContainerMd;
      padding-top: 1rem;
    }
    & > .bg {
    }
  }
}
</style>
