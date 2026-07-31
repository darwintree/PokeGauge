# PokeAPI Eviolite eligibility

Checked 2026-07-31 against the repository's vendored PokeAPI CSV/schema, the
current generated Pokemon resources, and the installed `@smogon/calc 0.11.0`
Gen 9 species table. No network source was required.

## Result

The smallest sufficiently accurate PokeAPI-backed rule is:

1. Build the outgoing evolution rows for a species by joining
   `pokemon_species.id` to another row's `evolves_from_species_id`, then to that
   child's rows in `pokemon_evolution.csv`.
2. A default `pokemon` row is eligible when one of those outgoing evolution
   rows has no `base_form_id`.
3. A non-default `pokemon` row is eligible only when an outgoing evolution row
   names its `pokemon.id` as `base_form_id`.
4. Add four reviewed positive exceptions: Pumpkaboo-Small, Pumpkaboo-Large,
   Pumpkaboo-Super, and Gimmighoul-Roaming.

This is preferable to a species-only `canEvolve` flag. The result belongs on
each `NormalizedBattlePokemon` identity, because eligibility can differ between
varieties that share one `speciesId`.

## Why the two species-level approaches are equivalent

The REST evolution-chain shape exposes a species node and recursive
`evolves_to` children ([OpenAPI chain schema](../../PokeAPI/pokeapi/openapi.yml#L4044),
[serializer traversal](../../PokeAPI/pokeapi/pokemon_v2/serializers.py#L6119)).
Walking the tree can answer whether a species node has a child.

The CSV stores the same edge directly: each species row has
`evolves_from_species_id` ([CSV schema and data](../../PokeAPI/pokeapi/data/v2/csv/pokemon_species.csv#L1)).
Reversing that column answers the same question without fetching and traversing
an evolution chain. Therefore:

- **A — `evolution_chain` + `evolves_to`:** correct for species-level
  `canEvolve`, but more work and still loses the source variety.
- **B — reverse `evolves_from_species_id`:** the simplest species-level seam;
  one pass builds the set of species ids that have children.

Neither A nor B alone is accurate enough for Eviolite because PokeAPI defines a
species as shared across its Pokemon varieties
([OpenAPI species description](../../PokeAPI/pokeapi/openapi.yml#L2654)), while
evolution eligibility can be variety-specific.

## Form and variety restriction

PokeAPI's evolution detail has nullable `base_form` and `evolved_form` fields
([OpenAPI evolution detail](../../PokeAPI/pokeapi/openapi.yml#L4094),
[model fields](../../PokeAPI/pokeapi/pokemon_v2/models.py#L1720)). The CSV
materializes them as `base_form_id` and `evolved_form_id`
([pokemon_evolution.csv](../../PokeAPI/pokeapi/data/v2/csv/pokemon_evolution.csv#L1)).
`base_form_id` references a `pokemon.id`, not a `pokemon_forms.id`; this lets a
non-default Battle Pokemon identity opt into a specific outgoing evolution.

The important examples are reproducible from the vendored rows:

| Battle Pokemon identity | PokeAPI id | Species id | Rule result | Reason |
| --- | ---: | ---: | --- | --- |
| Basculin (Red-Striped/default) | 550 | 550 | false | Its only outgoing evolution names `base_form_id=10247`. |
| Basculin-Blue-Striped | 10016 | 550 | false | It is non-default and no outgoing row names id 10016. |
| Basculin-White-Striped | 10247 | 550 | true | Basculegion's evolution row explicitly names `base_form_id=10247` ([row](../../PokeAPI/pokeapi/data/v2/csv/pokemon_evolution.csv#L464)). |
| Floette (default) | 670 | 670 | true | Floette has an unqualified outgoing evolution to Florges. |
| Floette-Eternal | 10061 | 670 | false | It is non-default and no outgoing row names id 10061. |

Thus a species-level flag would incorrectly make both ordinary Basculin forms
eligible and Floette-Eternal eligible.

## Full local comparison

The comparison reproduced the generator's current identity set from
`GENERATED_POKEMON`, applied the rule above from the vendored PokeAPI tables,
then compared joinable identities with `@smogon/calc` Gen 9 `nfe`.

| Scope | Identities | Calc-joinable | Not joinable | Rule mismatches |
| --- | ---: | ---: | ---: | ---: |
| All generated identities | 1,350 | 1,249 | 101 | 4 |
| Current selectable identities (`isMega || !isBattleOnly`) | 1,287 | 1,195 | 92 | 4 |

All four mismatches are false negatives caused by PokeAPI omitting an explicit
`base_form_id` for a non-default variety that shares the default variety's
evolution:

| Exception | Pokemon id | Override |
| --- | ---: | --- |
| Pumpkaboo-Small | 10027 | eligible |
| Pumpkaboo-Large | 10028 | eligible |
| Pumpkaboo-Super | 10029 | eligible |
| Gimmighoul-Roaming | 10263 | eligible |

No negative exception was required. With these four overrides, the rule matched
all 1,249 locally joinable generated identities and all 1,195 joinable current
selector identities.

The 101 generated identities absent from the installed calc table are not an
oracle mismatch; they remain classified solely by the PokeAPI rule. This is an
explicit evidence boundary rather than a reason to fall back to species-level
eligibility.

## Implementation consequence

Generate one boolean per Battle Pokemon identity from the existing vendored
tables and four-id exception set. Runtime compilation then reads that boolean;
it does not need an evolution-chain fetch, tree traversal, name join, or item
specific identity `if` chain.
