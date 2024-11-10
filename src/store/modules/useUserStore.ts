import { getAccessToken } from '@/utils/cache'

/** 第一个参数是该 store 的唯一 id */
export default defineStore('user', () => {
  const roles: string[] = []
  const permissions: string[] = []

  /**
   * 用户访问服务资源的唯一凭证
   */
  const token = ref<string | null>(getAccessToken())

  /**
   * 用户头像 默认值 src/assets/images/default/default-avatar.gif
   */
  const avatar = ref<string>(new URL('../../assets/images/default/default-avatar.gif', import.meta.url).href)

  return { token, avatar, roles, permissions }
})
