import { useId } from "react"
import { FormattedMessage } from "react-intl"

import { Switch } from "@/components/ui/switch"

type TrackDescriptionToggleProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function TrackDescriptionToggle({
  checked,
  onCheckedChange,
}: TrackDescriptionToggleProps) {
  const labelId = useId()

  return (
    <div className="flex min-h-8 items-center gap-2 rounded-md px-2 hover:bg-token-bg/60">
      <span id={labelId} className="text-xs font-extrabold">
        <FormattedMessage id="track.showDescriptions" />
      </span>
      <Switch
        size="sm"
        aria-labelledby={labelId}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}
