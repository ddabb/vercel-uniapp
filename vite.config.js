import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['path', 'fs', 'util', 'stream', 'constants', 'assert'],
      globals: { Buffer: true, process: true }
    }),
    // 关键修改：在uni插件中强制设置output格式为es
    uni({
      outputFormat: 'es' // 设置uni插件输出格式为es
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.60score.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '^/[^/]+$': {
        target: 'http://localhost:5173',
        rewrite: (path) => `/public${path}`,
        changeOrigin: true
      }
    },
    static: {
      dirs: ['public']
    }
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        format: 'es', // 确保Vite的输出格式为es
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})