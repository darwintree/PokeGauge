import { useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { MatchupLanding } from "@/components/scenario-explorer/matchup-landing"
import { Button } from "@/components/ui/button"
import {
  getCatalogShell,
  getDefaultMoveCategory,
  listAttackers,
  listDefenders,
  rankPokemonOptionsByChampionsUsage,
  resolveCatalogDefaultMovePick,
  type MatchupCatalog,
  type MoveCategory,
  type BattlePokemonOption,
} from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId } from "@/lib/resources"
import {
  discardScenarioSnapshot,
  loadScenarioSnapshot,
  scenarioSnapshotMatchesCatalog,
  type ScenarioSnapshot,
} from "@/lib/scenario-storage"
import { cn } from "@/lib/utils"

import { DamageResults } from "./damage-results"
import { ScenarioSetupPanel } from "./scenario-setup-panel"
import { ScenarioSetSummary } from "./scenario-set-summary"
import { useScenarioState } from "./use-scenario-state"

type ScenarioExplorerPageProps = {
  locale: SupportedLocale
}

type LocalizedCatalogState = {
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
  catalog: MatchupCatalog
}

type LocalizedOptionsState = {
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
}

function catalogKey(catalog: MatchupCatalog): string {
  return [
    catalog.matchup.attackerId,
    catalog.matchup.defenderId,
    catalog.moveCategory,
  ].join(":")
}

