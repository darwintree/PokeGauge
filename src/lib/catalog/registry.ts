import { buildCoreCatalogOptions, buildTypeBoostCatalogOptions } from "@/lib/held-item"
import { localeMessages, type SupportedLocale } from "@/lib/i18n"
import type { PokemonType } from "@/lib/pokemon/types"
import { getResource, type BattlePokemonId, type UpstreamResourceId } from "@/lib/resources"
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
  id: UpstreamResourceId
  moveName: string
  type: PokemonType
}

type AttackerEntry = {
  id: BattlePokemonId
  species: string
  types: PokemonType[]
  moveCategory: MoveCategory
  /** Usage-ranked top-N — default selected on load */
  moves: MovePickEntry[]
  /** Optional pool — addable via +, not pre-selected */
  extraMoves?: MovePickEntry[]
}

type DefenderEntry = {
  id: BattlePokemonId
  species: string
  types: PokemonType[]
}

/** Hardcoded VGC doubles usage-ranked move picks — Champions context, v1 */
const ATTACKERS: AttackerEntry[] = [
  {
    id: 445,
    species: "Garchomp",
    types: ["dragon", "ground"],
    moveCategory: "physical",
    moves: [
      { id: 89, moveName: "Earthquake", type: "ground" },
      { id: 337, moveName: "Dragon Claw", type: "dragon" },
      { id: 444, moveName: "Stone Edge", type: "rock" },
    ],
    extraMoves: [
      { id: 182, moveName: "Protect", type: "normal" },
      { id: 424, moveName: "Fire Fang", type: "fire" },
    ],
  },
  {
    id: 10021,
    species: "Landorus-Therian",
    types: ["ground", "flying"],
    moveCategory: "physical",
    moves: [
      { id: 89, moveName: "Earthquake", type: "ground" },
      { id: 157, moveName: "Rock Slide", type: "rock" },
      { id: 707, moveName: "Stomping Tantrum", type: "ground" },
    ],
    extraMoves: [
      { id: 182, moveName: "Protect", type: "normal" },
      { id: 282, moveName: "Knock Off", type: "dark" },
    ],
  },
  {
    id: 987,
    species: "Flutter Mane",
    types: ["ghost", "fairy"],
    moveCategory: "special",
    moves: [
      { id: 585, moveName: "Moonblast", type: "fairy" },
      { id: 247, moveName: "Shadow Ball", type: "ghost" },
      { id: 605, moveName: "Dazzling Gleam", type: "fairy" },
    ],
    extraMoves: [
      { id: 182, moveName: "Protect", type: "normal" },
      { id: 85, moveName: "Thunderbolt", type: "electric" },
    ],
  },
]

const DEFENDERS: DefenderEntry[] = [
  { id: 727, species: "Incineroar", types: ["fire", "dark"] },
  { id: 591, species: "Amoonguss", types: ["grass", "poison"] },
  { id: 812, species: "Rillaboom", types: ["grass"] },
]

const DEFAULT_MATCHUP = {
  attackerId: 445,
  defenderId: 727,
} as const

function statLabels(category: MoveCategory, locale: SupportedLocale) {
  const messages = localeMessages[locale]
  return category === "physical"
    ? {
        offenseStatLabel: messages["stat.attack"],
        defenseStatLabel: messages["stat.defense"],
      }
    : {
        offenseStatLabel: messages["stat.specialAttack"],
        defenseStatLabel: messages["stat.specialDefense"],
      }
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

function findAttacker(id: BattlePokemonId): AttackerEntry | undefined {
  return ATTACKERS.find((a) => a.id === id)
}

function findDefender(id: BattlePokemonId): DefenderEntry | undefined {
  return DEFENDERS.find((d) => d.id === id)
}

async function localizedSpeciesOption(
  entry: AttackerEntry | DefenderEntry,
  locale: SupportedLocale,
): Promise<SpeciesOption> {
  const resource = await getResource("pokemon", entry.id, locale)
  return { id: resource.battlePokemonId, label: resource.name, species: entry.species, types: entry.types }
}

export async function listAttackers(locale: SupportedLocale): Promise<SpeciesOption[]> {
  return Promise.all(ATTACKERS.map((entry) => localizedSpeciesOption(entry, locale)))
}

export async function listDefenders(locale: SupportedLocale): Promise<SpeciesOption[]> {
  return Promise.all(DEFENDERS.map((entry) => localizedSpeciesOption(entry, locale)))
}

export function getDefaultMatchupIds() {
  return { ...DEFAULT_MATCHUP }
}

export async function getCatalog(
  attackerId: BattlePokemonId,
  defenderId: BattlePokemonId,
  locale: SupportedLocale,
): Promise<MatchupCatalog> {
  const attacker = findAttacker(attackerId) ?? findAttacker(DEFAULT_MATCHUP.attackerId)!
  const defender = findDefender(defenderId) ?? findDefender(DEFAULT_MATCHUP.defenderId)!
  const [attackerResource, defenderResource] = await Promise.all([
    getResource("pokemon", attacker.id, locale),
    getResource("pokemon", defender.id, locale),
  ])

  const moveEntries = [...attacker.moves, ...(attacker.extraMoves ?? [])]
  const moves: CatalogMoveOption[] = await Promise.all(
    moveEntries.map(async (m) => {
      const moveResource = await getResource("move", m.id, locale)
      return {
        id: moveResource.id,
        label: moveResource.name,
        summary: "",
        moveName: m.moveName,
        type: m.type,
      }
    }),
  )

  const labels = statLabels(attacker.moveCategory, locale)

  return {
    matchup: {
      attackerId: attacker.id,
      defenderId: defender.id,
      attackerLabel: attackerResource.name,
      defenderLabel: defenderResource.name,
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
    /** Default selected set — top-N move pick only; extraMoves addable via + */
    defaultMoveIds: attacker.moves.map((m) => m.id),
    defaultAttackerStatIds: ["neutral-max", "extreme"],
    defaultAttackerItemIds: ["none"],
    defaultDefenderIds: ["hp-32"],
  }
}
