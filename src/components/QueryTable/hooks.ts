import { useRef } from 'react'
import { noop } from '@/utils/noop'
import type { QueryTableRef } from './types'

export function useQueryTable() {
  return useRef<QueryTableRef>({
    reload: noop,
    setValues: noop,
    triggerSearch: noop
  }).current
}
