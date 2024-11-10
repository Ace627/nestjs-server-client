import router from '@/router'
import { LoginService } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'
import { getAccessToken, getLoginInfo, removeAccessToken, removeLoginInfo, setAccessToken, setLoginInfo } from '@/utils/cache'
import { pick } from 'lodash-es'

/**
 * 请于登录表单的 el-form 上添加 <el-form ref="loginFormRef"></el-form>
 */
export default (formRef: string = 'loginFormRef') => {
  /** 返回当前的路由地址。相当于在模板中使用 $route */
  const route = router.currentRoute.value
  const redirect = (route.query['redirect'] as string) ?? '/' // 计算需要跳转的路径
  /** 读取 Pinia */
  const userStore = useUserStore()
  /** 登录按钮 Loading */
  const loading = ref<boolean>(false)
  /** 验证码图片地址 */
  const captchaURL = ref<string>()
  /** 登录表单实例 */
  const loginFormInstance = useTemplateRef<FormInstance>(formRef!)
  /** 登录表单数据 */
  const defaultModel: Readonly<Partial<LoginEntity.LoginInfo>> = { rememberMe: false }
  const loginInfo = ref({ ...defaultModel } as LoginEntity.LoginInfo)
  /** 登录表单的校验规则 */
  const loginRules: FormRules<LoginEntity.LoginInfo> = {
    username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
    captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
  }

  /* 获取图片验证码 */
  async function getCaptcha() {
    const data = await LoginService.getCaptcha()
    captchaURL.value = data.captcha
    loginInfo.value.uuid = data.uuid
  }

  /** 处理记住账号密码的操作 */
  function handleRememberMe() {
    const cacheInfo = pick(loginInfo.value, ['username', 'password', 'rememberMe'])
    loginInfo.value.rememberMe ? setLoginInfo(cacheInfo) : removeLoginInfo()
  }

  /** 处理登录的操作 */
  async function handleLogin() {
    try {
      await loginFormInstance.value?.validate()
      loading.value = true
      const data = await LoginService.login(loginInfo.value)
      setAccessToken(data.accessToken) // 存储 Token
      userStore.token = data.accessToken
      userStore.roles = data.roles
      handleRememberMe()
      await router.replace(redirect)
      loading.value = false
    } catch (error) {
      loading.value = false
      // getCaptcha() // 登录失败刷新验证码
    }
  }

  /** 处理退出登录的操作 */
  async function handleLogout(config: LoginEntity.LogoutOption = { confirm: true }) {
    try {
      if (config && config.confirm) await useModal().confirm(`确定注销并退出系统吗？`)
      await LoginService.logout() // 必须在前 不然会导致 Redis 无法清空对应的缓存 Token
      removeAccessToken()
      userStore.token = getAccessToken()
      window.location.reload()
    } catch (error) {
      if (error === 'cancel') return useModal().msg('操作取消')
      console.log('退出登录失败: ', error)
    }
  }

  Object.assign(loginInfo.value, getLoginInfo())

  return { loading, captchaURL, loginInfo, loginRules, getCaptcha, handleLogin, handleLogout }
}
