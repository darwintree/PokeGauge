import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

type SupportedLocale = "zh-hans" | "zh-hant" | "en" | "ja"

type CsvRow = Record<string, string>

const CSV_ROOT = path.join(process.cwd(), "PokeAPI/pokeapi/data/v2/csv")
const OUT_DIR = path.join(process.cwd(), "src/lib/resources/generated")
const SUPPORTED_LOCALES = ["zh-hans", "zh-hant", "en", "ja"] as const
const LANGUAGE_IDS: Record<SupportedLocale, number[]> = {
  "zh-hans": [12],
  "zh-hant": [4],
  en: [9],
  ja: [1, 11],
}
const SPREAD_TARGETS = new Set(["all-other-pokemon", "all-opponents", "entire-field"])

const TYPE_BY_ID: Record<string, string> = {}
const DAMAGE_CLASS_BY_ID: Record<string, string> = {}
const META_CATEGORY_BY_ID: Record<string, string> = {}
const STAT_KEY_BY_ID: Record<string, string> = {
  "1": "hp",
  "2": "atk",
  "3": "def",
  "4": "spa",
  "5": "spd",
  "6": "spe",
}

const missingLocaleNames: Array<{
  resourceType: "pokemon" | "move" | "ability" | "pokemon-species" | "pokemon-form"
  id: number
  locale: SupportedLocale
  fallbackLocale?: SupportedLocale
}> = []
const unsupportedBattleIdentities: Array<{ id: number; reason: string }> = []

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let cell = ""
  let quoted = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === "\"") {
      if (quoted && line[i + 1] === "\"") {
        cell += "\""
        i += 1
      } else {
        quoted = !quoted
      }
    } else if (char === "," && !quoted) {
      cells.push(cell)
      cell = ""
    } else {
      cell += char
    }
  }
  cells.push(cell)
  return cells
}

async function readCsv(name: string): Promise<CsvRow[]> {
  const text = await readFile(path.join(CSV_ROOT, `${name}.csv`), "utf8")
  const [headerLine, ...lines] = text.trimEnd().split(/\r?\n/)
  const headers = parseCsvLine(headerLine)
  return lines.map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
  })
}

function requiredNumber(row: CsvRow, key: string): number {
  const value = Number(row[key])
  if (!Number.isFinite(value)) throw new Error(`Expected numeric ${key}: ${JSON.stringify(row)}`)
  return value
}

function nullableNumber(value: string): number | null {
  if (value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function indexById(rows: CsvRow[]): Map<number, CsvRow> {
  return new Map(rows.map((row) => [requiredNumber(row, "id"), row]))
}

function groupByNumber(rows: CsvRow[], key: string): Map<number, CsvRow[]> {
  const grouped = new Map<number, CsvRow[]>()
  for (const row of rows) {
    const id = requiredNumber(row, key)
    grouped.set(id, [...(grouped.get(id) ?? []), row])
  }
  return grouped
}

function namesByLocale(
  resourceType: "pokemon" | "move" | "ability" | "pokemon-species" | "pokemon-form",
  id: number,
  rows: CsvRow[],
  nameField: string,
): Record<SupportedLocale, string> {
  const byLanguage = new Map(rows.map((row) => [Number(row.local_language_id), row[nameField]]))
  const english = byLanguage.get(9)

  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const value = LANGUAGE_IDS[locale].map((languageId) => byLanguage.get(languageId)).find(Boolean)
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

function stableJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function moduleWithImport(typeNames: string[], name: string, value: unknown, type: string): string {
  return `import type { ${typeNames.join(", ")} } from "../types"\n\nexport const ${name} = ${stableJson(value)} as const satisfies ${type}\n`
}

function composeNames(
  pokemonId: number,
  isDefaultPokemon: boolean,
  speciesNames: Record<SupportedLocale, string>,
  formNames: Partial<Record<SupportedLocale, string>>,
): Record<SupportedLocale, string> {
  if (isDefaultPokemon) return speciesNames
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const formName = formNames[locale]
      return [locale, formName ? `${speciesNames[locale]}-${formName}` : speciesNames[locale]]
    }),
  ) as Record<SupportedLocale, string>
}

