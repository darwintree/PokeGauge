import { typeEffectiveness } from "@/lib/calc-adapter/damage-kernel"
import { buildCoreCatalogOptions, buildTypeBoostCatalogOptions } from "@/lib/held-item"
import {
  listChampionsAbilityUsageRecords,
  listChampionsMoveUsageRecords,
  listChampionsPokemonUsageIds,
} from "@/lib/champions"
import { localeMessages, type SupportedLocale } from "@/lib/i18n"
import {
  isMoveExplicitlyUnsupported,
  resolveReviewedMoveType,
  reviewedVariablePowerDefault,
} from "@/lib/move-semantics"
import {
  getResource,
  listResources,
  type BattlePokemonId,
  type LocalizedMoveResource,
  type LocalizedPokemonResource,
  type UpstreamResourceId,
} from "@/lib/resources"
import {
  DEFENSE_PRESET_LABELS,
  OFFENSE_PRESET_LABELS,
  type DefensePresetId,
  type OffensePresetId,
} from "./preset-labels"
import type {
  CatalogAbilityOption,
  CatalogMoveOption,
  MatchupCatalog,
  MoveCategory,
  SpeciesOption,
} from "./types"

const STANDARD_TYPES = new Set([
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
])

function isStandardType(type: string): type is CatalogMoveOption["type"] {
  return STANDARD_TYPES.has(type)
}

const DEFAULT_MOVE_CATEGORY_BY_ATTACKER: Partial<Record<BattlePokemonId, MoveCategory>> = {
  445: "physical",
  591: "special",
  727: "physical",
  812: "physical",
  987: "special",
  10021: "physical",
}

const DEFAULT_MATCHUP = {
  attackerId: 445,
  defenderId: 727,
} as const

const DEFAULT_USAGE_TIMEOUT_MS = 5_000
const POKEMON_OPTIONS_BY_LOCALE = new Map<SupportedLocale, Promise<SpeciesOption[]>>()
const MOVE_OPTIONS_BY_LOCALE_CATEGORY = new Map<string, CatalogMoveOption[]>()

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

async function abilityOptions(
  abilityIds: UpstreamResourceId[],
  locale: SupportedLocale,
): Promise<CatalogAbilityOption[]> {
  return Promise.all(
    abilityIds.map(async (id) => {
      const ability = await getResource("ability", id, locale)
      return { id, label: ability.name, summary: "" }
    }),
  )
}

function localizedSpeciesOption(resource: LocalizedPokemonResource): SpeciesOption {
  return Object.freeze({
    id: resource.battlePokemonId,
    label: resource.name,
    species: resource.calcSpeciesName,
    types: Object.freeze([...resource.types]) as SpeciesOption["types"],
  })
}

async function listPokemonOptions(locale: SupportedLocale): Promise<SpeciesOption[]> {
  const cached = POKEMON_OPTIONS_BY_LOCALE.get(locale)
  if (cached) return cached

  const options = listResources("pokemon", locale).then((pokemon) =>
    Object.freeze(
      pokemon
        .map(localizedSpeciesOption)
        .sort((a, b) => a.label.localeCompare(b.label)),
    ) as SpeciesOption[],
  )
  POKEMON_OPTIONS_BY_LOCALE.set(locale, options)
  return options
}

export async function rankPokemonOptionsByChampionsUsage(
  options: SpeciesOption[],
): Promise<SpeciesOption[]> {
  const usageIds = await withTimeout(
    listChampionsPokemonUsageIds(),
    DEFAULT_USAGE_TIMEOUT_MS,
  ).catch(() => [])
  if (usageIds.length === 0) return options

  const byId = new Map(options.map((option) => [option.id, option]))
  const usageIdSet = new Set(usageIds)
  return [
    ...usageIds.flatMap((id) => byId.get(id) ?? []),
    ...options.filter((option) => !usageIdSet.has(option.id)),
  ]
}

export async function listAttackers(locale: SupportedLocale): Promise<SpeciesOption[]> {
  return listPokemonOptions(locale)
}

export async function listDefenders(locale: SupportedLocale): Promise<SpeciesOption[]> {
  return listPokemonOptions(locale)
}

export function getDefaultMatchupIds() {
  return { ...DEFAULT_MATCHUP }
}

export function getDefaultMoveCategory(attackerId: BattlePokemonId): MoveCategory {
  return DEFAULT_MOVE_CATEGORY_BY_ATTACKER[attackerId] ?? "physical"
}

function snapshotTemplatePower(
  moveResource: LocalizedMoveResource,
  category: MoveCategory,
): number | undefined {
  if (
    moveResource.category !== category ||
    !isStandardType(moveResource.type) ||
    isMoveExplicitlyUnsupported(moveResource.id)
  ) {
    return undefined
  }
  const reviewedPower = reviewedVariablePowerDefault(moveResource.id)
  if (reviewedPower !== undefined) return reviewedPower
  if (moveResource.power !== null && moveResource.power > 0) return moveResource.power
  return undefined
}

