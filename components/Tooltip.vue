<template>
  <a
    ref="tooltip"
    href="#"
    class="
      border-gray-300 pb-0.5
      transition-all duration-200
      hover:border-gray-100 hover:border-b hover:font-semibold hover:text-gray-100
    "
    @click.prevent="click"
  >
    <slot>
      {{ text }}
    </slot>
  </a>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Shepherd from 'shepherd.js'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: ''
    },
    tooltipTitle: {
      type: String,
      default: ''
    },
    tooltipText: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const tooltip = ref(null)

    //
    const click = () => {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'shepherd-theme-square',
          scrollTo: { behavior: 'smooth', block: 'center' },
          popperOptions: {
            modifiers: [{ name: 'offset', options: { offset: [0, 32] } }]
          }
        }
      })
      tour.addStep({
        title: props.tooltipTitle,
        text: props.tooltipText,
        // attachTo: {
        //   element: tooltip.value,
        //   on: 'right'
        // },
        // buttons: [
        //   {
        //     text: 'Ok',
        //     classes: 'shepherd-button-secondary',
        //     action: tour.hide
        //   }
        // ]
      })
      tour.start()
    }

    return {
      tooltip,
      click
    }
  }
})
</script>
