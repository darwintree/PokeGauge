import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"

/** Shown inside a picker while usage ranking loads the first time, with a skip escape hatch. */
export function RankingPendingNotice({ onSkip }: { onSkip: () => void }) {
  const intl = useIntl()
  return (
    <div className="m-3 flex flex-col items-center gap-3 rounded-[10px] border border-hud-frame bg-notice-bg p-4 text-center">
      <p aria-live="polite" className="text-sm font-bold">
        <FormattedMessage id="matchup.ranking.loading" />
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-label={intl.formatMessage({ id: "matchup.ranking.skip" })}
        className="border border-hud-frame bg-paper font-bold shadow-hud-chip hover:bg-token-bg/60"
        onClick={onSkip}
      >
        <FormattedMessage id="matchup.ranking.skip" />
      </Button>
    </div>
  )
}
