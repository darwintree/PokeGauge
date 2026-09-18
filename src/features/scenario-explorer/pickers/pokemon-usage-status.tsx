import { LoaderCircle } from "lucide-react"
import { FormattedMessage } from "react-intl"

import { Button } from "@/components/ui/button"
import type { MatchupCatalog } from "@/lib/catalog"

export function PokemonUsageStatus({
  catalog,
  hasMoves,
  onRetry,
}: {
  catalog: MatchupCatalog
  hasMoves: boolean
  onRetry: () => void
}) {
  const statuses = [
    catalog.defaultMovePickStatus,
    catalog.defaultAbilityPickStatus,
    catalog.defaultItemPickStatus,
    catalog.defaultStatPickStatus,
  ]
  const loading = statuses.includes("loading")
  const failed = statuses.includes("unavailable")
  const empty = catalog.defaultMovePickStatus === "ready" && catalog.defaultMovePoolIds.length === 0 && !hasMoves
  if (!loading && !failed && !empty) return null

  let message = "usage.detail.empty"
  if (failed) message = "usage.detail.failed"
  if (loading) message = "usage.detail.loading"

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-hairline bg-paper px-3 py-2 text-sm">
      <p role="status" className="flex min-w-0 flex-1 items-start gap-2">
        {loading ? <LoaderCircle aria-hidden className="mt-0.5 size-4 shrink-0 motion-safe:animate-spin" /> : null}
        <span>
          <FormattedMessage
            id={message}
            values={{ attacker: catalog.matchup.attackerLabel }}
          />
        </span>
      </p>
      {failed && !loading ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <FormattedMessage id="usage.detail.retry" />
        </Button>
      ) : null}
    </div>
  )
}
