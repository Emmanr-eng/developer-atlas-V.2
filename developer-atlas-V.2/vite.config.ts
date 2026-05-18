import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/developer-atlas-V.2/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
