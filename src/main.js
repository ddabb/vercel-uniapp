// 确保这是 Vue 3 的入口文件
import { createSSRApp } from 'vue'
import App from './App.vue'

// 创建应用实例
const app = createSSRApp(App)

// 适配 H5 平台
// #ifndef H5
app.mount('#app')
// #endif

// 适配其他平台 (小程序等)
// #ifdef H5
export function createApp() {
  return {
    app
  }
}
// #endif