import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.test.*'],
    exclude: ['e2e/**'],
    setupFiles: './test/setup.ts',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})
