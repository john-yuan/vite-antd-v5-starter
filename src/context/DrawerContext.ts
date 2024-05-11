import type { DrawerProps } from 'antd'
import { createContext } from 'react'

export interface DrawerRef {
  destroy: () => void
  update: (mutate: (prev: DrawerProps) => DrawerProps) => void
}

export type DrawerOptions = Omit<DrawerProps, 'ref'> & { ref?: DrawerRef }

export type ShowDrawerFn = (options: DrawerOptions) => () => void

export const DrawerContext = createContext<ShowDrawerFn>(() => () => {})
