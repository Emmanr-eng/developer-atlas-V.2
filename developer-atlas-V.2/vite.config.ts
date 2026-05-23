import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/developer-atlas-V.2/',
  plugins: [
    react()
  ],
})
