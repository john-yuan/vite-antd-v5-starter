import { createContext } from 'react'
import type { CurrentUser, RouteConfig } from '@/types'

export type AppContextValue = {
  currentUser: CurrentUser
  routes: RouteConfig[]
}

export type MutateAppContextFn = (prev: AppContextValue) => AppContextValue
export type SetAppContextFn = (
  arg: AppContextValue | MutateAppContextFn
) => void

export const AppContext = createContext<AppContextValue>({
  currentUser: {
    id: -1,
    account: 'anonymous'
  },
  routes: []
})

export const SetAppContext = createContext<SetAppContextFn>(() => {})
export const LogoutContext = createContext<() => void>(() => {})
