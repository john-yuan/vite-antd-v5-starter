import { routes } from '@/routes'
import { sleep } from '@/utils/sleep'
import type { AppContextValue } from './context/AppContext'

/**
 * Get the initial app state. If this function returns `null`, means that
 * there is no user logged in. In such case, the login page will be displayed.
 *
 * @returns return a `AppState` if user logged in, otherwise returns `null`.
 */
export async function getInitialAppState(): Promise<AppContextValue | null> {
  // TODO initialize the app state.

  await sleep(500)

  if (localStorage.getItem('auth_token') === 'yes') {
    return {
      routes,
      currentUser: {
        id: 1,
        account: 'admin',
        nickname: 'Admin'
      }
    }
  }

  return null
}
