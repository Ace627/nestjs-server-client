import { LoginService } from '@/api'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/cache'

/** 第一个参数是该 store 的唯一 id */
export default defineStore('user', () => {
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const userInfo = ref({} as UserEntity)

  /**
   * 用户访问服务资源的唯一凭证
   */
  const token = ref<string | null>(getAccessToken())

  /**
   * 用户头像 默认值 src/assets/images/default/default-avatar.gif
   */
  const avatar = ref<string>(new URL('../../assets/images/default/default-avatar.gif', import.meta.url).href)

  /**
   * 登录
   */
  async function login(loginParams: LoginAccountDto) {
    const data = await LoginService.login(loginParams)
    setAccessToken(data.accessToken)
    token.value = getAccessToken()
  }

  /**
   * 登出
   */
  async function logout() {
    await LoginService.logout() // 必须在前 不然会导致 Redis 无法清空对应的缓存 Token
    removeAccessToken()
    token.value = getAccessToken()
  }

  /**
   * 获取个人信息
   */
  async function getInfo() {
    try {
      const data = await LoginService.getInfo()
      roles.value = data.roles
      userInfo.value = data.user
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { token, avatar, roles, permissions, login, getInfo, logout }
})
