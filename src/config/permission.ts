import router from '@/router'
import { isExternal } from '@/utils/validate'
import { isWhiteList } from '@/config' // 路由是否在白名单的判断判断方法
import { getAccessToken } from '@/utils/cache' // 从缓存读取 Token 的方法
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const { VITE_ROUTER_NPROGRESS } = useEnv()
const NProgress = useNProgress({ show: VITE_ROUTER_NPROGRESS }) // 顶部进度条

/**
 * 路由全局前置守卫
 */
export async function globalRouterBeforeGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  NProgress.start()
  const hasToken = getAccessToken()
  const userStore = useUserStore()

  /** 如果没有 Token，但在免登录的白名单中，则直接进入；否则将被重定向到登录页面 */
  if (!hasToken) return isWhiteList(to) ? next() : next(`/login?redirect=${to.fullPath}`)

  /** 如果已经登录，并准备进入 Login 页面，则重定向到主页 */
  if (to.path.toLowerCase() === '/login') return next({ path: '/', replace: true })

  try {
    /** 如果用户已经获得其权限角色 直接放行 */
    if (userStore.roles.length !== 0) return next()
    /** 否则要重新获取权限角色 判断当前用户是否已拉取完 user_info 信息 */
    await userStore.getInfo()
    /** 将'有访问权限的动态路由' 添加到 Router 中 */
    userStore.dynamicRoutes.forEach((route) => !isExternal(route.path) && router.addRoute(route))
    /** 确保添加路由已完成 设置 replace: true, 因此导航将不会留下历史记录 */
    next({ ...to, replace: true })
  } catch (error: any) {
    /** 过程中发生任何错误，都直接重置 Token，并重定向到登录页面 */
    // useModal().msgError(error, { duration: 0 })
    await userStore.logout()
    next(`/login?redirect=${to.fullPath}`)
  }
}

/**
 * 路由全局后置守卫
 */
export async function globalRouterAfterGuard(to: RouteLocationNormalized) {
  NProgress.done()
}
