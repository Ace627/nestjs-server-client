interface UserEntity extends BaseEntity {
  username: string
  password: string
  realname: string
  nickname: string
  phone: string
  age: number
  gender: number
  roleIds: number[]
}
