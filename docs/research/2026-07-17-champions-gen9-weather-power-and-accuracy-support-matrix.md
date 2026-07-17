# Champions / Gen 9 Weather Power and Accuracy Support Matrix

Checked on 2026-07-17 for the **Weather** Track compiler.

## Decision-ready answer

The current product boundary can support standard `none`, `sun`, `rain`, `sand`, and `snow` for direct move damage/power and hit probability with one generic type rule plus reviewed metadata for nine exceptional move IDs. Weather Ball is the one known move that cannot be safely calculated under non-neutral weather while weather-induced type changes remain out of scope.

Pokémon's official Champions strategy material confirms that rain boosts Water-type attacks in Champions, but does not publish a complete numeric weather formula or exception table ([official Champions strategy article](https://www.pokemon.com/us/features/pokemon-champions-how-to-build-a-mega-malamar-team)). The exact rules below are therefore the product's explicit **Generation 9 alignment**, using the current Pokémon Showdown Gen 9 battle implementation at commit [`7b842b6`](https://github.com/smogon/pokemon-showdown/tree/7b842b6e963bb65cb2ee551db844e74cb420c367), not a claim that an official Champions specification independently documents every value.

This matrix assumes the selected standard weather is already effective. Weather suppression, Utility Umbrella, extreme weather, weather duration, charge-turn timing, defensive-stat weather boosts, residual damage, healing, status immunity, and weather-induced move type changes are outside this ticket.

## Generic direct effects

Use 4096-based modifiers. For every supported move whose type remains stable:

| Weather | Direct damage modifier | Accuracy override |
| --- | --- | --- |
| `none` | `4096` (`1x`) | none |
| `sun` | Fire `6144` (`1.5x`); Water `2048` (`0.5x`), except Hydro Steam uses `6144` | move-specific only |
| `rain` | Water `6144` (`1.5x`); Fire `2048` (`0.5x`) | move-specific only |
| `sand` | `4096` (`1x`) | move-specific only |
| `snow` | `4096` (`1x`) | move-specific only |

The exact standard-rain and standard-sun damage branches are implemented by Pokémon Showdown's weather conditions ([rain](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/conditions.ts#L476-L496), [sun and Hydro Steam](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/conditions.ts#L546-L569)). Sand and snow define no generic direct move-damage or accuracy modifier; their condition-level stat and residual effects are outside this ticket ([sand and snow](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/conditions.ts#L628-L720)).

## Executable move-ID matrix

PokeAPI provides stable numeric move IDs and scalar `type`, `power`, and `accuracy` fields through the Move resource, but not typed weather rules ([Move endpoint documentation](https://pokeapi.co/docs/v2#moves)). The following object is the smallest reviewed metadata surface needed on top of those fields:

```ts
const weatherMoveRules = {
  59:  { accuracy: { snow: "alwaysHits" } },
  76:  { basePowerMod: { rain: 2048, sand: 2048, snow: 2048 } },
  87:  { accuracy: { sun: 50, rain: "alwaysHits" } },
  542: { accuracy: { sun: 50, rain: "alwaysHits" } },
  669: { basePowerMod: { rain: 2048, sand: 2048, snow: 2048 } },
  846: { accuracy: { rain: "alwaysHits" } },
  847: { accuracy: { rain: "alwaysHits" } },
  848: { accuracy: { rain: "alwaysHits" } },
  876: { damageMod: { sun: 6144 } },

  // Non-neutral weather also changes the move type, which this ticket excludes.
  311: { unsupported: ["sun", "rain", "sand", "snow"], reason: "weather-type-change" },
} as const
```

| Move | PokeAPI base fields | Reviewed weather rule | Support status |
| --- | --- | --- | --- |
| [Blizzard, ID 59](https://pokeapi.co/api/v2/move/59/) | Ice, 110 power, 70 accuracy | Snow sets accuracy to `alwaysHits` ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L1491-L1502)). | Supported. |
| [Solar Beam, ID 76](https://pokeapi.co/api/v2/move/76/) | Grass, 120 power, 100 accuracy | Rain, sand, and snow apply `0.5x` base power ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L17218-L17249)). | Supported; charge timing is not modeled. |
| [Thunder, ID 87](https://pokeapi.co/api/v2/move/87/) | Electric, 110 power, 70 accuracy | Rain sets `alwaysHits`; sun sets 50 accuracy ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L19432-L19451)). | Supported. |
| [Weather Ball, ID 311](https://pokeapi.co/api/v2/move/311/) | Normal, 50 power, 100 accuracy | Every non-neutral supported weather doubles power **and changes type**; sun/rain then also use the changed Fire/Water type for the generic weather modifier ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L20686-L20733)). | `none` supported; all four weather states unsupported until type change is in scope. |
| [Hurricane, ID 542](https://pokeapi.co/api/v2/move/542/) | Flying, 110 power, 70 accuracy | Rain sets `alwaysHits`; sun sets 50 accuracy ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L9029-L9049)). | Supported. |
| [Solar Blade, ID 669](https://pokeapi.co/api/v2/move/669/) | Grass, 125 power, 100 accuracy | Rain, sand, and snow apply `0.5x` base power ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L17254-L17285)). | Supported; charge timing is not modeled. |
| [Bleakwind Storm, ID 846](https://pokeapi.co/api/v2/move/846/) | Flying, 100 power, 80 accuracy | Rain sets `alwaysHits` ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L1468-L1489)). | Supported. |
| [Wildbolt Storm, ID 847](https://pokeapi.co/api/v2/move/847/) | Electric, 100 power, 80 accuracy | Rain sets `alwaysHits` ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L20846-L20865)). | Supported. |
| [Sandsear Storm, ID 848](https://pokeapi.co/api/v2/move/848/) | Ground, 100 power, 80 accuracy | Rain sets `alwaysHits` ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L15673-L15693)). | Supported. |
| [Hydro Steam, ID 876](https://pokeapi.co/api/v2/move/876/) | Water, 80 power, 100 accuracy | Sun replaces the normal Water suppression with a `1.5x` damage modifier ([move declaration](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L9087-L9099), [weather rule](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/conditions.ts#L556-L569)). Rain uses the generic Water `1.5x`. | Supported. |

### Checked negative: Springtide Storm

[Springtide Storm, ID 831](https://pokeapi.co/api/v2/move/831/) is the fourth Forces of Nature storm move, but it has no weather accuracy rule in the Gen 9 implementation; it remains an ordinary 100-power, 80-accuracy Fairy move in all five Track states ([Gen 9 source](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/data/moves.ts#L17790-L17807)). It therefore does **not** belong in `weatherMoveRules` and needs no reviewed weather metadata.

## Formula order and rounding

Apply move-specific base-power modifiers before the ordinary damage formula. Pokémon Showdown resolves the `BasePower` event before calculating damage ([battle implementation](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/sim/battle-actions.ts#L1649-L1653)); Solar Beam and Solar Blade contribute a `0.5x` chained base-power modifier there. The integer modifier operation rounds exact halves down ([modifier implementation](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/sim/battle.ts#L2318-L2339)), so the upstream defaults compile as:

```text
Solar Beam:  120 × 0.5 = 60
Solar Blade: 125 × 0.5 = 62  // 62.5 rounds down
```

Apply the generic sun/rain damage modifier to the post-formula, post-spread integer damage, before critical damage, the random roll, STAB, and type effectiveness. That ordering is explicit in the Gen 9 damage path ([damage formula and ordering](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/sim/battle-actions.ts#L1717-L1759)). In 4096 notation:

```text
weatherAdjustedDamage = halfDown(postSpreadBaseDamage × weatherDamageMod / 4096)
```

Accuracy overrides replace the move's numeric accuracy before the accuracy check. `alwaysHits` must remain a semantic value, not numeric `100`: Pokémon Showdown bypasses the random check only when accuracy is `true`; otherwise it rolls `accuracy / 100` ([accuracy resolution](https://github.com/smogon/pokemon-showdown/blob/7b842b6e963bb65cb2ee551db844e74cb420c367/sim/battle-actions.ts#L690-L750)). In the app's actual-probability compiler this maps to `hitProbability = 1` for `alwaysHits`, or `accuracy / 100` for numeric accuracy.

## Data boundary

| Source | Safe to normalize directly | Must not infer from it |
| --- | --- | --- |
| PokeAPI Move resource | Numeric `id`, static `type`, scalar `power`, scalar `accuracy`, and damage category. | Weather conditions, modifier order, an always-hit semantic, or Weather Ball's resolved type. |
| Reviewed app metadata keyed by move ID | The nine supported exceptional rules above and Weather Ball's explicit unsupported states. | Ruleset legality or move availability; those belong to the ruleset resource. |
| Weather Track state | One of `none`, `sun`, `rain`, `sand`, `snow`. | Weather source, duration, suppression, or setter behavior. |

Do not parse localized PokeAPI effect text at runtime. PokeAPI exposes effect entries as prose rather than typed weather mechanics ([Move endpoint documentation](https://pokeapi.co/docs/v2#moves)); the executable boundary is the generic type rule plus the reviewed numeric-ID table above.

Apply base-power rules to the current **Move snapshot** power, not a hard-coded result copied from PokeAPI. PokeAPI values initialize the template; the compiled scenario owns the concrete power. Accuracy overrides likewise operate at scenario compilation, and only affect actual hit probability when that probability mode is enabled.

## Acceptance checks for the eventual implementation

- A neutral Fire and Water move match `none` under sand and snow; sun/rain use the generic modifiers.
- Solar Beam compiles to 60 power and Solar Blade to 62 power in rain, sand, and snow.
- Thunder and Hurricane compile to `0.5` hit probability in sun and `1` in rain; Blizzard compiles to `1` in snow.
- Bleakwind Storm, Wildbolt Storm, and Sandsear Storm compile to `1` in rain; Springtide Storm remains `0.8`.
- Hydro Steam uses `1.5x` in both sun and rain, never sun's generic Water `0.5x`.
- Weather Ball produces no weather-calculated scenario until weather-induced type changes are supported; `none` remains calculable from its ordinary template fields.
