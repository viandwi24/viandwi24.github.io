// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  
  css: ["~/assets/sass/main.scss"],

  modules: [
    "@nuxtjs/sitemap",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "nuxt-icon",
    "@pinia/nuxt",
  ],

  site: {
    url: "https://viandwi24.com",
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    }
  }
})