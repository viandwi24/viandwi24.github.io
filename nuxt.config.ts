// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Alfian Dwi Nugraha (viandwi24)',
      titleTemplate: '%s - Alfian Dwi Nugraha (viandwi24)',
      // portfolio website meta
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Alfian Dwi Nugraha (viandwi24) Portfolio Website' },
        { hid: 'og:title', property: 'og:title', content: 'Alfian Dwi Nugraha (viandwi24)' },
        { hid: 'og:description', property: 'og:description', content: 'Alfian Dwi Nugraha (viandwi24) Portfolio Website' },
      ]
    }
  },

  css: [
    '~/assets/scss/main.scss'
  ],

  plugins: [
    '~/plugins/loading.ts',
    // '~/plugins/bs.client.ts'
  ],

  modules: [
    'nuxt-windicss',
    'nuxt-headlessui'
  ],

  ssr: false,

  headlessui: {
    prefix: 'Headless',
  },
})
