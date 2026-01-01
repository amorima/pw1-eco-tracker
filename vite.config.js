import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/chatbot': {
        target: 'https://api.iaedu.pt',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/chatbot/,
            '/agent-chat/api/v1/agent/cmamvd3n40000c801qeacoad2/stream',
          ),
        secure: false,
      },
    },
  },
})
