import { useMemo, useRef } from 'react'
import { useAppState } from '@/hooks/useAppState'

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
import { ROUTER_TYPE } from '@/system/env'

export default function Router() {
  const { routes } = useAppState()
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

        pageRoutes.push({
          id: key,
          path: route.path,
          element: <Layout routes={resolvedRoutes} route={resolved} />
        })

        return resolved
      })
    }

    resolvedRoutes.push(...resolveRoutes(routes, [], []))

    const createRouter =
      ROUTER_TYPE === 'hash' ? createHashRouter : createBrowserRouter

    return createRouter([
      {
        path: '*',
        element: <Layout routes={resolvedRoutes} />
      },
      {
        path: '/',
        element: <Container defaultPath={defaultPath} />,
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
