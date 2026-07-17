import { useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

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

        <main className="min-w-0 flex-1 space-y-4">
          <header className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">
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

  useEffect(() => {
    let cancelled = false
    Promise.all([listAttackers(locale), listDefenders(locale)]).then(([attackers, defenders]) => {
      if (cancelled) return
      setLocalizedOptions({ attackers, defenders })
    })
    return () => {
      cancelled = true
    }
  }, [locale])

  useEffect(() => {
    let cancelled = false
    getCatalogShell(attackerId, defenderId, locale, moveCategory).then((nextCatalog) => {
      if (cancelled) return
      setCatalog(nextCatalog)
    })
    return () => {
      cancelled = true
    }
  }, [attackerId, defenderId, locale, moveCategory])

  useEffect(() => {
    if (!catalog || catalog.defaultMovePickStatus !== "loading") return
    let cancelled = false
    const expectedKey = catalogKey(catalog)
    resolveCatalogDefaultMovePick(catalog).then((resolvedCatalog) => {
      if (cancelled) return
      setCatalog((current) => {
        if (!current || catalogKey(current) !== expectedKey) return current
        return resolvedCatalog
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

  if (!localizedOptions || !catalog) return null

  return (
    <ScenarioExplorerContent
      key={`${catalog.matchup.attackerId}:${catalog.moveCategory}`}
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
