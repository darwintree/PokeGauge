import type { SupportedLocale } from "@/lib/i18n"
import { GENERATED_HELD_ITEMS } from "./generated/held-items"
import { GENERATED_MEGA_STONES } from "./generated/mega-stones"
import type {
  GeneratedResourceDiagnostics,
  HistoricalLearnsetIndex,
  LocalizedAbilityResource,
  LocalizedMoveResource,
  LocalizedPokemonResource,
  LocalizedResourceByType,
  NormalizedAbility,
  NormalizedBattlePokemon,
  NormalizedMove,
  ResourceType,
  UpstreamResourceId,
} from "./types"

type NormalizedResource = NormalizedBattlePokemon | NormalizedMove | NormalizedAbility

let pokemonResources: Record<UpstreamResourceId, NormalizedBattlePokemon> | undefined
let pokemonResourcesPromise:
  | Promise<Record<UpstreamResourceId, NormalizedBattlePokemon>>
  | undefined
let moveResources: Record<UpstreamResourceId, NormalizedMove> | undefined
let moveResourcesPromise:
  | Promise<Record<UpstreamResourceId, NormalizedMove>>
  | undefined
let abilityResources: Record<UpstreamResourceId, NormalizedAbility> | undefined
let abilityResourcesPromise:
  | Promise<Record<UpstreamResourceId, NormalizedAbility>>
  | undefined
let diagnosticsPromise: Promise<GeneratedResourceDiagnostics> | undefined
let historicalLearnsetsPromise: Promise<HistoricalLearnsetIndex> | undefined
let pokemonByCalcName: Map<string, NormalizedBattlePokemon> | undefined
let moveByCalcName: Map<string, NormalizedMove> | undefined
let moveIdByJoinName: Map<string, UpstreamResourceId> | undefined
let abilityIdByJoinName: Map<string, UpstreamResourceId> | undefined
let itemIdByJoinName: Map<string, UpstreamResourceId> | undefined

function buildFirstByName<T>(values: T[], getName: (value: T) => string): Map<string, T> {
  const byName = new Map<string, T>()
  for (const value of values) {
    const name = getName(value)
    if (!byName.has(name)) byName.set(name, value)
  }
  return byName
}

export class ResourceLookupError extends Error {
  constructor(resourceType: ResourceType, id: UpstreamResourceId) {
    super(`Unknown ${resourceType} resource id: ${id}`)
    this.name = "ResourceLookupError"
  }
}

async function loadPokemonResources(): Promise<Record<UpstreamResourceId, NormalizedBattlePokemon>> {
  if (pokemonResources) return pokemonResources
  pokemonResourcesPromise ??= import("./generated/pokemon").then(({ GENERATED_POKEMON }) => {
    pokemonResources = GENERATED_POKEMON
    pokemonByCalcName = buildFirstByName(
      Object.values(GENERATED_POKEMON),
      (pokemon) => pokemon.calcSpeciesName,
    )
    return GENERATED_POKEMON
  })
  return pokemonResourcesPromise
}

async function loadMoveResources(): Promise<Record<UpstreamResourceId, NormalizedMove>> {
  if (moveResources) return moveResources
  moveResourcesPromise ??= import("./generated/moves").then(({ GENERATED_MOVES }) => {
    moveResources = GENERATED_MOVES
    moveByCalcName = buildFirstByName(
      Object.values(GENERATED_MOVES),
      (move) => move.calcMoveName,
    )
    moveIdByJoinName = buildMoveIdByJoinName(GENERATED_MOVES)
    return GENERATED_MOVES
  })
  return moveResourcesPromise
}

async function loadAbilityResources(): Promise<Record<UpstreamResourceId, NormalizedAbility>> {
  if (abilityResources) return abilityResources
  abilityResourcesPromise ??= import("./generated/abilities").then(({ GENERATED_ABILITIES }) => {
    abilityResources = GENERATED_ABILITIES
    abilityIdByJoinName = buildAbilityIdByJoinName(GENERATED_ABILITIES)
    return GENERATED_ABILITIES
  })
  return abilityResourcesPromise
}

async function loadResources(
  resourceType: ResourceType,
): Promise<Record<UpstreamResourceId, NormalizedResource>> {
  if (resourceType === "pokemon") return loadPokemonResources()
  if (resourceType === "move") return loadMoveResources()
  return loadAbilityResources()
}

async function loadResourceDiagnostics(): Promise<GeneratedResourceDiagnostics> {
  diagnosticsPromise ??= import("./generated/diagnostics").then(
    ({ RESOURCE_DIAGNOSTICS }) => RESOURCE_DIAGNOSTICS,
  )
  return diagnosticsPromise
}

async function loadHistoricalLearnsets(): Promise<HistoricalLearnsetIndex> {
  historicalLearnsetsPromise ??= import("./generated/learnsets").then(
    ({ GENERATED_HISTORICAL_LEARNSETS }) => GENERATED_HISTORICAL_LEARNSETS,
  )
  return historicalLearnsetsPromise
}

export async function getResource<TType extends ResourceType>(
  resourceType: TType,
  id: UpstreamResourceId,
  locale: SupportedLocale,
): Promise<LocalizedResourceByType[TType]> {
  const resources = await loadResources(resourceType)
  const resource = resources[id]
  if (!resource) throw new ResourceLookupError(resourceType, id)

  return {
    resourceType,
    id: resource.id,
    locale,
    name: resource.names[locale],
    ...(resource.resourceType === "pokemon"
      ? {
          battlePokemonId: resource.id,
          speciesId: resource.speciesId,
          speciesName: resource.speciesNames[locale],
          formName: resource.formNames[locale] || null,
          isBattleOnly: resource.isBattleOnly,
          isMega: resource.isMega,
          evioliteEligible: resource.evioliteEligible,
          pokemonSlug: resource.pokemonSlug,
          calcSpeciesName: resource.calcSpeciesName,
          types: resource.types,
          abilityIds: resource.abilityIds,
          baseStats: resource.baseStats,
        }
      : resource.resourceType === "move" ? {
          calcMoveName: resource.calcMoveName,
          type: resource.type,
          category: resource.category,
          power: resource.power,
          accuracy: resource.accuracy,
          damageKind: resource.damageKind,
          target: resource.target,
          isSpread: resource.isSpread,
        } : {}),
  } as LocalizedResourceByType[TType]
}

