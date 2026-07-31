# Frozen held-item mechanics matrix

Checked **2026-07-31** against Pokémon Showdown commit
[`71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa`](https://github.com/smogon/pokemon-showdown/tree/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa).
This note verifies the Wayfinder inventory; it is not a product contract.

## Result

- The researched candidate inventory contains exactly **88 distinct canonical Showdown item identities**.
- A later confirmed product decision removed Adamant Crystal, Lustrous Globe, and Griseous Core because their supported damage behavior duplicates the retained Orb counterparts while their distinct form behavior is out of scope. The current frozen inventory therefore contains **85** identities.
- The pinned `champions` mod resolves the original candidates as **44 standard** and **44 `Past`**; the current 85-item scope contains **44 standard** and **41 `Past`**. The standard half is exactly the map's M-B main scope.
- The public official Regulation M-B notice does **not** publish a per-item allowlist. It says that regulations govern held items and forbids duplicate held items; the maintenance notice only says that held items were added for M-B. Consequently, the per-item M-B column below is a **pinned Showdown executable proxy**, not an independently verifiable official allowlist.
- The inventory collapses to eight mechanics shapes: final damage, Base Power, battle stat, incoming damage, numeric accuracy, critical stage, identity-gated Base Power, and holder-relative weather visibility.
- Showdown uses fixed-point chained modifiers. Values commonly described as `1.1x`, `1.2x`, and `1.3x` are exactly `4505/4096`, `4915/4096`, and `5324/4096` in these hooks, and compose with Showdown's fixed-point rounding rather than floating-point multiplication ([modifier implementation](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle.ts#L2308-L2342)).

## Sources and legality method

Primary or executable sources used:

- [Official Regulation Set M-B notice](https://news.pokemon-home.com/en/page/776.html): M-B duration, Mega rule, and Item Clause; it contains no item list.
- [Official M-B maintenance completion notice](https://news.pokemon-home.com/en/page/775.html): states only that Pokémon and held items were added.
- [Showdown base item table](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts): canonical identities and item callbacks.
- [Champions item overrides](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/mods/champions/items.ts): inherited `isNonstandard` changes.
- [Champions M-B format](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/config/formats.ts#L312-L323) and [Flat Rules](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/mods/champions/rulesets.ts#L27-L33): the format selects the `champions` mod and applies `Obtainable` plus `Item Clause = 1`.
- [Critical-hit pipeline](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle-actions.ts#L1620-L1647): item stage changes are combined, clamped, then mapped to the generation's probability table.

For each frozen ID, legality was resolved as the `champions` override's `isNonstandard` when present, otherwise the base record's value. `null`/absent is shown as **Yes (proxy)**; `Past` as **No (proxy)**. The official pages cannot strengthen either result to official per-item confirmation.

## Shared unsupported effects

Unless a row says otherwise, the matrix records only calculator-relevant damage, stat, accuracy, critical, or weather behavior. Generic item presence, removal/swap, Knock Off, and Fling are outside this effect matrix. Several families have additional explicit exclusions:

- Resistance Berries: consumption, post-consumption state, Natural Gift, and generic Berry-eating interactions are unsupported. Per the map decision, N-hit may still be shown as if the Berry remains held, with a red-dot tooltip warning that real battles consume it.
- Plates: Arceus forme forcing, Judgment type selection, and Arceus-specific non-removability are unsupported.
- Choice items: move locking is unsupported.
- Form artifacts and masks: forced-form and non-removability rules are unsupported; the selected battle identity remains the calculator input.
- Utility Umbrella: non-damage weather consequences are unsupported unless a later spec decision explicitly adopts them.

## Mechanics matrix

### Direct damage, category, and attacking-stat items (7)

| Item / canonical ID | M-B | Holder and activation | Affected value | Exact change | Relevant unsupported effect | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Life Orb / `lifeorb` | Yes (proxy) | Any source using a damaging move | Source final move damage | `5324/4096` | After a non-Status move, recoil of `1/10` base max HP (subject to the simulator's surrounding events) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3400-L3416) |
| Expert Belt / `expertbelt` | Yes (proxy) | Any source; move's resolved `typeMod > 0` | Source final move damage | `4915/4096` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1897-L1910) |
| Light Ball / `lightball` | Yes (proxy) | Holder's base species is Pikachu (all Pikachu formes) | Holder Atk and SpA | `2x` each | Fling has paralysis metadata | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3417-L3439) |
| Muscle Band / `muscleband` | Yes (proxy) | Any source; Physical move | Move Base Power | `4505/4096` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4235-L4249) |
| Wise Glasses / `wiseglasses` | Yes (proxy) | Any source; Special move | Move Base Power | `4505/4096` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7750-L7764) |
| Choice Band / `choiceband` | No (proxy) | Any holder outside Dynamax | Holder Atk | `1.5x` | Choice lock; the source suppresses the stat boost during Dynamax | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L959-L982) |
| Choice Specs / `choicespecs` | No (proxy) | Any holder outside Dynamax | Holder SpA | `1.5x` | Choice lock; the source suppresses the stat boost during Dynamax | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1006-L1029) |

### Unrestricted type boosters (18)

Every row applies to any holder when the move's resolved type equals the listed type. It modifies **move Base Power** by exactly `4915/4096`. No identity check is present. Unsupported effects are Fling and non-battle uses.

| Item / canonical ID | Type | M-B | Source |
| --- | --- | --- | --- |
| Black Belt / `blackbelt` | Fighting | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L508-L522) |
| Black Glasses / `blackglasses` | Dark | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L523-L537) |
| Charcoal / `charcoal` | Fire | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L773-L787) |
| Dragon Fang / `dragonfang` | Dragon | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1482-L1496) |
| Fairy Feather / `fairyfeather` | Fairy | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1923-L1937) |
| Hard Stone / `hardstone` | Rock | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2770-L2784) |
| Magnet / `magnet` | Electric | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3685-L3699) |
| Metal Coat / `metalcoat` | Steel | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3957-L3971) |
| Miracle Seed / `miracleseed` | Grass | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4131-L4145) |
| Mystic Water / `mysticwater` | Water | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4250-L4264) |
| Never-Melt Ice / `nevermeltice` | Ice | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4292-L4306) |
| Poison Barb / `poisonbarb` | Poison | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4642-L4657) |
| Sharp Beak / `sharpbeak` | Flying | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5602-L5616) |
| Silk Scarf / `silkscarf` | Normal | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5710-L5724) |
| Silver Powder / `silverpowder` | Bug | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5725-L5739) |
| Soft Sand / `softsand` | Ground | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5853-L5867) |
| Spell Tag / `spelltag` | Ghost | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5898-L5912) |
| Twisted Spoon / `twistedspoon` | Psychic | Yes (proxy) | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7373-L7387) |

