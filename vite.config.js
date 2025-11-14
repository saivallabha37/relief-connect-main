import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_PDF_WORKER_URL': JSON.stringify('/pdf.worker.min.js')
  }
})
