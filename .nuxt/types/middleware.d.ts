import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "/home/viandwi24/Project/Dev/viandwi24.github.io/node_modules/.pnpm/nuxt@3.0.0_sass@1.56.1/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}