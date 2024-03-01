import { AppContext } from '@/context/AppContext'
import { useContext } from 'react'

export function useCurrentUser() {
  return useContext(AppContext).appState.currentUser
}
