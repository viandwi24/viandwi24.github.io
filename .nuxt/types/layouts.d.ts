import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default"
declare module "/Users/viandwi24/projects/oss/viandwi24.github.io/node_modules/.pnpm/nuxt@3.5.2_@types+node@20.2.5_sass@1.62.1/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}