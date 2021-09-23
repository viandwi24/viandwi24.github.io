<template>
  <div class="page hero flex-1 max-h-full w-full flex flex-col justify-center md:justify-between md:flex-row relative overflow-hidden pb-10" style="opacity: 0;">
    <div class="w-full md:w-1/2 flex flex-col justify-center">
      <div class="content">
        <h1 class="title font-semibold mb-4 text-gray-50">
          <span>ALFIAN DWI</span>
          <span>NUGRAHA</span>
        </h1>
        <div class="description-header mb-2 font-semibold italic text-gray-200">// ABOUT ME</div>
        <div class="description mb-4 text-gray-200">
          I am a student at "State University of Surabaya" as an Informatics Engineering.
          19 years old, a web developer and mobile flutter developer and a Blockchain Enthusiast.
        </div>
        <div class="action">
          <Button text="My Projects" class="mr-2" />
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
      style="left: 110vw;"
    >
      HIRE ME!
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { startAnimation } = useAnimation()

    onMounted(() => {
      setTimeout(() => startAnimation(), 100)
    })
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
      rotation: 30,
      opacity: 1,
      repeat: 1,
      yoyo: true
    })
  }

  const startAnimation = () => {
    const tl = $gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' }
    })

    tl.fromTo(
      '.hero',
      {
        opacity: 0,
        x: 30
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.inOut',
      }
    )

    tl.from(
      '.hero .title',
      {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.out',
      },
    )

    tl.from(
      '.hero .description-header',
      {
        opacity: 0,
        x: 20,
        duration: 0.5,
        ease: 'power2.out',
      }
    )

    tl.from(
      '.hero .description',
      {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      }
    )

    tl.from(
      '.hero .action',
      {
        opacity: 0,
        x: 20,
        duration: 0.5,
        ease: 'power2.out',
      }
    )

    tl.fromTo('.hireme',
      {
        rotation: -30,
        left: '120%',
      },
      {
        rotation: 30,
        left: '50%',
        duration: 1,
        ease: 'power3.out',
        onComplete: async () => {
          tl.to('.hireme', {
            rotation: 15,
            left: '50%',
            opacity: 1,
            ease: 'power2.out',
          })
          hiremeBreath()
        }
      }
    )
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
      z-index: 20;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@screen md {
  .screen {
    & > .hero {
      & > div:nth-child(1) {
        padding-left: $paddingContainerMd;
        & > .content {
          & > .title {
            span {
              text-align: left;
              &:nth-child(1) {
                font-size: 4rem;
              }
              &:nth-child(2) {
                font-size: 5rem;
              }
            }
          }
          & > .description-header {
            text-align: left;
          }
          & > .description {
            text-align: left;
            max-width: 450px;
          }
        }
      }
    }
  }
}


@screen 2xl {
  .screen {
    & > .hero {
      & > div:nth-child(1) {
        padding-left: $paddingContainerMd;
        & > .content {
          & > .title {
            span {
              text-align: left;
              &:nth-child(1) {
                font-size: 6.1rem;
              }
              &:nth-child(2) {
                font-size: 7rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
