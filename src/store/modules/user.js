import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'
const state = {
  token: getToken() || '',
  userInfo: {},
  routes: constantRoutes
}
const mutations = {
  setToken(state, token) {
    // 存储到仓库
    state.token = token
    // 存储到本地local / cookie
    setToken(token)
  },
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  async login(context, payload) {
    // 1. 发送请求
    const token = await login(payload)
    // 2. 拿token - 进行存储
    // 3. 提交mutation  token
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const data = await getUserInfo()
    context.commit('setUserInfo', data)
    return data
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
    // 重置路由
    resetRouter()
  }

}
const getters = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
