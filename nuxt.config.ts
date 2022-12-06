// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    '~/assets/scss/index.scss'
  ],

  plugins: [
    '~/plugins/loading.ts',
    '~/plugins/bs.client.ts'
  ],

  ssr: false,
})
