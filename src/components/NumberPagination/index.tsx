import type { PaginationProps } from 'antd'
import { Pagination, Tooltip } from 'antd'
import css from './index.module.less'
import { LoadingOutlined } from '@ant-design/icons'
import clsx from 'clsx'

export interface Props {
  className?: string
  page: number
  size: number
  total: number
  loading?: boolean
  onChange: (page: number, size: number) => void
}

const showTotal: PaginationProps['showTotal'] = (total, [from, to]) =>
  `第 ${from}-${to} 条 / 共 ${total} 条`

export default function NumberPagination({
  className,
  page,
  size,
  total,
  onChange,
  loading
}: Props) {
  return (
    <div className={clsx(css.container, className)}>
      <div className={css.sep} />
      {loading ? (
        <Tooltip title="正在拼命加载分页信息">
          <div className={css.loading}>
            <div className={css.icon}>
              <LoadingOutlined />
            </div>
          </div>
        </Tooltip>
      ) : null}
      <div className={css.pagination}>
        <Pagination
          size="small"
          current={page}
          pageSize={size}
          total={total}
          onChange={onChange}
          disabled={loading}
          showTotal={showTotal}
          showSizeChanger
        />
      </div>
    </div>
  )
}
