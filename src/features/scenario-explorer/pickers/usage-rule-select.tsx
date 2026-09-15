import { useIntl } from "react-intl"

import type { UsageRule } from "@/lib/usage-source-preference"
import { cn } from "@/lib/utils"

export function UsageRuleSelect({
  value,
  rules,
  onChange,
  className,
  id,
  describedBy,
}: {
  value: string | null
  rules: readonly UsageRule[]
  onChange: (ruleId: string) => void
  className?: string
  id?: string
  describedBy?: string
}) {
  const intl = useIntl()
  return (
    <select
      id={id}
      aria-label={intl.formatMessage({ id: "settings.usageRule.label" })}
      aria-describedby={describedBy}
      value={value ?? ""}
      disabled={rules.length === 0}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "rounded-md border border-hud-frame bg-paper font-bold",
        className,
      )}
    >
      {rules.map((rule) => (
        <option key={rule.id} value={rule.id}>
          {rule.label}
        </option>
      ))}
    </select>
  )
}
