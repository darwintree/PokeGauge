# PokeAPI Variable-power Move Data

Checked on 2026-07-15 to decide whether a move template can directly supply the initial power and common power presets for an editable move snapshot.

## Decision-ready answer

PokeAPI can be reused directly for a fixed-power move's initial `power`, but it does **not** provide a uniform, machine-readable default or preset list for variable-power moves. In particular, [Gyro Ball](https://pokeapi.co/api/v2/move/gyro-ball/) has `power: null`; its formula and cap appear only in localized prose. The product therefore cannot initialize every variable-power snapshot, or populate common power presets, from the current scalar `Move.power` field alone.

Use this boundary:

- For a move classified as fixed-power, copy a positive PokeAPI `power` into the new snapshot.
- For a move classified as variable-power, treat PokeAPI `power` as move-specific upstream metadata, **not** as a universal snapshot default. A numeric value may represent a base value or a maximum under a particular condition; `null` provides no initial value.
- Keep variable-power preset lists and the recommended initial preset in reviewed, structured app metadata keyed by move ID. Values may be curated from authoritative mechanics data, but should not be extracted at runtime from `effect_entries` prose.
- Continue allowing manual power entry. If a variable-power move has no reviewed preset/default metadata, require the user to choose or enter power before the snapshot becomes calculable.

## What PokeAPI exposes

The official Move documentation describes `power` as one scalar base-power field and `effect_entries` as localized move-effect text; it defines no power-tier, recommended-power, formula, or variable-power discriminator field ([PokeAPI Move documentation](https://pokeapi.co/docs/v2#moves)). The repository's current OpenAPI schema likewise declares `MoveDetail.power` as a nullable integer and models `effect_entries` separately as strings ([PokeAPI OpenAPI schema](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/openapi.yml#L5611-L5785)).

Current endpoint records show that `power` does not have one usable initialization meaning across variable-power mechanics:

| Move | PokeAPI `power` | Where the variable rule lives | Consequence for snapshots |
| --- | ---: | --- | --- |
| [Gyro Ball](https://pokeapi.co/api/v2/move/gyro-ball/) | `null` | English `effect_entries` gives the Speed-ratio formula and 150 cap. | No upstream initial power or preset list. |
| [Heavy Slam](https://pokeapi.co/api/v2/move/heavy-slam/) | `null` | English `effect_entries` contains a prose/table representation of 40/60/80/100/120 weight bands. | Useful source material for curation, but no structured tiers. |
| [Electro Ball](https://pokeapi.co/api/v2/move/electro-ball/) | `null` | English `effect_entries` contains a prose/table representation of 60/80/120/150 Speed bands. | Useful source material for curation, but no structured tiers. |
| [Stored Power](https://pokeapi.co/api/v2/move/stored-power/) | `20` | English `effect_entries` says power grows from the original value with raised stat stages. | The scalar is a meaningful base, but it is not the full set of possible powers. |
| [Eruption](https://pokeapi.co/api/v2/move/eruption/) | `150` | English `effect_entries` gives `150 * HP / max HP`. | The scalar is the full-HP maximum, not a neutral/default battle state. |
| [Water Spout](https://pokeapi.co/api/v2/move/water-spout/) | `150` | English `effect_entries` gives the same HP-dependent formula. | The scalar is the full-HP maximum, not a neutral/default battle state. |

This is also how the official PokeAPI dataset is shaped: `moves.csv` has one nullable `power` column and a `move_effect_id`; formulae and tables are stored in `move_effect_prose.csv` as localized `short_effect` and `effect` strings ([move import code](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/pokeapi/data/v2/build.py#L801-L825), [effect-prose import code](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/pokeapi/data/v2/build.py#L718-L733)). Consequently, joining the prose into this app would provide descriptions, not a reliable typed preset model.

## What the current local pipeline preserves

The local generator reads `moves.csv` and `move_meta.csv`, then copies `move.power` through `nullableNumber` into `NormalizedMove.power`. It does not read or preserve `move_effect_prose.csv`, a formula, a variable-power kind, common tiers, or a recommended default ([resource generator](../../scripts/generate-pokeapi-resources.ts), [normalized move type](../../src/lib/resources/types.ts)).

The generated data therefore faithfully retains the upstream scalar distinction:

- Gyro Ball, Heavy Slam, and Electro Ball have `power: null`.
- Stored Power has `power: 20`.
- Eruption and Water Spout have `power: 150`.

These values are visible in [the generated move resource](../../src/lib/resources/generated/moves.ts). The resource access layer exposes only `power`, `accuracy`, `damageKind`, target, and spread status to localized move consumers; it cannot currently expose presets even if the UI wanted them ([resource access layer](../../src/lib/resources/access.ts)).

## Recommended specification seam

Do not overload `NormalizedMove.power` with inferred semantics. Add a separate template-level, reviewed variable-power configuration when implementation is planned, conceptually:

```ts
type VariablePowerConfig = {
  presets: number[]
  recommendedPower?: number
}
```

Presence of this configuration classifies the move as having supported variable-power snapshot presets. Its absence means the current implementation has no reviewed presets, regardless of whether raw PokeAPI `power` is numeric or null. The editable snapshot still owns its concrete `power: number`; calculation should never receive an unresolved tier, formula, or null.

This separation lets fixed-power templates continue using PokeAPI directly while avoiding three unsafe assumptions: `null` means a particular default, every numeric variable-power field means the same kind of default, or localized prose is stable structured data.
