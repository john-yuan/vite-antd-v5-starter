import type { FetchOptions, FetchResponse } from 'fetch-with-json'
import fetchWithJSON from 'fetch-with-json'
import { message } from 'antd'
import { API_BASE_URL } from './env'

const STORAGE_KEY = 'auth_token'

export function setAuthToken(token: string) {
  localStorage.setItem(STORAGE_KEY, token)
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEY)
}

function checkRequestError(res: FetchResponse) {
  const json = res.json as any

  if (res.status >= 400) {
    if (json && typeof json.message === 'string') {
      return new Error(json.message || 'Request error.')
    }

    if (res.status === 404) {
      return new Error(`Http Error: 404 Not Found`)
    }

    if (res.status === 500) {
      return new Error('Http Error: 500 Internal Server Error')
    }

    if (res.status === 502) {
      return new Error('Http Error: 502 Bad Gateway')
    }

    if (res.status === 504) {
      return new Error('Http Error: 504 Gateway Timeout')
    }

    return new Error('Http Error: ' + res.status + ' Request error.')
  }

  return null
}

function getErrorMessage(err?: any, fallback?: string) {
  const defaultMsg = fallback || 'Unknown error.'

  if (err && typeof err.message === 'string') {
    return err.message || defaultMsg
  }

  if (typeof err === 'string') {
    return err || defaultMsg
  }

  return defaultMsg
}

function wrapRequestError(err: Error, res: FetchResponse) {
  const e = err as any

  e.isSystemRequestError = true
  e.response = res

  return err
}

export interface RequestOptions<T = any> extends Omit<FetchOptions, 'method'> {
  /**
   * The request method. Default: `get`.
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

  /**
   * Custom the error check function. This function will not overwrite the
   * default error check function. If you want to skip the default error check
   * function, please use the `skipDefaultErrorCheck` option.
   */
  checkError?: (res: FetchResponse<T>) => Error | null

  /**
   * Skip the default error check function (not including the `checkError`
   * function).
   */
  skipDefaultErrorCheck?: boolean

  /**
   * Skip adding the authorization headers to the request.
   */
  skipAuthorization?: boolean

  /**
   * Skip the default error handler.
   */
  skipDefaultErrorHandler?: boolean
}

export async function baseRequest<T = any>(options: RequestOptions<T>) {
  options.baseURL = options.baseURL || API_BASE_URL

  if (!options.skipAuthorization) {
    const token = getAuthToken()

    if (token) {
      options.headers = new Headers(options.headers)
      options.headers.append('Authorization', `Bearer ${token}`)
    }
  }

  return fetchWithJSON<T>(options)
    .then((res) => {
      if (options.checkError) {
        const err = options.checkError(res)
        if (err) {
          throw wrapRequestError(err, res)
        }
      }

      if (!options.skipDefaultErrorCheck) {
        const err = checkRequestError(res)
        if (err) {
          throw wrapRequestError(err, res)
        }
      }

      return res
    })
    .catch((err) => {
      if (!options.skipDefaultErrorHandler) {
        message.error(getErrorMessage(err))
      }
      return Promise.reject(err)
    })
}

export async function request<T = any>(options: RequestOptions<T>): Promise<T> {
  return baseRequest<T>(options).then((res) => res.json)
}
