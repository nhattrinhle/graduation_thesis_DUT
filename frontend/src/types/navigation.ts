import { Roles } from "./role"

export interface NavigationTree {
  key: string
  path: string
  title: string
  icon: string
  type: string
  authority: Roles[]
  subMenu: NavigationTree[]
}