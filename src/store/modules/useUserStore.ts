import { LoginService } from '@/api/system/login.service'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router/constants-routes'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/cache'
import { RouterHelper } from '@/common/helper/route-helper'

/** 第一个参数是该 store 的唯一 id */
export default defineStore('user', () => {
  /** 静态路由 + 筛选后的动态路由 */
  const routes = shallowRef<RouteRecordRaw[]>([])
  /** 筛选后有权限访问的路由 */
  const dynamicRoutes = shallowRef<RouteRecordRaw[]>([])
  /** 用户角色编码组 ["admin", "common"] */
  const roles = ref<string[]>([])
  /** 用户权限编码组 ["system:user:create", "system:role:create"] */
  const permissions = ref<string[]>([])
  /** 用户基本信息 */
  const userInfo = ref({} as UserEntity)
  /** 用户访问服务资源的唯一凭证 */
  const token = ref<string | null>(getAccessToken())
  /** 用户头像 默认值 src/assets/images/default/default-avatar.gif */
  const avatar = ref<string>(new URL('../../assets/images/default/default-avatar.gif', import.meta.url).href)

  /** 登录 */
  async function login(loginParams: LoginUserDto) {
    const data = await LoginService.login(loginParams)
    setAccessToken(data.accessToken)
    token.value = getAccessToken()
  }

  /** 登出 */
  async function logout() {
    await LoginService.logout() // 必须在前 不然会导致 Redis 无法清空对应的缓存 Token
    removeAccessToken()
    token.value = getAccessToken()
  }

  /** 获取个人权限信息 */
  async function getInfo() {
    try {
      const data = await LoginService.getInfo()
      userInfo.value = data.userInfo
      permissions.value = data.permissions
      roles.value = data.roles
      dynamicRoutes.value = RouterHelper.generateRoutes(data.menus)
      routes.value = constantRoutes.concat(dynamicRoutes.value)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { token, avatar, userInfo, roles, permissions, routes, dynamicRoutes, login, getInfo, logout }
})
