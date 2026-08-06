# PokeAPI move-trait coverage for ability gates

Checked on **2026-08-06** for the current PokeLens Move candidate pool. This note distinguishes elemental move type/category from behavioral move traits and checks both the repository-pinned PokeAPI data and current upstream PokeAPI.

## Conclusion

The statement “PokeAPI has the move types” is true for **elemental type** (`type`: Fire, Water, etc.) and **damage class** (`damage_class`: Physical, Special, Status). It is not true for the complete set of behavioral traits needed by the scoped abilities.

- The public REST Move resource exposes elemental `type`, `damage_class`, power, accuracy, a lossy `meta` summary, and effect text. It does **not** expose move flags/attributes.
- The official PokeAPI database CSVs contain positive mappings for `contact`, `punch`, `bite`, and `pulse`, but contain no `slicing` attribute.
- Those mappings are incomplete for the repository's current pool: the pinned CSV and current upstream CSV have no flag rows at all for ordinary move IDs `827..919`. This includes known positive examples such as Jet Punch (`contact`, `punch`), Bitter Blade (`contact`, `slicing`), Wave Crash (`contact`), and Collision Course (`contact`).
- `move_meta.drain < 0` can represent recoil for older populated records, but recent records such as Wave Crash have no `move_meta` row. There is no structured crash-damage flag.
- PokeAPI has no field that says whether a move has a removable secondary effect for Sheer Force. Older `meta` fields can help with common ailments/flinches/stat changes, but they are not a complete eligibility contract, and most recent moves have `meta: null`.

Therefore, **PokeAPI-only is not sufficient to claim complete support for every scoped flag-dependent ability across the full current Move candidate pool**. Treating every absent row as `false` would knowingly misclassify current moves.

## Sources and versions

