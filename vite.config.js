import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      SECURE_LOCAL_STORAGE_HASH_KEY: JSON.stringify(process.env.SECURE_LOCAL_STORAGE_HASH_KEY),
      SECURE_LOCAL_STORAGE_PREFIX: JSON.stringify(process.env.SECURE_LOCAL_STORAGE_PREFIX),
    },
  }
})
