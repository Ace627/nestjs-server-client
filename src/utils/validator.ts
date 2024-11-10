/**
 * 对 ElementPlus 表单自定义校验方法的统一封装
 */
import { isPhone } from './validate'

/** 校验是否为手机号 */
export function validatePhone(rule: any, value: any, callback: any) {
  return isPhone(value) ? callback() : callback('手机号码格式不正确')
}
