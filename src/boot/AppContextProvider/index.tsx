import { Alert, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext, DEFAULT_APP_STATE } from '@/context/AppContext'
import { getInitialAppState } from '@/getInitialAppState'
import type { AppContextValue } from '@/context/AppContext'
import type { AppState } from '@/types'
import Login from '../Login'
import css from './index.module.less'

export default function AppContextProvider({
  children
}: {
  children?: React.ReactNode
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
    return <Login onSuccess={init} />
  }

  if (state.loading) {
    return (
      <div className={css.loading}>
        <Spin size="small" />
      </div>
    )
  }

  if (state.hasError) {
    return (
      <div className={css.error}>
        <Alert
          type="error"
          message={state.errorMessage}
          closable
          onClick={logout}
        />
      </div>
    )
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
