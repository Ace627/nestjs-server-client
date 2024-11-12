interface MenuEntity extends BaseEntity {
  parentId: string
  type: string
  title: string
  icon: string
  component: string
  path: string
  permission: string
  visible: number
  frame: number
}
