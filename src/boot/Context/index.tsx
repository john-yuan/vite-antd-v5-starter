import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Drawer, Modal } from 'antd'
import { DrawerContext } from '@/context/DrawerContext'
import { ModalContext } from '@/context/ModalContext'
import { AppContext, DEFAULT_APP_STATE } from '@/context/AppContext'
import { getInitialAppState } from '@/getInitialAppState'
import type { DrawerProps, ModalProps } from 'antd'
import type { AppState } from '@/types'
import type { AppContextValue } from '@/context/AppContext'
import type { ShowDrawerFn } from '@/context/DrawerContext'
import type { ShowModalFn } from '@/context/ModalContext'
import RawLogin from '../Login'
import Loading from '../Loading'

let key = 0
const Login = React.memo(RawLogin)

export default function Context({ children }: { children?: React.ReactNode }) {
  return <UI children={children} />
}

function UI({ children }: { children?: React.ReactNode }) {
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

    setModals((prev) => {
      const next = prev.filter((el) => el.open)
      next.push({ key, open: true, props, onCancel })
      return next
    })

    return destroy
  }, [])

  const [drawers, setDrawers] = useState<
    {
      key: number
      props: DrawerProps
      open: boolean
      onClose: (e: React.MouseEvent | React.KeyboardEvent) => void
    }[]
  >([])

  const showDrawer = useCallback<ShowDrawerFn>(({ ref, ...props }) => {
    const key = getNextKey()

    function destroy() {
      setDrawers((prev) =>
        prev.map((el) => {
          return el.key === key
            ? {
                key: el.key,
                open: false,
                onClose: el.onClose,
                props: {
                  ...el.props,
                  destroyOnClose: true,
                  afterOpenChange: function (this: any, open: boolean) {
                    if (!open) {
                      setDrawers((prev) => prev.filter((el) => el.key !== key))
                    }
                    el.props.afterOpenChange?.call(this, open)
                  }
                }
              }
            : el
        })
      )
    }

    function onClose(this: any, e: React.MouseEvent | React.KeyboardEvent) {
      if (props.onClose) {
        props.onClose.call(this, e)
      } else {
        destroy()
      }
    }

    if (ref) {
      ref.destroy = destroy
      ref.update = (mutate) => {
        setDrawers((prev) =>
          prev.map((el) => {
            return el.key === key
              ? { key, onClose, open: el.open, props: mutate(el.props) }
              : el
          })
        )
      }
    }

    setDrawers((prev) => {
      const next = prev.filter((el) => el.open)
      next.push({ key, open: true, props, onClose })
      return next
    })

    return destroy
  }, [])

  return (
    <ModalContext.Provider value={showModal}>
      <DrawerContext.Provider value={showDrawer}>
        <Auth
          ui={
            <>
              {modals.some((el) => el.open) ? (
                <div
                  style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10
                  }}
                />
              ) : null}
              {modals.map((el) => (
                <Modal
                  {...el.props}
                  key={el.key}
                  open={el.open}
                  onCancel={el.onCancel}
                />
              ))}
              {drawers.map((el) => (
                <Drawer
                  {...el.props}
                  key={el.key}
                  open={el.open}
                  onClose={el.onClose}
                />
              ))}
            </>
          }
          authorized={children}
        />
      </DrawerContext.Provider>
    </ModalContext.Provider>
  )
}

function Auth({
  ui,
  authorized
}: {
  ui?: React.ReactNode
  authorized?: React.ReactNode
}) {
  const [appState, setAppState] = useState<AppState>(DEFAULT_APP_STATE)
  const [state, setState] = useState<{
    loading?: boolean
    hasError?: boolean
    errorMessage?: string
    unauthorized?: boolean
  }>({ loading: true })

  const logout = useCallback(() => {
    setState({ unauthorized: true })
    setAppState(DEFAULT_APP_STATE)
  }, [])

  const context = useMemo<AppContextValue>(
    () => ({
      appState,
      setAppState,
      logout
    }),
    [appState, setAppState, logout]
  )

  const render = (content?: React.ReactNode) => {
    return (
      <AppContext.Provider value={context}>
        {content}
        {ui}
      </AppContext.Provider>
    )
  }

  const init = useCallback(() => {
    setState((prev) => (prev.loading ? prev : { loading: true }))
    getInitialAppState()
      .then((initialAppState) => {
        if (initialAppState) {
          setAppState(initialAppState)
          setState({})
        } else {
          setState({ unauthorized: true })
        }
      })
      .catch((err) => {
        setState({
          hasError: true,
          errorMessage: err ? `${err}` : 'Unknown error.'
        })
      })
  }, [])

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.unauthorized) {
    return render(<Login onSuccess={init} />)
  }

  if (state.loading) {
    return render(<Loading />)
  }

  if (state.hasError) {
    return render(
      <Alert
        closable
        type="error"
        message={state.errorMessage}
        style={{ margin: 20 }}
        onClick={logout}
      />
    )
  }

  return render(authorized)
}

function getNextKey() {
  key += 1
  if (key >= Number.MAX_SAFE_INTEGER) {
    key = Number.MIN_SAFE_INTEGER
  }
  return key
}
