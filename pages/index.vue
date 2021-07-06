<template>
  <div class="screen">
    <div class="bg">
      <div class="purple"></div>
      <div class="medium-blue"></div>
      <div class="light-blue"></div>
      <div class="red"></div>
      <div class="orange"></div>
      <div class="yellow"></div>
      <div class="cyan"></div>
      <div class="light-green"></div>
      <div class="lime"></div>
      <div class="magenta"></div>
      <div class="lightish-red"></div>
      <div class="pink"></div>
    </div>
    <div class="name-card-container">
      <div class="name-card-wrapper">
        <div class="name-card">
          <div class="overlay">
            <svg width="400" height="230" viewBox="0 0 400 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0)">
                <circle cx="400" cy="43" r="20" fill="#6C95FF"/>
                <circle cx="378" cy="208" r="38" fill="#6C95FF"/>
                <circle cx="-10" cy="165" r="15" fill="#6C95FF"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="400" height="230" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="profile">
            <div class="avatar">
              <img src="https://avatars.githubusercontent.com/u/41994283?v=4" alt="Alfian Photo's">
            </div>
            <div class="details">
              <div class="name">ALFIAN DWI NUGRAHA</div>
              <div class="email">viandwicyber@gmail.com</div>
            </div>
          </div>
        </div>
        <!-- <div class="bottom-shadow"></div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { initCard, destroyCard } = useCard()

    // lifecylce
    onMounted(() => {
      initCard()
    })
    onBeforeUnmount(() => {
      destroyCard()
    })

    return {}
  },
})

function useCard() {
  // vars
  let cardEl: HTMLElement | null
  const property = reactive({
    perspective: 1000,
    rotateX: 0,
    rotateY: 0,
    scaleX: 1,
    scaleY: 1,
  })
  // lifecylce
  const init = () => {
    cardEl = document.querySelector('.name-card')
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onWindowResize)
  }
  const destroy = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onWindowResize)
  }

  // on listen
  const onMouseMove = function (e: { clientY: number; clientX: number }) {
    if (cardEl) {
      const { x, y, width, height } = cardEl.getBoundingClientRect()
      const centerPoint = { x: x + width / 2, y: y + height / 2 }
      property.rotateX = (e.clientY - centerPoint.y) * 0.01
      property.rotateY = (e.clientX - centerPoint.x) * -0.008
      changeStyle()
    }
  }
  const onWindowResize = () => {
    if (cardEl) {
      const clientH = (window.innerHeight * 1) / 934
      const clientW = (window.innerHeight * 1) / 934
      // property.scaleX = clientW
      // property.scaleY = clientH
      changeStyle()
    }
  }

  const changeStyle = () => {
    if (cardEl) {
      const tf = `perspective(${property.perspective}px) rotateX(${property.rotateX}deg) rotateY(${property.rotateY}deg) `
      cardEl.style.transform = tf
    }
  }

  return {
    initCard: init,
    destroyCard: destroy,
  }
}
</script>
