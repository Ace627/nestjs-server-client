import { request } from '@/utils/request'

/** 避免 hooks 写法下的命名冲突 */
export class LoginService {
  /* 获取图片验证码 */
  static getCaptcha(): Promise<LoginEntity.Captcha> {
    return request.get('/captcha?type=math')
  }

  /** 登录 */
  static login(data: LoginEntity.LoginInfo): Promise<LoginEntity.LoginResult> {
    return request.post('/login', data)
  }

  /** 退出登录 */
  static logout() {
    return request.post('/logout')
  }
}
