/** PROTOTYPE #5 — Variant B: sticky sidebar refine + main results */

import { MatchupBar } from "./matchup-bar"
import { ResultsSection } from "./results-section"
import { SelectionSummary, TrackControls } from "./track-controls"
import type { ScenarioState } from "./use-scenario-state"

export const VARIANT_B_NAME = "Sidebar refine"

type VariantBProps = {
  state: ScenarioState
}

export function VariantB({ state }: VariantBProps) {
  return (
    <div className="flex min-h-[calc(100svh-6rem)] flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <aside className="lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
        <div className="space-y-4 rounded-xl border bg-card p-4">
          <div className="space-y-2 border-b pb-3">
            <div className="text-muted-foreground text-xs font-medium">Matchup</div>
            <MatchupBar compact />
          </div>
          <TrackControls state={state} />
          <p className="text-muted-foreground border-t pt-2 text-[10px] leading-relaxed">
            Desktop：左栏 sticky 参数 · 右栏结果主区 · Mobile：参数块在结果上方
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">伤害对比</h1>
          <SelectionSummary state={state} />
        </header>
        <ResultsSection state={state} compact />
      </main>
    </div>
  )
}
