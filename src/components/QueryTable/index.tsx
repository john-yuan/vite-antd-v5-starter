import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ColumnType, TableProps } from 'antd/es/table'
import type { QueryFormField } from '../QueryForm/types'
import type { CursorPageChangeEvent, CursorPageInfo } from '../CursorPagination'
import type {
  QueryTableColumn,
  QueryTableExtraItem,
  QueryTableField,
  QueryTablePageInfo,
  QueryTableParams,
  QueryTableRef,
  QueryTableSearchFn
} from './types'
import Table from 'antd/es/table'
import QueryForm from '../QueryForm'
import CursorPagination from '../CursorPagination'
import NumberPagination from '../NumberPagination'
import { ReloadOutlined } from '@ant-design/icons'
import { useQueryFormRef } from '../QueryForm/hooks'
import css from './index.module.less'

const MemoedTable = React.memo(Table)
export type RowSelection<T = any> = Required<TableProps<T>>['rowSelection']

export type ColumnInfo = {
  key: string
  name?: string | React.ReactNode
  fixed?: 'left' | 'right'
  hidden?: boolean
  hideInSettings?: boolean
}

function Toolbar({
  title,
  titleNode,
  extraToolbarItems,
  reload
}: {
  title?: string
  titleNode?: React.ReactNode
  extraToolbarItems?: QueryTableExtraItem[]
  reload?: () => void
}) {
  let text = title

  if (titleNode) {
    text = undefined
  }

  return (
    <div className={css.toolbar}>
      {text || !titleNode ? <div className={css.title}>{text}</div> : null}
      {titleNode ? <div className={css.titleNode}>{titleNode}</div> : null}
      {extraToolbarItems?.map((el) => (
        <div key={el.key} className={css.action}>
          {el.content}
        </div>
      ))}
      {reload ? (
        <div className={css.action}>
          <ReloadOutlined className={css.icon} onClick={reload} />
        </div>
      ) : null}
    </div>
  )
}

function useColumns(
  columns: QueryTableColumn[],
  extraQueryFields?: QueryTableField[]
) {
  return useMemo(() => {
    let totalWidth = 0

    const queryFields: QueryTableField[] = []
    const settingColumns: ColumnInfo[] = []
    const columnMap: Record<string, ColumnType<any>> = {}

    const cols: ColumnType<any>[] = columns.map((col, index) => {
      const width = col.width || 100

      totalWidth += width

      let render: ((_: any, row: any) => React.ReactNode) | undefined

      const colRender = col.render
      const ColComponent = col.component

      if (colRender) {
        render = (_, row) => colRender(row)
      } else if (ColComponent) {
        render = (_, row) => <ColComponent data={row} />
      }

      const dataIndex = col.dataIndex || col.key
      const item: ColumnInfo = {
        key: dataIndex || `${index}`,
        name: col.settingName || '',
        fixed: col.fixed,
        hideInSettings: col.hideInSettings
      }

      settingColumns.push(item)

      if (!item.name) {
        if (typeof col.title === 'string') {
          item.name = col.title
        } else {
          item.name = item.key
        }
      }

      if (col.query) {
        if (col.query === true) {
          if (dataIndex) {
            const field: QueryFormField = {
              label: dataIndex,
              name: dataIndex
            }
            if (typeof col.title === 'string') {
              field.label = col.title
            }
            queryFields.push({ order: col.queryOrder, field })
          }
        } else {
          const field: QueryFormField = {
            label: col.query.label || '',
            name: col.query.name || dataIndex || '',
            ...col.query
          }
          if (!field.label) {
            if (typeof col.title === 'string') {
              field.label = col.title
            } else {
              field.label = dataIndex || ''
            }
          }
          if (field.name) {
            queryFields.push({ order: col.queryOrder, field })
          }
        }
      }

      if (!render && col.valueEnum) {
        const map = col.valueEnum
        render = (val: any) => <>{map[val]}</>
      }

      const finalCol: ColumnType<any> = {
        key: col.key || col.dataIndex,
        dataIndex: col.dataIndex || col.key,
        title: col.title || col.dataIndex || col.key,
        fixed: col.fixed,
        align: col.align,
        width,
        render
      }

      if (finalCol.key) {
        columnMap[finalCol.key as string] = finalCol
      }

      return finalCol
    })

    if (extraQueryFields) {
      extraQueryFields.forEach((el) => {
        queryFields.push(el)
      })
    }

    queryFields.sort((a, b) => (a.order || 0) - (b.order || 0))

    return {
      cols,
      columnMap,
      settingColumns,
      scroll: { x: totalWidth },
      fields: queryFields.map((el) => el.field)
    }
  }, [columns, extraQueryFields])
}

