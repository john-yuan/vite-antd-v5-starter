const env = (s?: string) => `${s || ''}`.trim()

export const ROUTER_TYPE = env(import.meta.env.VITE_ROUTER_TYPE) as
  | 'hash'
  | 'browser'

export const API_BASE_URL = env(import.meta.env.VITE_API_BASE_URL)
