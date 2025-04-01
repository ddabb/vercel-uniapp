import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// 根据平台动态设置 base
const base = process.env.UNI_PLATFORM === 'h5' ? '/' : './';

export default defineConfig({
    base: base,
    plugins: [
        nodePolyfills({
            include: ['path', 'fs', 'util', 'stream', 'constants', 'assert'],
            globals: { Buffer: true, process: true }
        }),
        uni()
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
        target: 'esnext', // 修改为更兼容的版本
        assetsInlineLimit: 4096,
        // 动态调整 lib 配置
        ...(process.env.UNI_PLATFORM !== 'h5' && {
            lib: {
                name: 'main',
                entry: 'src/main.js',
                formats: ['es']
            }
        })
    }
}
);