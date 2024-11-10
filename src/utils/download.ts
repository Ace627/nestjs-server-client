import { request } from '@/utils/request'

/** 利用 a 标签进行下载 支持 URL、File 对象和 Blob 对象下载 */
export function linkDownload(fileURL: string | Blob | File, fileName?: string) {
  // 1、处理不同的数据类型
  let href: string = typeof fileURL === 'string' ? fileURL : URL.createObjectURL(fileURL)
  // 2、创建一个隐藏的 <a> 元素并触发下载
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = href
  a.download = fileName ?? Date.now().toString()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 3、清理资源
  if (typeof fileURL !== 'string') URL.revokeObjectURL(href)
}

/** 根据接口地址和传入名称直接下载服务器返回的 Buffer 文件流 */
export async function downloadServerFile(url: string, fileName: string) {
  const { data } = await request.post<any, { type: string; data: ArrayBuffer }>(url)
  const unit8Array = new Uint8Array(data) // ArrayBuffer --> Blob
  const blob = new Blob([unit8Array], { type: 'application/actet-stream' })
  linkDownload(blob, fileName)
}

/**
 * 图片转为 Base64 字符串
 * @param {String} imgURL 待转换的图片路径
 * @param {String} type 转换后的图片类型
 * @param  {Number} quality 转换后的图片质量
 * @returns {String} Base64 字符串
 */
export function imageToBase64(imgURL: string, quality = 0.9): Promise<string> {
  const img = new Image()
  // 因为是网络资源所以会有图片跨域问题产生，此属性可以解决跨域问题
  img.setAttribute('crossOrigin', 'anonymous')
  // 如果需要兼容 iOS，这两个顺序一定不能换，先设置 crossOrigin 后设置 src
  img.src = imgURL
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const cvs = document.createElement('canvas')
      cvs.width = img.width
      cvs.height = img.height
      const ctx = cvs.getContext('2d')!
      ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
      resolve(cvs.toDataURL('image/png', quality))
    }
    img.onerror = (error: any) => reject(error)
  })
}

/** 复制文本到剪贴板 */
export function copyText(text: string): void {
  if (typeof text !== 'string') throw new Error(`the content must be of type string`)
  // 是否支持 navigator.clipboard 属性
  const isClipboardApiSupported = window.navigator && window.navigator.clipboard
  if (isClipboardApiSupported) {
    window.navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.readOnly = true
    textarea.value = text
    textarea.style.position = 'absolute'
    textarea.style.top = '-9999px'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}
