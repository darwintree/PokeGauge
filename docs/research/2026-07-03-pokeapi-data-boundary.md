# PokeAPI Data Boundary for Pokemon and Damaging Moves

Resolved for wayfinder ticket `2fcd5d8a-4ec7-42ed-9a9c-d522f1ed4709`.

## Sources Checked

- PokeAPI docs: https://pokeapi.co/docs/v2
- Pokemon endpoint docs: https://pokeapi.co/docs/v2#pokemon
- Pokemon species endpoint docs: https://pokeapi.co/docs/v2#pokemon-species
- Pokemon form endpoint docs: https://pokeapi.co/docs/v2#pokemon-forms
- Move endpoint docs: https://pokeapi.co/docs/v2#moves
- Sample API checks:
  - https://pokeapi.co/api/v2/pokemon/445
  - https://pokeapi.co/api/v2/pokemon/10021
  - https://pokeapi.co/api/v2/pokemon-species/445
  - https://pokeapi.co/api/v2/pokemon-species/645
  - https://pokeapi.co/api/v2/pokemon-form/10081
  - https://pokeapi.co/api/v2/move/89
  - https://pokeapi.co/api/v2/move/182
  - https://pokeapi.co/api/v2/move/90

## Current Local Contract

The app already separates localized resource lookup from catalog/scenario behavior:

- `src/lib/resources/types.ts` defines `UpstreamResourceId`, `BattlePokemonId`, localized Pokemon resources, and localized move resources.
- `src/lib/catalog/types.ts` expects `BattlePokemonId`, localized labels, English `species` and `moveName` strings for `@smogon/calc`, Pokemon `types`, move `type`, and a `physical | special` move category.
- `src/lib/scenario/evaluate.ts` only needs catalog move IDs, `moveName`, matchup species names, and the matchup move category to compute rows.

The new boundary should replace mock data and hardcoded catalog entries without letting PokeAPI response shapes leak into those modules.

## Recommended Normalized Boundary

Generate local data files from PokeAPI into these domain-facing records:

```ts
type LocalizedNames = Record<SupportedLocale, string>

type NormalizedBattlePokemon = {
  id: BattlePokemonId
  speciesId: UpstreamResourceId
  pokemonSlug: string
  speciesSlug: string
  calcSpeciesName: string
  names: LocalizedNames
  speciesNames: LocalizedNames
  formNames: Partial<LocalizedNames>
  types: PokemonType[]
  baseStats: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
}

type NormalizedMove = {
  id: UpstreamResourceId
  slug: string
  calcMoveName: string
  names: LocalizedNames
  type: PokemonType
  category: "physical" | "special" | "status"
  power: number | null
  accuracy: number | null
  damageKind: "damage" | "damage+ailment" | "damage+lower" | "damage+raise" | "ohko" | "unique" | string
}

type DamagingMove = NormalizedMove & {
  category: "physical" | "special"
}
```

`BattlePokemonId` should remain the PokeAPI `pokemon.id`, not `pokemon-species.id` and not `pokemon-form.id`. PokeAPI describes the Pokemon entity as the variety that can differ by base stats, abilities, and typing, while Pokemon forms are cosmetic unless the differing battle variety is represented by a Pokemon entity. Landorus illustrates this: species `645` has varieties `pokemon/645` and `pokemon/10021`, and `pokemon/10021` has the battle-relevant Therian stats/types. The related form is `pokemon-form/10081`, so form IDs are not stable substitutes for battle identity.

## Pokemon Derivation

For each included `pokemon` resource:

1. Use `pokemon.id` as `BattlePokemonId` and `UpstreamResourceId`.
2. Read `pokemon.species.url` to fetch the species record.
3. Use `pokemon.types`, sorted by slot, as the domain `PokemonType[]`.
4. Map PokeAPI stat names to local stat keys:
   - `hp -> hp`
   - `attack -> atk`
   - `defense -> def`
   - `special-attack -> spa`
   - `special-defense -> spd`
   - `speed -> spe`
5. Read `species.names` for localized species names.
6. Read the default `pokemon.forms[0]` only for display qualifiers such as localized form names. Do not use form IDs as primary identity.
7. Build `names` as localized battle labels. For default varieties, the species name is enough. For non-default varieties, compose species name plus localized form name where available.
8. Store a `calcSpeciesName` separately for `@smogon/calc`; do not derive calculation names at runtime from localized labels.

This fits `CONTEXT.md`: battle identity is form-level only when battle data changes, upstream identity is numeric, and display text is derived from localized upstream fields.

## Move Derivation

For each included `move` resource:

1. Use `move.id` as `UpstreamResourceId`.
2. Read `move.names` into supported locales.
3. Map `move.type.name` to local `PokemonType`.
4. Map `move.damage_class.name` to `physical | special | status`.
5. Store `power` and `accuracy` directly; both may be `null`.
6. Store `move.meta.category.name` as `damageKind`.
7. Store `calcMoveName` separately for `@smogon/calc`; do not derive it from localized labels.

The global damaging-move pool should be derived from normalized moves, not from each Pokemon's `moves` learnset. For the current calculator contract, include moves whose category is `physical` or `special`, then let the product contract decide whether special cases with `power === null` or `damageKind === "ohko"` belong in the user-searchable pool. For default damage-calculation rows, the safer implementation slice is to require `physical | special` plus a non-null positive `power`; OHKO and variable-power/null-power moves need an explicit product/calculation decision.

## Search and Filtering Readiness

The normalized files should precompute only data needed by product search:

- Pokemon search: `id`, localized `names`, optional `speciesNames`, optional `formNames`, `types`, and base stats.
- Pokemon type filters: `types`.
- Move search: `id`, localized `names`, `type`, `category`, `power`, `accuracy`, and `damageKind`.
- Move type/category filters: `type` and `category`.

No UI or scenario code should read PokeAPI URLs, `NamedAPIResource`, language objects, species `varieties`, form records, or raw stat arrays.

## Update Path

Use a developer-run generation script rather than runtime fetching:

1. Fetch paginated `pokemon` and `move` lists using PokeAPI list endpoints.
2. Fetch each selected Pokemon, species, and default form record.
3. Fetch each move record.
4. Normalize into versioned local JSON or TypeScript modules under `src/lib/resources/generated/`.
5. Validate supported locales are present for required display labels, with a deterministic fallback policy recorded by the product contract if any upstream name is missing.
6. Keep generated data as the only place that knows PokeAPI response shapes.

PokeAPI asks clients to cache resources locally, and this app needs a repeatable local data boundary for deterministic builds.

## Open Follow-Ups

- Champions usage research still needs to define join keys. It should join to normalized move IDs and battle Pokemon IDs when possible, with slug matching only as an import-time fallback.
- The global move-search product ticket should decide whether null-power damaging categories such as OHKO moves are searchable, defaultable, both, or neither.
- The Pokemon add/search product ticket should decide exact display composition for non-default varieties in each supported locale.
