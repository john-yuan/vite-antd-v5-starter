import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import clsx from 'clsx'
import type { QueryFormField, QueryFormRef } from './types'
import css from './index.module.less'
import ResponsiveGrid from '../ResponsiveGrid'

function FormField({
  field,
  hidden
}: {
  field: QueryFormField
  hidden: boolean
}) {
  const Field = field.component
  return (
    <div className={css.item} data-hidden={hidden}>
      <Form.Item label={field.label} name={field.name}>
        {Field ? (
          <Field {...field.props} />
        ) : (
          <Input placeholder="请输入" allowClear {...field.props} />
        )}
      </Form.Item>
    </div>
  )
}

function FormGrid({
  fields,
  visibleCount,
  minWidth,
  onChange
}: {
  fields?: QueryFormField[]
  visibleCount: number
  minWidth?: number
  onChange: (columnCount: number) => void
}) {
  return (
    <ResponsiveGrid
      className={css.grid}
      columnGap={16}
      minColumnWidth={minWidth || 240}
      onChange={onChange}
    >
      {fields?.map((field, index) => (
        <MemoFormField
          key={field.name}
          field={field}
          hidden={index >= visibleCount}
        />
      ))}
    </ResponsiveGrid>
  )
}

const MemoFormField = memo(FormField)
const MemoFormGrid = memo(FormGrid)

export interface Props {
  className?: string
  style?: React.CSSProperties
  fields?: QueryFormField[]
  loading?: boolean
  formRef?: QueryFormRef
  manual?: boolean
  minWidth?: number
  searchText?: string
  resetText?: string
  defaultCollapsed?: boolean
  disableCollapse?: boolean
  storageKey?: string
  getResetValues?: () => Record<string, any>
  onSearch?: (values: any, reset: boolean) => void
  onValuesChange?: (changedValues: any, values: any) => void
}

export default function QueryForm({
  className,
  style,
  fields,
  loading,
  formRef,
  manual,
  minWidth,
  searchText,
  resetText,
  disableCollapse,
  defaultCollapsed,
  storageKey,
  getResetValues,
  onSearch,
  onValuesChange
}: Props) {
  const [form] = Form.useForm()
  const [columnCount, setColumnCount] = useState(0)
  const [collapsed, setCollapsed] = useState(() =>
    storageKey ? localStorage.getItem(storageKey) === 'Y' : defaultCollapsed
  )
  const ref = useRef({ form, fields, onSearch, getResetValues })
  const fieldCount = fields ? fields.length : 0
  let visibleCount =
    !disableCollapse && collapsed ? columnCount - 1 : fieldCount

  if (visibleCount === 0 && fieldCount) {
    visibleCount = 1
  }

  const hasMoreSpace = useMemo(() => {
    if (columnCount > 1) {
      if (visibleCount % columnCount) {
        return true
      }
    }
    return false
  }, [columnCount, visibleCount])

  const setValues = useCallback(
    (values: any) => {
      ref.current.form.setFieldsValue(values)
    },
    [ref]
  )

  const handleReset = useCallback(() => {
    const newValues: Record<string, any> = ref.current.getResetValues?.() || {}

    ref.current.fields?.forEach((el) => {
      if (!(el.name in newValues)) {
        newValues[el.name] = undefined
      }
    })

    ref.current.form.setFieldsValue(newValues)

    if (ref.current.onSearch) {
      ref.current.onSearch(ref.current.form.getFieldsValue(), true)
    }
  }, [ref])

  const handleSearch = useCallback(() => {
    const values = ref.current.form.getFieldsValue()
    if (ref.current.onSearch) {
      ref.current.onSearch(values, false)
    }
  }, [ref])

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev

      if (storageKey) {
        localStorage.setItem(storageKey, next ? 'Y' : 'N')
      }

      return next
    })
  }, [storageKey])

  const initRef = useRef({ manual, handleSearch })

  useEffect(() => {
    if (!initRef.current.manual) {
      initRef.current.handleSearch()
    }
  }, [initRef])

  ref.current.form = form
  ref.current.fields = fields
  ref.current.onSearch = onSearch
  ref.current.getResetValues = getResetValues

  if (formRef) {
    formRef.setValues = setValues
    formRef.triggerSearch = handleSearch
  }

  return (
    <div className={clsx(css.container, className)} style={style}>
      <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
        <MemoFormGrid
          fields={fields}
          visibleCount={visibleCount}
          minWidth={minWidth}
          onChange={setColumnCount}
        />
      </Form>
      <div className={css.actions} data-compact={hasMoreSpace}>
        <Button onClick={handleReset}>{resetText || '重置'}</Button>
        <Button type="primary" onClick={handleSearch} loading={loading}>
          {searchText || '查询'}
        </Button>
        {!disableCollapse && fieldCount >= columnCount && (
          <div className={css.toggle} onClick={handleToggle}>
            {collapsed ? (
              <>
                <DownOutlined />
                <span>展开</span>
              </>
            ) : (
              <>
                <UpOutlined />
                <span>收起</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
