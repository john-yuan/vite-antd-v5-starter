export interface AppState {
  currentUser: CurrentUser
  routes: RouteConfig[]
}

export interface CurrentUser {
  id: number
  account: string
  nickname?: string
}

export interface RouteConfig {
  label: string
  icon?: React.ReactNode
  iconComponent?: React.ComponentType
  path?: string
  defaultPath?: string
  hidden?: boolean
  fullscreen?: boolean
  skipSettingDocumentTitle?: boolean
  element?: React.ReactNode
  component?: React.ComponentType<any>
  componentProps?: Record<string, any>
  children?: RouteConfig[]
}

export interface ResolvedRouteObject {
  key: string
  parentKeys: string[]
  parent: RouteConfig[]
  path: string
  route: RouteConfig
  children: ResolvedRouteObject[]
}
