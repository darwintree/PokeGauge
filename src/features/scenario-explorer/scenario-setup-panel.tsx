import { useEffect, useState, type ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type { MatchupCatalog, MoveCategory, BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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

import "./matchup/battle-pokemon-identity.css"

type AccordionTrackId = "moves" | "offenseStats" | "defenseStats"

type TrackId =
  | AccordionTrackId
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
  const [activeId, setActiveId] = useState<AccordionTrackId | null>(null)
  const { trackState } = state


  function toggle(id: AccordionTrackId) {
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
        attackerId={catalog.matchup.attackerId}
        attackerTypes={catalog.attackerTypes}
        defenderTypes={catalog.defenderTypes}
        options={catalog.moves}
        learnableOptions={catalog.moveCandidates}
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
        label={<FormattedMessage id="track.stage" />}
        ariaLabel={intl.formatMessage({ id: "track.attackerStage" })}
        side="attacker"
        pool={trackState.attackerStagePool}
        values={trackState.attackerStages}
        onChange={state.setAttackerStages}
        onAdd={state.addAttackerStage}
      />
    ),
    defenderStages: (
      <BattleStatStageTrack
        label={<FormattedMessage id="track.stage" />}
        ariaLabel={intl.formatMessage({ id: "track.defenderStage" })}
        side="defender"
        pool={trackState.defenderStagePool}
        values={trackState.defenderStages}
        onChange={state.setDefenderStages}
        onAdd={state.addDefenderStage}
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
      />
    ),
    attackerAbilities: (
      <AbilityTrack
        labelId="track.attackerAbility"
        options={catalog.attackerAbilities}
        selectedIds={trackState.attackerAbilityIds}
        onChange={state.setAttackerAbilityIds}
      />
    ),
    defenderAbilities: (
      <AbilityTrack
        labelId="track.defenderAbility"
        options={catalog.defenderAbilities}
        selectedIds={trackState.defenderAbilityIds}
        onChange={state.setDefenderAbilityIds}
      />
    ),
    weather: (
      <WeatherTrack
        pool={trackState.weatherPool}
        onAdd={state.addWeather}
        values={trackState.weathers}
        onChange={state.setWeathers}
      />
    ),
    terrain: (
      <TerrainTrack
        pool={trackState.terrainPool}
        onAdd={state.addTerrain}
        values={trackState.terrains}
        onChange={state.setTerrains}
      />
    ),
    screens: (
      <ScreenTrack
        values={trackState.screens}
        onChange={state.setScreens}
      />
    ),
  }

  return (
    <section aria-label={intl.formatMessage({ id: "app.setup" })} className="setup-panel flex flex-col gap-4">
      <div className="battle-pokemon-identities grid grid-cols-2">
        <BattlePokemonPicker
          label={intl.formatMessage({ id: "matchup.attacker" })}
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
          compactSide="attacker"
          spriteSide="back"
        />
        <BattlePokemonPicker
          label={intl.formatMessage({ id: "matchup.defender" })}
          compactSide="defender"
          options={defenders}
          value={defenderId}
          onChange={onDefenderChange}
        />
      </div>

      <div className="setup-controls" data-track-id="moves">{tracks.moves}</div>
      <div
        className="setup-sides"
        data-editing-stats={activeId === "offenseStats" || activeId === "defenseStats"}
      >
        <SetupSection title={intl.formatMessage({ id: "matchup.attacker" })}>
          <div data-track-id="offenseStats">{tracks.offenseStats}</div>
          <div data-track-id="attackerStages">{tracks.attackerStages}</div>
          <div data-track-id="attackerAbilities">{tracks.attackerAbilities}</div>
          <div data-track-id="attackerItems">{tracks.attackerItems}</div>
        </SetupSection>
        <SetupSection title={intl.formatMessage({ id: "matchup.defender" })}>
          <div data-track-id="defenseStats">{tracks.defenseStats}</div>
          <div data-track-id="defenderStages">{tracks.defenderStages}</div>
          <div data-track-id="defenderAbilities">{tracks.defenderAbilities}</div>
          <div data-track-id="defenderItems">{tracks.defenderItems}</div>
          <div data-track-id="screens">{tracks.screens}</div>
        </SetupSection>
      </div>
      <SetupSection title={intl.formatMessage({ id: "setup.sharedField" })}>
        <div className="grid grid-cols-2">
          <div className="min-w-0" data-track-id="terrain">{tracks.terrain}</div>
          <div className="min-w-0 border-l border-hairline" data-track-id="weather">{tracks.weather}</div>
        </div>
      </SetupSection>
    </section>
  )
}

function SetupSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="setup-controls min-w-0 gap-0 overflow-visible py-0 ring-0" role="group" aria-label={title}>
      <CardHeader className="px-3 py-2">
        <CardTitle className="text-xs font-extrabold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="setup-section-tracks px-0">{children}</CardContent>
    </Card>
  )
}
