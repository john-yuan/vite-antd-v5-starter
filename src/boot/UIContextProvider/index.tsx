import type { ShowModalFn } from '@/context/ModalContext'
import { ModalContext } from '@/context/ModalContext'
import type { ModalProps } from 'antd'
import { Modal } from 'antd'
import { useCallback, useState } from 'react'

let key = 0

function getNextKey() {
  key += 1
  if (key >= Number.MAX_SAFE_INTEGER) {
    key = Number.MIN_SAFE_INTEGER
  }
  return key
}

export default function UIContextProvider({
  children
}: {
  children?: React.ReactNode
}) {
  const [modals, setModals] = useState<
    {
      key: number
      props: ModalProps
      open: boolean
      onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    }[]
  >([])

  const showModal = useCallback<ShowModalFn>(({ ref, ...props }) => {
    const key = getNextKey()

    function destroy() {
      setModals((prev) =>
        prev.map((el) => {
          return el.key === key
            ? {
                key: el.key,
                open: false,
                onCancel: el.onCancel,
                props: {
                  ...el.props,
                  destroyOnClose: true,
                  afterClose: function (this: any) {
                    setModals((prev) => prev.filter((el) => el.key !== key))
                    el.props.afterClose?.call(this)
                  }
                }
              }
            : el
        })
      )
    }

    function onCancel(
      this: any,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
      if (props.onCancel) {
        props.onCancel.call(this, e)
      } else {
        destroy()
      }
    }

    if (ref) {
      ref.destroy = destroy
      ref.update = (mutate) => {
        setModals((prev) =>
          prev.map((el) => {
            return el.key === key
              ? { key, onCancel, open: el.open, props: mutate(el.props) }
              : el
          })
        )
      }
    }

    setModals((prev) => [...prev, { key, open: true, props, onCancel }])
  }, [])

  return (
    <ModalContext.Provider value={showModal}>
      {children}
      {modals.map((el) => (
        <Modal
          {...el.props}
          key={el.key}
          open={el.open}
          onCancel={el.onCancel}
        />
      ))}
    </ModalContext.Provider>
  )
}
