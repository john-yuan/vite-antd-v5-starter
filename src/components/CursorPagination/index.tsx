import { useCallback, useMemo, useRef } from 'react'
import { Button, Select } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import css from './index.module.less'
import clsx from 'clsx'

export type CursorPaginationArgs = {
  after?: string
  before?: string
  first?: number
  last?: number
}

const OPTIONS = [
  { value: 10, label: '10 条/页' },
  { value: 20, label: '20 条/页' },
  { value: 50, label: '50 条/页' },
  { value: 100, label: '100 条/页' }
]

export interface CursorPageChangeEvent {
  type: 'prev' | 'next' | 'start' | 'end' | 'size'
  size: number
  args: CursorPaginationArgs
  startCursor?: string
  endCursor?: string
}

export interface CursorPageInfo {
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  startCursor?: string
  endCursor?: string
  total?: number
  loading?: boolean
  size?: number
}

export interface Props extends CursorPageInfo {
  className?: string
  onChange?: (event: CursorPageChangeEvent) => void
}

export default function CursorPagination(props: Props) {
  const ref = useRef({ props })

  ref.current.props = props

  const { hasNextPage, hasPreviousPage, total } = props

  const { onPrev, onNext, onStart, onEnd } = useMemo(() => {
    const send = (type: CursorPageChangeEvent['type']) => {
      const { startCursor, endCursor, loading, onChange } = ref.current.props
      const size = ref.current.props.size || 50

      if (!loading && onChange) {
        let args: CursorPaginationArgs = {}
        switch (type) {
          case 'prev':
            args = {
              before: startCursor,
              last: size
            }
            break
          case 'next':
            args = {
              after: endCursor,
              first: size
            }
            break
          case 'start':
            args = {
              first: size
            }
            break
          case 'end':
            args = {
              last: size
            }
            break
        }
        onChange({ type, startCursor, endCursor, size, args })
      }
    }
    return {
      onPrev: () => send('prev'),
      onNext: () => send('next'),
      onStart: () => send('start'),
      onEnd: () => send('end')
    }
  }, [ref])

  const onSizeChange = useCallback(
    (size: number) => {
      ref.current.props.onChange?.({
        size: size,
        type: 'size',
        args: {
          first: size
        }
      })
    },
    [ref]
  )

  return (
    <div className={clsx(css.pagination, props.className)}>
      {props.loading && (
        <div className={css.loading}>
          <LoadingOutlined />
        </div>
      )}
      {props.total ? <div className={css.info}>共 {total} 条数据</div> : null}
      <div>
        <Button.Group size="small">
          <Button disabled={!hasPreviousPage} onClick={onStart}>
            首页
          </Button>
          <Button disabled={!hasPreviousPage} onClick={onPrev}>
            上一页
          </Button>
        </Button.Group>
      </div>
      <div>
        <Select
          options={OPTIONS}
          value={props.size || 50}
          onChange={onSizeChange}
          size="small"
        />
      </div>
      <div>
        <Button.Group size="small">
          <Button onClick={onNext} disabled={!hasNextPage}>
            下一页
          </Button>
          <Button disabled={!hasNextPage} onClick={onEnd}>
            尾页
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}
