import './index.less'
import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import Loading from './boot/Loading'

const Application = lazy(() => import('./boot/Application'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<Loading />}>
      <Application />
    </React.Suspense>
  </React.StrictMode>
)
