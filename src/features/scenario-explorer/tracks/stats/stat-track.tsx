import { useContext, useEffect, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useIntl } from "react-intl"
import { ArrowLeftRight, ChartNoAxesCombined, Gauge, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { resolveDefenseChip, resolveOffenseChip, uniqueEndpointChips } from "@/lib/stat-preset"
import { TrackPanel } from "../common/track-panel"
import { StatPresetChoices } from "./stat-preset-choices"
import { RangeMark } from "./range-mark"
import { StatValueChipPair, StatValueChip } from "./stat-value-chip"
import { StatTrackEditor } from "./stat-track-editor"
import type { MatchupCatalog } from "@/lib/catalog"
import type { ScenarioState } from "../../state/use-scenario-state"
import { StatEditorContext } from "./stat-editor-context"

export type StatTrackProps = {
  side: "offense" | "defense"
  catalog: MatchupCatalog
  state: ScenarioState
}

export function StatTrack({ side, catalog, state }: StatTrackProps): ReactNode {
  const intl = useIntl()
  function message(id: string): string {
    return intl.formatMessage({ id })
  }
  const context = useContext(StatEditorContext)!
  const { editing, setEditing, previewTarget, showResults, showSetup } = context
  const offense = side === "offense"
  const label = offense ? catalog.offenseStatLabel : `HP / ${catalog.defenseStatLabel}`
  const mode = offense ? state.trackState.statMode : state.trackState.defenderMode
  const selectedIds = offense ? state.trackState.offensePresetIds : state.trackState.defensePresetIds
  const empty = selectedIds.length === 0
  const active = editing?.side === side
  const adding = active && editing.kind === "add"
  const docked = active && editing.placement === "results"
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!docked || !previewTarget) return
    const frame = requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true })
      previewTarget.scrollIntoView({ block: "start", behavior: "instant" })
    })
    return () => cancelAnimationFrame(frame)
  }, [docked, previewTarget])

  function clearDrafts() {
    state.setOffenseDraft(null)
    state.setDefenseDraft(null)
  }

  function open(kind: "add" | "range") {
    clearDrafts()
    if (kind === "add") {
      if (offense) state.setOffenseDraft(state.offenseBounds.snapPoints[1]?.value ?? state.offenseBounds.min)
      else state.setDefenseDraft({
        hp: state.defenderHpBounds.snapPoints[1]?.value ?? state.defenderHpBounds.min,
        def: state.defenderDefBounds.snapPoints[0]?.value ?? state.defenderDefBounds.min,
      })
    }
    setEditing({ side, kind, placement: "popover" })
  }

  function close() {
    clearDrafts()
    setEditing(null)
  }

  function confirm() {
    if (adding) {
      if (offense && state.offenseDraft !== null) state.confirmAddOffense(state.offenseDraft)
      if (!offense && state.defenseDraft !== null) state.confirmAddDefense(state.defenseDraft.hp, state.defenseDraft.def)
    }
    close()
  }

  function switchMode() {
    close()
    const next = mode === "preset" ? "range" : "preset"
    if (offense) state.setStatMode(next)
    else state.setDefenderMode(next)
  }

  const title = `${message(adding ? "stat.editor.add" : "stat.editor.range")} · ${label}`
  let draftChip = null
  if (adding && offense && state.offenseDraft !== null) {
    draftChip = resolveOffenseChip({ calcName: catalog.matchup.attackerCalcName, category: catalog.moveCategory, stat: state.offenseDraft, strategy: state.statNameStrategy, temporary: true })
  }
  if (adding && !offense && state.defenseDraft !== null) {
    draftChip = resolveDefenseChip({ calcName: catalog.matchup.defenderCalcName, category: catalog.moveCategory, hp: state.defenseDraft.hp, def: state.defenseDraft.def, strategy: state.statNameStrategy, temporary: true })
  }

  function resolveRangeEndpoint(endpoint: "min" | "max") {
    if (offense) {
      return resolveOffenseChip({
        calcName: catalog.matchup.attackerCalcName,
        category: catalog.moveCategory,
        stat: state.trackState.statRange[endpoint],
        strategy: state.statNameStrategy,
      })
    }
    return resolveDefenseChip({
      calcName: catalog.matchup.defenderCalcName,
      category: catalog.moveCategory,
      hp: state.trackState.defenderRanges.hp[endpoint],
      def: state.trackState.defenderRanges.def[endpoint],
      strategy: state.statNameStrategy,
    })
  }
  const rangeChips = uniqueEndpointChips(resolveRangeEndpoint("min"), resolveRangeEndpoint("max"))

  const controls = (
    <div className="space-y-3">
      <div className="flex min-h-7 items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{adding ? message("stat.editor.drag") : message("stat.editor.nudge")}</span>
        <div className="flex items-center gap-1">
          {draftChip ? <StatValueChip chip={draftChip} compact /> : <StatValueChipPair chips={rangeChips} compact />}
        </div>
      </div>
      <div className="space-y-3 px-2">
        <StatTrackEditor side={side} catalog={catalog} state={state} />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-hairline pt-3">
        {!docked && (
          <Button variant="outline" size="sm" className="mr-auto lg:hidden" onClick={() => {
            setEditing({ side, kind: adding ? "add" : "range", placement: "results" })
            showResults()
          }}>
            <ChartNoAxesCombined className="size-3.5" />{message("stat.editor.previewDamage")}
          </Button>
        )}
        {docked && <Button variant="ghost" size="sm" className="mr-auto" onClick={() => {
          setEditing({ side, kind: adding ? "add" : "range", placement: "popover" })
          showSetup()
        }}>{message("stat.editor.return")}</Button>}
        {adding && <Button variant="ghost" size="sm" onClick={close}>{message("action.cancel")}</Button>}
        <Button size="sm" onClick={confirm}>{message(adding ? "stat.editor.confirmAdd" : "stat.editor.done")}</Button>
      </div>
    </div>
  )

  const choicePool = (
    <StatPresetChoices
      presets={offense ? state.offensePresets : state.defensePresets}
      selectedIds={selectedIds}
      calcName={offense ? catalog.matchup.attackerCalcName : catalog.matchup.defenderCalcName}
      category={catalog.moveCategory}
      statNameStrategy={state.statNameStrategy}
      allocationIndices={offense ? state.trackState.offenseAllocationIndices : state.trackState.defenseAllocationIndices}
      onToggle={offense ? state.toggleOffensePreset : state.toggleDefensePreset}
      onCycleAllocation={offense ? state.cycleOffenseAllocation : state.cycleDefenseAllocation}
      onDelete={offense ? state.deleteOffensePreset : state.deleteDefensePreset}
      onPersist={offense ? state.persistOffensePreset : state.persistDefensePreset}
    />
  )

  return (
    <>
      <Popover open={active && !docked} onOpenChange={open => { if (!open && active && !docked) close() }}>
        <TrackPanel
          icon={Gauge}
          label={label}
          expandable={false}
          headerTrailing={
            <Button
              variant="ghost"
              size="xs"
              onClick={switchMode}
              aria-label={intl.formatMessage(
                { id: "stat.editor.switchMode" },
                { mode: message(mode === "preset" ? "track.range" : "track.choice") },
              )}
            >
              <ArrowLeftRight className="size-3" />
              {message(mode === "preset" ? "track.choice" : "track.range")}
            </Button>
          }
          summary={mode === "preset" ? (
            <div className="flex w-full flex-wrap items-center gap-1.5">
              <div className="contents [&>div]:contents">{choicePool}</div>
              <PopoverTrigger
                render={<Button variant="ghost" size="sm" className="track-option track-option--add track-option--add-text" />}
                aria-label={intl.formatMessage({ id: "stat.editor.addLabel" }, { stat: label })}
                onClick={() => open("add")}
              >+</PopoverTrigger>
            </div>
          ) : (
            <div className="relative flex w-full min-w-0 flex-col gap-1.5 rounded-lg border border-hairline bg-token-bg/50 p-2">
              <PopoverTrigger
                render={<Button variant="ghost" className="absolute inset-0 h-full w-full rounded-lg p-0 hover:bg-ink/5" />}
                aria-label={intl.formatMessage({ id: "stat.editor.editLabel" }, { stat: label, range: empty ? message("stat.editor.empty") : rangeChips.map(chip => chip.label).join(" ~ ") })}
                onClick={() => open("range")}
              ><span className="sr-only">{message("stat.editor.range")}</span></PopoverTrigger>
              <div className="pointer-events-none relative z-10 flex min-h-5 min-w-0 items-center">
                {empty ? <span className="text-xs text-muted-foreground">{message("stat.editor.empty")}</span> : (
                  <span className="flex min-w-0 flex-wrap items-center gap-1">
                    {rangeChips.map((chip, index) => <span key={index} className="inline-flex items-center gap-1">
                      {index > 0 && <span className="text-xs text-muted-foreground">~</span>}
                      <span className={`stat-value-chip stat-value-chip--compact stat-value-chip--${chip.band}`}>{chip.label}</span>
                    </span>)}
                  </span>
                )}
              </div>
              <div className="pointer-events-none relative flex h-3.5 items-center gap-2 text-muted-foreground">
                <RangeMark />
              </div>
            </div>
          )}
        />
        {!docked && <PopoverContent align="start" sideOffset={8} className="w-[360px] max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto border border-hud-frame bg-paper p-4 shadow-hud-panel">
          <div className="flex items-center justify-between gap-2">
            <PopoverTitle className="font-bold">{title}</PopoverTitle>
            <Button variant="ghost" size="icon-sm" aria-label={message("app.close")} onClick={close}><X /></Button>
          </div>
          {controls}
        </PopoverContent>}
      </Popover>
      {docked && previewTarget && createPortal(
        <section aria-label={title} className="rounded-xl border border-hud-frame bg-paper p-3 shadow-hud-panel">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 ref={headingRef} tabIndex={-1} className="text-sm font-bold outline-none">{title}</h2>
            <span className="text-[10px] text-muted-foreground">{message("stat.editor.live")}</span>
          </div>
          {controls}
        </section>, previewTarget,
      )}
    </>
  )
}
