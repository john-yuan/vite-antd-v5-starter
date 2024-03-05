import {
  Suspense,
  useCallback,
  useMemo,
  useState,
  memo,
  useEffect
} from 'react'

import { Dropdown, Menu, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons'
import { useAppContext } from '@/hooks/useAppContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useConfirm } from '@/hooks/useConfirm'
import type { MouseEvent } from 'react'
import type { GetProp, MenuProps } from 'antd'
import type { ResolvedRouteObject } from '@/types'

import css from './index.module.less'

type MenuItem = GetProp<MenuProps, 'items'>[number]
type SelectEventHandler = GetProp<MenuProps, 'onSelect'>

const Header = memo(SiteHeader)
const Sidebar = memo(SiteSidebar)

export default function Layout({
  routes,
  route
}: {
  route?: ResolvedRouteObject
  routes: ResolvedRouteObject[]
}) {
  let content = null

  useEffect(() => {
    if (route) {
      const labels = route.parent.map((el) => el.label)
      labels.push(route.route.label)
      document.title = labels.join(' - ')
    } else {
      document.title = 'Page not found'
    }
  }, [route])

  if (route) {
    if (route.route.element) {
      content = route.route.element
    } else if (route.route.component) {
      const Component = route.route.component
      content = <Component {...route.route.componentProps} />
    }
  }

  return (
    <>
      <Header />
      <Sidebar routes={routes} route={route} />
      <main className={css.main}>
        <Suspense fallback={<Loading />}>{content}</Suspense>
      </main>
    </>
  )
}

function SiteHeader() {
  const user = useCurrentUser()
  const { logout } = useAppContext()
  const confirm = useConfirm()
  return (
    <header className={css.header}>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'logout',
              label: '退出登录',
              onClick: () => {
                confirm({
                  title: '退出登录',
                  width: 400,
                  children: <div>确认退出登录？</div>,
                  onConfirm: () => {
                    // TODO handle the logout event
                    localStorage.removeItem('auth_token')
                    logout()
                  }
                })
              }
            }
          ]
        }}
      >
        <div className={css.user}>
          {user.nickname || user.account} <DownOutlined />
        </div>
      </Dropdown>
    </header>
  )
}

function SiteSidebar({
  routes,
  route
}: {
  route?: ResolvedRouteObject
  routes: ResolvedRouteObject[]
}) {
  const computed = useMemo(() => {
    const routeRef: Record<string, ResolvedRouteObject> = {}
    const prevent = (e: MouseEvent) => e.preventDefault()
    const toMenuItems = (list: ResolvedRouteObject[]): MenuItem[] => {
      return list
        .filter((item) => !item.route.hidden)
        .map<MenuItem>((item) => {
          routeRef[item.key] = item

          let icon = item.route.icon
          const Icon = item.route.iconComponent

          if (!icon && Icon) {
            icon = <Icon />
          }

          return {
            icon,
            key: item.key,
            label: item.path ? (
              <Link to={item.path} onClick={prevent}>
                {item.route.label}
              </Link>
            ) : (
              item.route.label
            ),
            children: item.children.length
              ? toMenuItems(item.children)
              : undefined
          }
        })
    }

    return { items: toMenuItems(routes), routeRef }
  }, [routes])

  const [openKeys, setOpenKeys] = useState<string[]>(
    route ? route.parentKeys : []
  )
  const navigate = useNavigate()
  const onSelect = useCallback<SelectEventHandler>(
    (info) => {
      const targetRoute = computed.routeRef[info.key]
      if (targetRoute && targetRoute.path) {
        navigate(targetRoute.path)
      }
    },
    [computed, navigate]
  )

  return (
    <aside className={css.sidebar}>
      <Menu
        mode="inline"
        theme="dark"
        items={computed.items}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        selectedKeys={route ? [route.key] : []}
        onSelect={onSelect}
      />
    </aside>
  )
}

function Loading() {
  return (
    <div className={css.loading}>
      <Spin size="small" />
    </div>
  )
}
