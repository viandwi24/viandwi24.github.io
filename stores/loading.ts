export const useLoading = defineStore('loading', {
  state: () => ({
    isLoading: true
  }),
  actions: {
    setLoading(isLoading: boolean) {
      // const indicator = useLoadingIndicator()
      // if (isLoading && !indicator.isLoading.value) indicator.start()
      // else if (!isLoading && indicator.isLoading.value) indicator.finish()
      this.isLoading = isLoading
    }
  }
})