export interface Props {
  columns: QueryTableColumn[]
  extraQueryFields?: QueryTableField[]
  rowKey?: string
  tableRef?: QueryTableRef
  defaultPageSize?: 10 | 20 | 50 | 100
  title?: string
  titleNode?: React.ReactNode
  extraToolbarItems?: QueryTableExtraItem[]

  /**
   * 分页模式
   *
   * - `number` 数字模式
   * - `cursor` 游标模式
   */
  paginationMode?: 'number' | 'cursor'

  /**
   * 是否隐藏分页
   */
  hidePagination?: boolean | 'show-total-only'

  /**
   * 是否隐藏搜索表单
   */
  hideForm?: boolean

  /**
   * 是否隐藏标题
   */
  hideTitle?: boolean

  /**
   * 搜索数据回调
   */
  onSearch?: QueryTableSearchFn

  /**
   * 手动触发首次搜索
   */
  manual?: boolean

  /**
   * 初始数据
   */
  initialData?: any[]

  /**
   * 本地存储 KEY
   */
  storageKey?: string

  /**
   * 本地存储版本
   */
  storageVersion?: string

  /**
   * 列选择操作
   */
  rowSelection?: RowSelection

  /**
   * 用于返回用户点击重置时回填的数据
   */
  getResetValues?: () => Record<string, any>

  /**
   * 吸顶偏移量
   */
  stickyOffset?: number

  /**
   * 表单和表格中间区域内容
   */
  between?: React.ReactNode
}

