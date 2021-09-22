<template>
  <NuxtLink to="/">aweawE</NuxtLink>
</template>

<script>
import { defineComponent, onMounted, useContext } from "@nuxtjs/composition-api";

export default defineComponent({
  setup () {
    const { redirect } = useContext()
    onMounted(() => {
      setTimeout(() => redirect('/'), 500)
    })
  }
})
</script>
