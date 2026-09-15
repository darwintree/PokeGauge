import { RefreshCw } from "lucide-react"
import { FormattedMessage, FormattedRelativeTime, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import {
  applyUsageStorePending,
  refreshUsageStore,
  setUsageStoreRule,
  setUsageStoreSource,
  useUsageStore,
} from "@/lib/usage-store"
import type { UsageSource } from "@/lib/usage-source-preference"
import { cn } from "@/lib/utils"

import { UsageRuleSelect } from "./usage-rule-select"
import { UsageSourceSelect } from "./usage-source-select"

const HUD_CHIP_BUTTON =
  "border border-hud-frame bg-paper font-bold shadow-hud-chip hover:bg-token-bg/60"

function relativeSeconds(fetchedAt: number): number {
  return Math.round((fetchedAt - Date.now()) / 1000)
}

export function UsageFetchStatus({
  showPending = false,
  className,
  id,
}: {
  showPending?: boolean
  className?: string
  id?: string
}) {
  const intl = useIntl()
  const usage = useUsageStore()
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)} id={id}>
      <p className="text-hud-muted min-w-0 flex-1 truncate text-xs font-medium">
        {usage.fetchedAt == null ? (
          <FormattedMessage id="settings.usageFetched.never" />
        ) : (
          <FormattedRelativeTime
            value={relativeSeconds(usage.fetchedAt)}
            numeric="auto"
            updateIntervalInSeconds={60}
          />
        )}
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={usage.refreshing}
        aria-label={intl.formatMessage({ id: "settings.usageRefresh" })}
        className={HUD_CHIP_BUTTON}
        onClick={() => void refreshUsageStore()}
      >
        <RefreshCw className={cn("size-3.5", usage.refreshing && "animate-spin motion-reduce:animate-none")} />
        <FormattedMessage id="settings.usageRefresh" />
      </Button>
      {showPending && usage.pendingUpdate ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={intl.formatMessage({ id: "usage.pendingUpdate" })}
          className={HUD_CHIP_BUTTON}
          onClick={applyUsageStorePending}
        >
          <FormattedMessage id="usage.applyUpdate" />
        </Button>
      ) : null}
    </div>
  )
}

/** Always-visible usage controls for Pokémon / move pickers. Source, then that source's rules. */
export function UsagePickerChrome({ className }: { className?: string }) {
  const usage = useUsageStore()
  return (
    <div className={cn("flex shrink-0 flex-col gap-2", className)}>
      <UsageSourceSelect
        value={usage.source}
        onChange={(source: UsageSource) => void setUsageStoreSource(source)}
        className="h-8 w-full px-2 text-xs"
      />
      <UsageRuleSelect
        value={usage.ruleId}
        rules={usage.rules}
        onChange={(ruleId) => void setUsageStoreRule(ruleId)}
        className="h-8 w-full px-2 text-xs"
      />
      <UsageFetchStatus showPending />
    </div>
  )
}
