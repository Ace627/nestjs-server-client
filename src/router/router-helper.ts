import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const views = import.meta.glob('../views/**/**.vue')

/** 将后端返回的路由视图转换为真正的路由表 */
export function loadView(routeList: RouteRecordRaw[]) {
  const asyncRoutes: RouteRecordRaw[] = []
  for (const route of routeList) {
    const tmpRoute = { ...route } // ES6 扩展运算符复制新对象
    tmpRoute.component = tmpRoute.component?.toString().toUpperCase() == 'LAYOUT' ? Layout : views[`../views/${tmpRoute.component}.vue`]
    if (tmpRoute.children) tmpRoute.children = loadView(tmpRoute.children)
    asyncRoutes.push(tmpRoute)
  }
  return asyncRoutes
}

/** 判断当前角色是否有权限访问此路由 */
export function hasPermission(roles: string[], route: RouteRecordRaw) {
  const hasRoles = route.meta && route.meta.roles
  if (!hasRoles) return true
  return roles.some((role) => (route.meta?.roles !== undefined ? route.meta.roles.includes(role) : false))
}

/** 筛选出当前角色组有权限访问的路由表 */
export function filterDynamicRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const list: RouteRecordRaw[] = []
  routes.forEach((route) => {
    let tmpRoute = { ...route }
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.children) tmpRoute.children = filterDynamicRoutes(tmpRoute.children, roles)
      list.push(tmpRoute)
    }
  })
  return list
}
