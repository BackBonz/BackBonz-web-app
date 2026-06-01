import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from the root of the custom domain https://backbonz.app/ on GitHub Pages.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
