import './index.less'
import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Loading from './boot/Loading'

const Application = lazy(() => import('./boot/Application'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <React.Suspense fallback={<Loading />}>
        <Application />
      </React.Suspense>
    </ConfigProvider>
  </React.StrictMode>
)
