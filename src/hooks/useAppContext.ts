import { AppContext } from '@/context/AppContext'
import { useContext } from 'react'

export function useAppContext() {
  return useContext(AppContext)
}
