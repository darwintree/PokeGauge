import { FormattedMessage, useIntl } from "react-intl"

import type { UsageSource } from "@/lib/usage-source-preference"
import { USAGE_SOURCES, usageSourceMessageId } from "@/lib/usage-source-preference"
import { cn } from "@/lib/utils"

export function UsageSourceSelect({
  value,
  onChange,
  className,
  id,
  describedBy,
}: {
  value: UsageSource
  onChange: (source: UsageSource) => void
  className?: string
  id?: string
  describedBy?: string
}) {
  const intl = useIntl()
  return (
    <select
      id={id}
      aria-label={intl.formatMessage({ id: "settings.usageSource.label" })}
      aria-describedby={describedBy}
      value={value}
      onChange={(event) => onChange(event.target.value as UsageSource)}
      className={cn(
        "rounded-md border border-hud-frame bg-paper font-bold",
        className,
      )}
    >
      {USAGE_SOURCES.map((source) => (
        <option key={source} value={source}>
          <FormattedMessage id={usageSourceMessageId(source)} />
        </option>
      ))}
    </select>
  )
}
