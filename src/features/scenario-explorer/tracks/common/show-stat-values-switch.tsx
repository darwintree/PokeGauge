import { useId } from "react"
import { useIntl } from "react-intl"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ShowStatValuesSwitch({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}) {
  const id = useId()
  const intl = useIntl()
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        size="sm"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-2 border-ink data-checked:bg-signal-yellow data-unchecked:bg-paper [&_[data-slot=switch-thumb]]:size-2.5 [&_[data-slot=switch-thumb]]:bg-ink"
      />
      <Label htmlFor={id} className="cursor-pointer text-[10.5px] font-bold">
        {label ?? intl.formatMessage({ id: "stat.showValue" })}
      </Label>
    </div>
  )
}
