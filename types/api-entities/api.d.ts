/** 所有 api 接口的响应数据都应该遵守该格式 */
interface ApiResponseData<T = any> {
  code: number
  timestamp: number
  success: boolean
  message: string
  result: T
}

/** 处理列表类型的返回数据 */
type TableResult<T = any> = Promise<{
  total: number
  records: Array<T>
}>

interface BaseEntity {
  id: string
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
}

/** 基础的分页查询参数 */
type TableQuery<T extends Record<string, any>> = Partial<T> & {
  pageNo: number
  pageSize: number
}
