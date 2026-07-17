import type { IntlShape } from "react-intl"

import type { MatchupCatalog } from "@/lib/catalog"
import {
  defenseTemplatesForState,
  offenseTemplatesForState,
  type TrackState,
} from "@/lib/scenario-pipeline"
import {
  templateCardLabel,
  type StatNameStrategy,
} from "@/lib/stat-value-template"

export type BriefTrackId =
  | "attacker"
  | "defender"
  | "category"
  | "moves"
  | "offenseStats"
  | "attackerStages"
  | "items"
  | "attackerAbilities"
  | "weather"
  | "defenseStats"
  | "defenderStages"
  | "defenderAbilities"
  | "screens"

export type BriefTrack = {
  id: BriefTrackId
  group: "atk" | "field" | "def"
  label: string
  value: string
}

function join(parts: string[]): string {
  return parts.length > 0 ? parts.join(", ") : "—"
}

function formatStages(stages: readonly number[]): string {
  return stages.map((s) => (s > 0 ? `+${s}` : String(s))).join(", ")
}

/** Resolve every scenario track into label/value pairs for brief prototypes. */
export function buildBriefTracks(
  catalog: MatchupCatalog,
  trackState: TrackState,
  intl: IntlShape,
  statNameStrategy: StatNameStrategy,
): BriefTrack[] {
  const moveLabels = trackState.moveSnapshots.map((snap) => {
    const move = catalog.moves.find((m) => m.id === snap.moveId)
    return move?.label ?? String(snap.moveId)
  })

  const offenseTemplates = offenseTemplatesForState(catalog, trackState)
  const defenseTemplates = defenseTemplatesForState(catalog, trackState)

  const offenseStats =
    trackState.statMode === "range"
      ? `${trackState.statRange.min}-${trackState.statRange.max}`
      : join(
          trackState.offenseTemplateIds.map((id) => {
            const t = offenseTemplates.find((x) => x.id === id)
            if (!t) return id
            const alloc = trackState.offenseAllocationIndices[id] ?? 0
            return templateCardLabel(
              t,
              catalog.matchup.attackerSpecies,
              catalog.moveCategory,
              alloc,
              statNameStrategy,
            )
          }),
        )

  const defenseStats =
    trackState.defenderMode === "range"
      ? `HP ${trackState.defenderRanges.hp.min}-${trackState.defenderRanges.hp.max}, ${catalog.defenseStatLabel} ${trackState.defenderRanges.def.min}-${trackState.defenderRanges.def.max}`
      : join(
          trackState.defenseTemplateIds.map((id) => {
            const t = defenseTemplates.find((x) => x.id === id)
            if (!t) return id
            const alloc = trackState.defenseAllocationIndices[id] ?? 0
            return templateCardLabel(
              t,
              catalog.matchup.defenderSpecies,
              catalog.moveCategory,
              alloc,
              statNameStrategy,
            )
          }),
        )

  const items = join(
    trackState.attackerItemIds.map((id) => {
      const opt = catalog.attackerItems.find((x) => x.id === id)
      return opt?.label ?? id
    }),
  )

  const atkAbilities = join(
    trackState.attackerAbilityIds.map((id) => {
      const opt = catalog.attackerAbilities.find((x) => x.id === id)
      return opt?.label ?? String(id)
    }),
  )

  const defAbilities = join(
    trackState.defenderAbilityIds.map((id) => {
      const opt = catalog.defenderAbilities.find((x) => x.id === id)
      return opt?.label ?? String(id)
    }),
  )

  const weather = join(
    trackState.weathers.map((w) => intl.formatMessage({ id: `track.weather.${w}` })),
  )

  const screens = join(
    trackState.screens.map((s) => intl.formatMessage({ id: `track.screen.${s}` })),
  )

  return [
    {
      id: "attacker",
      group: "atk",
      label: intl.formatMessage({ id: "matchup.attacker" }),
      value: catalog.matchup.attackerLabel,
    },
    {
      id: "category",
      group: "atk",
      label: intl.formatMessage({ id: "track.moveSide" }),
      value: intl.formatMessage({ id: `track.moveSide.${catalog.moveCategory}` }),
    },
    {
      id: "moves",
      group: "atk",
      label: intl.formatMessage({ id: "track.moves" }),
      value: join(moveLabels),
    },
    {
      id: "offenseStats",
      group: "atk",
      label: catalog.offenseStatLabel,
      value: offenseStats,
    },
    {
      id: "attackerStages",
      group: "atk",
      label: intl.formatMessage({ id: "track.attackerStage" }),
      value: formatStages(trackState.attackerStages),
    },
    {
      id: "items",
      group: "atk",
      // ponytail: no dedicated track.items i18n key yet
      label: "Item",
      value: items,
    },
    {
      id: "attackerAbilities",
      group: "atk",
      label: intl.formatMessage({ id: "track.attackerAbility" }),
      value: atkAbilities,
    },
    {
      id: "weather",
      group: "field",
      label: intl.formatMessage({ id: "track.weather" }),
      value: weather,
    },
    {
      id: "defender",
      group: "def",
      label: intl.formatMessage({ id: "matchup.defender" }),
      value: catalog.matchup.defenderLabel,
    },
    {
      id: "defenseStats",
      group: "def",
      label: `HP / ${catalog.defenseStatLabel}`,
      value: defenseStats,
    },
    {
      id: "defenderStages",
      group: "def",
      label: intl.formatMessage({ id: "track.defenderStage" }),
      value: formatStages(trackState.defenderStages),
    },
    {
      id: "defenderAbilities",
      group: "def",
      label: intl.formatMessage({ id: "track.defenderAbility" }),
      value: defAbilities,
    },
    {
      id: "screens",
      group: "def",
      label: intl.formatMessage({ id: "track.screen" }),
      value: screens,
    },
  ]
}
