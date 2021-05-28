import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import NotFound from '@/views/404'
import local from '@/utils/local'
import Welcome from '@/views/welcome'
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
          component: Welcome
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (!user && to.path !== '/login') return next('/login')
  next()
})
export default router