### Resistance Berries (18)

All rows belong to the **target/defender**. Except Chilan Berry, the Berry activates only when the incoming move has the listed type, resolved `typeMod > 0`, does not stop at an ordinary Substitute, and `eatItem()` succeeds. It then multiplies incoming damage by `0.5`. A move that bypasses Substitute (or infiltrates in Gen 6+) can trigger the Berry. Chilan has no super-effective predicate: any Normal move that reaches the holder can trigger it. Consumption and all subsequent-hit state are unsupported as described above.

| Item / canonical ID | Incoming type | M-B | Predicate difference | Source |
| --- | --- | --- | --- | --- |
| Babiri Berry / `babiriberry` | Steel | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L355-L378) |
| Charti Berry / `chartiberry` | Rock | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L812-L835) |
| Chilan Berry / `chilanberry` | Normal | Yes (proxy) | No super-effective requirement | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L898-L921) |
| Chople Berry / `chopleberry` | Fighting | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1030-L1053) |
| Coba Berry / `cobaberry` | Flying | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1109-L1132) |
| Colbur Berry / `colburberry` | Dark | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1133-L1156) |
| Haban Berry / `habanberry` | Dragon | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2746-L2769) |
| Kasib Berry / `kasibberry` | Ghost | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3125-L3148) |
| Kebia Berry / `kebiaberry` | Poison | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3149-L3172) |
| Occa Berry / `occaberry` | Fire | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4343-L4366) |
| Passho Berry / `passhoberry` | Water | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4445-L4468) |
| Payapa Berry / `payapaberry` | Psychic | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4469-L4492) |
| Rindo Berry / `rindoberry` | Grass | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5199-L5222) |
| Roseli Berry / `roseliberry` | Fairy | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5356-L5379) |
| Shuca Berry / `shucaberry` | Ground | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5686-L5709) |
| Tanga Berry / `tangaberry` | Bug | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L6218-L6241) |
| Wacan Berry / `wacanberry` | Electric | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7489-L7511) |
| Yache Berry / `yacheberry` | Ice | Yes (proxy) | Super-effective | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7765-L7788) |