function localizePokemon(
  resource: NormalizedBattlePokemon,
  locale: SupportedLocale,
): LocalizedPokemonResource {
  return {
    resourceType: "pokemon",
    id: resource.id,
    locale,
    name: resource.names[locale],
    battlePokemonId: resource.id,
    speciesId: resource.speciesId,
    speciesName: resource.speciesNames[locale],
    formName: resource.formNames[locale] || null,
    isBattleOnly: resource.isBattleOnly,
    isMega: resource.isMega,
    evioliteEligible: resource.evioliteEligible,
    pokemonSlug: resource.pokemonSlug,
    calcSpeciesName: resource.calcSpeciesName,
    types: resource.types,
    abilityIds: resource.abilityIds,
    baseStats: resource.baseStats,
  }
}

function localizeAbility(
  resource: NormalizedAbility,
  locale: SupportedLocale,
): LocalizedAbilityResource {
  return {
    resourceType: "ability",
    id: resource.id,
    locale,
    name: resource.names[locale],
  }
}

function localizeMove(resource: NormalizedMove, locale: SupportedLocale): LocalizedMoveResource {
  return {
    resourceType: "move",
    id: resource.id,
    locale,
    name: resource.names[locale],
    calcMoveName: resource.calcMoveName,
    type: resource.type,
    category: resource.category,
    power: resource.power,
    accuracy: resource.accuracy,
    damageKind: resource.damageKind,
    target: resource.target,
    isSpread: resource.isSpread,
  }
}

export async function listResources<TType extends ResourceType>(
  resourceType: TType,
  locale: SupportedLocale,
): Promise<LocalizedResourceByType[TType][]> {
  const resources = await loadResources(resourceType)
  const localized = Object.values(resources).map((resource) => {
    if (resource.resourceType === "pokemon") return localizePokemon(resource, locale)
    if (resource.resourceType === "move") return localizeMove(resource, locale)
    return localizeAbility(resource, locale)
  })

  return localized as LocalizedResourceByType[TType][]
}

export async function getResourceDiagnostics(): Promise<GeneratedResourceDiagnostics> {
  return loadResourceDiagnostics()
}

export async function listHistoricalLearnableMoveIds(
  battlePokemonId: UpstreamResourceId,
): Promise<readonly UpstreamResourceId[]> {
  return (await loadHistoricalLearnsets())[battlePokemonId] ?? []
}

export function getBattlePokemonById(
  id: UpstreamResourceId,
): NormalizedBattlePokemon | undefined {
  return pokemonResources?.[id]
}

export function getMoveById(id: UpstreamResourceId): NormalizedMove | undefined {
  return moveResources?.[id]
}

export function getAbilityById(id: UpstreamResourceId): NormalizedAbility | undefined {
  return abilityResources?.[id]
}

export function getBattlePokemonByCalcName(name: string): NormalizedBattlePokemon | undefined {
  return pokemonByCalcName?.get(name)
}

export function getMoveByCalcName(name: string): NormalizedMove | undefined {
  return moveByCalcName?.get(name)
}

function normalizeJoinName(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

function buildMoveIdByJoinName(
  resources: Record<UpstreamResourceId, NormalizedMove>,
): Map<string, UpstreamResourceId> {
  return new Map(
    Object.values(resources).flatMap((move) => [
      [normalizeJoinName(move.slug), move.id] as const,
      [normalizeJoinName(move.calcMoveName), move.id] as const,
      ...Object.values(move.names).map((name) => [normalizeJoinName(name), move.id] as const),
    ]),
  )
}

function buildAbilityIdByJoinName(
  resources: Record<UpstreamResourceId, NormalizedAbility>,
): Map<string, UpstreamResourceId> {
  return new Map(
    Object.values(resources).flatMap((ability) => [
      [normalizeJoinName(ability.slug), ability.id] as const,
      ...Object.values(ability.names).map((name) => [normalizeJoinName(name), ability.id] as const),
    ]),
  )
}

export function getMoveIdByJoinName(name: string): UpstreamResourceId | undefined {
  return moveIdByJoinName?.get(normalizeJoinName(name))
}

export function getAbilityIdByJoinName(name: string): UpstreamResourceId | undefined {
  return abilityIdByJoinName?.get(normalizeJoinName(name))
}

function buildItemIdByJoinName(
  resources: Array<{ id: UpstreamResourceId; slug: string; names: Record<string, string> }>,
): Map<string, UpstreamResourceId> {
  return new Map(
    resources.flatMap((item) => [
      [normalizeJoinName(item.slug), item.id] as const,
      ...Object.values(item.names).map((name) => [normalizeJoinName(name), item.id] as const),
    ]),
  )
}

export function getItemIdByJoinName(name: string): UpstreamResourceId | undefined {
  itemIdByJoinName ??= buildItemIdByJoinName([
    ...Object.values(GENERATED_HELD_ITEMS),
    ...Object.values(GENERATED_MEGA_STONES),
  ])
  return itemIdByJoinName.get(normalizeJoinName(name))
}
