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

type ChampionsIndexPokemon = {
  name: string
  slug: string
  battleName: string
  battleDataCsvs?: Array<{
    season: string
    format: ChampionsBattleFormat
    path: string
  }>
}

type ChampionsIndexApi = {
  defaultSeason?: string
  pokemon?: ChampionsIndexPokemon[]
}

type ChampionsBattleFormat = "Doubles" | "Singles"

type ChampionsBattleRow = {
  category: string
  rank: number
  name: string
  percentage_value?: number | null
}

type ChampionsBattleApi = {
  pokemon: string
  format: ChampionsBattleFormat
  season: string
  source: string
  data?: ChampionsBattleRow[]
  rows?: ChampionsBattleRow[]
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
const CHAMPIONS_FORMAT: ChampionsBattleFormat = "Doubles"

const CHAMPIONS_NAME_OVERRIDES: Partial<Record<number, string>> = {
  10021: "Landorus Therian",
}

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
const unmatchedChampionsPokemon: Array<{
  battlePokemonId: number
  pokemonName: string
  reason: string
}> = []
const unmatchedChampionsMoves: Array<{
  battlePokemonId: number
  championsPokemonName: string
  championsMoveName: string
  reason: string
}> = []

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
  championsMoveUsage: unknown
  diagnostics: unknown
}): string {
  return `import type {
  ChampionsMoveUsageRecord,
  GeneratedResourceDiagnostics,
  NormalizedBattlePokemon,
  NormalizedMove,
  UpstreamResourceId,
} from "../types"

export const GENERATED_POKEMON = ${stableJson(contents.pokemon)} as const satisfies Record<UpstreamResourceId, NormalizedBattlePokemon>

export const GENERATED_MOVES = ${stableJson(contents.moves)} as const satisfies Record<UpstreamResourceId, NormalizedMove>

export const CHAMPIONS_MOVE_USAGE = ${stableJson(contents.championsMoveUsage)} as const satisfies readonly ChampionsMoveUsageRecord[]

export const RESOURCE_DIAGNOSTICS = ${stableJson(contents.diagnostics)} as const satisfies GeneratedResourceDiagnostics
`
}

function normalizeJoinName(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

function pokeapiSlug(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
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

async function fetchChampionsBattleRows(
  pokemon: ChampionsIndexPokemon,
  defaultSeason: string,
): Promise<ChampionsBattleApi | null> {
  const season =
    pokemon.battleDataCsvs?.find((entry) => entry.format === CHAMPIONS_FORMAT)?.season ??
    defaultSeason
  const url = `https://championsbattledata.com/api/battle/${CHAMPIONS_FORMAT}/${encodeURIComponent(pokemon.battleName || pokemon.name)}?season=${encodeURIComponent(season)}`
  const response = await fetch(url)
  if (!response.ok) return null
  return response.json() as Promise<ChampionsBattleApi>
}

async function resolveMoveIdFromChampionsName(name: string): Promise<number | null> {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${pokeapiSlug(name)}`)
  if (!response.ok) return null
  const move = await response.json() as MoveApi
  return move.id
}

async function generateChampionsMoveUsage(
  pokemonEntries: Array<readonly [number, Awaited<ReturnType<typeof normalizePokemon>>[1]]>,
) {
  const index = await fetchJson<ChampionsIndexApi>("https://championsbattledata.com/api")
  const defaultSeason = index.defaultSeason ?? "Current"
  const championsByName = new Map(
    (index.pokemon ?? []).flatMap((pokemon) => {
      const keys = [pokemon.name, pokemon.battleName, pokemon.slug]
        .filter(Boolean)
        .map((name) => [normalizeJoinName(name), pokemon] as const)
      return keys
    }),
  )
  const moveIdByName = new Map<string, number>()
  const mappedPokemon: Array<{
    battlePokemonId: number
    championsName: string
    championsSlug: string
    championsBattleName: string
    source: string | null
  }> = []
  const records: Array<{
    battlePokemonId: number
    moveId: number
    format: ChampionsBattleFormat
    season: string
    source: string
    rank: number
    percentage: number | null
    championsMoveName: string
  }> = []

  for (const [, pokemon] of pokemonEntries) {
    const preferredName = CHAMPIONS_NAME_OVERRIDES[pokemon.id] ?? pokemon.names.en
    const championsPokemon = championsByName.get(normalizeJoinName(preferredName))
    if (!championsPokemon) {
      unmatchedChampionsPokemon.push({
        battlePokemonId: pokemon.id,
        pokemonName: preferredName,
        reason: "No matching Champions index Pokemon",
      })
      continue
    }

    const battleData = await fetchChampionsBattleRows(championsPokemon, defaultSeason)
    mappedPokemon.push({
      battlePokemonId: pokemon.id,
      championsName: championsPokemon.name,
      championsSlug: championsPokemon.slug,
      championsBattleName: championsPokemon.battleName,
      source: battleData?.source ?? null,
    })
    if (!battleData) {
      unmatchedChampionsPokemon.push({
        battlePokemonId: pokemon.id,
        pokemonName: preferredName,
        reason: `No ${CHAMPIONS_FORMAT} battle rows available from Champions`,
      })
      continue
    }

    const rows = battleData.data ?? battleData.rows ?? []
    for (const row of rows.filter((entry) => entry.category === "move")) {
      const key = normalizeJoinName(row.name)
      let moveId = moveIdByName.get(key)
      if (moveId == null) {
        moveId = await resolveMoveIdFromChampionsName(row.name) ?? undefined
        if (moveId != null) moveIdByName.set(key, moveId)
      }
      if (moveId == null) {
        unmatchedChampionsMoves.push({
          battlePokemonId: pokemon.id,
          championsPokemonName: championsPokemon.name,
          championsMoveName: row.name,
          reason: "No matching PokeAPI move",
        })
        continue
      }

      records.push({
        battlePokemonId: pokemon.id,
        moveId,
        format: CHAMPIONS_FORMAT,
        season: battleData.season,
        source: battleData.source,
        rank: row.rank,
        percentage: row.percentage_value ?? null,
        championsMoveName: row.name,
      })
    }
  }

  return {
    defaultSeason,
    mappedPokemon,
    records,
  }
}

async function main() {
  const pokemonEntries = await Promise.all(POKEMON_IDS.map(normalizePokemon))
  const champions = await generateChampionsMoveUsage(pokemonEntries)
  const moveIds = [...new Set([...MOVE_IDS, ...champions.records.map((record) => record.moveId)])]
    .toSorted((a, b) => a - b)
  const moveEntries = await Promise.all(moveIds.map(normalizeMove))
  const generatedAt = new Date().toISOString()

  const output = generatedModule({
    pokemon: Object.fromEntries(pokemonEntries),
    moves: Object.fromEntries(moveEntries),
    championsMoveUsage: champions.records,
    diagnostics: {
      generatedAt,
      source: "pokeapi",
      pokemonIds: [...POKEMON_IDS],
      moveIds,
      missingLocaleNames,
      unsupportedBattleIdentities,
      champions: {
        defaultSeason: champions.defaultSeason,
        format: CHAMPIONS_FORMAT,
        mappedPokemon: champions.mappedPokemon,
        unmatchedPokemon: unmatchedChampionsPokemon,
        unmatchedMoves: unmatchedChampionsMoves,
      },
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
  console.log(
    `Champions: ${champions.records.length} joined move usage rows, ${unmatchedChampionsPokemon.length} unmatched Pokemon, ${unmatchedChampionsMoves.length} unmatched moves.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
