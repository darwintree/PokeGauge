import { buildCoreCatalogOptions, buildTypeBoostCatalogOptions } from "@/lib/held-item"
import type { PokemonType } from "@/lib/pokemon/types"
import {
  DEFENSE_PRESET_LABELS,
  OFFENSE_PRESET_LABELS,
  type DefensePresetId,
  type OffensePresetId,
} from "./preset-labels"
import type {
  CatalogMoveOption,
  MatchupCatalog,
  MoveCategory,
  SpeciesOption,
} from "./types"

type MovePickEntry = {
  id: string
  label: string
  moveName: string
  type: PokemonType
}

type AttackerEntry = {
  id: string
  label: string
  species: string
  types: PokemonType[]
  moveCategory: MoveCategory
  moves: MovePickEntry[]
}

type DefenderEntry = {
  id: string
  label: string
  species: string
  types: PokemonType[]
}

/** Hardcoded VGC doubles usage-ranked move picks — Champions context, v1 */
const ATTACKERS: AttackerEntry[] = [
  {
    id: "garchomp",
    label: "烈咬陆鲨",
    species: "Garchomp",
    types: ["dragon", "ground"],
    moveCategory: "physical",
    moves: [
      { id: "earthquake", label: "地震", moveName: "Earthquake", type: "ground" },
      { id: "dragon-claw", label: "龙爪", moveName: "Dragon Claw", type: "dragon" },
      { id: "stone-edge", label: "尖石攻击", moveName: "Stone Edge", type: "rock" },
    ],
  },
  {
    id: "landorus-therian",
    label: "土地云-灵兽",
    species: "Landorus-Therian",
    types: ["ground", "flying"],
    moveCategory: "physical",
    moves: [
      { id: "earthquake", label: "地震", moveName: "Earthquake", type: "ground" },
      { id: "rock-slide", label: "岩崩", moveName: "Rock Slide", type: "rock" },
      { id: "stomping-tantrum", label: "跺脚", moveName: "Stomping Tantrum", type: "ground" },
    ],
  },
  {
    id: "flutter-mane",
    label: "振翼发",
    species: "Flutter Mane",
    types: ["ghost", "fairy"],
    moveCategory: "special",
    moves: [
      { id: "moonblast", label: "月亮之力", moveName: "Moonblast", type: "fairy" },
      { id: "shadow-ball", label: "暗影球", moveName: "Shadow Ball", type: "ghost" },
      { id: "dazzling-gleam", label: "魔法闪耀", moveName: "Dazzling Gleam", type: "fairy" },
    ],
  },
]

const DEFENDERS: DefenderEntry[] = [
  { id: "incineroar", label: "咆哮虎", species: "Incineroar", types: ["fire", "dark"] },
  { id: "amoonguss", label: "败露球菇", species: "Amoonguss", types: ["grass", "poison"] },
  { id: "rillaboom", label: "轰擂金刚猩", species: "Rillaboom", types: ["grass"] },
]

const DEFAULT_MATCHUP = {
  attackerId: "garchomp",
  defenderId: "incineroar",
} as const

function statLabels(category: MoveCategory) {
  return category === "physical"
    ? { offenseStatLabel: "物攻" as const, defenseStatLabel: "物防" as const }
    : { offenseStatLabel: "特攻" as const, defenseStatLabel: "特防" as const }
}

function buildAttackerStats(category: MoveCategory) {
  const stat = category === "physical" ? "物攻" : "特攻"
  const entries: Array<{ id: OffensePresetId; summary: string }> = [
    { id: "neutral-zero", summary: `无修正 · 0 ${stat}` },
    { id: "neutral-max", summary: `无修正 · 252 ${stat}` },
    {
      id: "extreme",
      summary: category === "physical" ? "固执 · 252 物攻" : "内敛 · 252 特攻",
    },
  ]

  return entries.map(({ id, summary }) => ({
    id,
    label: OFFENSE_PRESET_LABELS[id],
    summary,
  }))
}

function buildDefenderBulks(category: MoveCategory) {
  const stat = category === "physical" ? "物防" : "特防"
  const entries: Array<{ id: DefensePresetId; summary: string }> = [
    { id: "min-bulk", summary: `无修正 · 0 HP / 0 ${stat}` },
    { id: "hp-32", summary: `无修正 · 252 HP / 0 ${stat}` },
    {
      id: "standard-bulk",
      summary:
        category === "physical" ? "慎重 · 252 HP / 252 物防" : "慎重 · 252 HP / 252 特防",
    },
  ]

  return entries.map(({ id, summary }) => ({
    id,
    label: DEFENSE_PRESET_LABELS[id],
    summary,
  }))
}

function buildAttackerItems(category: MoveCategory) {
  return [...buildCoreCatalogOptions(category), ...buildTypeBoostCatalogOptions()]
}

function findAttacker(id: string): AttackerEntry | undefined {
  return ATTACKERS.find((a) => a.id === id)
}

function findDefender(id: string): DefenderEntry | undefined {
  return DEFENDERS.find((d) => d.id === id)
}

export function listAttackers(): SpeciesOption[] {
  return ATTACKERS.map(({ id, label, species, types }) => ({ id, label, species, types }))
}

export function listDefenders(): SpeciesOption[] {
  return DEFENDERS.map(({ id, label, species, types }) => ({ id, label, species, types }))
}

export function getDefaultMatchupIds() {
  return { ...DEFAULT_MATCHUP }
}

export function getCatalog(attackerId: string, defenderId: string): MatchupCatalog {
  const attacker = findAttacker(attackerId) ?? findAttacker(DEFAULT_MATCHUP.attackerId)!
  const defender = findDefender(defenderId) ?? findDefender(DEFAULT_MATCHUP.defenderId)!

  const moves: CatalogMoveOption[] = attacker.moves.map((m) => ({
    id: m.id,
    label: m.label,
    summary: "",
    moveName: m.moveName,
    type: m.type,
  }))

  const labels = statLabels(attacker.moveCategory)

  return {
    matchup: {
      attackerId: attacker.id,
      defenderId: defender.id,
      attackerLabel: attacker.label,
      defenderLabel: defender.label,
      attackerSpecies: attacker.species,
      defenderSpecies: defender.species,
    },
    attackerTypes: attacker.types,
    moveCategory: attacker.moveCategory,
    ...labels,
    moves,
    attackerStats: buildAttackerStats(attacker.moveCategory),
    attackerItems: buildAttackerItems(attacker.moveCategory),
    defenderBulks: buildDefenderBulks(attacker.moveCategory),
    /** Default selected set — all top-N moves pre-selected */
    defaultMoveIds: moves.map((m) => m.id),
    defaultAttackerStatIds: ["neutral-max", "extreme"],
    defaultAttackerItemIds: ["none"],
    defaultDefenderIds: ["hp-32"],
  }
}

/** Backward-compatible fixture export for tests */
export const GARCHOMP_INCINEROAR_CATALOG = getCatalog("garchomp", "incineroar")
