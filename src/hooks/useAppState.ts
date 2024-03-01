import { AppContext } from '@/context/AppContext'
import { useContext } from 'react'

export function useAppState() {
  return useContext(AppContext).appState
}
