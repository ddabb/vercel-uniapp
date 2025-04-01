import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import uni from '@dcloudio/uni-app' // 引入 uni 库

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 移除重复的 uni 导入，使用上面已经导入的 uni

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif