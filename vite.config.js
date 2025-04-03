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
    uni()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src').replace(/\\/g, '/') // 转换为正斜杠
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
    target: 'esnext', // 修改为更兼容的版本
    assetsInlineLimit: 4096}
    // ,lib: { name: 'main', entry: 'src/main.js', formats: ['es']  }}
})