function snapshotCapableMoveOption(
  moveResource: LocalizedMoveResource,
  power: number,
): CatalogMoveOption {
  if (!isStandardType(moveResource.type) || moveResource.category === "status") {
    throw new Error(`Unsupported Move candidate resource: ${moveResource.id}`)
  }
  return {
    id: moveResource.id,
    label: moveResource.name,
    summary: [power, moveResource.accuracy ?? "-"].join(" / "),
    moveName: moveResource.calcMoveName,
    type: moveResource.type,
    category: moveResource.category,
    power,
    accuracy: moveResource.accuracy,
    isSpread: moveResource.isSpread,
  }
}

function compareMoveSearchOrder(a: CatalogMoveOption, b: CatalogMoveOption): number {
  const byPower = b.power - a.power
  if (byPower !== 0) return byPower
  const byAccuracy = (b.accuracy ?? Number.POSITIVE_INFINITY) - (a.accuracy ?? Number.POSITIVE_INFINITY)
  if (byAccuracy !== 0) return byAccuracy
  const byMoveName = a.moveName.localeCompare(b.moveName)
  if (byMoveName !== 0) return byMoveName
  return a.id - b.id
}

async function snapshotCapableMoveOptions(
  locale: SupportedLocale,
  category: MoveCategory,
): Promise<CatalogMoveOption[]> {
  const key = `${locale}:${category}`
  const cached = MOVE_OPTIONS_BY_LOCALE_CATEGORY.get(key)
  if (cached) return cached

  const moves = (await listResources("move", locale))
    .flatMap((moveResource) => {
      const power = snapshotTemplatePower(moveResource, category)
      return power === undefined ? [] : [snapshotCapableMoveOption(moveResource, power)]
    })
    .sort(compareMoveSearchOrder)
  MOVE_OPTIONS_BY_LOCALE_CATEGORY.set(key, moves)
  return moves
}

async function resolveUsageMoves(
  attackerId: BattlePokemonId,
  activeMoveCategory: MoveCategory,
  moves: CatalogMoveOption[],
): Promise<Array<{ moveId: UpstreamResourceId; percentage: number | null }>> {
  const moveById = new Map(moves.map((move) => [move.id, move]))
  const ranked = (await listChampionsMoveUsageRecords(attackerId))
    .toSorted((a, b) => {
      const byRank = a.rank - b.rank
      if (byRank !== 0) return byRank
      const byUsage = (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY)
      if (byUsage !== 0) return byUsage
      const byMoveName = a.championsMoveName.localeCompare(b.championsMoveName)
      if (byMoveName !== 0) return byMoveName
      return a.moveId - b.moveId
    })
    .slice(0, 10)
    .filter((record) => moveById.get(record.moveId)?.category === activeMoveCategory)

  return [
    ...new Map(
      ranked.map(({ moveId, percentage }) => [moveId, { moveId, percentage }]),
    ).values(),
  ]
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timeout = setTimeout(() => reject(new Error("Default Move pick timed out")), timeoutMs)
    }),
  ]).finally(() => {
    if (timeout) clearTimeout(timeout)
  })
}

async function resolveDefaultMovePick(
  attackerId: BattlePokemonId,
  activeMoveCategory: MoveCategory,
  moves: CatalogMoveOption[],
  defenderTypes: MatchupCatalog["defenderTypes"],
): Promise<
  Pick<
    MatchupCatalog,
    "moves" | "defaultMovePoolIds" | "defaultMoveIds" | "defaultMovePickStatus"
  >
> {
  try {
    const usageMoves = await withTimeout(
      resolveUsageMoves(attackerId, activeMoveCategory, moves),
      DEFAULT_USAGE_TIMEOUT_MS,
    )
    const usageMoveIds = usageMoves.map(({ moveId }) => moveId)
    const moveById = new Map(moves.map((move) => [move.id, move]))
    const usageMoveIdSet = new Set(usageMoveIds)

    return {
      moves: [
        ...usageMoveIds.map((moveId) => moveById.get(moveId)!),
        ...moves.filter((move) => !usageMoveIdSet.has(move.id)),
      ],
      defaultMovePoolIds: usageMoveIds,
      defaultMoveIds: usageMoves
        .filter(({ moveId, percentage }) =>
          (percentage ?? Number.NEGATIVE_INFINITY) > 50 ||
          typeEffectiveness(moveById.get(moveId)!.type, defenderTypes) > 1,
        )
        .map(({ moveId }) => moveId),
      defaultMovePickStatus: "ready",
    }
  } catch {
    return {
      moves,
      defaultMovePoolIds: [],
      defaultMoveIds: [],
      defaultMovePickStatus: "unavailable",
    }
  }
}

