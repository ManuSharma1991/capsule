import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or @vitejs/plugin-react

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Your frontend dev port
    proxy: {
      // Proxy /api requests to your backend server
      '/api': {
        target: 'http://localhost:10000', // Your backend server address
        changeOrigin: true, // Recommended for most cases
        // secure: false, // If your backend is not HTTPS and you have issues
        // rewrite: (path) => path.replace(/^\/api/, '') // Optional: if backend doesn't expect /api prefix
      },
    },
  },
})