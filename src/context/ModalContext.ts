import { createContext } from 'react'
import type { ModalProps } from 'antd'

export interface ModalRef {
  destroy: () => void
  update: (mutate: (perv: ModalProps) => ModalProps) => void
}

export type ModalOptions = Omit<ModalProps, 'ref'> & {
  ref?: ModalRef
}

export type ShowModalFn = (options: ModalOptions) => void

export const ModalContext = createContext<ShowModalFn>(() => {})
