import { defineConfig } from 'vite';

export default defineConfig({
  base: '/keymapgen/',
  build: {
    outDir: 'dist',
    target: 'es2020'
  },
  server: {
    port: 3000
  }
});