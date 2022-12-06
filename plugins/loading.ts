import { useLoading } from "~~/stores/loading"

export default defineNuxtPlugin((n) => {
  n.hook('page:start', async () => {
    useLoading().isLoading.value = true
  })
  n.hook('page:finish', () => {
    useLoading().isLoading.value = false
  })
})
