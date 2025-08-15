import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vite.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        example1_1: resolve(root, 'part1/example1/index.html'),
        example1_2: resolve(root, 'part1/example2/index.html'),
        objects: resolve(root, 'part1/objects/index.html'),
        // unicafe: resolve(root, 'part1/unicafe/index.html'),
        // anecdotes: resolve(root, 'part1/anecdotes/index.html'),
      },
    },
  },
})
