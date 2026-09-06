import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { Check, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { trackProductEvent, useTrackProductEventOnce } from "@/lib/analytics"
import type { BattlePokemonOption, MatchupCatalog, MoveCategory } from "@/lib/catalog"
import type { ProbabilityMode } from "@/lib/damage-calculation"
import type { BattlePokemonId } from "@/lib/resources"
import { createScenarioSetupUrl, type TrackState } from "@/lib/scenario"
import type { StatNameStrategy } from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

import type { ResultGrouping } from "./results/result-groups"
import { DamageResults } from "./results/damage-results"
import { ScenarioSetupPanel } from "./scenario-setup-panel"
import { ResultSetSummary } from "./results-summary"
import { SetupBookmarkControls } from "./setup-bookmarks"
import { useScenarioState } from "./state/use-scenario-state"
import { UsageTip } from "./usage-tip/usage-tip"

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
  onFeedbackScenarioUrlChange,
  onSharedSetupEdited,
  onApplySetupBookmark,
  onAttackerChange,
  onDefenderChange,
  onMoveCategoryChange,
  statNameStrategy,
  probabilityMode,
}: LocalizedCatalogState & {
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  restoredTrackState: TrackState | null
  sharedSetupToken: string | null
  onFeedbackScenarioUrlChange: (url: string | null) => void
  onSharedSetupEdited: () => void
  onApplySetupBookmark: (token: string) => Promise<"ok" | "unloadable">
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onMoveCategoryChange: (category: MoveCategory) => void
  statNameStrategy: StatNameStrategy
  probabilityMode: ProbabilityMode
}) {
  const intl = useIntl()
  const [resultGrouping, setResultGrouping] = useState<ResultGrouping | null>(null)
  const state = useScenarioState(
    catalog,
    statNameStrategy,
    probabilityMode,
    restoredTrackState ?? undefined,
    sharedSetupToken
      ? { token: sharedSetupToken, onEdited: onSharedSetupEdited }
      : undefined,
    resultGrouping,
  )
  const { visibleGrouping } = state
  const [mobileView, setMobileView] = useState<"setup" | "results">("results")
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle")
  useTrackProductEventOnce("scenario_ready", intl.locale)

  useEffect(() => setShareStatus("idle"), [state.trackState])

  useEffect(() => {
    const result = createScenarioSetupUrl(window.location.href, catalog, state.trackState)
    onFeedbackScenarioUrlChange(result.ok ? result.value : null)
  }, [catalog, onFeedbackScenarioUrlChange, state.trackState])

  useEffect(
    () => () => onFeedbackScenarioUrlChange(null),
    [onFeedbackScenarioUrlChange],
  )

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
      trackProductEvent("share", intl.locale)
    } catch {
      const copied = window.prompt(
        intl.formatMessage({ id: "share.copyPrompt" }),
        result.value,
      )
      setShareStatus(copied === null ? "error" : "copied")
      if (copied !== null) {
        trackProductEvent("share", intl.locale)
      }
    }
  }

  return (
    <div className="p-4 pb-12 sm:p-6">
      <a
        href="#damage-results"
        onClick={() => setMobileView("results")}
        className="focus-visible:ring-ring fixed top-12 left-2 z-50 -translate-y-40 rounded-md border border-hud-frame bg-paper px-3 py-2 text-sm font-bold shadow-hud-chip focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:outline-none lg:top-16"
      >
        <FormattedMessage id="app.skipToResults" />
      </a>
      <nav
        aria-label={intl.formatMessage({ id: "app.title" })}
        className="sticky top-0 z-20 -mx-4 -mt-4 mb-4 grid grid-cols-2 border-b border-hairline bg-bg-app/95 px-4 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6 lg:hidden"
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
      <div className="flex min-h-[calc(100svh-6rem)] flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          id="scenario-setup"
          className={cn(
            "lg:w-[336px] xl:w-[360px] lg:sticky lg:top-16 lg:block lg:max-h-[calc(100dvh-5rem)] lg:shrink-0 lg:overflow-y-auto lg:[scrollbar-gutter:stable]",
            mobileView !== "setup" && "hidden",
          )}
        >
          <div className="p-1 pb-2">
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
            "flex min-h-[calc(100svh-8rem)] min-w-0 flex-1 flex-col lg:flex",
            state.rows.length > 0 ? "space-y-5" : "gap-5",
            mobileView !== "results" && "hidden",
          )}
        >
          <header className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h1 className="min-w-0 truncate text-[19px] font-extrabold tracking-tight [text-shadow:1px_1px_0_var(--paper)]">
                {catalog.matchup.attackerLabel} → {catalog.matchup.defenderLabel}
              </h1>
              <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-2">
                <SetupBookmarkControls
                  catalog={catalog}
                  trackState={state.trackState}
                  attackers={attackers}
                  defenders={defenders}
                  onApplyToken={onApplySetupBookmark}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-11 sm:h-7 sm:w-auto sm:px-2.5"
                  onClick={shareSetup}
                >
                  {shareStatus === "copied" ? <Check /> : <Share2 />}
                  <span className="sr-only sm:not-sr-only" aria-live="polite">
                    <FormattedMessage id={shareStatus === "copied" ? "share.copied" : "share.action"} />
                  </span>
                </Button>
              </div>
            </div>
            {shareStatus === "error" ? (
              <p role="status" className="text-destructive text-xs font-medium">
                <FormattedMessage id="share.copyError" />
              </p>
            ) : null}
            <ResultSetSummary trackState={state.trackState} rowCount={state.rows.length} grouping={visibleGrouping} onGroupingChange={setResultGrouping} />
          </header>
          <DamageResults
            grouping={visibleGrouping}
            catalog={catalog}
            rows={state.rows}
            unavailable={state.unavailable}
            trackState={state.pipelineTrackState}
            statNameStrategy={state.statNameStrategy}
            probabilityMode={probabilityMode}
          />
          {state.rows.length > 0 ? (
            <UsageTip key={`${attackerId}:${defenderId}`} attached />
          ) : (
            <div className="flex min-h-0 flex-1 items-center">
              <div className="w-full">
                <UsageTip key={`${attackerId}:${defenderId}`} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
