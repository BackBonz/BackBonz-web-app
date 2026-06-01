import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from a GitHub Pages project sub-path in production
// (https://<user>.github.io/BackBonz-web-app/). Dev/preview stay at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/BackBonz-web-app/' : '/',
  plugins: [react(), tailwindcss()],
}))
