<template>
  <div class="screen max-h-screen max-w-screen h-screen w-screen flex flex-col">
    <div class="bg">
      <div></div>
      <div></div>
    </div>
    <div class="navbar">
      <div class="flex justify-between">
        <div class="font-semibold text-lg text-gray-50">
          VIANDWI24
        </div>
        <div class="navbar-menu flex-1 hidden md:flex space-x-8 justify-end">
          <NuxtLink tag="a" class="item" to="/a">About</NuxtLink>
          <div class="item">Experience</div>
          <div class="item">Blog</div>
          <div class="item">Github</div>
        </div>
      </div>
    </div>
    <div class="hero flex-1 max-h-full w-full flex flex-col justify-center md:justify-between md:flex-row relative overflow-hidden">
      <div class="w-full md:w-1/2 flex flex-col justify-center">
        <div class="content">
          <h1 class="title font-semibold mb-4 text-gray-50">
            <span>ALFIAN DWI</span>
            <span>NUGRAHA</span>
          </h1>
          <div class="description-header mb-2 font-semibold italic text-gray-200">// ABOUT ME</div>
          <div class="description text-gray-200">
            I am a student at "State University of Surabaya" as an Informatics Engineering.
            19 years old, a web developer and mobile flutter developer and a Blockchain Enthusiast.
          </div>
        </div>
      </div>
      <div class="hidden md:w-1/2 md:flex flex-col justify-end">
        <div class="flex justify-center">
          <img src="/images/me.png" alt="Me">
        </div>
      </div>
      <div
        class="
          hireme hidden md:flex flex-col text-center justify-center text-xl font-bold h-32 w-32 rounded-full text-secondary bg-gray-100
          transition-all duration-500 ease-in-out cursor-pointer
          hover:shadow-xl hover:scale-105
        "
        style="left: 100vw;"
      >
        HIRE ME!
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { startAnimation } = useAnimation()

    onMounted(() => startAnimation())
  }
})

function useAnimation() {
  const { $gsap, $sleep } = useContext()

  const hiremeBreath = () => {
    const tl = $gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
    })
    tl.to('.hireme', {
      scale: 1.5,
      opacity: 1,
      repeat: 1,
      yoyo: true
    })
  }

  const startAnimation = () => {
    const tl = $gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' }
    })

    tl.to('.hireme', {
      left: '50%',
      top: '50%',
      opacity: 1,
      rotation: -30,
      ease: 'power1.out',
      onComplete: async () => {
        await $sleep(500)
        tl.to('.hireme', {
          rotation: 15,
          left: '50%',
          opacity: 1,
          ease: 'power2.out',
        })
        hiremeBreath()
      }
    })
  }

  return {
    startAnimation
  }
}
</script>

<style lang="scss">
$paddingContainerSm: 0.6rem;
$paddingContainerMd: 5rem;

.screen {
  width: 100vw;
  height: 100vh;

  & > .bg {
    z-index: -1;
    width: 100vw;
    height: 100vh;
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-direction: row;

    & > div {
      width: 100vw;
      height: 100vh;
    }
    & > div:nth-child(1) {
      background: #FF8F73;
    }
    & > div:nth-child(2) {
      background: #FF734E;
      display: none;
    }
  }

  & > .navbar {
    z-index: 2;
    padding: $paddingContainerSm;

    .navbar-menu {
      & > .item {
        font-size: 1.125rem/* 18px */;
        line-height: 1.75rem/* 28px */;
        color: #FFF;
      }
    }
  }

  & > .hero {
    & > div:nth-child(1) {
      padding-left: $paddingContainerSm;
      .content {
        .title {
          span {
            text-shadow: 4px 4px #FF734E;
            display: inline-block;
            width: 100%;
            line-height: 0.9;
            text-align: center;
            &:nth-child(1) {
              font-size: 3rem;
            }
            &:nth-child(2) {
              font-size: 3.5rem;
            }

            @screen md {
              text-align: left;
              &:nth-child(1) {
                font-size: 6rem;
              }
              &:nth-child(2) {
                font-size: 7rem;
              }
            }
          }
        }
        .description-header {
          text-align: center;
        }
        .description {
          max-width: 550px;
          text-align: center;
        }
      }
    }
    & > div:nth-child(2) {
      &  > div > img {
        width: auto;
        height: 110vh;
        transform: translateY(30%);
      }
    }
    & > .hireme {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
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
      & > div:nth-child(2) {
        display: block;
      }
    }
    & > .hero {
      & > div:nth-child(1) {
        padding-left: $paddingContainerMd;
        & > .content {
          & > .description-header {
            text-align: left;
          }
          & > .description {
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
