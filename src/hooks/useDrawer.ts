import type { DrawerRef } from '@/context/DrawerContext'
import { DrawerContext } from '@/context/DrawerContext'
import { noop } from '@/utils/noop'
import { useContext } from 'react'

export function useDrawer() {
  return useContext(DrawerContext)
}

export function createDrawerRef(): DrawerRef {
  return {
    destroy: noop,
    update: noop
  }
}
