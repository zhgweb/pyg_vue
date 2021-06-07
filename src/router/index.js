import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import NotFound from '@/views/404'
import local from '@/utils/local'
import Welcome from '@/views/welcome'
import Users from '@/views/users'
import Roles from '@/views/auth/roles'
import Rights from '@/views/auth/rights'
import Goods from '@/views/goods/goods'
import GoodsAdd from '@/views/goods/add'
import Params from '@/views/goods/params'
import Categories from '@/views/goods/categories'
import Orders from '@/views/orders'
import Reports from '@/views/reports'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    // 登录
    { path: '/login', name: 'login', component: Login },
    {
      // 首页
      path: '/',
      component: Home,
      children: [
        // 欢迎页面
        {
          path: '/',
          name: '/',
          component: Welcome
        },
        // 用户管理-用户列表
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        // 权限管理-角色列表
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        // 权限管理-权限列表
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        // 商品管理-商品列表
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        // 商品管理-商品列表-添加商品
        {
          path: '/goods/Add',
          name: 'goodsAdd',
          component: GoodsAdd
        },
        // 商品管理-分类参数
        {
          path: '/params',
          name: 'params',
          component: Params
        },
        // 商品管理-商品分类
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        // 订单管理-订单列表
        {
          path: '/orders',
          name: 'orders',
          component: Orders
        },
        // 数据统计-数据报表
        {
          path: '/reports',
          name: 'reports',
          component: Reports
        }
      ]
    },
    // 404页面
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
