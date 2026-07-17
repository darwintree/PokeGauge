import { useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  getCatalogShell,
  getDefaultMatchupIds,
  getDefaultMoveCategory,
  listAttackers,
  listDefenders,
  resolveCatalogDefaultMovePick,
  type MatchupCatalog,
  type MoveCategory,
  type SpeciesOption,
} from "@/lib/catalog"
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { MatchupSelector } from "./matchup-selector"
import { ScenarioResults } from "./scenario-results"
import { SelectionSummary, TrackControls } from "./track-controls"
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

function ScenarioExplorerContent({
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
            "lg:sticky lg:top-6 lg:block lg:max-h-[calc(100dvh-3rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:[scrollbar-gutter:stable]",
            mobileView !== "setup" && "hidden",
          )}
        >
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <MatchupSelector
                attackerId={attackerId}
                defenderId={defenderId}
                attackers={attackers}
                defenders={defenders}
                onAttackerChange={onAttackerChange}
                onDefenderChange={onDefenderChange}
              />
              <div className="space-y-2 pt-3">
                <label className="text-muted-foreground text-xs" htmlFor="locale-select">
                  <FormattedMessage id="locale.label" />
                </label>
                <select
                  id="locale-select"
                  value={locale}
                  onChange={(event) => onLocaleChange(event.target.value as SupportedLocale)}
                  className="border-input bg-background h-8 w-full rounded-md border px-2 text-xs"
                >
                  {localeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <TrackControls
                catalog={catalog}
                state={state}
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
            showMoveOnRow={state.showMoveOnRow}
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
  const defaults = getDefaultMatchupIds()
  const [attackerId, setAttackerId] = useState<BattlePokemonId>(defaults.attackerId)
  const [defenderId, setDefenderId] = useState<BattlePokemonId>(defaults.defenderId)
  const [moveCategory, setMoveCategory] = useState<MoveCategory>(() =>
    getDefaultMoveCategory(defaults.attackerId),
  )
  const [localizedOptions, setLocalizedOptions] = useState<LocalizedOptionsState | null>(null)
  const [catalog, setCatalog] = useState<MatchupCatalog | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoadError(false)
    Promise.all([listAttackers(locale), listDefenders(locale)])
      .then(([attackers, defenders]) => {
        if (cancelled) return
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
    let cancelled = false
    setLoadError(false)
    getCatalogShell(attackerId, defenderId, locale, moveCategory)
      .then((nextCatalog) => {
        if (cancelled) return
        setCatalog(nextCatalog)
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

  if (!localizedOptions || !catalog) {
    return (
      <main
        aria-busy="true"
        aria-label={intl.formatMessage({ id: "app.loading" })}
        className="mx-auto grid min-h-svh max-w-7xl gap-6 p-4 motion-reduce:animate-none sm:p-6 lg:grid-cols-[20rem_1fr]"
      >
        <div className="hidden h-[42rem] animate-pulse rounded-xl bg-muted motion-reduce:animate-none lg:block" />
        <div className="space-y-5 pt-2">
          <div className="h-8 w-56 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
          <div className="h-36 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
          <div className="h-36 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
        </div>
      </main>
    )
  }

  return (
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
  )
}
