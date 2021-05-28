// 导出一个本地操作用户信息的模块（设置用户，获取用户，清除用户）
const KEY = 'pyg-admin-vue-key'
const local = {
  setUser (user) {
    // 保存数据到 sessionStorage
    // 存储 setItem(key,value) key将来获取时候需要使用  value json字符串格式
    const jsonStr = JSON.stringify(user)
    window.sessionStorage.setItem(KEY, jsonStr)
  },
  getUser () {
    // 从 sessionStorage 获取数据
    const jsonStr = window.sessionStorage.getItem(KEY)
    return JSON.parse(jsonStr)
  },
  derUser () {
    // clear() 清除所有的数据  不建议使用
    // setItem(KEY,'') 删除除
    // 从 sessionStorage 删除保存的数据
    window.sessionStorage.removeItem(KEY)
  }
}

export default local
