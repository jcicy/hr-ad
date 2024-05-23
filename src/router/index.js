import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

import department from './modules/department'
import role from './modules/role'
import employee from './modules/employee'
import permission from './modules/permission'
import attendance from './modules/attendance'
import approval from './modules/approval'
import salary from './modules/salary'
import social from './modules/social'

// 静态路由 - 不需要任何权限就可以访问 (首页 / 登录页 / 404)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
  // department,
  // role,
  // employee,
  // permission,
  // attendance,
  // approval,
  // salary,
  // social,
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true },
]

// 动态路由 - 需要权限才可以访问 (取决于角色)
export const asyncRoutes = [
  department,
  role,
  employee,
  permission,
  attendance,
  approval,
  salary,
  social
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
