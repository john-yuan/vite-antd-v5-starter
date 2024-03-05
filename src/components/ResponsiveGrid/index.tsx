import clsx from 'clsx'
import { useCallback, useMemo } from 'react'
import { useResponsiveGridCalculator } from './hooks'
import type { CSSProperties } from 'react'

import css from './index.module.less'

export interface ResponsiveGridProps {
  columnGap: number
  minColumnWidth: number
  className?: string
  children?: React.ReactNode
  onChange?: (columnCount: number) => void
  onSizeChange?: (container: HTMLDivElement, columnCount: number) => void
}

export default function ResponsiveGrid({
  className,
  children,
  columnGap,
  minColumnWidth,
  onChange,
  onSizeChange
}: ResponsiveGridProps) {
  const style = useMemo<CSSProperties>(
    () => ({
      columnGap
    }),
    [columnGap]
  )

  const handleChange = useCallback(
    (elem: HTMLDivElement, columnCount: number) => {
      elem.setAttribute('data-col-num', `${columnCount}`)
      onChange && onChange(columnCount)
      onSizeChange && onSizeChange(elem, columnCount)
    },
    [onChange, onSizeChange]
  )

  const measureRef = useResponsiveGridCalculator({
    columnGap,
    minColumnWidth,
    onSizeChange: handleChange
  })

  return (
    <div ref={measureRef} style={style} className={clsx(css.grid, className)}>
      {children}
    </div>
  )
}
