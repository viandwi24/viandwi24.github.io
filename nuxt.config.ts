// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  
  css: ["~/assets/sass/main.scss"],

  modules: [
    "@nuxtjs/sitemap",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "nuxt-headlessui",
    "nuxt-icon",
    "@pinia/nuxt",
  ],

  site: {
    url: "https://viandwi24.com",
  },

  vite: {
    optimizeDeps: {
      include: ["dayjs", "jsdom", "rss-parser"],
    },
  },

  runtimeConfig: {
    feed: {
      sources: {
        medium: {
          name: "Medium",
          url: "https://viandwi24.medium.com/feed",
          updateInterval: 1000 * 60 * 60 * 24, // 1 day
        },
      },
      active: ['medium', 'static']
    },
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    }
  }
})