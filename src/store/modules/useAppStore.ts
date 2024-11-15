import { getSidebarStatus, setSidebarStatus } from '@/utils/cache'

/** 侧边栏配置类型 */
interface SidebarConfig {
  opened: boolean
  withoutAnimation: boolean
}

export default defineStore('app', () => {
  /** 侧边栏配置 */
  const sidebar = reactive<SidebarConfig>({
    opened: getSidebarStatus(),
    withoutAnimation: false,
  })

  /** 面包屑开关菜单栏的回调 */
  function toggleSidebar(): void {
    sidebar.withoutAnimation = false
    sidebar.opened = !sidebar.opened
    setSidebarStatus(sidebar.opened)
  }

  /** 关闭侧边栏（主要用于移动端状态下） */
  function closeSidebar(withoutAnimation: boolean): void {
    setSidebarStatus(false)
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }

  /** 设备类型 */
  const device = ref<DeviceType>('desktop')
  const isMobile: globalThis.ComputedRef<boolean> = computed(() => device.value === 'mobile')
  const isDesktop: globalThis.ComputedRef<boolean> = computed(() => device.value === 'desktop')
  /** 是否显示重新登录 */
  const isRelogin = ref<boolean>(false)

  return { sidebar, device, isMobile, isDesktop, isRelogin, toggleSidebar, closeSidebar }
})
