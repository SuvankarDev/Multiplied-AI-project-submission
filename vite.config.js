import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Any request starting with /api will be redirected
      '/api': {
        target: 'https://temp.aistoryteller.workers.dev',
        changeOrigin: true,
        secure: false,
        // Remove /api from the beginning of the path before sending to Cloudflare
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
