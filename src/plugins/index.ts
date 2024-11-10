import type { App } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import { registerElementIcon } from './element-icon'

export function setupPlugins(app: App) {
  /** 解决 v-html 指令潜在的 xss 攻击 v-dompurify-html */
  app.use(VueDOMPurifyHTML)
  /** 导入 ElementPlus 图标并进行全局注册 */
  app.use(registerElementIcon)
}
