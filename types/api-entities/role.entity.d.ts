interface RoleEntity extends BaseEntity {
  name: string
  code: string
  menus?: MenuEntity[]
}
