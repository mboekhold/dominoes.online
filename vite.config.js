import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // Use the appropriate environment variables based on the current mode
  const envFiles = {
    development: '.env.development',
    production: '.env.production'
  }
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true
    },
    define: {
      'process.env': Object.assign({}, env, {
        ...loadEnv(envFiles[mode], process.cwd())
      })
    }
  }
})
