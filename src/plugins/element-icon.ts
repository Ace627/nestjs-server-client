import type { App } from 'vue'
import { Plus, Download, Refresh, Search, Upload, UploadFilled } from '@element-plus/icons-vue'

// 按需引入图标组件
const components = { Plus, Download, Refresh, Search, Upload, UploadFilled }

export function registerElementIcon(app: App) {
  for (const [key, component] of Object.entries(components)) {
    app.component(key, component)
  }
}
