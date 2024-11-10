import { GenderEnum } from '@/enums'

/** 性别选项配置 */
export const GenderOption = [
  { label: '未知', value: GenderEnum.UNKNOWN },
  { label: '男性', value: GenderEnum.MALE },
  { label: '女性', value: GenderEnum.FEMALE }
]

/** 根据性别值获取性别对应的 label */
export function getGenderByValue(value: GenderEnum) {
  return GenderOption.find((v) => v.value === value)?.label ?? 'N/A'
}
