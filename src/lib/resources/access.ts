import type { SupportedLocale } from "@/lib/i18n"
import type {
  GeneratedResourceDiagnostics,
  LocalizedMoveResource,
  LocalizedPokemonResource,
  LocalizedResourceByType,
  NormalizedBattlePokemon,
  NormalizedMove,
  ResourceType,
  UpstreamResourceId,
} from "./types"

let pokemonResources: Record<UpstreamResourceId, NormalizedBattlePokemon> | undefined
let pokemonResourcesPromise:
  | Promise<Record<UpstreamResourceId, NormalizedBattlePokemon>>
  | undefined
let moveResources: Record<UpstreamResourceId, NormalizedMove> | undefined
let moveResourcesPromise:
  | Promise<Record<UpstreamResourceId, NormalizedMove>>
  | undefined
let diagnosticsPromise: Promise<GeneratedResourceDiagnostics> | undefined
let pokemonByCalcName: Map<string, NormalizedBattlePokemon> | undefined
let moveByCalcName: Map<string, NormalizedMove> | undefined
let moveIdByJoinName: Map<string, UpstreamResourceId> | undefined

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

async function loadResourceDiagnostics(): Promise<GeneratedResourceDiagnostics> {
  diagnosticsPromise ??= import("./generated/diagnostics").then(
    ({ RESOURCE_DIAGNOSTICS }) => RESOURCE_DIAGNOSTICS,
  )
  return diagnosticsPromise
}

export async function getResource<TType extends ResourceType>(
  resourceType: TType,
  id: UpstreamResourceId,
  locale: SupportedLocale,
): Promise<LocalizedResourceByType[TType]> {
  const resources =
    resourceType === "pokemon" ? await loadPokemonResources() : await loadMoveResources()
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
          calcSpeciesName: resource.calcSpeciesName,
          types: resource.types,
          baseStats: resource.baseStats,
        }
      : {
          calcMoveName: resource.calcMoveName,
          type: resource.type,
          category: resource.category,
          power: resource.power,
          accuracy: resource.accuracy,
          damageKind: resource.damageKind,
          target: resource.target,
          isSpread: resource.isSpread,
        }),
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
    calcSpeciesName: resource.calcSpeciesName,
    types: resource.types,
    baseStats: resource.baseStats,
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
  const resources =
    resourceType === "pokemon" ? await loadPokemonResources() : await loadMoveResources()
  const localized = Object.values(resources).map((resource) =>
    resource.resourceType === "pokemon"
      ? localizePokemon(resource, locale)
      : localizeMove(resource, locale),
  )

  return localized as LocalizedResourceByType[TType][]
}

export async function getResourceDiagnostics(): Promise<GeneratedResourceDiagnostics> {
  return loadResourceDiagnostics()
}

export function getBattlePokemonById(
  id: UpstreamResourceId,
): NormalizedBattlePokemon | undefined {
  return pokemonResources?.[id]
}

export function getMoveById(id: UpstreamResourceId): NormalizedMove | undefined {
  return moveResources?.[id]
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

export function getMoveIdByJoinName(name: string): UpstreamResourceId | undefined {
  return moveIdByJoinName?.get(normalizeJoinName(name))
}
