import { request } from '@/utils/request'
import { downloadServerFile } from '@/utils/download'

export class UserService {
  /** 新增一个用户 */
  static create(data: UserEntity): Promise<string> {
    return request.post('/system/user/create', data)
  }

  /** 查询用户列表 */
  static findAll(params: TableQuery<UserEntity>): TableResult<UserEntity> {
    return request.get('/system/user/list', { params })
  }

  /** 根据 userId 查询用户信息 */
  static findOneById(params: { userId: string }): Promise<UserEntity> {
    return request.get('/system/user/detail', { params })
  }

  /** 更新用户信息 */
  static update(data: UserEntity): Promise<string> {
    return request.post('/system/user/update', data)
  }

  /** 根据 userId 删除用户信息 */
  static deleteOneById(params: { userId: string }): Promise<string> {
    return request.delete('/system/user/deleteOneById', { params })
  }

  /** 导入用户 Excel 表格 */
  static importExcel(data: FormData, params: { updateSupport: number }) {
    return request.post('/system/user/importExcel', data, { headers: { 'Content-Type': 'multipart/form-data' }, params })
  }

  /** 导出用户 Excel 表格 */
  static exportExcel(fileName: string) {
    downloadServerFile('/system/user/exportExcel', fileName)
  }

  /** 下载用户导入的表格模板 */
  static downloadExcelTemplate(fileName: string) {
    downloadServerFile('/system/user/downloadExcelTemplate', fileName)
  }
}
