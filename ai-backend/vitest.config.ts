import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        statements: 65,
        branches: 40,
        functions: 65,
        lines: 65,
      },
    },
  },
})