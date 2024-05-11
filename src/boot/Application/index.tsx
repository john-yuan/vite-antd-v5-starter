import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Router from '../Router'
import Context from '../Context'

export default function Application() {
  return (
    <ConfigProvider locale={zhCN}>
      <Context>
        <Router />
      </Context>
    </ConfigProvider>
  )
}
