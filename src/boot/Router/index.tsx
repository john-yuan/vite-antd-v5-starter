import { useMemo, useRef } from 'react'

import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashRouter,
  createBrowserRouter,
  useMatches
} from 'react-router-dom'

import type { RouteObject } from 'react-router-dom'
import type { ResolvedRouteObject, RouteConfig } from '@/types'

import Layout from '../Layout'
import UiContextProvider from '../UiContextProvider'
import { useAppContext } from '@/hooks/useAppContext'
import { ROUTER_TYPE } from '@/system/env'

export default function Router() {
  const { routes } = useAppContext()
  const ref = useRef({ idPrefix: 0 })
  const router = useMemo(() => {
    ref.current.idPrefix += 1

    const pageRoutes: RouteObject[] = []
    const resolvedRoutes: ResolvedRouteObject[] = []
    const prefix = ref.current.idPrefix

    let counter = 0
    let defaultPath = ''

    const resolveRoutes = (
      list: RouteConfig[],
      parent: RouteConfig[],
      parentKeys: string[]
    ): ResolvedRouteObject[] => {
      return list.map<ResolvedRouteObject>((route) => {
        counter += 1
        const key = `${prefix}.${counter}`
        const path = route.defaultPath || route.path || ''

        if (!defaultPath && path) {
          defaultPath = path
        }

        const resolved: ResolvedRouteObject = {
          key,
          parentKeys,
          route,
          parent,
          path,
          children: resolveRoutes(
            route.children || [],
            [...parent, route],
            [...parentKeys, key]
          )
        }

        if (route.path) {
          pageRoutes.push({
            id: key,
            path: route.path,
            element: <Layout routes={resolvedRoutes} route={resolved} />
          })
        }

        return resolved
      })
    }

    resolvedRoutes.push(...resolveRoutes(routes, [], []))

    const createRouter =
      ROUTER_TYPE === 'hash' ? createHashRouter : createBrowserRouter

    return createRouter([
      {
        path: '*',
        element: (
          <UiContextProvider>
            <Layout routes={resolvedRoutes} />
          </UiContextProvider>
        )
      },
      {
        path: '/',
        element: (
          <UiContextProvider>
            <Container defaultPath={defaultPath} />
          </UiContextProvider>
        ),
        children: pageRoutes
      }
    ])
  }, [ref, routes])

  return <RouterProvider router={router} />
}

function Container({ defaultPath }: { defaultPath?: string }) {
  return useMatches().length < 2 && defaultPath ? (
    <Navigate to={defaultPath} />
  ) : (
    <Outlet />
  )
}
