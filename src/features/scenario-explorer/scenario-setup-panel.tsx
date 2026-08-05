import { useEffect, useState, type ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type { MatchupCatalog, MoveCategory, BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"

import { AbilityTrack } from "./tracks/common/ability-track"
import { HeldItemTrack } from "./tracks/held-item/held-item-track"
import { BattlePokemonPicker } from "./matchup/battle-pokemon-picker"
import { MoveTrack } from "./tracks/move/move-track"
import { ScreenTrack } from "./tracks/common/screen-track"
import { BattleStatStageTrack } from "./tracks/common/battle-stat-stage-track"
import { StatTrack } from "./tracks/stats/stat-track"
import { TerrainTrack } from "./tracks/common/terrain-track"
import type { ScenarioState } from "./state/use-scenario-state"
import { WeatherTrack } from "./tracks/common/weather-track"

type TrackId =
  | "moves"
  | "offenseStats"
  | "defenseStats"
  | "attackerStages"
  | "defenderStages"
  | "attackerItems"
  | "defenderItems"
  | "attackerAbilities"
  | "defenderAbilities"
  | "weather"
  | "terrain"
  | "screens"

type ScenarioSetupPanelProps = {
  catalog: MatchupCatalog
  state: ScenarioState
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onMoveCategoryChange: (category: MoveCategory) => void
}

export function ScenarioSetupPanel({
  catalog,
  state,
  attackers,
  defenders,
  attackerId,
  defenderId,
  onAttackerChange,
  onDefenderChange,
  onMoveCategoryChange,
}: ScenarioSetupPanelProps) {
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
      <MoveTrack
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
      <StatTrack
        side="offense"
        catalog={catalog}
        state={state}
        expanded={activeId === "offenseStats"}
        onToggle={() => toggle("offenseStats")}
      />
    ),
    defenseStats: (
      <StatTrack
        side="defense"
        catalog={catalog}
        state={state}
        expanded={activeId === "defenseStats"}
        onToggle={() => toggle("defenseStats")}
      />
    ),
    attackerStages: (
      <BattleStatStageTrack
        label={<FormattedMessage id="track.attackerStage" />}
        ariaLabel={intl.formatMessage({ id: "track.attackerStage" })}
        values={trackState.attackerStages}
        onChange={state.setAttackerStages}
        expanded={activeId === "attackerStages"}
        onToggle={() => toggle("attackerStages")}
      />
    ),
    defenderStages: (
      <BattleStatStageTrack
        label={<FormattedMessage id="track.defenderStage" />}
        ariaLabel={intl.formatMessage({ id: "track.defenderStage" })}
        values={trackState.defenderStages}
        onChange={state.setDefenderStages}
        expanded={activeId === "defenderStages"}
        onToggle={() => toggle("defenderStages")}
      />
    ),
    attackerItems: (
      <HeldItemTrack
        catalog={catalog}
        poolIds={trackState.attackerItemPoolIds}
        selectedIds={trackState.attackerItemIds}
        onChange={state.setAttackerItemIds}
        onAdd={state.addAttackerItem}
        onFormTriggerConfirm={onAttackerChange}
        selectableIds={new Set(attackers.map((option) => option.id))}
        lockedId={catalog.attackerLockedItemId}
        expanded={activeId === "attackerItems"}
        onToggle={() => toggle("attackerItems")}
      />
    ),
    defenderItems: (
      <HeldItemTrack
        catalog={catalog}
        side="defender"
        poolIds={trackState.defenderItemPoolIds}
        selectedIds={trackState.defenderItemIds}
        onChange={state.setDefenderItemIds}
        onAdd={state.addDefenderItem}
        onFormTriggerConfirm={onDefenderChange}
        selectableIds={new Set(defenders.map((option) => option.id))}
        lockedId={catalog.defenderLockedItemId}
        expanded={activeId === "defenderItems"}
        onToggle={() => toggle("defenderItems")}
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
    terrain: (
      <TerrainTrack
        values={trackState.terrains}
        onChange={state.setTerrains}
        expanded={activeId === "terrain"}
        onToggle={() => toggle("terrain")}
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
        <BattlePokemonPicker
          label={intl.formatMessage({ id: "matchup.attacker" })}
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
          spriteSide="back"
        />
        <BattlePokemonPicker
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
      {pair("attackerItems", "defenderItems")}
      {pair("terrain", "screens")}
      {pair("weather", null)}
    </section>
  )
}
