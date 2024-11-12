import { request } from '@/utils/request'
import type { RouteRecordRaw } from 'vue-router'

/** 避免 hooks 写法下的命名冲突 */
export class LoginService {
  /* 获取图片验证码 */
  static getCaptcha(): Promise<Captcha> {
    return request.get('/captcha?type=math')
  }

  /** 登录 */
  static login(data: LoginAccountDto): Promise<LoginResult> {
    return request.post('/login', data)
  }

  /**
   * 获取个人信息
   */
  static getInfo(): Promise<LoginUserInfo> {
    return request.get('/getInfo')
  }

  /**
   * 获取用户路由信息
   */
  static getRoutes(): Promise<RouteRecordRaw[]> {
    return request.get('/getRoutes')
  }

  /** 退出登录 */
  static logout() {
    return request.post('/logout')
  }
}