### Accuracy and critical items (7)

Accuracy modifiers apply only when accuracy is numeric; they do not alter `true`/always-hit accuracy. Critical items change the **source user's critical stage**, after which the normal generation pipeline clamps and converts the combined stage to probability.

| Item / canonical ID | M-B | Holder eligibility and activation | Affected value | Exact change | Unsupported | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Bright Powder / `brightpowder` | Yes (proxy) | Any target holder; opponent uses numeric-accuracy move | Incoming move accuracy | `3686/4096` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L659-L673) |
| Wide Lens / `widelens` | Yes (proxy) | Any source holder; numeric-accuracy move | Source move accuracy | `4505/4096` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7709-L7723) |
| Scope Lens / `scopelens` | Yes (proxy) | Any source holder | Source critical stage | `+1` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5550-L5561) |
| Lax Incense / `laxincense` | No (proxy) | Any target holder; opponent uses numeric-accuracy move | Incoming move accuracy | `3686/4096` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3293-L3308) |
| Razor Claw / `razorclaw` | No (proxy) | Any source holder | Source critical stage | `+1` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5085-L5096) |
| Leek / `leek` | No (proxy) | Base species Farfetch'd (either forme) or Sirfetch'd | Source critical stage | `+2` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3318-L3333) |
| Lucky Punch / `luckypunch` | No (proxy) | Base species exactly Chansey | Source critical stage | `+2` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3517-L3532) |

### Plates and Incenses (22)

Every row applies to any source holder when the move's resolved type equals the listed type and modifies **move Base Power** by exactly `4915/4096`. All are No (proxy) for M-B. Plates additionally carry `onPlate`, forced Arceus forme, and Arceus-specific non-removability; those effects, Judgment type selection, Fling, and Incense breeding behavior are unsupported.

| Item / canonical ID | Type | Source |
| --- | --- | --- |
| Draco Plate / `dracoplate` | Dragon | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1450-L1469) |
| Dread Plate / `dreadplate` | Dark | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1572-L1591) |
| Earth Plate / `earthplate` | Ground | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1637-L1656) |
| Fist Plate / `fistplate` | Fighting | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2118-L2137) |
| Flame Plate / `flameplate` | Fire | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2153-L2172) |
| Icicle Plate / `icicleplate` | Ice | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2974-L2993) |
| Insect Plate / `insectplate` | Bug | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3026-L3045) |
| Iron Plate / `ironplate` | Steel | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3064-L3083) |
| Meadow Plate / `meadowplate` | Grass | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3841-L3860) |
| Mind Plate / `mindplate` | Psychic | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4111-L4130) |
| Pixie Plate / `pixieplate` | Fairy | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4612-L4631) |
| Sky Plate / `skyplate` | Flying | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5784-L5803) |
| Splash Plate / `splashplate` | Water | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5926-L5945) |
| Spooky Plate / `spookyplate` | Ghost | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5946-L5965) |
| Stone Plate / `stoneplate` | Rock | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L6130-L6149) |
| Toxic Plate / `toxicplate` | Poison | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L6353-L6372) |
| Zap Plate / `zapplate` | Electric | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7789-L7808) |
| Odd Incense / `oddincense` | Psychic | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L4367-L4382) |
| Rock Incense / `rockincense` | Rock | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5247-L5262) |
| Rose Incense / `roseincense` | Grass | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5340-L5355) |
| Sea Incense / `seaincense` | Water | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5586-L5601) |
| Wave Incense / `waveincense` | Water | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7576-L7591) |

### Identity-gated and defensive stats (5)

All are No (proxy) for M-B.

| Item / canonical ID | Holder eligibility | Affected value | Exact change | Relevant unsupported effect | Source |
| --- | --- | --- | --- | --- | --- |
| Thick Club / `thickclub` | Base species Cubone or Marowak, including Alolan Marowak | Holder Atk | `2x` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L6288-L6304) |
| Deep Sea Tooth / `deepseatooth` | Base species exactly Clamperl | Holder SpA | `2x` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1361-L1377) |
| Deep Sea Scale / `deepseascale` | Base species exactly Clamperl | Holder SpD | `2x` | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1344-L1360) |
| Assault Vest / `assaultvest` | Any holder | Holder SpD | `1.5x` | Disables Status moves (except the historical `mefirst` exception); Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L313-L333) |
| Eviolite / `eviolite` | Holder's base species has Showdown `nfe = true` | Holder Def and SpD | `1.5x` each | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1864-L1884) |

