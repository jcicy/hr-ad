import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// 创建axios实例
// 配置基地址&&超时时间
// 配置请求拦截器&&响应拦截器
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})
// 添加请求拦截器
// 作用: 统一携带token
instance.interceptors.request.use(function(config) {
  const token = store.getters.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
  // console.log('响应拦截器', response)
  // 判断: 针对于blob数据类型
  // instanceof 判断一个实例是否属于某个类型
  if (response.data instanceof Blob) return response.data
  const { success, data, message } = response.data
  if (success) {
    // 请求成功&&业务成功
    return data
  } else {
    // 请求成功&&业务失败
    // 提示用户&&返回错误的promise (控制台查看 - 方便调试)
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, async function(error) {
  // 4x  / 5x
  // 提示用户&&返回错误的promise (控制台查看 - 方便调
  if (error.response) {
    if (error.response.status === 401) {
      // 提示用户
      Message.error('token失效, 请重新登录')
      // 删除token&&用户信息
      await store.dispatch('user/logout')
      // 跳转到登录页
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
})
export default instance
