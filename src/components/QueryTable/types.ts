import type React from 'react'
import type { ComponentType } from 'react'

export interface QueryTableRef {
  reload: () => void
  setValues: (values: any) => void
  triggerSearch: () => void
}

export interface QueryTableToolbarItem {
  key: string | number
  content: React.ReactNode
}

export interface QueryTableCursorPagination {
  first?: number
  last?: number
  before?: string
  after?: string
}

export interface QueryTableParams<T extends Record<string, any> = any> {
  paginationMode: 'cursor' | 'number'

  /**
   * 当前表单数据
   */
  formValues: T

  /**
   * 数字分页的数据
   */
  numberPagination: {
    page?: number
    size?: number
  }

  /**
   * Cursor 分页方式的数据
   */
  cursorPagination: QueryTableCursorPagination
}

export interface QueryTablePageInfo {
  total?: number
  cursorPagination?: {
    hasNextPage?: boolean
    hasPreviousPage?: boolean
    startCursor?: string
    endCursor?: string
  }
}

export interface QueryTableSearchResult<T = any> extends QueryTablePageInfo {
  data: T[]
  count?: () => Promise<QueryTablePageInfo>
}

export type QueryTableSearchFn<T = any, P extends Record<string, any> = any> = (
  params: QueryTableParams<P>
) => Promise<QueryTableSearchResult<T>>

export interface QueryTableColumn<T = any> {
  /**
   * 如果不填写默认使用 dataIndex
   */
  key?: string

  /**
   * 透传给 ProTable，用于取数据，如果不填写默认使用 key
   */
  dataIndex?: string

  /**
   * 表头
   */
  title?: React.ReactNode

  /**
   * 列设置中的名字
   */
  settingName?: React.ReactNode

  /**
   * 是否可以在列设置中配置（默认 true）
   */
  hideInSettings?: boolean

  /**
   * 是否固定
   */
  fixed?: 'left' | 'right'

  /**
   * 列宽
   */
  width?: number

  /**
   * 数据映射
   */
  valueEnum?: Record<string, string | React.ReactNode>

  /**
   * 对齐方式
   */
  align?: 'left' | 'right' | 'center'

  /**
   * 默认隐藏
   */
  defaultHidden?: boolean

  /**
   * 指定一个用于渲染当前单元格数据的组件
   */
  component?: ComponentType<{ data: T }>

  /**
   * 自定义单元格渲染函数
   */
  render?: (data: T) => React.ReactNode
}
