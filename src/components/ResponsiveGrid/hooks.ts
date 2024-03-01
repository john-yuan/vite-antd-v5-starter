import { useCallback, useEffect, useRef } from 'react'

export interface Options {
  columnGap: number
  minColumnWidth: number
  maxColumnCount?: number
  onSizeChange: (container: HTMLDivElement, columnCount: number) => void
}

export function useResponsiveGridCalculator(options: Options) {
  const ref = useRef<{
    options: Options
    force?: boolean
    containerWidth?: number | null
    unobserve?: (() => void) | null
    calculate?: (() => void) | null
  }>({ options })

  ref.current.options = options

  const containerRef = useCallback(
    (elem: HTMLDivElement | null) => {
      ref.current.calculate = null

      if (ref.current.unobserve) {
        ref.current.unobserve()
        ref.current.unobserve = null
      }

      if (elem) {
        const container = elem
        const calculate = () => {
          const containerWidth = container.offsetWidth

          if (containerWidth <= 0) {
            return
          }

          if (
            ref.current.force ||
            ref.current.containerWidth !== containerWidth
          ) {
            const {
              columnGap,
              minColumnWidth,
              maxColumnCount = 12,
              onSizeChange
            } = ref.current.options
            let columnCount = Math.floor(
              (containerWidth + columnGap) / (minColumnWidth + columnGap)
            )

            columnCount = columnCount < 1 ? 1 : columnCount
            columnCount =
              columnCount > maxColumnCount ? maxColumnCount : columnCount
            ref.current.containerWidth = containerWidth
            ref.current.force = false
            onSizeChange(container, columnCount)
          }
        }

        const observer = new ResizeObserver(calculate)

        observer.observe(container)

        ref.current.calculate = calculate
        ref.current.unobserve = () => {
          observer.disconnect()
          ref.current.unobserve = null
        }

        calculate()
      }
    },
    [ref]
  )

  const { columnGap, minColumnWidth, maxColumnCount, onSizeChange } = options

  useEffect(() => {
    ref.current.force = true
    ref.current.options.columnGap = columnGap
    ref.current.options.minColumnWidth = minColumnWidth
    ref.current.options.maxColumnCount = maxColumnCount
    ref.current.options.onSizeChange = onSizeChange
    ref.current.calculate?.()
  }, [ref, columnGap, minColumnWidth, maxColumnCount, onSizeChange])

  return containerRef
}
