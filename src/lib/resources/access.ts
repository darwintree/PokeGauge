import type { SupportedLocale } from "@/lib/i18n"
import { resourcesForType } from "./mock-data"
import type {
  LocalizedResourceByType,
  ResourceType,
  UpstreamResourceId,
} from "./types"

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
  const resources = resourcesForType(resourceType)
  const resource = resources[id]
  if (!resource) throw new ResourceLookupError(resourceType, id)

  return {
    resourceType,
    id: resource.id,
    locale,
    name: resource.names[locale],
    ...(resource.resourceType === "pokemon"
      ? { battlePokemonId: resource.battlePokemonId }
      : {}),
  } as LocalizedResourceByType[TType]
}
