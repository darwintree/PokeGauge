# Champions Move Usage Data and Join Keys

Resolved for wayfinder ticket `ddeb1f63-6177-4196-9fc1-caf630852bc8`.

## Sources Checked

- API guide: https://championsbattledata.com/api_guide
- Index endpoint: https://championsbattledata.com/api
- Static index asset: https://championsbattledata.com/data/pokemon-index.json
- Battle rows sample: https://championsbattledata.com/api/battle/Doubles/garchomp?season=Current
- Battle rows sample with a form-specific name: https://championsbattledata.com/api/battle/Doubles/Paldean%20Tauros%20Aqua%20Breed?season=Current
- Metadata rows sample: https://championsbattledata.com/api/metadata/tauros
- Raw CSV sample: https://championsbattledata.com/pokemon_champions_assets/battle_data/Doubles/Garchomp.csv
- Project announcement / update note: https://www.reddit.com/r/stunfisk/comments/1uflr91/pokemon_champions_battle_data_is_now_online_api/
- PokeAPI move samples for filtering: https://pokeapi.co/api/v2/move/89 and https://pokeapi.co/api/v2/move/182

Checked on 2026-07-03.

## Observed Champions API Contract

The usable entry point is the index endpoint. It returns:

- `defaultSeason`
- `seasons`
- `battleDataFolders`
- `pokemon[]`

Each indexed Pokemon currently carries:

- `name`: display / route name in Champions Battle Data, e.g. `Garchomp` or `Paldean Tauros Aqua Breed`
- `battleName`: same role as `name` in checked samples
- `slug`: lower-case route/search slug
- `metadataCsv`: metadata asset path by base name
- `battleDataCsvs[]`: `{ season, format, path }`
- `learnableMoveNames[]`: English move names
- `summary`: typing, stats, forms, and `battleSummary`

The battle rows endpoint is the source needed for move usage:

```txt
GET /api/battle/:format/:name?season=<season>
```

For `Doubles` + `Garchomp`, it returned 54 rows across these categories:

- `move`: 10 rows
- `held_item`: 10 rows
- `teammate`: 10 rows
- `stat_alignment`: 10 rows
- `stat_points`: 12 rows
- `ability`: 2 rows

Rows have this shape after JSON parsing:

```ts
type ChampionsBattleRow = {
  pokemon: string
  column_position: number
  category:
    | "move"
    | "held_item"
    | "teammate"
    | "stat_alignment"
    | "stat_points"
    | "ability"
  rank: number
  name: string
  percentage: string
  percentage_value: number | null
  stat_up: string
  stat_down: string
  hp_points?: number | ""
  attack_points?: number | ""
  defense_points?: number | ""
  sp_atk_points?: number | ""
  sp_def_points?: number | ""
  speed_points?: number | ""
}
```

The raw CSV header matches the JSON row fields:

```csv
pokemon,column_position,category,rank,name,percentage,stat_up,stat_down,hp_points,attack_points,defense_points,sp_atk_points,sp_def_points,speed_points
```

The `move` rows are ranked English move names plus usage rates. They do not include PokeAPI move ids, type, damage class, power, accuracy, or Champions-specific move metadata.

## Season and Format Notes

The API guide currently documents `Season M-3`, but the live index checked on 2026-07-03 reported `defaultSeason: "Current"` and `battleDataFolders: ["Doubles", "Singles"]`. The live battle endpoint accepted `season=Current`, but the response still echoed `season: "Season M-3"` in checked samples.

Implementation should therefore derive the season and paths from `/api` instead of hardcoding the guide examples. Store the source season string from the returned battle response with generated usage records so later changes are detectable.

The product's current **Battle format** is VGC doubles, so use `format=Doubles` for default **Move pick** usage.

## Pokemon Join Recommendation

Champions Battle Data has no PokeAPI numeric Pokemon id. It exposes form-specific English names and paths. Join should be generated, not done dynamically in UI code:

