import { useEffect, useState } from 'react'
import { Alert, Button, Input } from 'antd'
import css from './index.module.less'

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [state, setState] = useState<{
    submitting?: boolean
    error?: boolean
  }>({})

  const [input, setInput] = useState({ account: '', password: '' })

  const handleLogin = async () => {
    // TODO implement

    const account = input.account.trim()
    const password = input.password

    if (account && password && !state.submitting) {
      setState({ submitting: true })
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (input.account === 'admin' && input.password === '123456') {
        setState({})
        localStorage.setItem('mock:login', 'yes')
        onSuccess()
      } else {
        setState({ error: true })
      }
    }
  }

  useEffect(() => {
    document.title = 'Login'
  }, [])

  return (
    <div className={css.login}>
      <h1>Login</h1>
      <p className={css.tip}>Login with your account and password.</p>
      {state.error ? (
        <Alert
          type="error"
          showIcon
          closable
          message="Incorrect account or password."
          onClose={() => {
            setState((prev) => ({ ...prev, error: false }))
          }}
        />
      ) : null}
      <div className={css.input}>
        <Input
          placeholder="Please enter your account"
          value={input.account}
          onChange={(e) => {
            setInput((prev) => ({ ...prev, account: e.target.value }))
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter' || e.keyCode === 13) {
              handleLogin()
            }
          }}
        />
      </div>
      <div className={css.input}>
        <Input
          type="password"
          placeholder="Please enter your password"
          value={input.password}
          onChange={(e) => {
            setInput((prev) => ({ ...prev, password: e.target.value }))
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter' || e.keyCode === 13) {
              handleLogin()
            }
          }}
        />
      </div>
      <div className={css.button}>
        <Button
          type="primary"
          block
          loading={state.submitting}
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </div>
  )
}
