import { request } from '@/utils/request'

export class MenuService {
  /**
   * 新增一个菜单
   */
  static create(data: Partial<MenuEntity>): Promise<string> {
    return request.post('/system/menu/create', data)
  }

  /**
   * 查询父级菜单下拉列表
   */
  static findParentList(): Promise<any> {
    return request.get(`/system/menu/findParentList`)
  }

  /**
   * 查询树状菜单列表
   */
  static findTreeList(): Promise<any> {
    return request.get(`/system/menu/findTreeList`)
  }

  /**
   * 根据 ID 更新单个菜单
   */ static update(data: MenuEntity): Promise<string> {
    return request.post('/system/menu/update', data)
  }

  /**
   * 根据 ID 查询单个菜单
   */
  static findOneById(params: { menuId: string }): Promise<MenuEntity> {
    return request.get(`/system/menu/detail`, { params })
  }

  /**
   * 根据 ID 删除单个菜单
   */
  static deleteOneById(params: { menuId: string }): Promise<string> {
    return request.get('/system/menu/delete', { params })
  }
}
