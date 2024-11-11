import { request } from '@/utils/request'

export class RoleService {
  /** 新增一个角色 */
  static create(data: RoleEntity): Promise<string> {
    return request.post('/system/role/create', data)
  }

  /** 根据 roleId 删除用户信息 */
  static deleteOneById(params: { roleId: string }): Promise<string> {
    return request.get('/system/role/delete', { params })
  }

  /** 更新用户信息 */
  static update(data: RoleEntity): Promise<string> {
    return request.post('/system/role/update', data)
  }

  /** 查询用户列表 */
  static findList(params: TableQuery<RoleEntity>): TableResult<RoleEntity> {
    return request.get('/system/role/list', { params })
  }

  /** 查询用户不分页列表 */
  static findAll(): Promise<RoleEntity[]> {
    return request.get('/system/role/list/all')
  }

  /** 根据 roleId 查询用户信息 */
  static findOneById(params: { roleId: string }): Promise<RoleEntity> {
    return request.get('/system/role/detail', { params })
  }
}
