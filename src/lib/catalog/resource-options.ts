import { localeMessages, type SupportedLocale } from "@/lib/i18n"
import {
  calcDerivedPowerDefault,
  isMoveExplicitlyUnsupported,
} from "@/lib/move"
import {
  getResource,
  listResources,
  type LocalizedMoveResource,
  type LocalizedPokemonResource,
  type UpstreamResourceId,
} from "@/lib/resources"
import { NO_ABILITY_ID, UNKNOWN_ABILITY_ID } from "@/lib/ability"
import type {
  BattlePokemonOption,
  CatalogAbilityOption,
  CatalogMoveOption,
  MoveCategory,
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

const POKEMON_OPTIONS_BY_LOCALE = new Map<SupportedLocale, Promise<BattlePokemonOption[]>>()
const MOVE_OPTIONS_BY_LOCALE_CATEGORY = new Map<string, CatalogMoveOption[]>()

export function statLabels(category: MoveCategory, locale: SupportedLocale) {
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

export async function abilityOptions(
  abilityIds: UpstreamResourceId[],
  locale: SupportedLocale,
): Promise<CatalogAbilityOption[]> {
  if (abilityIds.length === 0) {
    return [{
      id: UNKNOWN_ABILITY_ID,
      label: localeMessages[locale]["track.ability.unknown"],
      summary: localeMessages[locale]["track.description.unavailable"],
    }]
  }
  return Promise.all(
    abilityIds.map(async (id) => {
      const ability = await getResource("ability", id, locale)
      return {
        id,
        label: ability.name,
        summary: ability.description || localeMessages[locale]["track.description.unavailable"],
      }
    }),
  )
}

export function noAbilityOption(locale: SupportedLocale): CatalogAbilityOption {
  return {
    id: NO_ABILITY_ID,
    label: "—",
    accessibleLabel: localeMessages[locale]["track.ability.none"],
    summary: localeMessages[locale]["track.ability.noneDescription"],
  }
}

export function battlePokemonLabel(resource: LocalizedPokemonResource): string {
  return resource.isMega ? resource.formName ?? resource.name : resource.name
}

function localizedBattlePokemonOption(resource: LocalizedPokemonResource): BattlePokemonOption {
  return Object.freeze({
    id: resource.battlePokemonId,
    speciesId: resource.speciesId,
    label: battlePokemonLabel(resource),
    species: resource.speciesName,
    form: resource.formName,
    isMega: resource.isMega,
    types: Object.freeze([...resource.types]) as BattlePokemonOption["types"],
  })
}

async function listPokemonOptions(locale: SupportedLocale): Promise<BattlePokemonOption[]> {
  const cached = POKEMON_OPTIONS_BY_LOCALE.get(locale)
  if (cached) return cached

  const options = listResources("pokemon", locale).then((pokemon) =>
    Object.freeze(
      pokemon
        .filter((resource) => resource.isMega || !resource.isBattleOnly)
        .map(localizedBattlePokemonOption)
        .sort((a, b) => a.label.localeCompare(b.label)),
    ) as BattlePokemonOption[],
  )
  POKEMON_OPTIONS_BY_LOCALE.set(locale, options)
  return options
}

export async function listAttackers(locale: SupportedLocale): Promise<BattlePokemonOption[]> {
  return listPokemonOptions(locale)
}

export async function listDefenders(locale: SupportedLocale): Promise<BattlePokemonOption[]> {
  return listPokemonOptions(locale)
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
  const derivedPower = calcDerivedPowerDefault(moveResource.id)
  if (derivedPower !== undefined) return derivedPower
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

export async function snapshotCapableMoveOptions(
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
