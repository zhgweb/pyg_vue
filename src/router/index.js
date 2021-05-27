import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    // 登录
    { path: '/login', component: Login },
    {
      // 首页
      path: '/',
      component: Home,
      children: [
        // 欢迎页面
        {
          path: '/',
          component: null
        }
      ]
    }
  ]
})
export default router