function InnerQueryTable({
  title,
  titleNode,
  extraToolbarItems,
  columns,
  extraQueryFields,
  rowKey,
  tableRef,
  defaultPageSize,
  paginationMode = 'number',
  hidePagination,
  hideForm,
  hideTitle,
  manual,
  initialData,
  storageKey,
  rowSelection,
  getResetValues,
  stickyOffset,
  between,
  onSearch
}: Props) {
  const formRef = useQueryFormRef()
  const [state, setState] = useState<{
    loading: boolean
    data: any[]
  }>({ loading: false, data: initialData || [] })

  const [cursorPage, setCursorPage] = useState<CursorPageInfo>({
    size: defaultPageSize || 50
  })

  const [numberPage, setNumberPage] = useState<{
    page: number
    size: number
    total: number
    loading?: boolean
  }>({
    page: 1,
    total: 0,
    size: defaultPageSize || 50
  })

  const paramsRef = useRef<QueryTableParams>({
    paginationMode,
    formValues: {},
    cursorPagination: {
      first: cursorPage.size
    },
    numberPagination: {
      page: numberPage.page,
      size: numberPage.size
    }
  })

  const { fields, cols, scroll } = useColumns(columns, extraQueryFields)

  const ref = useRef({
    onSearch,
    cursorPage,
    defaultPageSize,
    reqLock: 0
  })

  ref.current.onSearch = onSearch
  ref.current.cursorPage = cursorPage
  paramsRef.current.paginationMode = paginationMode

  const execSearch = useCallback(() => {
    ref.current.reqLock += 1

    const { reqLock } = ref.current
    const { paginationMode } = paramsRef.current

    if (ref.current.onSearch) {
      setState((prev) =>
        prev.loading ? prev : { loading: true, data: prev.data }
      )

      if (paginationMode === 'cursor') {
        setCursorPage((prev) => ({ ...prev, loading: true }))
      } else {
        setNumberPage((prev) => ({
          ...prev,
          loading: true,
          page: paramsRef.current.numberPagination.page || prev.page,
          size: paramsRef.current.numberPagination.size || prev.size
        }))
      }

      const setPage = (res: QueryTablePageInfo) => {
        if (reqLock === ref.current.reqLock) {
          if (paginationMode === 'cursor') {
            setCursorPage((prev) => ({
              size: prev.size,
              loading: false,
              total: res.total,
              ...res.cursorPagination
            }))
          } else {
            setNumberPage((prev) => ({
              ...prev,
              loading: false,
              total: res.total || prev.total
            }))
          }
        }
      }

      const clearOnError = (err: Error) => {
        if (reqLock === ref.current.reqLock) {
          setState({ loading: false, data: [] })
          if (paginationMode === 'cursor') {
            setCursorPage((prev) => ({
              size: prev.size,
              loading: false,
              total: 0
            }))
          } else {
            setNumberPage((prev) => ({
              ...prev,
              loading: false,
              total: 0,
              page: 1
            }))
          }
        }
        console.error(err)
      }

      ref.current
        .onSearch(paramsRef.current)
        .then((res) => {
          if (reqLock === ref.current.reqLock) {
            setState({ loading: false, data: res.data })
            if (res.count) {
              return res.count().then(setPage)
            } else {
              setPage(res)
            }
          }
        })
        .catch(clearOnError)
    }
  }, [ref, paramsRef])

  const handleSearch = useCallback(
    (values: any) => {
      paramsRef.current.formValues = values

      if (paramsRef.current.paginationMode === 'cursor') {
        paramsRef.current.cursorPagination = {
          first: ref.current.cursorPage.size
        }
      } else {
        paramsRef.current.numberPagination.page = 1
      }

      execSearch()
    },
    [ref, paramsRef, execSearch]
  )

  const handleCursorPageChange = useCallback(
    (event: CursorPageChangeEvent) => {
      if (event.type === 'size') {
        setCursorPage((prev) => ({ ...prev, size: event.size }))
      }
      paramsRef.current.cursorPagination = event.args
      execSearch()
    },
    [paramsRef, execSearch]
  )

  const handleNumberPageChange = useCallback(
    (page: number, size: number) => {
      const prev = paramsRef.current.numberPagination
      paramsRef.current.numberPagination.page = page || prev.page
      paramsRef.current.numberPagination.size = size || prev.size
      execSearch()
    },
    [paramsRef, execSearch]
  )

  const titleRender = useMemo(() => {
    return () => (
      <Toolbar
        title={title}
        titleNode={titleNode}
        extraToolbarItems={extraToolbarItems}
        reload={execSearch}
      />
    )
  }, [title, titleNode, extraToolbarItems, execSearch])

  const initRef = useRef({ formRef, hideForm, execSearch, manual, initialData })

  initRef.current.execSearch = execSearch
  initRef.current.hideForm = hideForm

  const triggerSearch = useCallback(() => {
    const curr = initRef.current
    if (curr.hideForm) {
      curr.execSearch()
    } else {
      curr.formRef.triggerSearch()
    }
  }, [initRef])

  const setValues = useCallback(
    (values: any) => {
      formRef.setValues(values)
    },
    [formRef]
  )

  useEffect(() => {
    const curr = initRef.current
    if (!curr.manual && !curr.initialData) {
      if (curr.hideForm) {
        curr.execSearch()
      } else {
        curr.formRef.triggerSearch()
      }
    }
  }, [initRef])

  if (tableRef) {
    tableRef.reload = execSearch
    tableRef.setValues = setValues
    tableRef.triggerSearch = triggerSearch
  }

  const total =
    paginationMode === 'cursor' ? cursorPage.total : numberPage.total
  const sticky = useMemo(
    () =>
      stickyOffset
        ? {
            offsetHeader: stickyOffset
          }
        : true,
    [stickyOffset]
  )

  return (
    <>
      {!hideForm && (
        <QueryForm
          manual
          formRef={formRef}
          fields={fields}
          loading={state.loading}
          getResetValues={getResetValues}
          onSearch={handleSearch}
          storageKey={storageKey ? `${storageKey}_closed` : undefined}
        />
      )}
      {between}
      <MemoedTable
        sticky={sticky}
        className={css.table}
        title={hideTitle ? undefined : titleRender}
        pagination={false}
        rowKey={rowKey || 'id'}
        loading={state.loading}
        dataSource={state.data}
        scroll={scroll}
        columns={cols}
        rowSelection={rowSelection}
      />
      {!hidePagination && (
        <>
          {paginationMode === 'cursor' ? (
            <CursorPagination
              {...cursorPage}
              className={css.cursorPage}
              onChange={handleCursorPageChange}
            />
          ) : (
            <NumberPagination
              className={css.numberPage}
              {...numberPage}
              onChange={handleNumberPageChange}
            />
          )}
        </>
      )}
      {hidePagination === 'show-total-only' && (
        <div className={css.emptyPage}>
          {total != null ? `共 ${total} 条数据` : null}
        </div>
      )}
    </>
  )
}

const QueryTable = React.memo(InnerQueryTable)

export default QueryTable
