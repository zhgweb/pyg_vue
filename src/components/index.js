// 封装一个插件  注册所有的全局组件
import MyBread from '@/components/my-bread'
export default {
  install (Vue) {
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    // 基于Vue做任何事情（注册全局组件，指令，过滤器，挂载原型函数）
    Vue.component(MyBread.name, MyBread)
  }
}