async function main() {
  const [
    pokemonRows,
    speciesRows,
    speciesNameRows,
    formRows,
    formNameRows,
    pokemonTypeRows,
    pokemonStatRows,
    typeRows,
    moveRows,
    moveNameRows,
    moveMetaRows,
    moveTargetRows,
    damageClassRows,
    metaCategoryRows,
    abilityRows,
    abilityNameRows,
    pokemonAbilityRows,
  ] = await Promise.all([
    readCsv("pokemon"),
    readCsv("pokemon_species"),
    readCsv("pokemon_species_names"),
    readCsv("pokemon_forms"),
    readCsv("pokemon_form_names"),
    readCsv("pokemon_types"),
    readCsv("pokemon_stats"),
    readCsv("types"),
    readCsv("moves"),
    readCsv("move_names"),
    readCsv("move_meta"),
    readCsv("move_targets"),
    readCsv("move_damage_classes"),
    readCsv("move_meta_categories"),
    readCsv("abilities"),
    readCsv("ability_names"),
    readCsv("pokemon_abilities"),
  ])

  for (const row of typeRows) TYPE_BY_ID[row.id] = row.identifier
  for (const row of damageClassRows) DAMAGE_CLASS_BY_ID[row.id] = row.identifier
  for (const row of metaCategoryRows) META_CATEGORY_BY_ID[row.id] = row.identifier

  const speciesById = indexById(speciesRows)
  const speciesNamesBySpeciesId = groupByNumber(speciesNameRows, "pokemon_species_id")
  const formsByPokemonId = groupByNumber(formRows, "pokemon_id")
  const formNamesByFormId = groupByNumber(formNameRows, "pokemon_form_id")
  const pokemonTypesById = groupByNumber(pokemonTypeRows, "pokemon_id")
  const pokemonStatsById = groupByNumber(pokemonStatRows, "pokemon_id")
  const pokemonAbilitiesById = groupByNumber(pokemonAbilityRows, "pokemon_id")
  const moveNamesByMoveId = groupByNumber(moveNameRows, "move_id")
  const moveMetaByMoveId = groupByNumber(moveMetaRows, "move_id")
  const moveTargetById = indexById(moveTargetRows)

  const pokemonEntries = pokemonRows.flatMap((pokemon) => {
    const id = requiredNumber(pokemon, "id")
    const speciesId = requiredNumber(pokemon, "species_id")
    const species = speciesById.get(speciesId)
    const forms = formsByPokemonId.get(id) ?? []
    const defaultForm = forms.find((form) => form.is_default === "1") ?? forms[0]
    const speciesNames = namesByLocale(
      "pokemon-species",
      speciesId,
      speciesNamesBySpeciesId.get(speciesId) ?? [],
      "name",
    )
    const formNames = defaultForm && defaultForm.form_identifier
      ? namesByLocale("pokemon-form", requiredNumber(defaultForm, "id"), formNamesByFormId.get(requiredNumber(defaultForm, "id")) ?? [], "form_name")
      : {}
    const types = (pokemonTypesById.get(id) ?? [])
      .toSorted((a, b) => Number(a.slot) - Number(b.slot))
      .map((entry) => TYPE_BY_ID[entry.type_id])
      .filter((type) => type && type !== "stellar")
    const abilityIds = (pokemonAbilitiesById.get(id) ?? [])
      .toSorted((a, b) => Number(a.slot) - Number(b.slot) || Number(a.ability_id) - Number(b.ability_id))
      .map((entry) => requiredNumber(entry, "ability_id"))
    const stats = Object.fromEntries(
      (pokemonStatsById.get(id) ?? []).map((entry) => [STAT_KEY_BY_ID[entry.stat_id], Number(entry.base_stat)]),
    )
    for (const key of ["hp", "atk", "def", "spa", "spd", "spe"]) {
      if (typeof stats[key] !== "number") {
        unsupportedBattleIdentities.push({ id, reason: `pokemon/${id} is missing base stat ${key}` })
      }
    }
    if (abilityIds.length === 0) {
      unsupportedBattleIdentities.push({ id, reason: `pokemon/${id} has no current ability relation` })
    }
    if (
      abilityIds.length === 0 ||
      ["hp", "atk", "def", "spa", "spd", "spe"].some((key) => typeof stats[key] !== "number")
    ) {
      return []
    }

    const names = composeNames(id, pokemon.is_default === "1", speciesNames, formNames)

    return [[
      id,
      {
        resourceType: "pokemon",
        id,
        speciesId,
        pokemonSlug: pokemon.identifier,
        speciesSlug: species?.identifier ?? pokemon.identifier,
        calcSpeciesName: names.en || pokemon.identifier,
        names,
        speciesNames,
        formNames,
        types,
        abilityIds,
        baseStats: stats,
      },
    ] as const]
  })

  const moveEntries = moveRows.flatMap((move) => {
    const id = requiredNumber(move, "id")
    const type = TYPE_BY_ID[move.type_id]
    const names = namesByLocale("move", id, moveNamesByMoveId.get(id) ?? [], "name")
    const target = moveTargetById.get(requiredNumber(move, "target_id"))?.identifier ?? "unknown"
    const meta = moveMetaByMoveId.get(id)?.[0]
    const minHits = nullableNumber(meta?.min_hits ?? "")
    const maxHits = nullableNumber(meta?.max_hits ?? "")
    const critRate = nullableNumber(meta?.crit_rate ?? "")
    return [[
      id,
      {
        resourceType: "move",
        id,
        slug: move.identifier,
        calcMoveName: names.en,
        names,
        type,
        category: DAMAGE_CLASS_BY_ID[move.damage_class_id] ?? "status",
        power: nullableNumber(move.power),
        accuracy: nullableNumber(move.accuracy),
        ...(minHits === null ? {} : { minHits }),
        ...(maxHits === null ? {} : { maxHits }),
        ...(critRate !== null && critRate > 0 ? { critRate } : {}),
        damageKind: META_CATEGORY_BY_ID[meta?.meta_category_id ?? ""] ?? "unique",
        target,
        isSpread: SPREAD_TARGETS.has(target),
      },
    ] as const]
  })

  const abilityNamesByAbilityId = groupByNumber(abilityNameRows, "ability_id")
  const abilityEntries = abilityRows.map((ability) => {
    const id = requiredNumber(ability, "id")
    return [
      id,
      {
        resourceType: "ability",
        id,
        slug: ability.identifier,
        names: namesByLocale("ability", id, abilityNamesByAbilityId.get(id) ?? [], "name"),
      },
    ] as const
  })

  const diagnostics = {
    source: "pokeapi",
    pokemonIds: pokemonEntries.map(([id]) => id),
    moveIds: moveEntries.map(([id]) => id),
    abilityIds: abilityEntries.map(([id]) => id),
    missingLocaleNames,
    unsupportedBattleIdentities,
  }

  await mkdir(OUT_DIR, { recursive: true })
  await Promise.all([
    writeFile(
      path.join(OUT_DIR, "pokemon.ts"),
      moduleWithImport(["NormalizedBattlePokemon", "UpstreamResourceId"], "GENERATED_POKEMON", Object.fromEntries(pokemonEntries), "Record<UpstreamResourceId, NormalizedBattlePokemon>"),
    ),
    writeFile(
      path.join(OUT_DIR, "moves.ts"),
      moduleWithImport(["NormalizedMove", "UpstreamResourceId"], "GENERATED_MOVES", Object.fromEntries(moveEntries), "Record<UpstreamResourceId, NormalizedMove>"),
    ),
    writeFile(
      path.join(OUT_DIR, "abilities.ts"),
      moduleWithImport(["NormalizedAbility", "UpstreamResourceId"], "GENERATED_ABILITIES", Object.fromEntries(abilityEntries), "Record<UpstreamResourceId, NormalizedAbility>"),
    ),
    writeFile(
      path.join(OUT_DIR, "diagnostics.ts"),
      moduleWithImport(["GeneratedResourceDiagnostics"], "RESOURCE_DIAGNOSTICS", diagnostics, "GeneratedResourceDiagnostics"),
    ),
    writeFile(
      path.join(OUT_DIR, "index.ts"),
      "export { GENERATED_ABILITIES } from \"./abilities\"\nexport { RESOURCE_DIAGNOSTICS } from \"./diagnostics\"\nexport { GENERATED_MOVES } from \"./moves\"\nexport { GENERATED_POKEMON } from \"./pokemon\"\n",
    ),
  ])

  console.log(`Generated ${pokemonEntries.length} Pokemon, ${moveEntries.length} moves, and ${abilityEntries.length} abilities from local PokeAPI CSV.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
