import Vue from 'vue'
// 引如饿了么
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from '@/router'// 引入router
import axios from '@/api'// 引入axios
/* 依赖字体图标css */
import './assets/fonts/iconfont.css'
/* 依赖全局样式文件 */
import './assets/css/global.css'
// 挂载自定义插件
import plugin from '@/components'
Vue.use(plugin)// 全局使用
Vue.use(ElementUI)// 全局使用
Vue.config.productionTip = false
Vue.prototype.$http = axios// 把axios挂载到vue上
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
