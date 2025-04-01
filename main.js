import App from './App'
// 修改 uni 的导入方式
import * as uni from '@dcloudio/uni-app' // 使用命名空间导入

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$uni = uni // 添加到全局属性
  return {
    app
  }
}
// #endif