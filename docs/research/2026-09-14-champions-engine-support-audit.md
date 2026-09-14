# Champions engine support audit

Static audit of smogon/damage-calc commit `e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d`, against PokeGauge HEAD's ability classification and frozen held-item effects. This identifies existing execution paths, not exhaustive interaction correctness. No prototype was run. Catalog membership alone is not a support test.

## Abilities

Of the generated abilities that PokeGauge HEAD classifies as supported or assumed-satisfied, these are absent from the Champions ability catalog:

- Existing relevant damage paths: **76 Air Lock**, through the shared weather-clearing helper; **186 Dark Aura**, through the dynamic `${move.type} Aura` branch. Champions does not implement Aura Break's reversal.
- Missing relevant Champions branches/calls: **25 Wonder Guard, 88 Download, 96 Normalize, 110 Tinted Lens, 114 Storm Drain, 122 Flower Gift, 137 Toxic Boost, 138 Flare Boost, 188 Aura Break, 200 Steelworker, 206 Galvanize, 231 Shadow Shield, 232 Prism Armor, 233 Neuroforce, 234 Intrepid Sword, 235 Dauntless Shield, 246 Ice Scales, 255 Gorilla Tactics, 262 Transistor, 273 Well-Baked Body, 274 Wind Rider, 276 Rocky Payload, 284 Vessel of Ruin, 285 Sword of Ruin, 286 Tablets of Ruin, 287 Beads of Ruin, 288 Orichalcum Pulse, 289 Hadron Engine, 305 Tera Shell**. Data fallback does not restore their effects.

Sources: [Champions ability catalog](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/data/abilities.ts#L350), [Champions mechanics](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/champions.ts), [Air Lock helper](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/util.ts#L168). The local classification is `src/lib/ability/index.ts`; stable PokeAPI names are `src/lib/resources/generated/ability-calc-names.ts`.

Storm Drain illustrates why textual presence is insufficient: it remains in the ability-ignoring list, but is absent from Champions' Water immunity branch. Some other unsupported abilities retain partial shared-helper effects: Slow Start, Protosynthesis and Quark Drive affect speed, while their full damage-stat behavior is absent. Do not promote these on helper/name recognition alone.

## Current frozen item effects outside the Champions catalog

Existing generic type-boost path (4915/4096): **275–290 and 684** (plates), **291 Odd Incense, 292 Rock Incense, 295 Rose Incense, 231 Sea Incense, 294 Wave Incense**. The data adapter must supply canonical names: the helper matches display names, not PokeAPI numeric IDs or lowercase joined names. Sources: [generic Champions modifier](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/champions.ts#L825), [shared item mapping](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/items.ts#L11).

Local-only supported probability effects: **232 Lax Incense** (incoming accuracy), **303 Razor Claw** (+1 critical stage), **233 Lucky Punch** (+2 critical stages, Chansey gate). These are owned by PokeGauge's `src/lib/held-item/inventory.ts` and `src/lib/damage-calculation/scenario-compiler.ts`, not calc's damage modifiers. Absence from the calc catalog does not itself invalidate these particular effects; this is not a claim of full item mechanics or legality.

Missing current frozen damage effects in Champions: **197 Choice Band, 274 Choice Specs, 235 Thick Club, 203 Deep Sea Tooth, 204 Deep Sea Scale, 683 Assault Vest, 581 Eviolite, 112 Adamant Orb, 113 Lustrous Orb, 442 Griseous Orb, 202 Soul Dew, 2108 Cornerstone Mask, 2107 Hearthflame Mask, 2106 Wellspring Mask, 1181 Utility Umbrella**. These lack their specific Champions modifier/condition branches; merely falling back to gen9 item data is insufficient. Sources: [Champions attack/defense/final modifiers](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/champions.ts#L850), [gen9 comparison](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/gen789.ts), [Champions item catalog](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/data/items.ts#L551).

Out-of-catalog items outside the current frozen list also demonstrate surviving helpers: Float Stone affects weight, Quick Powder affects Ditto speed, and Clear Amulet blocks Intimidate. These observations do not add those items to product scope or establish all of their interactions.

## Projection and sequence implications

- Champions Fairy/Dark Aura uses 5448/4096 and has no Aura Break reversal. The local display must not imply the reversal.
- Critical damage remains 1.5; Sniper remains a 6144 final modifier; burn remains physical-only with Guts/Facade exemptions. Doubles Reflect/Light Screen remains 2732/4096 and does not apply to critical hits. These inspected formulas do not establish a need to change the existing probability model. See [Champions damage/final modifiers](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/champions.ts#L1068).
- Multiscale remains; Shadow Shield/Tera Shell do not. A full-HP state adapter must use the selected engine's support, rather than enabling effects from a shared name list.
- Mega Sol checks the attacker, not either side. It changes Weather Ball, Solar Beam/Blade, weather damage and Sand/Snow defense behavior; it is not a global replacement Weather selection. See [Champions weather defense](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/champions.ts#L991).
- Champions move overrides include native multi-hit power changes and Make It Rain's -2 SpA effect. PokeAPI defaults and the local fixed-hit/stat-change profiles need selected-engine alignment, separately from ability/item classification. See [Champions move patch](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/data/moves.ts#L5456).

The public Generation interface permits `num: 0` with gen0-first/gen9-fallback collections; constructors and clones retain that object. This preserves Champions overrides and broad lookup coverage, but cannot supply mechanics that the Champions implementation removed. See [Generation interface](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/data/interface.ts#L44) and [mechanics dispatcher](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/calc.ts#L34).


## Probability supplement

Mega Sol applies sunny weather to the active user's move effects, including Thunder/Hurricane accuracy; it does not replace weather for other abilities such as Sand Veil. PokeGauge retains its local probability layer: [Showdown effectiveWeather](https://github.com/smogon/pokemon-showdown/blob/master/sim/pokemon.ts#L2056) and [Thunder accuracy](https://github.com/smogon/pokemon-showdown/blob/master/data/moves.ts#L19406), inspected 2026-09-14. The pinned Gen 9 calc retains Solar Beam/Blade's weather power penalty and Sand/Snow defense boosts, whereas its Champions branch bypasses these with Mega Sol; damage projections follow the selected calc branch.
