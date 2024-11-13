import { upperFirst } from 'lodash-es'
import Layout from '@/layout/index.vue'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'

export class RouterHelper {
  /**
   * 根据菜单数据生成对应的路由元信息
   * @param {MenuEntity} route 后端返回的原始菜单数据
   */
  static generateMeta(route: MenuEntity): RouteMeta {
    const meta = {} as RouteMeta
    meta.title = route.title
    meta.icon = route.icon
    // meta.affix = route.affix === 1
    meta.hidden = route.visible === 0
    // meta.breadcrumb = route.breadcrumb === 1
    meta.alwaysShow = route.type === 'M'
    return meta
  }

  /**
   * 初始化动态路由（用于生成扁平化一级路由，将后端一级路由数据转化为前端 router 格式的一级路由）
   * @param {Array<MenuEntity>} menus 后端返回的菜单组
   */
  static generateFlattenRoutes(menus: MenuEntity[]): RouteRecordRaw[] {
    // 首先把你需要动态路由的组件地址全部获取（vue2 中可以直接用拼接的方式，但是 vue3 中必须用这种方式）
    const views = import.meta.glob('@/views/**/*.vue')
    // 过滤菜单 F 是按钮权限 不参与菜单显示
    menus = menus.filter((item) => ['M', 'C'].includes(item.type))
    const routes: RouteRecordRaw[] = []
    for (const item of menus) {
      const route = {} as RouteRecordRaw
      route.path = item.path
      route.name = upperFirst(item.path.replaceAll('/', ''))
      route.component = item.component ? views[`/src/views/${item.component}.vue`] : Layout
      route.meta = this.generateMeta(item)
    }
    return routes
  }

  /**
   * 递归函数用于生成路由配置，登录的时候也需要调用一次
   * @param {Array<MenuEntity>} menus 后端返回的菜单组
   */
  static generateRoutes(menus: MenuEntity[], parentId: string = '0') {
    menus = menus.filter((item) => ['M', 'C'].includes(item.type))
    const views = import.meta.glob('@/views/**/*.vue')
    const routeList: RouteRecordRaw[] = []
    for (const item of menus) {
      if (item.parentId === parentId) {
        const route = {} as RouteRecordRaw
        // 处理路由基础数据
        route.path = item.path
        route.name = upperFirst(item.path.replaceAll('/', ''))
        route.component = item.component ? views[`/src/views/${item.component}.vue`] : Layout
        // 处理路由元信息
        route.meta = this.generateMeta(item)
        // 递归处理子节点
        const children = this.generateRoutes(menus, item.id)
        if (children.length > 0) route.children = children
        routeList.push(route)
      }
    }
    return routeList
  }
}
