/**
 * 登录所需的参数体
 */
interface LoginAccountDto {
  /** 登录账号 */
  username: string
  /** 登录密码 */
  password: string
  /** 登录验证码 */
  captcha: string
  /** 登录验证码唯一标识 */
  uuid: string
  /** 记住密码的标识 */
  rememberMe: boolean
}

/**
 * 登录成功返回的数据
 */
interface LoginResult {
  accessToken: string
  refreshToken: string
}

/**
 * 验证码接口返回数据
 *
 */
type Captcha = Pick<LoginInfo, 'captcha' | 'uuid'>

/**
 * 登录后获取的个人信息
 */
interface LoginUserInfo {
  user: UserEntity
  roles: string[]
}

interface LogoutOption {
  /** 退出是否显示确认框 */
  confirm: boolean
}
