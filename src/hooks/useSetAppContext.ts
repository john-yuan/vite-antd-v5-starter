import { SetAppContext } from '@/context/AppContext'
import { useContext } from 'react'

export function useSetAppContext() {
  return useContext(SetAppContext)
}
