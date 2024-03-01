import { useCallback } from 'react'
import { createModalRef, useModal } from './useModal'
import type { ModalProps } from 'antd'

function isPromise(v: any): v is Promise<any> {
  return v ? typeof v.then === 'function' : false
}

export function useConfirm() {
  const showModal = useModal()
  const showConfirm = useCallback(
    ({
      onConfirm,
      ...props
    }: Omit<ModalProps, 'onOk'> & {
      onConfirm?: () => Promise<any> | any
    }) => {
      const ref = createModalRef()

      const handleConfirm = () => {
        if (onConfirm) {
          const p = onConfirm()

          if (isPromise(p)) {
            ref.update((prev) => ({
              ...prev,
              okButtonProps: {
                ...(prev.okButtonProps || {}),
                loading: true
              }
            }))

            p.then(() => {
              ref.destroy()
            }).catch(() => {
              ref.update((prev) => ({
                ...prev,
                okButtonProps: {
                  ...(prev.okButtonProps || {}),
                  loading: false
                }
              }))
            })
          } else {
            ref.destroy()
          }
        } else {
          ref.destroy()
        }
      }

      showModal({
        ref,
        ...props,
        onOk: handleConfirm
      })
    },
    [showModal]
  )

  return showConfirm
}
