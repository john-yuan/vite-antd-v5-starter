import type { ComponentType, ReactNode } from 'react'

export interface QueryFormField {
  name: string
  label: ReactNode
  props?: Record<string, any>
  component?: ComponentType<any>
}

export interface QueryFormRef {
  setValues: (values: any) => void
  triggerSearch: () => void
}
