import { CacheKey } from '@/config'

/** 存储登录信息到本地 */
export function setLoginInfo(data: Partial<LoginEntity.LoginInfo>): void {
  localStorage.setItem(CacheKey.REMEMBER_LOGIN_INFO, JSON.stringify(data))
}

/** 从本地获取登录信息 */
export function getLoginInfo(): Partial<LoginEntity.LoginInfo> {
  const jsonStr = localStorage.getItem(CacheKey.REMEMBER_LOGIN_INFO)
  return jsonStr ? JSON.parse(jsonStr) : {}
}

/** 从本地移除登录信息 */
export function removeLoginInfo(): void {
  localStorage.removeItem(CacheKey.REMEMBER_LOGIN_INFO)
}
