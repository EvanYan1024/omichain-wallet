import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      nodePolyfills({
        exclude: [],
        globals: {
          Buffer: true,
          global: true,
          process: true
        },
        protocolImports: true
      })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
  },
  server: {
    port: 8000
  }
})
