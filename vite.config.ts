import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: process.env.BASE_URL,
  esbuild: {
    keepNames: true  // Don't rename inner functions, e.g. client.moves.*
  }
})
