import { useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { HomeScreen } from "@/components/scenario-explorer/home-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  getCatalogShell,
  getDefaultMoveCategory,
  listAttackers,
  listDefenders,
  rankPokemonOptionsByChampionsUsage,
  resolveCatalogDefaultMovePick,
  type MatchupCatalog,
  type MoveCategory,
  type SpeciesOption,
} from "@/lib/catalog"
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { ScenarioResults } from "./scenario-results"
import { ScenarioSidebar } from "./scenario-sidebar"
import { SelectionSummary } from "./track-controls"
import { useScenarioState } from "./use-scenario-state"

type ScenarioExplorerPageProps = {
  locale: SupportedLocale
  onLocaleChange: (locale: SupportedLocale) => void
}

type LocalizedCatalogState = {
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  catalog: MatchupCatalog
}

type LocalizedOptionsState = {
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
}

function catalogKey(catalog: MatchupCatalog): string {
  return [
    catalog.matchup.attackerId,
    catalog.matchup.defenderId,
    catalog.moveCategory,
  ].join(":")
}

export function ScenarioExplorerContent({
  catalog,
  attackers,
  defenders,
  attackerId,
  defenderId,
  locale,
  localeOptions,
  onAttackerChange,
  onDefenderChange,
  onLocaleChange,
  onMoveCategoryChange,
}: LocalizedCatalogState & {
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  locale: SupportedLocale
  localeOptions: Array<{ value: SupportedLocale; label: string }>
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onLocaleChange: (locale: SupportedLocale) => void
  onMoveCategoryChange: (category: MoveCategory) => void
}) {
  const intl = useIntl()
  const state = useScenarioState(catalog)
  const [mobileView, setMobileView] = useState<"setup" | "results">("results")

  function changeMobileView(view: "setup" | "results") {
    setMobileView(view)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto min-h-svh max-w-7xl p-4 pb-12 sm:p-6">
      <a
        href="#damage-results"
        onClick={() => setMobileView("results")}
        className="bg-background focus-visible:ring-ring fixed top-2 left-2 z-30 -translate-y-20 rounded-md px-3 py-2 text-sm font-medium shadow-sm focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:outline-none"
      >
        <FormattedMessage id="app.skipToResults" />
      </a>
      <nav
        aria-label={intl.formatMessage({ id: "app.title" })}
        className="bg-background/95 sticky top-0 z-20 -mx-1 mb-4 grid grid-cols-2 gap-1 rounded-lg border p-1 shadow-sm backdrop-blur lg:hidden"
      >
        <Button
          type="button"
          variant={mobileView === "setup" ? "secondary" : "ghost"}
          className="h-10"
          aria-pressed={mobileView === "setup"}
          onClick={() => changeMobileView("setup")}
        >
          <FormattedMessage id="app.setup" />
        </Button>
        <Button
          type="button"
          variant={mobileView === "results" ? "secondary" : "ghost"}
          className="h-10"
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
            "lg:w-[22rem] lg:sticky lg:top-6 lg:block lg:max-h-[calc(100dvh-3rem)] lg:shrink-0 lg:overflow-y-auto lg:[scrollbar-gutter:stable]",
            mobileView !== "setup" && "hidden",
          )}
        >
          <Card>
            <CardHeader className="border-b [.border-b]:pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium tracking-tight">
                  <FormattedMessage id="app.setup" />
                </span>
                <select
                  id="locale-select"
                  value={locale}
                  onChange={(event) => onLocaleChange(event.target.value as SupportedLocale)}
                  className="border-input bg-background h-7 rounded-md border px-2 text-[11px]"
                  aria-label={intl.formatMessage({ id: "locale.label" })}
                >
                  {localeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ScenarioSidebar
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
            </CardContent>
          </Card>
        </aside>

        <main
          id="damage-results"
          className={cn(
            "min-w-0 flex-1 space-y-5 lg:block",
            mobileView !== "results" && "hidden",
          )}
        >
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              <FormattedMessage id="app.title" />
            </h1>
            <p className="text-muted-foreground text-sm">
              {catalog.matchup.attackerLabel} → {catalog.matchup.defenderLabel}
            </p>
            <SelectionSummary state={state} />
          </header>
          <ScenarioResults
            catalog={catalog}
            rows={state.rows}
            unavailable={state.unavailable}
            trackState={state.trackState}
            statNameStrategy={state.statNameStrategy}
            onShowResultActualChange={state.setShowResultActual}
            onProbabilityModeChange={state.setProbabilityMode}
            compact
          />
        </main>
      </div>
    </div>
  )
}

export function ScenarioExplorerPage({ locale, onLocaleChange }: ScenarioExplorerPageProps) {
  const intl = useIntl()
  const [attackerId, setAttackerId] = useState<BattlePokemonId | null>(null)
  const [defenderId, setDefenderId] = useState<BattlePokemonId | null>(null)
  const [moveCategory, setMoveCategory] = useState<MoveCategory>("physical")
  const [localizedOptions, setLocalizedOptions] = useState<LocalizedOptionsState | null>(null)
  const [catalog, setCatalog] = useState<MatchupCatalog | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [showExplorer, setShowExplorer] = useState(false)
  const [leavingHome, setLeavingHome] = useState(false)

  const bothSelected = attackerId != null && defenderId != null

  useEffect(() => {
    let cancelled = false
    setLoadError(false)
    Promise.all([listAttackers(locale), listDefenders(locale)])
      .then(([attackers, defenders]) => {
        if (cancelled) return
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
    if (attackerId == null || defenderId == null) {
      setCatalog(null)
      return
    }
    let cancelled = false
    setLoadError(false)
    getCatalogShell(attackerId, defenderId, locale, moveCategory)
      .then((nextCatalog) => {
        if (!cancelled) setCatalog(nextCatalog)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [attackerId, defenderId, locale, moveCategory])

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
    if (!bothSelected || !catalog) {
      setLeavingHome(false)
      setShowExplorer(false)
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

  const localeOptions = useMemo(
    () =>
      SUPPORTED_LOCALES.map((value) => ({
        value,
        label: intl.formatMessage({ id: `locale.${value}` }),
      })),
    [intl],
  )

  if (loadError) {
    return (
      <main className="grid min-h-svh place-items-center p-6">
        <div className="max-w-sm space-y-4 rounded-xl border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
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

  if (!localizedOptions) {
    return (
      <main
        aria-busy="true"
        aria-label={intl.formatMessage({ id: "app.loading" })}
        className="grid min-h-[100dvh] place-items-center p-6"
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
        <HomeScreen
          attackers={localizedOptions.attackers}
          defenders={localizedOptions.defenders}
          attackerId={attackerId}
          defenderId={defenderId}
          locale={locale}
          localeOptions={localeOptions}
          onAttackerChange={changeAttacker}
          onDefenderChange={setDefenderId}
          onLocaleChange={onLocaleChange}
        />
      </div>
    )
  }

  return (
    <div className="motion-safe:animate-[home-rise_500ms_cubic-bezier(0.16,1,0.3,1)_both]">
      <ScenarioExplorerContent
        attackers={localizedOptions.attackers}
        defenders={localizedOptions.defenders}
        catalog={catalog}
        attackerId={attackerId}
        defenderId={defenderId}
        locale={locale}
        localeOptions={localeOptions}
        onAttackerChange={changeAttacker}
        onDefenderChange={setDefenderId}
        onLocaleChange={onLocaleChange}
        onMoveCategoryChange={setMoveCategory}
      />
    </div>
  )
}
