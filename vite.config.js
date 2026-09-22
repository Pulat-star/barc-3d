import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages at /barc-3d/ — override with BASE_PATH when needed.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/barc-3d/',
  plugins: [react()],
  build: { assetsInlineLimit: 0 }
})
