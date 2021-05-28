import axios from 'axios'// 引入axios
import local from '@/utils/local'// 引入axios
import router from '@/router'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置请求头
// if (local.getUser()) {
//   console.log(local.getUser())
//   axios.defaults.headers.common.Authorization = local.getUser()
// }
// 添加请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = local.getUser() || {}
  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(res => {
  if (res.data.meta.status === 401) { return router.push('/login') } else {
    return res
  }
}, error => {
  return Promise.reject(error)
})
export default axios
