import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: process.env.BASE_URL,
  esbuild: {
    keepNames: true  // Prevent renaming of inner functions https://github.com/vitejs/vite/issues/11136
  }
})
