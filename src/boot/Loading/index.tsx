import { Spin } from 'antd'
import css from './index.module.less'

export default function Loading() {
  return (
    <div className={css.loading}>
      <Spin size="small" />
    </div>
  )
}
