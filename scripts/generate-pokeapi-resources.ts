import { writeFile } from "node:fs/promises"
import path from "node:path"

type SupportedLocale = "zh-hans" | "zh-hant" | "en" | "ja"
type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy"

type LocalizedName = {
  name: string
  language: { name: string }
}

type NamedResource = {
  name: string
  url: string
}

type PokemonApi = {
  id: number
  name: string
  species: NamedResource
  forms: NamedResource[]
  types: Array<{ slot: number; type: { name: PokemonType } }>
  stats: Array<{ base_stat: number; stat: { name: string } }>
}

type PokemonSpeciesApi = {
  id: number
  name: string
  names: LocalizedName[]
  varieties: Array<{ is_default: boolean; pokemon: NamedResource }>
}

type PokemonFormApi = {
  id: number
  name: string
  names: LocalizedName[]
  form_names: LocalizedName[]
}

type MoveApi = {
  id: number
  name: string
  names: LocalizedName[]
  type: { name: PokemonType }
  damage_class: { name: "physical" | "special" | "status" }
  power: number | null
  accuracy: number | null
  meta: { category: { name: string } | null } | null
}

type DiagnosticMissingLocaleName = {
  resourceType: "pokemon" | "move" | "pokemon-species" | "pokemon-form"
  id: number
  locale: SupportedLocale
  fallbackLocale?: SupportedLocale
}

const SUPPORTED_LOCALES = ["zh-hans", "zh-hant", "en", "ja"] as const
const POKEAPI_LANGUAGE_BY_LOCALE: Record<SupportedLocale, string[]> = {
  "zh-hans": ["zh-hans"],
  "zh-hant": ["zh-hant"],
  en: ["en"],
  ja: ["ja-hrkt", "ja"],
}

const POKEMON_IDS = [445, 591, 727, 812, 987, 10021] as const
const MOVE_IDS = [85, 89, 157, 182, 247, 282, 337, 424, 444, 585, 605, 707] as const

const CALC_SPECIES_NAME: Record<number, string> = {
  445: "Garchomp",
  591: "Amoonguss",
  727: "Incineroar",
  812: "Rillaboom",
  987: "Flutter Mane",
  10021: "Landorus-Therian",
}

const CALC_MOVE_NAME: Record<number, string> = {
  85: "Thunderbolt",
  89: "Earthquake",
  157: "Rock Slide",
  182: "Protect",
  247: "Shadow Ball",
  282: "Knock Off",
  337: "Dragon Claw",
  424: "Fire Fang",
  444: "Stone Edge",
  585: "Moonblast",
  605: "Dazzling Gleam",
  707: "Stomping Tantrum",
}

const STAT_KEY: Record<string, "hp" | "atk" | "def" | "spa" | "spd" | "spe"> = {
  hp: "hp",
  attack: "atk",
  defense: "def",
  "special-attack": "spa",
  "special-defense": "spd",
  speed: "spe",
}

const missingLocaleNames: DiagnosticMissingLocaleName[] = []
const unsupportedBattleIdentities: Array<{ id: number; reason: string }> = []

function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  if (!match) throw new Error(`Could not parse PokeAPI id from ${url}`)
  return Number(match[1])
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`PokeAPI request failed ${response.status}: ${url}`)
  return response.json() as Promise<T>
}

async function fetchResource<T>(resource: string, idOrSlug: number | string): Promise<T> {
  return fetchJson<T>(`https://pokeapi.co/api/v2/${resource}/${idOrSlug}`)
}

function localizedNames(
  resourceType: DiagnosticMissingLocaleName["resourceType"],
  id: number,
  names: LocalizedName[],
): Record<SupportedLocale, string> {
  const byLanguage = new Map(names.map((entry) => [entry.language.name, entry.name]))
  const english = byLanguage.get("en")

  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const value = POKEAPI_LANGUAGE_BY_LOCALE[locale]
        .map((language) => byLanguage.get(language))
        .find(Boolean)
      if (value) return [locale, value]

      missingLocaleNames.push({
        resourceType,
        id,
        locale,
        fallbackLocale: english ? "en" : undefined,
      })
      return [locale, english ?? ""]
    }),
  ) as Record<SupportedLocale, string>
}

function composeBattleNames(
  pokemon: PokemonApi,
  species: PokemonSpeciesApi,
  speciesNames: Record<SupportedLocale, string>,
  formNames: Partial<Record<SupportedLocale, string>>,
): Record<SupportedLocale, string> {
  const variety = species.varieties.find((entry) => idFromUrl(entry.pokemon.url) === pokemon.id)
  if (!variety) {
    unsupportedBattleIdentities.push({
      id: pokemon.id,
      reason: `pokemon/${pokemon.id} is not listed as a variety of pokemon-species/${species.id}`,
    })
  }
  if (variety?.is_default) return speciesNames

  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const formName = formNames[locale]
      return [locale, formName ? `${speciesNames[locale]}-${formName}` : speciesNames[locale]]
    }),
  ) as Record<SupportedLocale, string>
}

