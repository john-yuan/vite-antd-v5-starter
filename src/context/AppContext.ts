import type { AppState } from '@/types'
import { createContext } from 'react'

export interface AppContextValue {
  appState: AppState
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
  logout: () => void
}

export const DEFAULT_APP_STATE: AppState = {
  currentUser: { id: 0, account: 'anonymous' },
  routes: []
}

export const AppContext = createContext<AppContextValue>({
  appState: DEFAULT_APP_STATE,
  setAppState: () => {},
  logout: () => {}
})
