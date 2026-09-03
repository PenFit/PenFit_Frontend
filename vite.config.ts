import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/v1/auth": {
        target: "https://penfit.duckdns.org",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