export function ScenarioWorkspace({
  catalog,
  attackers,
  defenders,
  attackerId,
  defenderId,
  restoredScenario,
  onAttackerChange,
  onDefenderChange,
  onMoveCategoryChange,
}: LocalizedCatalogState & {
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  restoredScenario: ScenarioSnapshot | null
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onMoveCategoryChange: (category: MoveCategory) => void
}) {
  const intl = useIntl()
  const state = useScenarioState(catalog, restoredScenario?.trackState)
  const [mobileView, setMobileView] = useState<"setup" | "results">("results")

  function changeMobileView(view: "setup" | "results") {
    setMobileView(view)
    window.scrollTo({ top: 0 })
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
            <h1 className="text-[19px] font-extrabold tracking-tight [text-shadow:1px_1px_0_var(--paper)]">
              {catalog.matchup.attackerLabel} → {catalog.matchup.defenderLabel}
            </h1>
            <ScenarioSetSummary state={state} />
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

export function ScenarioExplorerPage({ locale }: ScenarioExplorerPageProps) {
  const intl = useIntl()
  const [initialRestoredScenario] = useState(loadScenarioSnapshot)
  const restoredScenarioRef = useRef(initialRestoredScenario)
  const restorePendingRef = useRef(initialRestoredScenario !== null)
  const availableMatchupIdsRef = useRef<{
    attackers: Set<BattlePokemonId>
    defenders: Set<BattlePokemonId>
  } | null>(null)
  const [attackerId, setAttackerId] = useState<BattlePokemonId | null>(
    restoredScenarioRef.current?.attackerId ?? null,
  )
  const [defenderId, setDefenderId] = useState<BattlePokemonId | null>(
    restoredScenarioRef.current?.defenderId ?? null,
  )
  const [moveCategory, setMoveCategory] = useState<MoveCategory>(
    restoredScenarioRef.current?.moveCategory ?? "physical",
  )
  const [localizedOptions, setLocalizedOptions] = useState<LocalizedOptionsState | null>(null)
  const [catalog, setCatalog] = useState<MatchupCatalog | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [showExplorer, setShowExplorer] = useState(
    restoredScenarioRef.current !== null,
  )
  const [restoring, setRestoring] = useState(
    restoredScenarioRef.current !== null,
  )
  const [leavingHome, setLeavingHome] = useState(false)

  const bothSelected = attackerId != null && defenderId != null
  const optionsReady = localizedOptions !== null

  function discardRestore() {
    discardScenarioSnapshot()
    restorePendingRef.current = false
    restoredScenarioRef.current = null
    setAttackerId(null)
    setDefenderId(null)
    setMoveCategory("physical")
    setCatalog(null)
    setShowExplorer(false)
    setRestoring(false)
  }

  useEffect(() => {
    let cancelled = false
    setLoadError(false)
    Promise.all([listAttackers(locale), listDefenders(locale)])
      .then(([attackers, defenders]) => {
        if (cancelled) return
        availableMatchupIdsRef.current = {
          attackers: new Set(attackers.map((option) => option.id)),
          defenders: new Set(defenders.map((option) => option.id)),
        }
        setLocalizedOptions({ attackers, defenders })
        return Promise.all([
          rankPokemonOptionsByChampionsUsage(attackers),
          rankPokemonOptionsByChampionsUsage(defenders),
        ])
      })
      .then((ranked) => {
        if (cancelled || !ranked) return
        const [attackers, defenders] = ranked
        setLocalizedOptions({ attackers, defenders })
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  useEffect(() => {
    if (!optionsReady || attackerId == null || defenderId == null) {
      setCatalog(null)
      return
    }
    const restoredScenario = restoredScenarioRef.current
    const restoringSnapshot =
      restorePendingRef.current && restoredScenario !== null
    const availableMatchupIds = availableMatchupIdsRef.current
    if (
      restoringSnapshot &&
      (!availableMatchupIds?.attackers.has(attackerId) ||
        !availableMatchupIds.defenders.has(defenderId))
    ) {
      discardRestore()
      return
    }
    let cancelled = false
    setLoadError(false)
    getCatalogShell(attackerId, defenderId, locale, moveCategory)
      .then((nextCatalog) => {
        if (cancelled) return
        if (
          restoringSnapshot &&
          !scenarioSnapshotMatchesCatalog(restoredScenario, nextCatalog)
        ) {
          discardRestore()
          return
        }
        setCatalog(nextCatalog)
        if (restoringSnapshot) {
          restorePendingRef.current = false
          setRestoring(false)
        }
      })
      .catch(() => {
        if (cancelled) return
        if (restoringSnapshot) {
          discardRestore()
          return
        }
        setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [attackerId, defenderId, locale, moveCategory, optionsReady])

  useEffect(() => {
    if (!catalog || catalog.defaultMovePickStatus !== "loading") return
    let cancelled = false
    const expectedKey = catalogKey(catalog)
    resolveCatalogDefaultMovePick(catalog)
      .then((resolvedCatalog) => {
        if (cancelled) return
        setCatalog((current) => {
          if (!current || catalogKey(current) !== expectedKey) return current
          return resolvedCatalog
        })
      })
      .catch(() => {
        if (cancelled) return
        setCatalog((current) => {
          if (!current || catalogKey(current) !== expectedKey) return current
          return { ...current, defaultMovePickStatus: "unavailable" }
        })
      })
    return () => {
      cancelled = true
    }
  }, [catalog])

  useEffect(() => {
    if (!bothSelected) {
      setLeavingHome(false)
      setShowExplorer(false)
      return
    }
    if (!catalog) return
    if (restoredScenarioRef.current) {
      setLeavingHome(false)
      setShowExplorer(true)
      return
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setShowExplorer(true)
      return
    }
    setLeavingHome(true)
    const timer = window.setTimeout(() => setShowExplorer(true), 420)
    return () => window.clearTimeout(timer)
  }, [bothSelected, catalog])

  function changeAttacker(id: BattlePokemonId) {
    setAttackerId(id)
    setMoveCategory(getDefaultMoveCategory(id))
  }

  if (loadError) {
    return (
      <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center p-6">
        <div className="max-w-sm space-y-4 rounded-2xl border-2 border-ink bg-paper p-6 text-center shadow-hud-board">
          <h1 className="text-xl font-extrabold tracking-tight">
            <FormattedMessage id="app.loadError" />
          </h1>
          <p className="text-muted-foreground text-sm">
            <FormattedMessage id="app.loadErrorDescription" />
          </p>
          <Button type="button" onClick={() => window.location.reload()}>
            <FormattedMessage id="app.retry" />
          </Button>
        </div>
      </main>
    )
  }

  if (!localizedOptions || restoring) {
    return (
      <main
        aria-busy="true"
        aria-label={intl.formatMessage({ id: "app.loading" })}
        className="grid min-h-[calc(100dvh-3.5rem)] place-items-center p-6"
      >
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
      </main>
    )
  }

  if (!showExplorer || !catalog || attackerId == null || defenderId == null) {
    return (
      <div
        className={cn(
          "transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          leavingHome && "translate-y-2 opacity-0",
        )}
      >
        <MatchupLanding
          attackers={localizedOptions.attackers}
          defenders={localizedOptions.defenders}
          attackerId={attackerId}
          defenderId={defenderId}
          onAttackerChange={changeAttacker}
          onDefenderChange={setDefenderId}
        />
      </div>
    )
  }

  return (
    <div className="motion-safe:animate-[home-rise_500ms_cubic-bezier(0.16,1,0.3,1)_both]">
      <ScenarioWorkspace
        attackers={localizedOptions.attackers}
        defenders={localizedOptions.defenders}
        catalog={catalog}
        attackerId={attackerId}
        defenderId={defenderId}
        restoredScenario={restoredScenarioRef.current}
        onAttackerChange={changeAttacker}
        onDefenderChange={setDefenderId}
        onMoveCategoryChange={setMoveCategory}
      />
    </div>
  )
}