function baseStats(pokemon: PokemonApi) {
  const stats = Object.fromEntries(
    pokemon.stats.map((entry) => [STAT_KEY[entry.stat.name], entry.base_stat]),
  )
  for (const key of ["hp", "atk", "def", "spa", "spd", "spe"]) {
    if (typeof stats[key] !== "number") {
      unsupportedBattleIdentities.push({
        id: pokemon.id,
        reason: `pokemon/${pokemon.id} is missing base stat ${key}`,
      })
    }
  }
  return stats
}

function stableJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function generatedModule(contents: {
  pokemon: unknown
  moves: unknown
  diagnostics: unknown
}): string {
  return `import type {
  GeneratedResourceDiagnostics,
  NormalizedBattlePokemon,
  NormalizedMove,
  UpstreamResourceId,
} from "../types"

export const GENERATED_POKEMON = ${stableJson(contents.pokemon)} as const satisfies Record<UpstreamResourceId, NormalizedBattlePokemon>

export const GENERATED_MOVES = ${stableJson(contents.moves)} as const satisfies Record<UpstreamResourceId, NormalizedMove>

export const RESOURCE_DIAGNOSTICS = ${stableJson(contents.diagnostics)} as const satisfies GeneratedResourceDiagnostics
`
}

async function normalizePokemon(id: number) {
  const pokemon = await fetchResource<PokemonApi>("pokemon", id)
  const speciesId = idFromUrl(pokemon.species.url)
  const species = await fetchResource<PokemonSpeciesApi>("pokemon-species", speciesId)
  const formId = pokemon.forms[0] ? idFromUrl(pokemon.forms[0].url) : null
  const form = formId == null ? null : await fetchResource<PokemonFormApi>("pokemon-form", formId)
  const speciesNames = localizedNames("pokemon-species", species.id, species.names)
  const variety = species.varieties.find((entry) => idFromUrl(entry.pokemon.url) === pokemon.id)
  const formNames = form && !variety?.is_default
    ? localizedNames("pokemon-form", form.id, form.form_names)
    : {}
  const names = composeBattleNames(pokemon, species, speciesNames, formNames)

  return [
    pokemon.id,
    {
      resourceType: "pokemon",
      id: pokemon.id,
      speciesId,
      pokemonSlug: pokemon.name,
      speciesSlug: species.name,
      calcSpeciesName: CALC_SPECIES_NAME[pokemon.id] ?? speciesNames.en,
      names,
      speciesNames,
      formNames,
      types: pokemon.types
        .toSorted((a, b) => a.slot - b.slot)
        .map((entry) => entry.type.name),
      baseStats: baseStats(pokemon),
    },
  ] as const
}

async function normalizeMove(id: number) {
  const move = await fetchResource<MoveApi>("move", id)
  return [
    move.id,
    {
      resourceType: "move",
      id: move.id,
      slug: move.name,
      calcMoveName: CALC_MOVE_NAME[move.id] ?? localizedNames("move", move.id, move.names).en,
      names: localizedNames("move", move.id, move.names),
      type: move.type.name,
      category: move.damage_class.name,
      power: move.power,
      accuracy: move.accuracy,
      damageKind: move.meta?.category?.name ?? "unique",
    },
  ] as const
}

async function main() {
  const pokemonEntries = await Promise.all(POKEMON_IDS.map(normalizePokemon))
  const moveEntries = await Promise.all(MOVE_IDS.map(normalizeMove))
  const generatedAt = new Date().toISOString()

  const output = generatedModule({
    pokemon: Object.fromEntries(pokemonEntries),
    moves: Object.fromEntries(moveEntries),
    diagnostics: {
      generatedAt,
      source: "pokeapi",
      pokemonIds: [...POKEMON_IDS],
      moveIds: [...MOVE_IDS],
      missingLocaleNames,
      unsupportedBattleIdentities,
    },
  })

  await writeFile(
    path.join(process.cwd(), "src/lib/resources/generated/pokeapi.ts"),
    output,
  )
  console.log(
    `Generated ${pokemonEntries.length} Pokemon and ${moveEntries.length} moves from PokeAPI.`,
  )
  console.log(
    `Diagnostics: ${missingLocaleNames.length} missing locale names, ${unsupportedBattleIdentities.length} unsupported battle identities.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
