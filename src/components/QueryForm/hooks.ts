import { useRef } from 'react'
import type { QueryFormRef } from './types'

export function useQueryFormRef() {
  return useRef<QueryFormRef>({
    setValues: () => {},
    triggerSearch: () => {}
  }).current
}
