# Held-item modifier phases and rounding (Gen 9)

Checked on 2026-07-31 for the frozen held-item spec scope.

## Source status

The repository declares `@smogon/calc ^0.11.0` and locks `0.11.0` ([package manifest](../../package.json), [lockfile](../../pnpm-lock.yaml)). The npm registry record for that release identifies git commit [`264a4ea`](https://github.com/smogon/damage-calc/tree/264a4ea846a0a0c7724e26c4671ff42e854b5ea1); the checked-in package's `gen789.ts` and `util.ts` byte-match that commit ([npm release record](https://registry.npmjs.org/@smogon/calc/0.11.0)).

The mechanic reference is Pokémon Showdown's Gen 9 implementation at the previously pinned commit [`71d77d3`](https://github.com/smogon/pokemon-showdown/tree/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa). The first-party sources reviewed do not publish an equivalent numeric battle specification: the official [Pokémon Champions gameplay page](https://champions.pokemon.com/en-us/gameplay/) describes modes and changing regulation parameters, while the official [Play! Pokémon VGC tournament handbook](https://mcdn.pokemon.com/pokemon-prod/raw/upload/v1/live/static-assets/content-assets/cms2/pdf/play-pokemon/rules/play-pokemon-vgc-tournament-handbook-en.pdf#page=6) specifies item eligibility and the duplicate-item rule, not held-item accuracy coefficients, fixed-point arithmetic, rounding, or the hit RNG. These are therefore high-fidelity simulator/calculator sources, not independent confirmation of the Pokémon Champions executable. Exact values below are the product's explicit **pinned Pokémon Showdown Gen 9 alignment** and must not be described as a first-party Champions formula.

## Decision-ready result

Use one integer modifier chain per phase. A held-item effect joins the chain shown below; it must not be converted into an arbitrary floating multiplier or applied at another phase.

| Frozen family | Triggered item modifier | Phase | Applied to |
| --- | ---: | --- | --- |
| Type boosters, Plates, Incenses, Dialga/Palkia/Giratina items, Soul Dew, Ogerpon masks | `4915` | Base Power | post-callback / snapshot power |
| Muscle Band, Wise Glasses | `4505` | Base Power | post-callback / snapshot power |
| Light Ball, Thick Club, Deep Sea Tooth | `8192` | Attack or Special Attack | stat after stage handling |
| Assault Vest, Eviolite | `6144` | Defense or Special Defense | stat after stage handling |
| Deep Sea Scale | `8192` | Special Defense | stat after stage handling |
| Expert Belt | `4915` | Final damage | damage after random, STAB, effectiveness, and burn |
| Life Orb | `5324` | Final damage | damage after random, STAB, effectiveness, and burn |
| Resistance Berry | `2048` | Final damage | the same final chain as Life Orb / Expert Belt |
| Wide Lens | `4505` | Numeric accuracy | move accuracy before accuracy/evasion stages |
| Bright Powder, Lax Incense | `3686` | Numeric accuracy | move accuracy before accuracy/evasion stages |
| Scope Lens, Razor Claw | `+1` stage | Critical ratio | additive stage, not a 4096 modifier |
| Leek, Lucky Punch | `+2` stages | Critical ratio | additive stage, not a 4096 modifier |

Pokémon Showdown declares the Base Power item values directly: ordinary type boosters use `4915`, while Muscle Band and Wise Glasses use `4505` ([type booster](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L508-L519), [Muscle Band](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4235-L4248), [Wise Glasses](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7750-L7763)). Plates, the identity-limited orbs/crystals/globes/cores, Soul Dew, and Ogerpon masks use the same `4915` Base Power hook ([Draco Plate](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1450-L1464), [Adamant items](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L75-L109), [Soul Dew](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5879-L5893), [Ogerpon masks](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1157-L1171)).

The stat items are `2x` (`8192`) or `1.5x` (`6144`) `ModifyAtk` / `ModifySpA` / `ModifyDef` / `ModifySpD` effects ([Light Ball](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3417-L3435), [Thick Club](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L6288-L6303), [Deep Sea items](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1344-L1376), [Assault Vest](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L313-L330), [Eviolite](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1864-L1882)). Expert Belt and Life Orb are `ModifyDamage`, not Base Power, and use `4915` and `5324` respectively ([Expert Belt](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1897-L1910), [Life Orb](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3400-L3416)).

## Damage pipeline and chaining order

For an ordinary Gen 9 damage branch, the relevant order is:

1. Resolve move power callbacks and then the **Base Power** event. Base Power items join this event.
2. Apply Attack/Defense stat stages, including the critical-hit rules that ignore a negative offensive stage or positive defensive stage, then run the relevant **stat modifier** event. Stat items still apply on a critical hit.
3. Run the integer core formula and add `2`.
4. Apply spread damage.
5. Apply the generic weather damage modifier.
6. Apply critical damage (`1.5x`) and then the random roll.
7. Apply STAB, type effectiveness, and burn.
8. Run the **final `ModifyDamage`** chain. Expert Belt, Life Orb, and a triggered resistance Berry join here.

Showdown resolves critical ratio before Base Power, then Base Power before the stage-aware stats and their modifier events ([damage setup](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle-actions.ts#L1613-L1719)). Its damage path then orders spread, weather, critical damage, random, STAB, effectiveness, burn, and final `ModifyDamage` exactly as above ([damage modifier order](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle-actions.ts#L1725-L1840)).

`@smogon/calc 0.11.0` exposes equivalent explicit seams: `calculateBPModsSMSSSV`, `calculateAtModsSMSSSV`, `calculateDfModsSMSSSV`, and `calculateFinalModsSMSSSV` ([Base Power application and collection](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L992-L1028), [Attack application and item rules](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1330-L1490), [Defense application and item rules](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1530-L1633), [final item rules](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1689-L1799)). These are the correct oracle seams for all 16 ordinary and critical damage rolls.

Within one phase, collect all applicable modifiers in mechanic order, chain them, and apply the chained result to the phase input **once**. Do not round the stat/power/damage after each individual source. `@smogon/calc`'s arrays preserve a canonical order for interactions with abilities, screens, and field effects; using those functions as the roll oracle avoids inventing a second order.

## Exact integer rules and caps

There are two different rounding operations:

```text
chain(M, next) = floor((M * next + 2048) / 4096)  // exact half rounds up
apply(value, M) = floor((value * M + 2047) / 4096) // exact half rounds down
```

Showdown implements these as `chainModify` and `modify` ([integer modifier implementation](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle.ts#L2302-L2339)). `@smogon/calc` uses the same chained-modifier operation and an explicit `pokeRound` whose exact `.5` case rounds down ([`chainMods`](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/util.ts#L469-L478), [`pokeRound`](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/util.ts#L698-L701)).

The calculator makes the game-oriented modifier bounds and integer widths explicit:

| Phase | Chained modifier bounds | Post-apply rule |
| --- | ---: | --- |
| Base Power | `41..2_097_152` | half-down, minimum `1`, 16-bit overflow |
| Attack / Defense | `410..131_072` | half-down, minimum `1`, 16-bit overflow |
| Final damage | `41..131_072` | half-down after a minimum-`1` input, 16-bit overflow |

The Base Power and stat calls pass those exact bounds to `chainMods` ([Base Power](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1000-L1005), [Attack](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1330-L1340), [Defense](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1530-L1552)); final damage uses the final bounds and applies the result after random/STAB/effectiveness ([final chain and rolls](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L632-L668), [`getFinalDamage`](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/util.ts#L539-L557)). The frozen legal combinations do not approach these ceilings, but the spec should preserve them by delegating to the existing integer kernel rather than replacing it with floats.

## Resistance Berries

All type resistance Berries use `2048` (`0.5x`) in the final-damage chain when the incoming move has the matching type and is super effective. Chilan Berry is the exception: it triggers on a Normal-type move without requiring super effectiveness. Showdown checks the resolved `typeMod`, consumes the Berry, and returns a `0.5x` final modifier ([representative resistance Berry](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L355-L373), [Chilan Berry](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L898-L916)). `@smogon/calc` places the Berry after outgoing final modifiers in the same `finalMods` chain, and limits it to `hitCount === 0` ([Berry final modifier](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1787-L1799)).

Mechanic fact: a real Berry is consumed, so a qualifying later hit does not receive the modifier. Product choice already made for this effort: keep N-hit output, treat the selected Berry as persistent in that projection, and disclose the unsupported consumption with the red-dot tooltip. That choice intentionally must **not** be inferred from `@smogon/calc`'s `hitCount === 0` behavior.

## Accuracy items

Wide Lens contributes `4505`; Bright Powder and Lax Incense contribute `3686`. Their callbacks only act when accuracy is numeric, so they do not modify semantic `always hits` (`true`) ([Wide Lens](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7709-L7723), [Bright Powder](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L659-L672), [Lax Incense](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3293-L3306)).

The order is: start from the move's numeric or always-hit accuracy; run one `ModifyAccuracy` event whose target handlers include Bright Powder/Lax Incense and whose source handlers include Wide Lens; apply that event's completed modifier chain to accuracy **once**; if still numeric, apply accuracy/evasion stages with integer truncation; run the later `Accuracy` event or always-hit override; then call `randomChance(accuracy, 100)` ([accuracy path](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle-actions.ts#L685-L750), [`runEvent` and modifier application](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle.ts#L720-L892)). The item factors are not independently applied and rounded percentages.

For this frozen scope, one attacking item and one defending item can contribute at most two factors to the event. Wide Lens plus Bright Powder or Lax Incense chains to:

```text
floor((4505 * 3686 + 2048) / 4096) = 4054
```

The two-factor result is the same whichever of these two factors is visited first. The combined `4054` is then applied once with the `+2047` half-down rule. These examples are directly reproducible from the pinned source and assume no accuracy/evasion stage or later `Accuracy` override:

| Case | Chained modifier | Integer accuracy after `apply` | Effective hit probability |
| --- | ---: | ---: | ---: |
| Wide Lens, base `100` | `4505` | `floor((100 * 4505 + 2047) / 4096) = 110` | `1` |
| Bright Powder or Lax Incense, base `100` | `3686` | `floor((100 * 3686 + 2047) / 4096) = 90` | `0.90` |
| Wide Lens + Bright Powder/Lax Incense, base `100` | `4054` | `floor((100 * 4054 + 2047) / 4096) = 99` | `0.99` |
| Wide Lens + Bright Powder/Lax Incense, base `80` | `4054` | `floor((80 * 4054 + 2047) / 4096) = 79` | `0.79` |

The precision boundary has three layers. Item coefficients and their chained result are integers in units of `1/4096`; exact half in the chain rounds up via `+2048`. Applying the chain produces an integer accuracy point; exact half rounds down via `+2047`. The final RNG samples an integer in `0..99`, so numeric accuracy has one-percentage-point hit-probability resolution after the preceding truncations ([integer modifier implementation](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle.ts#L2302-L2339), [RNG implementation](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/prng.ts#L78-L117)). Showdown applies no explicit numeric `100` cap: accuracy `110` remains `110`, but every draw in `0..99` succeeds. A probability model must therefore use `min(1, accuracy / 100)` rather than expose `1.10` or create a negative miss mass.

`@smogon/calc` has item names but no hit-probability pipeline, so it cannot be the oracle for this family. The claims above are fully supported as pinned Showdown Gen 9 simulator semantics; because the reviewed first-party sources do not expose the corresponding executable formula, they do not independently establish that Pokémon Champions uses the same coefficients or rounding at every precision boundary.

## Critical-stage items

Showdown gives ordinary moves `critRatio = 1`, then adds all `ModifyCritRatio` effects, and finally clamps the Gen 9 ratio to `0..4`. Ratios `1,2,3,4` resolve to `1/24`, `1/8`, `1/2`, and `1` ([move default](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/dex-moves.ts#L479-L486), [critical resolution and cap](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle-actions.ts#L1613-L1646)). Scope Lens and Razor Claw add `1`; Leek and Lucky Punch add `2` only for their eligible identities ([Scope Lens and Razor Claw](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5085-L5095), [Scope Lens](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5550-L5560), [Leek](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3318-L3332), [Lucky Punch](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3517-L3531)).

The app's existing `Critical stage 0..+3` is the zero-based product representation of Showdown ratios `1..4`. Add the item contribution and saturate at product stage `+3`; there is no 4096 chaining or rounding. The item changes only critical probability. Once the branch is critical, its damage multiplier and stage-ignore rules are unchanged. `@smogon/calc` accepts an already-decided `move.isCrit` boolean and calculates that branch, but does not calculate the stage probability; Showdown is again the oracle for compilation, while `@smogon/calc` remains the oracle for critical rolls.

## Utility Umbrella: holder-scoped weather suppression

Utility Umbrella does not globally disable weather. In Showdown, a Pokémon's `effectiveWeather()` returns no weather for sun, rain, harsh sunshine, or heavy rain when that Pokémon holds the item; sand and snow are unaffected ([holder-scoped implementation](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/pokemon.ts#L2191-L2212)). The direct calculator consequences are:

| Holder | Suppressed in the frozen calculator context | Not suppressed |
| --- | --- | --- |
| Defender | Generic sun/rain Fire/Water damage modifier; target-scoped Thunder/Hurricane/storm weather accuracy | Sand/snow; Hydro Steam's attacker-scoped sun boost |
| Attacker | Solar Beam/Solar Blade's rain Base Power penalty; Weather Ball's sun/rain type/power behavior; Hydro Steam's sun boost | Generic sun/rain Fire/Water damage modifier against a defender without Utility Umbrella; Solar Beam/Solar Blade's sand/snow penalty; sand/snow Weather Ball behavior |

The generic weather damage hooks deliberately consult `defender.effectiveWeather()`, while Hydro Steam first consults `attacker.effectiveWeather()` ([rain and sun damage hooks](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/conditions.ts#L476-L566)). Weather-dependent accuracy moves consult the target's effective weather ([Thunder](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L19432-L19451), [Hurricane](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L9029-L9049)); Solar Beam/Blade and Weather Ball consult the attacker ([Solar Beam](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L17218-L17249), [Weather Ball](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L20686-L20733)).

`@smogon/calc` exposes the same damage seams: attacker-held Umbrella neutralizes Weather Ball's sun/rain type and power, attacker-held Umbrella suppresses Hydro Steam's sun boost, and defender-held Umbrella suppresses generic sun/rain damage ([Weather Ball type](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L234-L250), [Weather Ball power](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L852-L866), [generic weather and Hydro Steam](https://github.com/smogon/damage-calc/blob/264a4ea846a0a0c7724e26c4671ff42e854b5ea1/calc/src/mechanics/gen789.ts#L1647-L1685)). It does not expose the weather-accuracy consequence because it does not calculate hit probability.

## Product choices still needed by the spec

Mechanic facts above are sufficient to implement the phases. The spec still has to state these product choices explicitly:

- Whether an otherwise unsupported Weather Ball weather scenario becomes calculable when attacker-held Utility Umbrella neutralizes its sun/rain type change. The mechanic permits it; the current Weather Track contract excludes non-neutral Weather Ball scenarios.
- Persistent resistance-Berry treatment for N-hit is a disclosed approximation, not Showdown or `@smogon/calc` behavior.
- Identity eligibility (including exact form acceptance) belongs to the item identity contract; it does not alter phase or rounding.

No additional modifier abstraction is required: extend the existing phase fields and integer chaining kernel, and keep accuracy/critical compilation outside `@smogon/calc`.