- Repository-pinned PokeAPI gitlink: [`6629d1506a5ae659bb75d33e8e3ea143f2833642`](https://github.com/PokeAPI/pokeapi/tree/6629d1506a5ae659bb75d33e8e3ea143f2833642).
- Current upstream `master` at time of check: [`5064f1d72746b3a6a931616dae3fb6445c556d4f`](https://github.com/PokeAPI/pokeapi/tree/5064f1d72746b3a6a931616dae3fb6445c556d4f).
- Official REST documentation: [Moves endpoint and Move schema](https://pokeapi.co/docs/v2#moves).
- Production REST examples: [Jet Punch](https://pokeapi.co/api/v2/move/jet-punch/), [Bitter Blade](https://pokeapi.co/api/v2/move/bitter-blade/), [Wave Crash](https://pokeapi.co/api/v2/move/wave-crash/), [Collision Course](https://pokeapi.co/api/v2/move/collision-course/).
- PokeLens mechanics comparison uses the already-pinned Pokémon Showdown commit [`71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa`](https://github.com/smogon/pokemon-showdown/tree/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa). This is evidence for the project's chosen Gen 9 mechanics alignment, not an official Pokémon executable specification.

The pinned and current-upstream PokeAPI files have the same findings relevant to this question.

## What the REST Move resource actually contains

PokeAPI's documented Move type includes `type` and `damage_class`. Its `meta` object is limited to ailment/category, hit/turn ranges, `drain`, healing, critical-rate bonus, and ailment/flinch/stat chances. The documented schema has no `flags`, `attributes`, `contact`, `punch`, `bite`, `pulse`, `slicing`, `recoil`, `crash`, or `sheer_force` field ([official Move schema](https://pokeapi.co/docs/v2#moves)).

This is also explicit in PokeAPI's implementation: the database models have internal `MoveAttribute` / `MoveAttributeMap` tables ([models](https://github.com/PokeAPI/pokeapi/blob/5064f1d72746b3a6a931616dae3fb6445c556d4f/pokemon_v2/models.py#L1260-L1277)), but `MoveDetailSerializer` does not include them in its output fields ([serializer](https://github.com/PokeAPI/pokeapi/blob/5064f1d72746b3a6a931616dae3fb6445c556d4f/pokemon_v2/serializers.py#L3329-L3384)). Production responses for the four concrete moves above likewise contain no flags key.

All four concrete responses do provide the ordinary move classification:

| Move | ID | Elemental type | Damage class | Power | REST `meta` |
| --- | ---: | --- | --- | ---: | --- |
| Wave Crash | 834 | Water | Physical | 120 | `null` |
| Jet Punch | 857 | Water | Physical | 60 | `null` |
| Collision Course | 878 | Fighting | Physical | 100 | `null` |
| Bitter Blade | 891 | Fire | Physical | 90 | `null` |

So “Water/Fire/Fighting” and “Physical” are available. “Punch/contact/slicing/recoil” are separate behavioral facts and are not present in those REST records.

## What the official CSV database contains

PokeAPI's [`move_flags.csv`](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/data/v2/csv/move_flags.csv) defines 21 attributes. Relevant positive attributes are:

- `1 = contact`
- `8 = punch`
- `16 = bite`
- `17 = pulse`

It does not define `slicing`, `recoil`, `crash`, or Sheer Force eligibility. Current upstream's [`move_flags.csv`](https://github.com/PokeAPI/pokeapi/blob/5064f1d72746b3a6a931616dae3fb6445c556d4f/data/v2/csv/move_flags.csv) is the same for these traits.

The many-to-many [`move_flag_map.csv`](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/data/v2/csv/move_flag_map.csv) supplies positive membership records. PokeAPI imports that CSV into its internal attribute-map table ([build code](https://github.com/PokeAPI/pokeapi/blob/5064f1d72746b3a6a931616dae3fb6445c556d4f/data/v2/build.py#L876-L890)). However, both pinned and current-upstream maps contain **zero rows for ordinary move IDs `827..919`**. The latest upstream file is [here](https://github.com/PokeAPI/pokeapi/blob/5064f1d72746b3a6a931616dae3fb6445c556d4f/data/v2/csv/move_flag_map.csv).

Applying the repository's current Snapshot-capable filter to the pinned CSV yields:

| Measurement | Count |
| --- | ---: |
| Current PokeLens Move candidates | 531 |
| Candidates with at least one `move_flag_map` row | 455 |
| Candidates with no flag row | 76 |
| No-row candidates in the recent `827..919` block | 74 |

The other two no-row candidates are Future Sight and Doom Desire; their absence may be an intentional negative because their delayed-hit mechanics differ. That contrast is important: an absent row is only “no mapping in this dataset.” PokeAPI publishes no row-level completeness marker that lets a consumer distinguish an intentional negative from the wholly unpopulated recent block. Absence therefore cannot be treated as an authoritative `false` across the full pool.

## Concrete recent-move verification

PokeAPI's [`moves.csv`](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/data/v2/csv/moves.csv) includes the identities, elemental types, classes, power, accuracy, and priority for all four examples, but neither pinned nor current-upstream `move_flag_map.csv` has a row for any of them. Neither pinned nor current-upstream `move_meta.csv` has a row for any of them ([pinned meta](https://github.com/PokeAPI/pokeapi/blob/6629d1506a5ae659bb75d33e8e3ea143f2833642/data/v2/csv/move_meta.csv), [current meta](https://github.com/PokeAPI/pokeapi/blob/5064f1d72746b3a6a931616dae3fb6445c556d4f/data/v2/csv/move_meta.csv)).

The project's pinned mechanics source records the missing positive facts:

- Jet Punch is `contact` and `punch` ([Showdown move definition](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L9808-L9819)).
- Bitter Blade is `contact` and `slicing`, with 1/2 drain ([definition](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L1368-L1380)).
- Wave Crash is `contact`, with 33/100 recoil ([definition](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L20673-L20685)).
- Collision Course is `contact`; its super-effective Base Power behavior is also executable logic rather than PokeAPI structured metadata ([definition](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L2625-L2643)).

These are not hypothetical future gaps: interpreting the current PokeAPI absence as false already gives wrong gates for Tough Claws, Iron Fist, Sharpness, and Reckless.

## Trait-by-trait sufficiency

| Needed semantic | PokeAPI structured source | Full-pool verdict |
| --- | --- | --- |
| Elemental type | REST `type`; `moves.csv.type_id` | **Sufficient** |
| Physical/Special category | REST `damage_class`; `moves.csv.damage_class_id` | **Sufficient** |
| Contact | CSV attribute `contact` | **Incomplete**: recent positive rows are missing |
| Punch | CSV attribute `punch` | **Incomplete**: Jet Punch is a known missing positive |
| Bite | CSV attribute `bite` | **Positive records exist** through current known bite moves, but PokeAPI supplies no completeness signal for the recent blank block; PokeAPI-only cannot prove exhaustive negative membership |
| Pulse | CSV attribute `pulse` | **Positive records exist** through Terrain Pulse, but has the same no-completeness limitation |
| Slicing | None | **Unavailable** |
| Recoil | `move_meta.drain < 0` for populated older records | **Incomplete**: Wave Crash has no meta row |
| Crash damage | None | **Unavailable** |
| Sheer Force removable secondary | No direct field; only partial `effect_chance`, `meta`, and stat-change summaries | **Incomplete / not an exact contract** |

### Sheer Force edge cases

PokeAPI can describe common older cases such as Psychic's target Special Defense drop and Close Combat's user stat drops through `meta`, `stat_changes`, and effect text ([Psychic REST](https://pokeapi.co/api/v2/move/psychic/), [Close Combat REST](https://pokeapi.co/api/v2/move/close-combat/)). But the PokeAPI schema does not state whether an effect is a removable secondary under Sheer Force.

The pinned mechanics source makes that distinction executable: Sheer Force activates from a move's `secondaries`, removes them, removes associated `self` effects, and applies its Base Power modifier ([ability definition](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/abilities.ts#L4192-L4206)). Psychic has a `secondary`; Close Combat has only a primary `self` drop ([Psychic](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L14044-L14061), [Close Combat](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L2571-L2589)). Stone Axe is a sharper edge: Showdown uses an empty `secondary` marker plus custom post-hit hazard logic specifically so Sheer Force boosts it and suppresses the hazard, while PokeAPI returns `meta: null` ([Stone Axe mechanics](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L18063-L18088), [PokeAPI REST](https://pokeapi.co/api/v2/move/stone-axe/)). Dire Claw likewise has a real removable secondary while PokeAPI returns `meta: null` ([mechanics](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L3630-L3648), [PokeAPI REST](https://pokeapi.co/api/v2/move/dire-claw/)).

Effect prose is not a replacement for structured eligibility: parsing localized text would be a heuristic, and a manually maintained effect-ID allowlist would itself be supplemental reviewed metadata rather than a direct PokeAPI field.

## Consequence for the scoped abilities

| Ability | PokeAPI-only status for the current full pool | Reason |
| --- | --- | --- |
| Technician | **Complete for this gate** | Uses resolved power, not a behavioral trait |
| Tough Claws | **Not complete** | Contact mapping misses current positives |
| Iron Fist | **Not complete** | Jet Punch is missing from the punch map |
| Sharpness | **Not implementable exactly** | PokeAPI has no slicing attribute |
| Reckless | **Not complete** | Recent recoil metadata is missing; crash has no structured field |
| Sheer Force | **Not complete** | No exact removable-secondary field; recent metadata is mostly null |
| Strong Jaw | **Implementable only by trusting the snapshot's positive map and treating all absences as false** | Bite mappings exist, but PokeAPI does not establish completeness of the recent blank cohort |
| Mega Launcher | **Same conditional status as Strong Jaw** | Pulse mappings exist, but exhaustive negatives are not guaranteed |
| Fluffy / Long Reach contact facets | **Not complete** | Same contact-data gap as Tough Claws |

If “no fallback” remains a hard constraint, the honest choices are to exclude the abilities marked incomplete from a claim of full support, or explicitly approve partial snapshot semantics. Calling missing PokeAPI rows `false` without that product decision would hide known unsupported cases as inactive ones.
