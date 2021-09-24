<template>
  <button class="btn" @click.prevent="clicked">
    {{ text }}
  </button>
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: ''
    },
    to: {
      type: Object,
      default: undefined
    }
  },
  setup(props) {
    const { redirect } = useContext()
    const clicked = () => {
      if (props.to) {
        redirect(props.to)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.btn {
  background: #ff7b56;
  color: theme('colors.gray.100');
  padding: 10px 20px;
  transition: all 2s;
  box-shadow: 1px 1px 0px 0px theme('colors.gray.200');

  &:hover {
    box-shadow: 5px 5px 0px 0px theme('colors.gray.100');
  }
}
</style>
