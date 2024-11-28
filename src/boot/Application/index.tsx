import { Alert } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { AppContext, LogoutContext, SetAppContext } from '@/context/AppContext'
import { getInitialAppState } from '@/getInitialAppState'
import Login from '../Login'
import Loading from '../Loading'
import Router from '../Router'
import UiContextProvider from '../UiContextProvider'
import type { AppContextValue, SetAppContextFn } from '@/context/AppContext'

export default function Application() {
  const [state, setState] = useState<{
    status?: 'initializing' | 'error' | 'authorized' | 'unauthorized'
    context?: AppContextValue
    error?: string
  }>({})

  const setAppContext = useCallback<SetAppContextFn>(
    (ctx) => {
      setState((prev) => {
        if (prev.context) {
          const next = typeof ctx === 'function' ? ctx(prev.context) : ctx
          return next === prev.context ? prev : { ...prev, context: next }
        }
        return prev
      })
    },
    [setState]
  )

  const logout = useCallback(() => {
    setState({ status: 'unauthorized' })
  }, [])

  useEffect(() => {
    if (!state.status) {
      setState({ status: 'initializing' })
    } else if (state.status === 'initializing') {
      getInitialAppState()
        .then((res) => {
          if (res) {
            setState({ status: 'authorized', context: res })
          } else {
            setState({ status: 'unauthorized' })
          }
        })
        .catch((err) => {
          setState({
            status: 'error',
            error: err ? `${err}` : 'Unknown error.'
          })
        })
    }
  }, [state, setState])

  if (state.status === 'authorized' && state.context) {
    return (
      <SetAppContext.Provider value={setAppContext}>
        <LogoutContext.Provider value={logout}>
          <AppContext.Provider value={state.context}>
            <Router />
          </AppContext.Provider>
        </LogoutContext.Provider>
      </SetAppContext.Provider>
    )
  }

  if (state.status === 'unauthorized') {
    return (
      <UiContextProvider>
        <Login onSuccess={() => setState({})} />
      </UiContextProvider>
    )
  }

  if (state.status === 'error') {
    return (
      <Alert
        closable
        type="error"
        message={state.error}
        style={{ margin: 20 }}
        onClose={logout}
      />
    )
  }

  return <Loading />
}
