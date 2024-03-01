import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import UIContextProvider from '../UIContextProvider'
import AppContextProvider from '../AppContextProvider'
import Router from '../Router'

export default function Application() {
  return (
    <ConfigProvider locale={zhCN}>
      <UIContextProvider>
        <AppContextProvider>
          <Router />
        </AppContextProvider>
      </UIContextProvider>
    </ConfigProvider>
  )
}
