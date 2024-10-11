import { useEffect, useRef, useState } from 'react'
import type { ColumnInfo } from '.'

// [key: string, hideInSettings: 0|1, hidden: 0|1, fixed: 0|left(1)|right(2)]
type Column = [string, number, number, number]

export function useQueryTableSettings({
  columns,
  storageKey,
  storageVersion
}: {
  columns: ColumnInfo[]
  storageKey?: string
  storageVersion?: string | number
}) {
  const ref = useRef({ columns, storageKey, storageVersion })
  const state = useState<ColumnInfo[]>(() => {
    return getColumns(columns, storageKey, storageVersion)
  })

  const settingColumns = state[0]
  const setColumns = state[1]

  useEffect(() => {
    if (
      !(
        ref.current.columns === columns &&
        ref.current.storageKey === storageKey &&
        ref.current.storageVersion === storageVersion
      )
    ) {
      ref.current.columns = columns
      ref.current.storageKey = storageKey
      ref.current.storageVersion = storageVersion
      setColumns(getColumns(columns, storageKey, storageVersion))
    }
  }, [ref, columns, storageKey, storageVersion])

  useEffect(() => {
    if (storageKey) {
      const data: Column[] = settingColumns.map<Column>((col) => [
        col.key,
        col.hideInSettings ? 1 : 0,
        col.hidden ? 1 : 0,
        col.fixed === 'left' ? 1 : col.fixed === 'right' ? 2 : 0
      ])
      const saved: (Column[] | number | string)[] = [data]
      if (storageVersion != null) {
        saved.push(storageVersion)
      }
      localStorage.setItem(storageKey, JSON.stringify(saved))
    }
  }, [settingColumns, storageKey, storageVersion])

  return state
}

function getColumns(
  columns: ColumnInfo[],
  storageKey?: string,
  ver?: string | number
) {
  if (storageKey) {
    const text = localStorage.getItem(storageKey)
    if (text) {
      try {
        const arr = JSON.parse(text) as [Column[], string | number]
        if ((ver == null && arr[1] == null) || ver == arr[1]) {
          const data = arr[0]
          const savedKeys = data
            .map<[string, number]>((el) => [el[0], el[1]])
            .sort((a, b) => a[0].localeCompare(b[0]))

          const columnsMap: Record<string, ColumnInfo> = {}

          const currentKeys = columns
            .map<[string, number]>((col) => {
              columnsMap[col.key] = col
              return [col.key, col.hideInSettings ? 1 : 0]
            })
            .sort((a, b) => a[0].localeCompare(b[0]))

          if (JSON.stringify(savedKeys) === JSON.stringify(currentKeys)) {
            return data.map<ColumnInfo>((info) => {
              const col: ColumnInfo = {
                key: info[0],
                name: info[0], // default to the key
                hideInSettings: !!info[1],
                hidden: !!info[2]
              }

              if (info[3] === 1) {
                col.fixed = 'left'
              } else if (info[3] === 2) {
                col.fixed = 'right'
              }

              const ref = columnsMap[col.key]

              if (ref) {
                col.name = ref.name
              }

              return col
            })
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  return columns
}
