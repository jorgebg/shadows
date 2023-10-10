import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), tsconfigPaths()],
  base: process.env.BASE_URL,
  esbuild: {
    keepNames: true, // Don't rename inner functions, e.g. client.moves.*
  },
});
