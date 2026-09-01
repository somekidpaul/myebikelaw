import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    // .tsx included so components can be asserted on as RENDERED TEXT via
    // renderToStaticMarkup. The engine tests cannot see copy defects: the
    // "the your county's director of finance" and "Accepted: basic-drivers"
    // bugs both shipped with a fully green suite.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
