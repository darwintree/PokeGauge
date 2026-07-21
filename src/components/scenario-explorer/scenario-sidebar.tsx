import { useEffect, useState, type ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type { MatchupCatalog, MoveCategory, SpeciesOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"

import { AbilityTrack } from "./ability-track"
import { HeldItemTrack } from "./held-item-track/held-item-track"
import { SpeciesSelect } from "./matchup-selector"
import { MoveMultiSelect } from "./move-multi-select"
import { ScreenTrack } from "./screen-track"
import { StatStageTrack } from "./stat-stage-track"
import { StatTrackCard } from "./stat-track-card"
import type { ScenarioState } from "./use-scenario-state"
import { WeatherTrack } from "./weather-track"

type TrackId =
  | "moves"
  | "offenseStats"
  | "defenseStats"
  | "attackerStages"
  | "defenderStages"
  | "items"
  | "attackerAbilities"
  | "defenderAbilities"
  | "weather"
  | "screens"

type ScenarioSidebarProps = {
  catalog: MatchupCatalog
  state: ScenarioState
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onMoveCategoryChange: (category: MoveCategory) => void
}

export function ScenarioSidebar({
  catalog,
  state,
  attackers,
  defenders,
  attackerId,
  defenderId,
  onAttackerChange,
  onDefenderChange,
  onMoveCategoryChange,
}: ScenarioSidebarProps) {
  const intl = useIntl()
  const [activeId, setActiveId] = useState<TrackId | null>(null)
  const { trackState } = state

  function toggle(id: TrackId) {
    setActiveId((current) => (current === id ? null : id))
  }

  useEffect(() => {
    if (!activeId) return
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector(`[data-track-id="${activeId}"]`)
      const rect = target?.getBoundingClientRect()
      if (rect && (rect.top < 0 || rect.top > window.innerHeight)) {
        target?.scrollIntoView({ block: "nearest" })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [activeId])

  const tracks: Record<TrackId, ReactNode> = {
    moves: (
      <MoveMultiSelect
        label={intl.formatMessage({ id: "track.moves" })}
        options={catalog.moves}
        snapshots={trackState.moveSnapshots}
        selectedSnapshotIds={trackState.selectedMoveSnapshotIds}
        onAdd={state.addMoveSnapshot}
        onChange={state.updateMoveSnapshot}
        onRemove={state.removeMoveSnapshot}
        onSelectionChange={state.setSelectedMoveSnapshotIds}
        expanded={activeId === "moves"}
        onToggle={() => toggle("moves")}
        category={catalog.moveCategory}
        onCategoryChange={onMoveCategoryChange}
      />
    ),
    offenseStats: (
      <StatTrackCard
        side="offense"
        catalog={catalog}
        state={state}
        expanded={activeId === "offenseStats"}
        onToggle={() => toggle("offenseStats")}
      />
    ),
    defenseStats: (
      <StatTrackCard
        side="defense"
        catalog={catalog}
        state={state}
        expanded={activeId === "defenseStats"}
        onToggle={() => toggle("defenseStats")}
      />
    ),
    attackerStages: (
      <StatStageTrack
        label={<FormattedMessage id="track.attackerStage" />}
        ariaLabel={intl.formatMessage({ id: "track.attackerStage" })}
        values={trackState.attackerStages}
        onChange={state.setAttackerStages}
        expanded={activeId === "attackerStages"}
        onToggle={() => toggle("attackerStages")}
      />
    ),
    defenderStages: (
      <StatStageTrack
        label={<FormattedMessage id="track.defenderStage" />}
        ariaLabel={intl.formatMessage({ id: "track.defenderStage" })}
        values={trackState.defenderStages}
        onChange={state.setDefenderStages}
        expanded={activeId === "defenderStages"}
        onToggle={() => toggle("defenderStages")}
      />
    ),
    items: (
      <HeldItemTrack
        catalog={catalog}
        selectedIds={trackState.attackerItemIds}
        onChange={state.setAttackerItemIds}
        expanded={activeId === "items"}
        onToggle={() => toggle("items")}
      />
    ),
    attackerAbilities: (
      <AbilityTrack
        labelId="track.attackerAbility"
        options={catalog.attackerAbilities}
        selectedIds={trackState.attackerAbilityIds}
        onChange={state.setAttackerAbilityIds}
        onReset={state.resetAttackerAbilities}
        expanded={activeId === "attackerAbilities"}
        onToggle={() => toggle("attackerAbilities")}
      />
    ),
    defenderAbilities: (
      <AbilityTrack
        labelId="track.defenderAbility"
        options={catalog.defenderAbilities}
        selectedIds={trackState.defenderAbilityIds}
        onChange={state.setDefenderAbilityIds}
        onReset={state.resetDefenderAbilities}
        expanded={activeId === "defenderAbilities"}
        onToggle={() => toggle("defenderAbilities")}
      />
    ),
    weather: (
      <WeatherTrack
        values={trackState.weathers}
        onChange={state.setWeathers}
        expanded={activeId === "weather"}
        onToggle={() => toggle("weather")}
      />
    ),
    screens: (
      <ScreenTrack
        values={trackState.screens}
        onChange={state.setScreens}
        expanded={activeId === "screens"}
        onToggle={() => toggle("screens")}
      />
    ),
  }

  function pair(leftId: TrackId | null, rightId: TrackId | null) {
    const selected = [leftId, rightId].find((id) => id === activeId)
    const peer = selected === leftId ? rightId : leftId

    if (selected) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <div key={selected} data-track-id={selected} className="col-span-2">
            {tracks[selected]}
          </div>
          {peer && (
            <div key={peer} data-track-id={peer}>
              {tracks[peer]}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {leftId ? <div data-track-id={leftId}>{tracks[leftId]}</div> : <div />}
        {rightId ? <div data-track-id={rightId}>{tracks[rightId]}</div> : <div />}
      </div>
    )
  }

  return (
    <section aria-label={intl.formatMessage({ id: "app.setup" })} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <SpeciesSelect
          label={intl.formatMessage({ id: "matchup.attacker" })}
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
          spriteSide="back"
        />
        <SpeciesSelect
          label={intl.formatMessage({ id: "matchup.defender" })}
          options={defenders}
          value={defenderId}
          onChange={onDefenderChange}
        />
      </div>

      <div data-track-id="moves">{tracks.moves}</div>
      {pair("offenseStats", "defenseStats")}
      {pair("attackerStages", "defenderStages")}
      {pair("attackerAbilities", "defenderAbilities")}
      {pair(null, "screens")}
      {pair("items", "weather")}
    </section>
  )
}
