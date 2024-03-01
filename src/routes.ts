import { lazy } from 'react'
import type { RouteConfig } from './types'
import { DashboardOutlined, QuestionCircleOutlined } from '@ant-design/icons'

export const routes: RouteConfig[] = [
  {
    label: 'Dashboard',
    iconComponent: DashboardOutlined,
    children: [
      {
        label: 'Reports',
        path: '/dashboard/reports',
        component: lazy(() => import('./pages/Dashboard/Reports'))
      },
      {
        label: 'Tasks',
        path: '/dashboard/tasks',
        component: lazy(() => import('./pages/Dashboard/Tasks'))
      }
    ]
  },
  {
    label: 'About',
    path: '/about',
    iconComponent: QuestionCircleOutlined,
    component: lazy(() => import('./pages/About'))
  }
]