async function resolveDefaultAbilityIds(
  battlePokemonId: BattlePokemonId,
  abilities: CatalogAbilityOption[],
): Promise<UpstreamResourceId[]> {
  try {
    const legalIds = new Set(abilities.map((ability) => ability.id))
    const defaultId = (await withTimeout(
      listChampionsAbilityUsageRecords(battlePokemonId),
      DEFAULT_USAGE_TIMEOUT_MS,
    ))
      .toSorted((a, b) =>
        a.rank - b.rank ||
        (b.percentage ?? Number.NEGATIVE_INFINITY) -
          (a.percentage ?? Number.NEGATIVE_INFINITY) ||
        a.championsAbilityName.localeCompare(b.championsAbilityName) ||
        a.abilityId - b.abilityId,
      )
      .find((record) => legalIds.has(record.abilityId))?.abilityId
    return defaultId === undefined ? [...legalIds] : [defaultId]
  } catch {
    return abilities.map((ability) => ability.id)
  }
}

export async function getCatalogShell(
  attackerId: BattlePokemonId,
  defenderId: BattlePokemonId,
  locale: SupportedLocale,
  moveCategory?: MoveCategory,
): Promise<MatchupCatalog> {
  const activeMoveCategory = moveCategory ?? getDefaultMoveCategory(attackerId)
  const [attackerResource, defenderResource] = await Promise.all([
    getResource("pokemon", attackerId, locale),
    getResource("pokemon", defenderId, locale),
  ])
  const [attackerAbilities, defenderAbilities] = await Promise.all([
    abilityOptions(attackerResource.abilityIds, locale),
    abilityOptions(defenderResource.abilityIds, locale),
  ])

  const moves = (await snapshotCapableMoveOptions(locale, activeMoveCategory)).map(
    (move) => ({
      ...move,
      type: resolveReviewedMoveType(
        move.id,
        attackerId,
        move.type,
        attackerResource.types,
      ),
    }),
  )

  const labels = statLabels(activeMoveCategory, locale)

  return {
    matchup: {
      attackerId,
      defenderId,
      attackerLabel: attackerResource.name,
      defenderLabel: defenderResource.name,
      attackerSpecies: attackerResource.calcSpeciesName,
      defenderSpecies: defenderResource.calcSpeciesName,
    },
    attackerTypes: attackerResource.types,
    defenderTypes: defenderResource.types,
    moveCategory: activeMoveCategory,
    ...labels,
    moves,
    attackerStats: buildAttackerStats(activeMoveCategory),
    attackerItems: buildAttackerItems(activeMoveCategory),
    attackerAbilities,
    defenderBulks: buildDefenderBulks(activeMoveCategory),
    defenderAbilities,
    /** Champions defaults load asynchronously; global snapshot-capable moves remain searchable. */
    defaultMovePickStatus: "loading",
    defaultAbilityPickStatus: "loading",
    defaultMovePoolIds: [],
    defaultMoveIds: [],
    defaultAttackerStatIds: ["neutral-max", "extreme"],
    defaultAttackerItemIds: ["none"],
    defaultDefenderIds: ["hp-32"],
    defaultAttackerAbilityIds: attackerAbilities.map((ability) => ability.id),
    defaultDefenderAbilityIds: defenderAbilities.map((ability) => ability.id),
  }
}

export async function resolveCatalogDefaultMovePick(
  catalog: MatchupCatalog,
): Promise<MatchupCatalog> {
  const [defaultMovePick, defaultAttackerAbilityIds, defaultDefenderAbilityIds] =
    await Promise.all([
      resolveDefaultMovePick(
        catalog.matchup.attackerId,
        catalog.moveCategory,
        catalog.moves,
        catalog.defenderTypes,
      ),
      resolveDefaultAbilityIds(catalog.matchup.attackerId, catalog.attackerAbilities),
      resolveDefaultAbilityIds(catalog.matchup.defenderId, catalog.defenderAbilities),
    ])
  return {
    ...catalog,
    ...defaultMovePick,
    defaultAbilityPickStatus: "ready",
    defaultAttackerAbilityIds,
    defaultDefenderAbilityIds,
  }
}

export async function getCatalog(
  attackerId: BattlePokemonId,
  defenderId: BattlePokemonId,
  locale: SupportedLocale,
  moveCategory?: MoveCategory,
): Promise<MatchupCatalog> {
  return resolveCatalogDefaultMovePick(
    await getCatalogShell(attackerId, defenderId, locale, moveCategory),
  )
}
