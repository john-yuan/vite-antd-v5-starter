import css from './index.module.less'
import { Button, Checkbox, Tooltip, Typography } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export interface ColumnInfo {
  key: string
  name?: string | React.ReactNode
  fixed?: 'left' | 'right'
  hidden?: boolean
  hideInSettings?: boolean
}

export interface Props {
  listClassName?: string
  columns: ColumnInfo[]
  onChange: (columns: ColumnInfo[]) => void
  onReset?: () => void
}

export default function QueryTableSettings({
  listClassName,
  columns: propColumns,
  onChange,
  onReset
}: Props) {
  const [columns, setColumns] = useState(propColumns)
  const { leftCols, rightCols, centerCols, visibleCount, totalCount } =
    splitColumns(columns)

  useEffect(() => {
    setColumns(propColumns)
  }, [propColumns])

  const updateColumn = (col: ColumnInfo) => {
    setColumns((prev) => prev.map((old) => (col.key === old.key ? col : old)))
  }

  return (
    <div className={css.settings}>
      <div className={css.header}>
        <div className={css.title}>
          <Checkbox
            checked={totalCount > 0 && visibleCount === totalCount}
            indeterminate={visibleCount > 0 && visibleCount < totalCount}
            onClick={() => {
              if (visibleCount === totalCount) {
                setColumns((prev) =>
                  prev.map((el) => ({
                    ...el,
                    hidden: true
                  }))
                )
              } else {
                setColumns((prev) =>
                  prev.map((el) => ({
                    ...el,
                    hidden: false
                  }))
                )
              }
            }}
          >
            列设置
          </Checkbox>
        </div>
        {onReset ? (
          <div className={css.action}>
            <Typography.Link
              onClick={() => {
                setColumns(propColumns)
                onReset()
              }}
            >
              恢复默认
            </Typography.Link>
          </div>
        ) : null}
        <div className={css.action}>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              onChange(columns)
            }}
          >
            应用
          </Button>
        </div>
      </div>
      <div className={css.border} />
      <div className={clsx(css.list, listClassName)}>
        <List
          title="固定在左侧"
          columns={leftCols}
          onMove={(cols) => setColumns([...cols, ...centerCols, ...rightCols])}
          onUpdate={updateColumn}
        />
        <List
          title="固定在右侧"
          columns={rightCols}
          onMove={(cols) => setColumns([...leftCols, ...centerCols, ...cols])}
          onUpdate={updateColumn}
        />
        <List
          title="不固定"
          columns={centerCols}
          onMove={(cols) => setColumns([...leftCols, ...cols, ...rightCols])}
          onUpdate={updateColumn}
        />
      </div>
    </div>
  )
}

function List({
  title,
  columns,
  onMove,
  onUpdate
}: {
  title: string
  columns: ColumnInfo[]
  onMove: (columns: ColumnInfo[]) => void
  onUpdate: (updated: ColumnInfo) => void
}) {
  return columns.length ? (
    <>
      <div className={css.listTitle}>{title}</div>
      {columns.map((col, i) => (
        <Row
          key={col.key}
          column={col}
          index={i}
          length={columns.length}
          onMove={(dir) => {
            const next = [...columns]
            const target = i + dir
            const old = columns[target]
            next[target] = col
            next[i] = old
            onMove(next)
          }}
          onUpdate={onUpdate}
        />
      ))}
    </>
  ) : null
}

function Row({
  column,
  length,
  index,
  onMove,
  onUpdate
}: {
  column: ColumnInfo
  index: number
  length: number
  onMove: (dir: -1 | 1) => void
  onUpdate: (column: ColumnInfo) => void
}) {
  let canUp = false
  let canDown = false

  if (length > 1) {
    canUp = index > 0
    canDown = index < length - 1
  }

  const delay = 1

  return (
    <div className={css.row}>
      <div className={css.name}>
        <Checkbox
          checked={!column.hidden}
          onClick={() => {
            onUpdate({ ...column, hidden: !column.hidden })
          }}
        >
          {column.name}
        </Checkbox>
      </div>
      {canUp ? (
        <Tooltip title="上移" mouseEnterDelay={delay}>
          <div className={css.icon} onClick={() => onMove(-1)}>
            <ArrowUpOutlined />
          </div>
        </Tooltip>
      ) : null}
      {canDown ? (
        <Tooltip title="下移" mouseEnterDelay={delay}>
          <div className={css.icon} onClick={() => onMove(1)}>
            <ArrowDownOutlined />
          </div>
        </Tooltip>
      ) : null}
      {column.fixed ? (
        <Tooltip title="取消固定" mouseEnterDelay={delay}>
          <div
            className={css.icon}
            onClick={() => {
              onUpdate({ ...column, fixed: undefined })
            }}
          >
            <VerticalAlignMiddleOutlined />
          </div>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="固定在左侧" mouseEnterDelay={delay}>
            <div
              className={css.icon}
              onClick={() => {
                onUpdate({ ...column, fixed: 'left' })
              }}
            >
              <VerticalAlignTopOutlined />
            </div>
          </Tooltip>
          <Tooltip title="固定在右侧" mouseEnterDelay={delay}>
            <div
              className={css.icon}
              onClick={() => {
                onUpdate({ ...column, fixed: 'right' })
              }}
            >
              <VerticalAlignBottomOutlined />
            </div>
          </Tooltip>
        </>
      )}
    </div>
  )
}

function splitColumns(columns: ColumnInfo[]) {
  const leftCols: ColumnInfo[] = []
  const centerCols: ColumnInfo[] = []
  const rightCols: ColumnInfo[] = []

  let totalCount = 0
  let visibleCount = 0

  columns.forEach((el) => {
    if (el.hideInSettings) {
      return
    }
    totalCount += 1
    if (!el.hidden) {
      visibleCount += 1
    }
    if (el.fixed === 'left') {
      leftCols.push(el)
    } else if (el.fixed === 'right') {
      rightCols.push(el)
    } else {
      centerCols.push(el)
    }
  })

  return { leftCols, centerCols, rightCols, totalCount, visibleCount }
}