1. Load PokeAPI-normalized battle Pokemon records from the prior research boundary.
2. Load Champions `/api` index.
3. Match each Champions Pokemon record to exactly one normalized `BattlePokemonId`.
4. Persist a generated mapping:

```ts
type ChampionsPokemonUsageKey = {
  championsName: string
  championsSlug: string
  championsBattleName: string
  championsBattlePathByFormat: Partial<Record<"Doubles" | "Singles", string>>
  battlePokemonId: BattlePokemonId
}
```

The primary automated join should use normalized English battle labels and aliases. The checked form examples show Champions uses route names such as `Paldean Tauros Aqua Breed`, `Alolan Ninetales`, `Basculegion Male`, and `Rotom Wash`; these are form-specific enough to satisfy the repo's **Battle Pokemon identity** rule when mapped to numeric PokeAPI `pokemon.id`.

Manual overrides will be required for name-style mismatches. Likely cases include punctuation, gender/form ordering, regional prefixes, mega forms, and any Champions-only naming that differs from PokeAPI or `@smogon/calc` names. Treat unmatched or multiply-matched names as generation failures, not silent omissions.

## Move Join Recommendation

Champions move usage rows also have no numeric id. Join to normalized moves by English localized name during data generation:

```ts
type ChampionsMoveUsageRecord = {
  battlePokemonId: BattlePokemonId
  moveId: UpstreamResourceId
  format: "Doubles" | "Singles"
  season: string
  source: string
  rank: number
  percentage: number | null
  championsMoveName: string
}
```

The generation script should build an English-name index from normalized PokeAPI moves. On import:

1. Take `category === "move"` rows.
2. Resolve `row.name` to a normalized `move.id`.
3. Attach normalized move metadata: `type`, `category`, `power`, and `accuracy`.
4. Fail or report rows whose names do not resolve uniquely.

This keeps Champions names as import-time source facts while the app continues using numeric upstream ids.

## Top-6 Damaging Move Pick Defaults

The Champions move list includes status moves in rank order. For Garchomp doubles, `Protect` ranked 4, and PokeAPI reports Protect as `damage_class: "status"` with `power: null`; it must not count toward top-6 damaging defaults.

The default **Move pick** algorithm should be:

1. Fetch/use generated Champions `Doubles` move rows for the attacker and selected season.
2. Resolve each row to normalized `moveId`.
3. Keep only normalized moves where:
   - `category` is `physical` or `special`
   - `power` is a positive number
4. Preserve Champions rank order.
5. Select the first 6 rows.

Keep the raw rank and usage percentage on each selected move for future display or tie/debug context. Do not infer category from the Pokemon or from Champions data; Champions does not expose it.

Null-power physical/special moves and OHKO moves should remain excluded from default damage rows until a product/calculation ticket explicitly chooses their policy.

## Update Cadence

The site author says the data will be refreshed automatically and older ranked seasons will be available soon, but no exact cadence was found in the API guide or response headers. Checked asset headers showed browser/API cache headers and ETags, but no stable domain-level update schedule.

Use a developer-run generator with ETag/source-season capture. Runtime fetching is unnecessary for the current product and would make Scenario Explorer behavior depend on live third-party data.

## Required Generated Facts

To support top-6 damaging defaults, generate and validate:

- Champions default season and available formats from `/api`
- Champions Pokemon to `BattlePokemonId` mapping
- For each mapped Pokemon and `Doubles`, source path and battle rows source string
- Move usage rows joined to normalized `move.id`
- Move metadata needed to filter defaults: `type`, `category`, `power`, `accuracy`
- Import diagnostics for unmatched Pokemon, unmatched moves, duplicate joins, and too-few damaging moves

## Open Follow-Ups

- Decide the missing-data policy when a Pokemon has no Champions rows, no joined move rows, or fewer than 6 positive-power damaging moves.
- Decide whether the UI should expose usage percentages in the move picker or only use them to order defaults.
- Implementation should create an import/generation slice before replacing the hardcoded catalog, because both Pokemon and move joins need validation output.
