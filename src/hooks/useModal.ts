import { useContext } from 'react'
import { ModalContext } from '@/context/ModalContext'
import { noop } from '@/utils/noop'
import type { ModalRef } from '@/context/ModalContext'

export function useModal() {
  return useContext(ModalContext)
}

export function createModalRef(): ModalRef {
  return {
    destroy: noop,
    update: noop
  }
}
