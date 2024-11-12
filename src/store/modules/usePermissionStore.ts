import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router/constants-routes'
import { loadView, filterDynamicRoutes } from '@/router/router-helper'
import { LoginService } from '@/api'

export default defineStore('permission', () => {
  const routes = shallowRef<RouteRecordRaw[]>([]) // 静态路由 + 筛选后的动态路由
  const dynamicRoutes = shallowRef<RouteRecordRaw[]>([]) // 筛选后有权限访问的路由

  /** 处理静态、动态、后端路由表 */
  async function generateRoutes(roles: string[]) {
    try {
      const data = await LoginService.getRoutes()
      const backRouteList = loadView(data)
      dynamicRoutes.value = filterDynamicRoutes(backRouteList, roles)
      routes.value = [...constantRoutes, ...dynamicRoutes.value]
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { routes, dynamicRoutes, generateRoutes }
})
