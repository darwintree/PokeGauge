import { useMemo, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  getCatalog,
  getDefaultMatchupIds,
  listAttackers,
  listDefenders,
} from "@/lib/catalog"

import { MatchupSelector } from "./matchup-selector"
import { ScenarioResults } from "./scenario-results"
import { SelectionSummary, TrackControls } from "./track-controls"
import { useScenarioState } from "./use-scenario-state"

export function ScenarioExplorerPage() {
  const attackers = listAttackers()
  const defenders = listDefenders()
  const defaults = getDefaultMatchupIds()

  const [attackerId, setAttackerId] = useState<string>(defaults.attackerId)
  const [defenderId, setDefenderId] = useState<string>(defaults.defenderId)

  const catalog = useMemo(
    () => getCatalog(attackerId, defenderId),
    [attackerId, defenderId],
  )
  const state = useScenarioState(catalog)

  return (
    <div className="mx-auto min-h-svh max-w-6xl p-4 pb-12 sm:p-6">
      <div className="flex min-h-[calc(100svh-6rem)] flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <MatchupSelector
                attackerId={attackerId}
                defenderId={defenderId}
                attackers={attackers}
                defenders={defenders}
                onAttackerChange={setAttackerId}
                onDefenderChange={setDefenderId}
              />
            </CardHeader>
            <CardContent>
              <TrackControls catalog={catalog} state={state} />
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
          <ScenarioResults
            catalog={catalog}
            rows={state.rows}
            trackState={state.trackState}
            statNameStrategy={state.statNameStrategy}
            showMoveOnRow={state.showMoveOnRow}
            onShowResultActualChange={state.setShowResultActual}
            compact
          />
        </main>
      </div>
    </div>
  )
}
