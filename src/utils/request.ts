import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios'
import { getAccessToken, getFullAccessToken } from '@/utils/cache'

const { VITE_BASE_API, VITE_REQUEST_TIMEOUT, VITE_REQUEST_NPROGRESS } = useEnv() // 解构环境变量
const NProgress = useNProgress({ show: VITE_REQUEST_NPROGRESS }) // 顶部进度条

type PendingTask = { config: AxiosRequestConfig; resolve: AnyFunction }
let isRefreshing = false // 是否还需要刷新的标识
const pendingTaskList: PendingTask[] = [] // 存储未完成的请求

export const request = axios.create({
  // baseURL 将自动加在 url 前面，除非 url 是一个绝对 URL
  baseURL: VITE_BASE_API,
  // timeout 指定请求超时的毫秒数(0 表示无超时时间)，如果请求花费了超过 timeout 的时间，请求将被中断
  timeout: VITE_REQUEST_TIMEOUT * 1000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    NProgress.start() // 开启响应进度条
    const timestamp = Date.now()
    const token = getAccessToken()
    const isGetRequest = config.method?.toUpperCase() === 'GET'
    config.params = config.params || {}
    if (isGetRequest) config.params['timestamp'] = timestamp // 给 get 请求加上时间戳参数，避免从缓存中拿数据
    // 配置请求头
    if (token) config.headers['Authorization'] = getFullAccessToken() // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (token) config.headers['X-Access-Token'] = token
    config.headers['X-TIMESTAMP'] = timestamp
    // 返回处理后的请求头
    return config
  },
  (error) => {
    // 关闭响应进度条
    NProgress.done()
    // 将原初异常以 Promise 形式暴露给外部调用处理
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  async (response) => {
    NProgress.done()
    // 未设置状态码则默认成功状态
    const code = response.data.code || HttpStatusCode.Ok
    // 获取错误信息
    const message = response.data.message || `系统未知错误，请反馈给管理员`
    // 二进制数据则直接返回
    if (['blob', 'arraybuffer'].includes(response.request.responseType)) {
      return response.data
    }

    // 非二进制且状态码为成功状态码 直接返回具体数据
    if (code === HttpStatusCode.Ok) {
      return response.data.result
    } else if (code === HttpStatusCode.Unauthorized) {
      useModal().msgError(message)
      setTimeout(() => useLogin().handleLogout({ confirm: false }), 1.5 * 1000)
    } else {
      useModal().msgError(message)
      return Promise.reject(new Error(message))
    }
  },
  (error: any) => {
    NProgress.done()
    // 参考：https://gitee.com/y_project/RuoYi-Vue/blob/master/ruoyi-ui/src/utils/request.js
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `系统接口 ${message.substr(message.length - 3)} 异常`
    }

    // 如果后端返回错误提示信息，则采用该信息提示
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message
    }

    useModal().msgError(message, { duration: 5 * 1000 })
    return Promise.reject(error)
  },
)
