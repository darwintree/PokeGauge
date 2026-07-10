# Champions / Gen 9 Critical-Hit and Accuracy Semantics

Checked on 2026-07-10 for the first **Atomic Damage Distribution** (ADD) compiler.

## Decision-ready answer

The product decision is to align the current Champions ruleset adapter with **Generation 9** for these mechanics. Compile an ordinary, unmodified move with:

```ts
criticalHitProbability = 1 / 24
hitProbability = accuracyPercent / 100
```

`criticalHitProbability` is conditional on a hit, as required by the existing ADD contract. The `1 / 24` value is the normal Gen 9 critical-hit stage: Pokémon Showdown's current move model defaults `critRatio` to stage 1, and its Gen 7+ resolution table gives that stage a denominator of 24 ([move default](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/sim/dex-moves.ts#L479-L486), [critical-hit resolution](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/sim/battle-actions.ts#L1627-L1646)). This is simulator-source evidence for modern main-series mechanics, not a first-party Champions specification.

No official Champions page found in this investigation publishes a numeric base critical-hit probability. The official Japanese site says Champions offers battles like previous Pokémon titles while preserving familiar type, Ability, and move depth, but it does not promise exact numerical identity ([official Champions site](https://www.pokemonchampions.jp/ja/)). Therefore the app should describe `1 / 24` as its explicit **Gen 9 alignment**, not as an independently confirmed Champions-only value.

## Accuracy compilation

An official Pokémon battle guide defines Accuracy as the percentage chance that a move successfully hits its target ([official Brilliant Diamond / Shining Pearl trainer guide](https://diamondpearl.pokemon.com/en-us/trainersguide/fundamentals/battling/)). PokeAPI likewise describes `Move.accuracy` as the percent likelihood that the move succeeds ([PokeAPI Move schema](https://pokeapi.co/docs/v2#moves)). For the first compiler's neutral context—no accuracy/evasion stages, weather override, Ability, item, or other hit modifier—a normal numeric value in the closed interval `1..100` therefore compiles to `accuracy / 100`.

The Gen 9 simulation source makes the representation distinction the local adapter currently lacks: ordinary accuracy is numeric, while `true` means that the move always hits; only numeric values go through the random `accuracy / 100` check ([move accuracy type](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/sim/dex-moves.ts#L359-L365), [accuracy check](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/sim/battle-actions.ts#L685-L743)).

### `null` is absence, not a complete rule

PokeAPI permits a database-null accuracy value ([PokeAPI model](https://github.com/PokeAPI/pokeapi/blob/3fe051e57f6b5792240acd7059cbca8249aae170/pokemon_v2/models.py#L1190-L1207)), but its public schema does not define `null` as a universal synonym for “always hits.” Its current records demonstrate why the compiler should not assign semantics from nullability alone:

- [Swift](https://pokeapi.co/api/v2/move/129/) has positive power, `accuracy: null`, and an effect saying it never misses.
- [Struggle](https://pokeapi.co/api/v2/move/165/) also has positive power and `accuracy: null`, but is an exceptional fallback action with recoil rather than an ordinary selectable move.
- [Kowtow Cleave](https://pokeapi.co/api/v2/move/869/) and [Flower Trick](https://pokeapi.co/api/v2/move/870/) have positive power and `accuracy: null`; Gen 9 simulation data classifies both as always-hit, and Flower Trick additionally always critically hits ([Kowtow Cleave](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/data/moves.ts#L9987-L9998), [Flower Trick](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/data/moves.ts#L5881-L5892)).

The first compiler should accept a null-backed move only after an upstream resource adapter has classified it as `alwaysHits`; that classification compiles to `hitProbability = 1`. A raw `null` that has not been classified is **unsupported**, not `1` and not `0`.

### Invalid or contradictory numeric metadata

Numeric zero must not compile to a 0% move without validation. PokeAPI currently reports [Tachyon Cutter](https://pokeapi.co/api/v2/move/911/) with `accuracy: 0`, while Gen 9 simulation data represents it as always-hit and two-hit ([Gen 9 move data](https://github.com/smogon/pokemon-showdown/blob/7fb9fe8c40dc05285b938f49cf8cde5b110d8407/data/moves.ts#L18807-L18821)). This is a concrete upstream-data exception, not a meaningful ordinary accuracy percentage.

For the first implementation:

| Compiled accuracy kind | ADD input | Admission rule |
| --- | ---: | --- |
| `percent` with integer `1..100` | `hitProbability = value / 100` | Admit in the neutral Gen 9 baseline. |
| `alwaysHits` | `hitProbability = 1` | Admit only when established by normalized move semantics or a reviewed allowlist. |
| Raw `null`, `0`, out-of-range, or contradictory data | none | Reject/omit actual probability for that move until classified; never silently coerce. |

Weather-dependent and other contextual overrides remain outside the current product-scoped kernel. A numeric base value is the neutral-context input, not a claim about every battle state. Moves with per-hit accuracy checks, guaranteed critical hits, elevated critical-hit ratios, or other exceptional resolution also need explicit normalized semantics or exclusion before their result can be called an ADD.

## Local data impact

The current `NormalizedMove` stores only `accuracy: number | null`, and the global **Fixed-power damaging move** pool admits every physical/special move with positive power. In the generated resources checked here, that yields 582 moves: 530 with accuracy `1..100`, 51 with `null`, and one with `0` (Tachyon Cutter). The 51 null rows mix ordinary always-hit moves with Struggle and legacy Z/Max entries, so generic `null => 1` would erase meaningful eligibility distinctions.

The smallest safe resource-to-ADD seam is therefore a compiler-facing discriminated value, conceptually:

```ts
type CompiledAccuracy =
  | { kind: "percent"; value: number }
  | { kind: "alwaysHits" }
  | { kind: "unsupported"; reason: string }
```

An equivalent reviewed allowlist is acceptable for the first narrow slice. The probability core itself should continue receiving only the resolved `hitProbability`; it should not interpret PokeAPI nullability, move identity, or exceptional move rules.

## Scope boundary

- Use `1 / 24` only for ordinary crit-stage-zero Gen 9 moves. A guaranteed-crit or elevated-ratio move must not be mislabeled as ordinary actual probability.
- “Actual probability off” continues to compile to hit probability `1` and critical-hit probability `0`, per the already resolved module contract.
- Champions-specific balance changes may later justify a ruleset override. This research found no first-party numeric Champions critical-hit statement that overrides the chosen Gen 9 baseline.
