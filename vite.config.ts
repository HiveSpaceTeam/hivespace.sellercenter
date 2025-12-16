import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue', 'vue-router', 'pinia'],
  },
  optimizeDeps: {
    exclude: ['@hivespace/shared'],
  },
  // Read port numbers from environment variables for flexibility.
  // Default dev server port is 5174 (Vite default). You can override by
  // setting PORT or VITE_DEV_PORT in your environment or .env file.
  server: {
    port: Number(process.env.VITE_DEV_PORT ?? process.env.PORT ?? 5174),
    watch: {
      ignored: ['!**/node_modules/@hivespace/shared/**'],
    },
  },
  // Preview (production preview) port can also be configured via
  // VITE_PREVIEW_PORT or PREVIEW_PORT env vars.
  preview: {
    port: Number(process.env.VITE_PREVIEW_PORT ?? process.env.PREVIEW_PORT ?? 5174),
  },
})
