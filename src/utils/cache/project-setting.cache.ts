import { CacheKey } from '@/common'

/** 项目配置类型 */
export interface ProjectConfig {
  /** 是否显示 Settings Panel */
  showSetting: boolean
  /** 是否显示侧边栏 Logo */
  showLogo: boolean
  /** 是否显示灰色模式 */
  showGreyMode: boolean
  /** 是否显示色弱模式 */
  showColorWeakness: boolean
  /** 内容区域转场动效 */
  transitionName: 'fade-transform' | 'el-zoom-in-center' | 'el-zoom-in-top' | 'el-zoom-in-bottom' | 'el-fade-in-linear' | 'el-fade-in'
}

/** 存储项目配置信息到本地 */
export function setProjectConfig(data: ProjectConfig): void {
  localStorage.setItem(CacheKey.PROJECT_CONFIG, JSON.stringify(data))
}

/** 从本地获取存储项目配置信息 */
export function getProjectConfig(): ProjectConfig {
  const jsonStr = localStorage.getItem(CacheKey.PROJECT_CONFIG)
  return jsonStr ? JSON.parse(jsonStr) : {}
}

/** 从本地移除存储项目配置信息 */
export function removeProjectConfig(): void {
  localStorage.removeItem(CacheKey.PROJECT_CONFIG)
}
