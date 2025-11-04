import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // :white_check_mark: Add this line
  server: {
    host: true,
    port: 3001,
    historyApiFallback: true,
  },
})