import type { SupportedLocale } from "@/lib/i18n"
import {
  GENERATED_MOVES,
  GENERATED_POKEMON,
  RESOURCE_DIAGNOSTICS,
} from "./generated/pokeapi"
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

const POKEMON_RESOURCES: Record<UpstreamResourceId, NormalizedBattlePokemon> = GENERATED_POKEMON
const MOVE_RESOURCES: Record<UpstreamResourceId, NormalizedMove> = GENERATED_MOVES

export class ResourceLookupError extends Error {
  constructor(resourceType: ResourceType, id: UpstreamResourceId) {
    super(`Unknown ${resourceType} resource id: ${id}`)
    this.name = "ResourceLookupError"
  }
}

export async function getResource<TType extends ResourceType>(
  resourceType: TType,
  id: UpstreamResourceId,
  locale: SupportedLocale,
): Promise<LocalizedResourceByType[TType]> {
  const resources = resourceType === "pokemon" ? POKEMON_RESOURCES : MOVE_RESOURCES
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
  }
}

export async function listResources<TType extends ResourceType>(
  resourceType: TType,
  locale: SupportedLocale,
): Promise<LocalizedResourceByType[TType][]> {
  const resources = resourceType === "pokemon" ? POKEMON_RESOURCES : MOVE_RESOURCES
  const localized = Object.values(resources).map((resource) =>
    resource.resourceType === "pokemon"
      ? localizePokemon(resource, locale)
      : localizeMove(resource, locale),
  )

  return localized as LocalizedResourceByType[TType][]
}

export function getResourceDiagnostics(): GeneratedResourceDiagnostics {
  return RESOURCE_DIAGNOSTICS
}
