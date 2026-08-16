import { useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { MatchupLanding } from "./matchup/matchup-landing"
import { ScenarioWorkspace } from "./scenario-workspace"
import { Button } from "@/components/ui/button"
import {
  getCatalogShell,
  getDefaultMoveCategory,
  listAttackers,
  listDefenders,
  resolveCatalogDefaultMovePick,
  type BattlePokemonOption,
  type MatchupCatalog,
  type MoveCategory,
} from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId } from "@/lib/resources"
import {
  discardScenarioSnapshot,
  loadScenarioSnapshot,
  readScenarioSetupUrl,
  restoreSetupBookmark,
  scenarioSnapshotMatchesCatalog,
  SCENARIO_SHARE_PARAM,
  trackStateFromScenarioSetup,
  type ScenarioShareFailure,
  type SharedScenarioSetup,
  type TrackState,
} from "@/lib/scenario"
import { cn } from "@/lib/utils"

type ScenarioExplorerPageProps = {
  locale: SupportedLocale
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

export function ScenarioExplorerPage({ locale }: ScenarioExplorerPageProps) {
  const intl = useIntl()
  const [initialUrlState] = useState(() => readScenarioSetupUrl(window.location.href))
  const [initialRestoredScenario] = useState(() =>
    initialUrlState.kind === "none" ? loadScenarioSnapshot() : null,
  )
  const restoredScenarioRef = useRef(initialRestoredScenario)
  const restoredTrackStateRef = useRef<TrackState | null>(
    initialRestoredScenario?.trackState ?? null,
  )
  const sharedSetupRef = useRef<SharedScenarioSetup | null>(
    initialUrlState.kind === "valid" ? initialUrlState.setup : null,
  )
  const sharedTokenRef = useRef(
    initialUrlState.kind === "valid" ? initialUrlState.token : null,
  )
  const restorePendingRef = useRef(
    initialRestoredScenario !== null || initialUrlState.kind === "valid",
  )
  const [shareFailures, setShareFailures] = useState<ScenarioShareFailure[] | null>(
    initialUrlState.kind === "invalid" ? initialUrlState.failures : null,
  )
  const availableMatchupIdsRef = useRef<{
    attackers: Set<BattlePokemonId>
    defenders: Set<BattlePokemonId>
  } | null>(null)
  const [attackerId, setAttackerId] = useState<BattlePokemonId | null>(
    sharedSetupRef.current?.attackerId ??
      restoredScenarioRef.current?.attackerId ??
      null,
  )
  const [defenderId, setDefenderId] = useState<BattlePokemonId | null>(
    sharedSetupRef.current?.defenderId ??
      restoredScenarioRef.current?.defenderId ??
      null,
  )
  const [moveCategory, setMoveCategory] = useState<MoveCategory>(
    sharedSetupRef.current?.moveCategory ??
      restoredScenarioRef.current?.moveCategory ??
      "physical",
  )
  const [localizedOptions, setLocalizedOptions] = useState<LocalizedOptionsState | null>(null)
  const [catalog, setCatalog] = useState<MatchupCatalog | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [showExplorer, setShowExplorer] = useState(
    restorePendingRef.current,
  )
  const [restoring, setRestoring] = useState(
    restorePendingRef.current,
  )
  const [leavingHome, setLeavingHome] = useState(false)
  const [workspaceEpoch, setWorkspaceEpoch] = useState(0)

  const bothSelected = attackerId != null && defenderId != null
  const optionsReady = localizedOptions !== null

  function discardRestore() {
    discardScenarioSnapshot()
    restorePendingRef.current = false
    restoredScenarioRef.current = null
    restoredTrackStateRef.current = null
    setAttackerId(null)
    setDefenderId(null)
    setMoveCategory("physical")
    setCatalog(null)
    setShowExplorer(false)
    setRestoring(false)
  }

  function rejectSharedSetup(failures: ScenarioShareFailure[]) {
    restorePendingRef.current = false
    restoredTrackStateRef.current = null
    setCatalog(null)
    setRestoring(false)
    setShowExplorer(false)
    setShareFailures(failures)
  }

  function removeShareParam(reload = false) {
    const url = new URL(window.location.href)
    url.searchParams.delete(SCENARIO_SHARE_PARAM)
    if (reload) window.location.assign(url)
    else window.history.replaceState(null, "", url)
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
    const sharedSetup = sharedSetupRef.current
    const restoringSnapshot = restorePendingRef.current && restoredScenario !== null
    const restoringShare = restorePendingRef.current && sharedSetup !== null
    const availableMatchupIds = availableMatchupIdsRef.current
    if (
      (restoringSnapshot || restoringShare) &&
      (!availableMatchupIds?.attackers.has(attackerId) ||
        !availableMatchupIds.defenders.has(defenderId))
    ) {
      if (restoringShare) {
        rejectSharedSetup([{ stage: "domain", code: "unknown-matchup", field: "matchup" }])
      } else discardRestore()
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
        if (restoringShare) {
          const restored = trackStateFromScenarioSetup(sharedSetup, nextCatalog)
          if (!restored.ok) {
            rejectSharedSetup(restored.failures)
            return
          }
          restoredTrackStateRef.current = restored.value
        }
        setCatalog(nextCatalog)
        if (restoringSnapshot || restoringShare) {
          restorePendingRef.current = false
          setRestoring(false)
        }
      })
      .catch(() => {
        if (cancelled) return
        if (restoringShare) {
          rejectSharedSetup([{ stage: "domain", code: "catalog-unavailable" }])
          return
        }
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
    if (restoredTrackStateRef.current) {
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

  async function applySetupBookmark(token: string): Promise<"ok" | "unloadable"> {
    const availableMatchupIds = availableMatchupIdsRef.current
    if (!availableMatchupIds) return "unloadable"
    const restored = await restoreSetupBookmark(
      token,
      locale,
      availableMatchupIds.attackers,
      availableMatchupIds.defenders,
    )
    if (!restored.ok) return "unloadable"
    removeShareParam()
    sharedSetupRef.current = null
    sharedTokenRef.current = null
    restoredTrackStateRef.current = restored.trackState
    restorePendingRef.current = false
    setAttackerId(restored.catalog.matchup.attackerId)
    setDefenderId(restored.catalog.matchup.defenderId)
    setMoveCategory(restored.catalog.moveCategory)
    setCatalog(restored.catalog)
    setShowExplorer(true)
    setWorkspaceEpoch((epoch) => epoch + 1)
    return "ok"
  }

  if (shareFailures) {
    return (
      <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center p-6">
        <div className="max-w-md space-y-4 rounded-2xl border-2 border-ink bg-paper p-6 text-center shadow-hud-board">
          <h1 className="text-xl font-extrabold tracking-tight">
            <FormattedMessage id="share.invalidTitle" />
          </h1>
          <p className="text-muted-foreground text-sm">
            <FormattedMessage id="share.invalidDescription" />
          </p>
          <Button type="button" onClick={() => removeShareParam(true)}>
            <FormattedMessage id="share.returnLocal" />
          </Button>
        </div>
      </main>
    )
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
        key={workspaceEpoch}
        attackers={localizedOptions.attackers}
        defenders={localizedOptions.defenders}
        catalog={catalog}
        attackerId={attackerId}
        defenderId={defenderId}
        restoredTrackState={restoredTrackStateRef.current}
        sharedSetupToken={sharedTokenRef.current}
        onSharedSetupEdited={() => removeShareParam()}
        onApplySetupBookmark={applySetupBookmark}
        onAttackerChange={changeAttacker}
        onDefenderChange={setDefenderId}
        onMoveCategoryChange={setMoveCategory}
      />
    </div>
  )
}
