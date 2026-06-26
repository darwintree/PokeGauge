/** PROTOTYPE #4 — type colors verdict reference (?prototype=type-colors) */

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import { SelectionSummary } from "@/components/scenario-explorer/track-controls"

import { useTypeColorsPage } from "../type-colors/use-type-colors-page"
import { MatchupTrailingBadge } from "./matchup-trailing-badge"
import { ResultsWithMoveBadge } from "./results-move-chrome"
import { SidebarTracks } from "./sidebar-tracks"

export function MoveTypesPrototype() {
  const {
    attackers,
    defenders,
    attackerId,
    defenderId,
    setAttackerId,
    setDefenderId,
    catalog,
    state,
  } = useTypeColorsPage()

  return (
    <div className="mx-auto min-h-svh max-w-6xl p-4 pb-12 sm:p-6">
      <p className="text-muted-foreground mb-4 rounded-md border border-dashed px-3 py-2 text-xs">
        PROTOTYPE #4 — species trailing badge + move track/row TypeBadge（grill verdict）
      </p>
      <div className="flex min-h-[calc(100svh-6rem)] flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <MatchupTrailingBadge
                attackerId={attackerId}
                defenderId={defenderId}
                attackers={attackers}
                defenders={defenders}
                onAttackerChange={setAttackerId}
                onDefenderChange={setDefenderId}
              />
            </CardHeader>
            <CardContent>
              <SidebarTracks catalog={catalog} state={state} />
            </CardContent>
          </Card>
        </aside>
        <main className="min-w-0 flex-1 space-y-4">
          <header className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">伤害对比</h1>
            <p className="text-muted-foreground text-sm">
              {catalog.matchup.attackerLabel} → {catalog.matchup.defenderLabel}
            </p>
            <SelectionSummary state={state} />
          </header>
          <ResultsWithMoveBadge
            catalog={catalog}
            rows={state.rows}
            showMoveOnRow={state.showMoveOnRow}
          />
        </main>
      </div>
    </div>
  )
}