### Identity-gated type damage (7)

All are No (proxy) for M-B. Every successful row modifies **move Base Power** by exactly `4915/4096`. The executable activation gate is National Dex base-species number plus move type, not the `itemUser` metadata by itself.

| Item / canonical ID | Holder gate | Move types | Relevant unsupported effect | Source |
| --- | --- | --- | --- | --- |
| Adamant Orb / `adamantorb` | Dialga (`baseSpecies.num = 483`) | Steel or Dragon | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L95-L110) |
| Adamant Crystal / `adamantcrystal` | Dialga (`483`) | Steel or Dragon | Forces Dialga-Origin; non-removable when either holder or source is Dialga | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L75-L94) |
| Lustrous Orb / `lustrousorb` | Palkia (`484`) | Water or Dragon | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3612-L3627) |
| Lustrous Globe / `lustrousglobe` | Palkia (`484`) | Water or Dragon | Forces Palkia-Origin; non-removable when either holder or source is Palkia | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L3592-L3611) |
| Griseous Orb / `griseousorb` | Giratina (`487`) | Ghost or Dragon | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2676-L2691) |
| Griseous Core / `griseouscore` | Giratina (`487`) | Ghost or Dragon | Forces Giratina-Origin; non-removable when either holder or source is Giratina | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2656-L2675) |
| Soul Dew / `souldew` | Latias (`380`) or Latios (`381`) | Psychic or Dragon | Fling | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L5879-L5897) |

### Ogerpon masks (3)

All are No (proxy) for M-B. Each modifies **Base Power of every damaging move** by exactly `4915/4096` when the holder's base-species name starts with the mask's listed Ogerpon forme (thereby also covering its Tera identity in Showdown). Forced forme, Ogerpon-specific non-removability, Fling, and resulting ability/forme behavior are unsupported.

| Item / canonical ID | Holder gate | Source |
| --- | --- | --- |
| Cornerstone Mask / `cornerstonemask` | `Ogerpon-Cornerstone*` | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L1157-L1177) |
| Hearthflame Mask / `hearthflamemask` | `Ogerpon-Hearthflame*` | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L2804-L2824) |
| Wellspring Mask / `wellspringmask` | `Ogerpon-Wellspring*` | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7610-L7630) |

### Utility Umbrella (1)

| Item / canonical ID | M-B | Holder and activation | Affected value | Exact change | Relevant unsupported effects | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| Utility Umbrella / `utilityumbrella` | No (proxy) | Any holder while its item is active; only sun/rain and their strong variants are hidden from that holder's `effectiveWeather()` | Holder-relative weather context, not a standalone damage scalar | Returns neutral weather (`''`) for Sunny Day, Rain Dance, Desolate Land, or Primordial Sea. For ordinary weather damage, the callback queries the **defender**, so a defending holder suppresses rain's Water `1.5x`/Fire `0.5x` and sun's Fire `1.5x`/Water `0.5x`; it likewise suppresses the strong-weather Fire/Water boost. | Weather-dependent charge turns, Solar Beam/Blade weakening, Hydro Steam, move accuracy, healing, Abilities/status, Weather Ball typing/power, and Fling. Strong-weather move cancellation remains separate and does not consult `effectiveWeather()`. | [item](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts#L7436-L7464), [`effectiveWeather`](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/pokemon.ts#L2192-L2213), [weather damage](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/conditions.ts#L476-L617), [Solar Beam/Blade](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/moves.ts#L17220-L17286) |

## Consequences for the later spec

1. Treat M-B legality as a versioned source field with explicit provenance. The public official page cannot reproduce the item allowlist; do not label the 44-item Showdown result “officially verified.”
2. Preserve the exact Showdown modifier fractions and their calculation phase: Base Power, battle stat, final damage, accuracy, and incoming-damage hooks are not interchangeable under fixed-point rounding.
3. Resistance-Berry N-hit output is intentionally an approximation under the frozen scope. The spec needs the red-dot warning and must not imply consumption is simulated.
4. Utility Umbrella needs a holder-side decision, not a generic “ignore weather” boolean: Showdown's ordinary weather damage hook consults the defender, while move-specific hooks may consult the attacker.
