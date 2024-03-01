import type { PopoverProps } from 'antd'
import { Popover, Tooltip, Checkbox } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import classNames from 'classnames'
import SettingOutlined from '@ant-design/icons/lib/icons/SettingOutlined'
import type {
  CheckboxType,
  ColumnSettingsProps,
  TooltipType
} from '@zbanx/ui/es/ColumnSettings'
import ColumnSettings from '@zbanx/ui/es/ColumnSettings'
import css from './index.module.less'

const ALIGN = { offset: [-12, -14] }

const CustomCheckbox: CheckboxType = ({ indeterminate, checked, onClick }) => {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={onClick}
    />
  )
}

const CustomTooltip: TooltipType = ({ title, children }) => {
  return <Tooltip title={title}>{children}</Tooltip>
}

export interface Props extends ColumnSettingsProps {
  className?: string
  placement?: TooltipPlacement
  trigger?: PopoverProps['trigger']
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ColumnSettingsIcon({
  className,
  placement,
  trigger,
  onOpenChange,
  open,
  ...props
}: Props) {
  return (
    <Popover
      placement={placement || 'leftBottom'}
      trigger={trigger || 'click'}
      align={ALIGN}
      overlayClassName={css.overlay}
      onOpenChange={onOpenChange}
      open={open}
      content={
        <div className="zui-scrollbar">
          <ColumnSettings
            checkboxComponent={CustomCheckbox}
            tooltipComponent={CustomTooltip}
            {...props}
          />
        </div>
      }
    >
      <SettingOutlined className={classNames(className, css.icon)} />
    </Popover>
  )
}
