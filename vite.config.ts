import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { seo } from './seo.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), seo()],
})
