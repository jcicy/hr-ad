import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { asyncRoutes } from '@/router'
// 路由前置导航守卫 - 权限控制拦截
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  const token = store.getters.token
  // 有token
  if (token) {
    if (to.path === '/login') {
      // 一旦拦截处理next('/路径'), 路由的后置导航守卫不会执行
      NProgress.done() // 手动关闭进度条
      next('/')
    } else {
      // 判断是否获取过资料
      // if (store.state.user.userInfo.userId)
      if (!store.getters.userId) {
        // 获取到用户对应的权限 -
        // 筛选动态路由 -
        // 添加到当前路由表中..
        const { roles: { menus, points }} = await store.dispatch('user/getUserInfo')
        // menus -> 页面访问权限
        // points -> 页面按钮操作权限
        console.log('页面操作权', points)
        // console.log('页面访问权', menus) // ['role', 'xxx']
        const filterRoutes = asyncRoutes.filter(item => {
          return menus.includes(item.name)
        })
        // console.log(filterRoutes)
        store.commit('user/setRoutes', filterRoutes)
        // 将匹配到的动态路由信息 - 添加到路由表中
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 路由已知缺陷 - addRoutes添加完动态路由之后, 并不能立即拥有路由信息
        // 问题: 如何执行完addRoutes之后, 立马拥有当前的路由信息
        // 再次执行next(to.path) 即可解决
        next(to.path)
      }
      next()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      NProgress.done() // 手动关闭进度条
      next('/login')
    }
  }
})
// 路由后置导航守卫 - 进度条关闭
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

