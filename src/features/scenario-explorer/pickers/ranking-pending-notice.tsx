import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { usageSourceMessageId, type UsageSource } from "@/lib/usage-source-preference"

import { UsageSourceSelect } from "./usage-source-select"

/** Shown inside a picker while usage ranking loads, with a source switch and a skip escape hatch. */
export function RankingPendingNotice({
  usageSource,
  onUsageSourceChange,
  onSkip,
}: {
  usageSource: UsageSource
  onUsageSourceChange: (source: UsageSource) => void
  onSkip: () => void
}) {
  const intl = useIntl()
  return (
    <div className="m-3 flex flex-col items-center gap-3 rounded-[10px] border border-hud-frame bg-notice-bg p-4 text-center">
      <p aria-live="polite" className="text-sm font-bold">
        <FormattedMessage id="matchup.ranking.loading" /> ({intl.formatMessage({ id: usageSourceMessageId(usageSource) })})
      </p>
      <UsageSourceSelect
        value={usageSource}
        onChange={onUsageSourceChange}
        className="h-9 px-2 text-xs"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border border-hud-frame bg-paper font-bold shadow-hud-chip hover:bg-token-bg/60"
        onClick={onSkip}
      >
        <FormattedMessage id="matchup.ranking.skip" />
      </Button>
    </div>
  )
}
