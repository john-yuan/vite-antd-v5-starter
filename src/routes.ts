import { lazy } from 'react'
import type { RouteConfig } from './types'
import { AppstoreOutlined, LinkOutlined } from '@ant-design/icons'

export const routes: RouteConfig[] = [
  {
    label: 'Links',
    path: '/links',
    iconComponent: LinkOutlined,
    component: lazy(() => import('./pages/Links'))
  },
  {
    label: 'Examples',
    iconComponent: AppstoreOutlined,
    children: [
      {
        label: 'Drawers',
        path: '/examples/drawers',
        component: lazy(() => import('./pages/Examples/Drawers'))
      },
      {
        label: 'Modals',
        path: '/examples/modals',
        component: lazy(() => import('./pages/Examples/Modals'))
      },
      {
        label: 'QueryTable',
        path: '/examples/query_table',
        component: lazy(() => import('./pages/Examples/QueryTable'))
      }
    ]
  }
]
