import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { Check, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BattlePokemonOption, MatchupCatalog, MoveCategory } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"
import { createScenarioSetupUrl, type TrackState } from "@/lib/scenario"
import { cn } from "@/lib/utils"

import { DamageResults } from "./results/damage-results"
import { ScenarioSetupPanel } from "./scenario-setup-panel"
import { ResultSetSummary } from "./results-summary"
import { useScenarioState } from "./state/use-scenario-state"

type LocalizedCatalogState = {
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
  catalog: MatchupCatalog
}

export function ScenarioWorkspace({
  catalog,
  attackers,
  defenders,
  attackerId,
  defenderId,
  restoredTrackState,
  sharedSetupToken,
  onSharedSetupEdited,
  onAttackerChange,
  onDefenderChange,
  onMoveCategoryChange,
}: LocalizedCatalogState & {
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  restoredTrackState: TrackState | null
  sharedSetupToken: string | null
  onSharedSetupEdited: () => void
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onMoveCategoryChange: (category: MoveCategory) => void
}) {
  const intl = useIntl()
  const state = useScenarioState(
    catalog,
    restoredTrackState ?? undefined,
    sharedSetupToken
      ? { token: sharedSetupToken, onEdited: onSharedSetupEdited }
      : undefined,
  )
  const [mobileView, setMobileView] = useState<"setup" | "results">("results")
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle")

  useEffect(() => setShareStatus("idle"), [state.trackState])

  function changeMobileView(view: "setup" | "results") {
    setMobileView(view)
    window.scrollTo({ top: 0 })
  }

  async function shareSetup() {
    const result = createScenarioSetupUrl(window.location.href, catalog, state.trackState)
    if (!result.ok) {
      setShareStatus("error")
      return
    }
    try {
      if (!navigator.clipboard) throw new Error("clipboard-unavailable")
      await navigator.clipboard.writeText(result.value)
      setShareStatus("copied")
    } catch {
      const copied = window.prompt(
        intl.formatMessage({ id: "share.copyPrompt" }),
        result.value,
      )
      setShareStatus(copied === null ? "error" : "copied")
    }
  }

  return (
    <div className="p-4 pb-12 sm:p-6">
      <a
        href="#damage-results"
        onClick={() => setMobileView("results")}
        className="focus-visible:ring-ring fixed top-[6.5rem] left-2 z-50 -translate-y-40 rounded-md border-2 border-ink bg-paper px-3 py-2 text-sm font-bold shadow-hud-chip focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:outline-none lg:top-16"
      >
        <FormattedMessage id="app.skipToResults" />
      </a>
      <nav
        aria-label={intl.formatMessage({ id: "app.title" })}
        className="sticky top-14 z-20 -mx-4 -mt-4 mb-4 grid grid-cols-2 border-b border-hairline bg-bg-app/95 px-4 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6 lg:hidden"
      >
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-11 rounded-none border-b-2 px-3",
            mobileView === "setup"
              ? "border-b-ink text-ink"
              : "border-b-transparent text-muted-foreground",
          )}
          aria-pressed={mobileView === "setup"}
          onClick={() => changeMobileView("setup")}
        >
          <FormattedMessage id="app.setup" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-11 rounded-none border-b-2 px-3",
            mobileView === "results"
              ? "border-b-ink text-ink"
              : "border-b-transparent text-muted-foreground",
          )}
          aria-pressed={mobileView === "results"}
          onClick={() => changeMobileView("results")}
        >
          <FormattedMessage id="app.results" />
        </Button>
      </nav>
      <div className="flex min-h-[calc(100svh-6rem)] flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside
          id="scenario-setup"
          className={cn(
            "lg:w-[300px] lg:sticky lg:top-16 lg:block lg:max-h-[calc(100dvh-5rem)] lg:shrink-0 lg:overflow-y-auto lg:[scrollbar-gutter:stable]",
            mobileView !== "setup" && "hidden",
          )}
        >
          <div className="rounded-[14px] bg-token-bg p-2.5">
            <ScenarioSetupPanel
              catalog={catalog}
              state={state}
              attackers={attackers}
              defenders={defenders}
              attackerId={attackerId}
              defenderId={defenderId}
              onAttackerChange={onAttackerChange}
              onDefenderChange={onDefenderChange}
              onMoveCategoryChange={onMoveCategoryChange}
            />
          </div>
        </aside>

        <main
          id="damage-results"
          className={cn(
            "min-w-0 flex-1 space-y-5 lg:block",
            mobileView !== "results" && "hidden",
          )}
        >
          <header className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-[19px] font-extrabold tracking-tight [text-shadow:1px_1px_0_var(--paper)]">
                {catalog.matchup.attackerLabel} → {catalog.matchup.defenderLabel}
              </h1>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={shareSetup}
              >
                {shareStatus === "copied" ? <Check /> : <Share2 />}
                <span aria-live="polite">
                  <FormattedMessage id={shareStatus === "copied" ? "share.copied" : "share.action"} />
                </span>
              </Button>
            </div>
            {shareStatus === "error" ? (
              <p role="status" className="text-destructive text-xs font-medium">
                <FormattedMessage id="share.copyError" />
              </p>
            ) : null}
            <ResultSetSummary trackState={state.trackState} rowCount={state.rows.length} />
          </header>
          <DamageResults
            catalog={catalog}
            rows={state.rows}
            unavailable={state.unavailable}
            trackState={state.trackState}
            statNameStrategy={state.statNameStrategy}
            onShowResultStatValueChange={state.setShowResultStatValue}
            onProbabilityModeChange={state.setProbabilityMode}
          />
        </main>
      </div>
    </div>
  )
}
