import { LogoutContext } from '@/context/AppContext'
import { useContext } from 'react'

export function useLogout() {
  return useContext(LogoutContext)
}
