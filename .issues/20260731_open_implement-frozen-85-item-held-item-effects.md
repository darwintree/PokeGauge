---
# This section is managed by the CLI. Do not edit manually.
id: "eb3a6510-6d3e-4791-85a3-5b3429739fc6"
title: "Implement frozen 85-item Held-item effects"
status: "open"
priority: "high"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-31T13:06:00Z"
updated_at: "2026-07-31T13:50:00Z"
---
## Problem Statement

PokeLens currently exposes a small attacker-oriented Held item Track backed by synthetic string identities. Only Life Orb, Choice Band, Choice Specs, and 18 type boosters affect compilation; the defender Track reuses the attacker pool and treats every non-neutral defender item as inactive. This makes the Track insufficient for the frozen Held-item effect scope and prevents users from comparing common damage, defensive, accuracy, critical, and holder-relative Weather effects in one Matchup.

Users need Held item choices to change damage, hit probability, critical probability, and N-hit results with the same exact integer semantics as the rest of the current Pokémon Champions · VGC doubles model. They also need the calculator to disclose the two known partial-support boundaries that can make those outputs misleading: persistent Resistance Berry treatment across N hits and Utility Umbrella's deliberately narrow Weather coverage.

The implementation must preserve the existing Row product rule, Effect-equivalent scenario merge, Damage Conditions Card hierarchy, Move snapshot ownership, probability modes, identity locks, and saved-Scenario safety. It must not turn PokeLens into a full battle simulator or treat Showdown slugs and localized labels as persistent identities.

## Solution

Deliver the frozen whitelist of 85 real Held items as one coherent extension of the existing Held item Track and Scenario pipeline. Generate localized, sprite-backed item resources keyed by PokeAPI numeric id; statically separate ordinary attacker and defender candidate pools by supported effect direction; preserve `none` and identity-locked items; and compile the selected holder's active effect into the existing Base Power, battle-stat, final-damage, numeric-accuracy, critical-stage, or holder-relative Weather seam.

Every supported effect is compiled from the current Scenario into the existing item-agnostic damage and probability inputs. Effect-equivalent choices continue to merge on complete compiled calculation identity while retaining side-specific provenance. Partial-support warnings remain accessible red-dot tooltips on the Held item Track and never alter calculation identity, provenance, result ordering, or result-surface information.

Invalid restored item selections are not migrated: the saved Scenario is rejected as a whole and the app returns to the Matchup home. Resource or descriptor incompleteness fails delivery acceptance rather than silently shrinking the 85-item contract.

## User Stories

1. As a PokeLens user, I want every supported real Held item to have a stable identity, so that saved Matchups do not depend on translated names or third-party slugs.
2. As a PokeLens user, I want Held item names in my Supported locale, so that I can recognize choices without knowing their English names.
3. As a PokeLens user, I want every supported Held item to have a locally available sprite, so that the Track remains recognizable and does not depend on a mutable runtime image host.
4. As a PokeLens user, I want an explicit no-item choice, so that I can deliberately compare an item-equipped Scenario with no item.
5. As a PokeLens user, I want removing the last unlocked Held item selection to restore explicit no-item, so that the Track never accidentally produces zero rows.
6. As a PokeLens user, I want to select multiple attacker Held items, so that the Row product rule can compare their outcomes.
7. As a PokeLens user, I want to select multiple defender Held items, so that defensive alternatives participate in the same Scenario comparison.
8. As a PokeLens user, I want attacker and defender candidate pools separated by supported effect direction, so that an offensive-only item is not presented as an ordinary defender choice.
9. As a PokeLens user, I want identity- or Move-gated items to remain available when their gate is currently unmet, so that candidate visibility does not shift as I adjust the Matchup.
10. As a PokeLens user, I want an unmet supported gate to compile as inactive rather than unsupported, so that the result explains why the choice merged without claiming the effect is missing.
11. As a PokeLens user, I want Mega identities to retain their existing locked Mega Stone behavior, so that expanding the effect whitelist does not regress form selection.
12. As a PokeLens user, I want masked Ogerpon identities to lock their corresponding Mask, so that the selected Battle Pokémon identity and required Held item cannot contradict each other.
13. As a PokeLens user, I want choosing an item never to synthesize another Battle Pokémon identity, so that identity remains an explicit Matchup input.
14. As a PokeLens user, I want changing Battle Pokémon identity to rebuild that identity's default item state, so that stale form-specific selections do not leak between identities.
15. As a PokeLens user, I want Mega Rayquaza's existing item-preservation exception to keep working, so that this delivery does not change its current identity transition behavior.
16. As a PokeLens user, I want a type booster to affect only a Move whose resolved Type matches, so that edited and reviewed Move semantics remain authoritative.
17. As a PokeLens user, I want Muscle Band and Wise Glasses to follow the current Move side, so that their Base Power modifier applies only to the matching category.
18. As a PokeLens user, I want Choice Band and Choice Specs to modify the correct attacking stat, so that their integer phase differs correctly from a Base Power boost.
19. As a PokeLens user, I want Light Ball, Thick Club, and Deep Sea Tooth to respect holder identity, so that their large stat modifiers do not apply to unrelated Pokémon.
20. As a PokeLens user, I want Assault Vest, Eviolite, and Deep Sea Scale to modify the correct defensive stat, so that physical and special Matchups compile correctly.
21. As a PokeLens user, I want Eviolite eligibility evaluated per Battle Pokémon identity, so that forms with different evolution eligibility are not conflated.
22. As a PokeLens user, I want Life Orb and Expert Belt to apply in the final-damage phase, so that integer rounding matches the supported ruleset.
23. As a PokeLens user, I want a Resistance Berry to halve matching super-effective incoming damage, so that defensive item comparisons affect damage and KO outputs.
24. As a PokeLens user, I want Chilan Berry to work on matching Normal damage without requiring super effectiveness, so that its unique activation rule is preserved.
25. As a PokeLens user, I want Resistance Berry N-hit results to remain available with a clear persistence warning, so that I can use the calculator without mistaking the static approximation for consumption simulation.
26. As a PokeLens user, I want Wide Lens, Bright Powder, and Lax Incense to compose through exact numeric-accuracy rounding, so that hit probability is reproducible.
27. As a PokeLens user, I want semantic always-hit and unconfigured accuracy to bypass item completion, so that an item neither weakens a guaranteed hit nor invents missing Move data.
28. As a PokeLens user, I want Scope Lens, Razor Claw, Leek, and Lucky Punch to add critical stage without mutating my Move snapshot, so that the snapshot remains my intentional comparison unit.
29. As a PokeLens user, I want critical stage to saturate at `+3`, so that redundant item contributions do not create impossible probabilities.
30. As a PokeLens user, I want item-derived guaranteed critical hits to select the critical-only branch and interact with Stat stages and Screens correctly, so that damage and displayed conditions stay coherent.
31. As a PokeLens user, I want `Actual probability` to include supported item accuracy and critical effects, so that Atomic Damage Distribution and KO probabilities reflect them.
32. As a PokeLens user, I want `16 roll` mode to hide non-guaranteed probability effects while retaining guaranteed critical behavior, so that the existing probability-mode contract remains stable.
33. As a PokeLens user, I want defender-held Utility Umbrella to suppress ordinary sun/rain Fire/Water damage modification, so that supported Weather damage reflects the holder-relative rule.
34. As a PokeLens user, I want Utility Umbrella's unsupported Move-specific and accuracy Weather interactions disclosed on the Track, so that its result is not overclaimed.
35. As a PokeLens user, I want signature Orbs and Soul Dew to require both an eligible holder and matching resolved Move Type, so that their supported damage effect is not generalized.
36. As a PokeLens user, I want Ogerpon Masks to boost every damaging Move of the corresponding masked identity, so that the supported Mask effect participates in normal compilation.
37. As a PokeLens user, I want Held item effects to use my current editable Move snapshot power, so that editing a snapshot and selecting an item compose predictably.
38. As a PokeLens user, I want Held item choices to participate in the existing Row product rule with every other Track, so that combined comparisons do not need a separate item mode.
39. As a PokeLens user, I want calculation-equivalent item choices to merge, so that repeated rows do not obscure the comparison.
40. As a PokeLens user, I want merged rows to retain attacker and defender item provenance separately, so that I can tell which selected sources contributed.
41. As a PokeLens user, I want effective attacker and defender items on the corresponding identity lines, so that the Damage Conditions Card preserves its current hierarchy.
42. As a PokeLens user, I want inactive item sources in the existing folded conditions entry, so that useful provenance remains available without crowding the primary card.
43. As a PokeLens user, I want explicit no-item and defined neutral locked identities hidden from results, so that neutral configuration does not become visual noise.
44. As a PokeLens user, I want the formula tooltip's Held item row to show only effective attacker Base Power contributions, so that it does not flatten unrelated phases into a misleading scalar.
45. As a PokeLens user, I want partial-support warnings to stay on item options rather than result rows, so that warnings remain discoverable without changing the contracted result surface.
46. As a PokeLens user, I want equivalent normalized probabilities to merge deterministically, so that over-100 numeric accuracy does not create duplicate `100%` rows.
47. As a PokeLens user, I want result rows to remain grouped by Move snapshot creation order, so that adding items does not reorder my comparison unexpectedly.
48. As a returning PokeLens user, I want valid numeric Held item selections to restore with identical semantics, so that refreshing the app does not change my Matchup.
49. As a returning PokeLens user, I want an invalid legacy, external, or wrong-side item id to reject the saved Scenario as a whole, so that a partially restored Matchup cannot silently lie.
50. As a returning PokeLens user, I want unknown legacy added-type-boost visibility entries filtered, so that obsolete display preferences do not block an otherwise valid Matchup.
51. As a PokeLens user, I want items outside the frozen whitelist to receive no implied effect or warning semantics, so that absence is not confused with a supported no-op.
52. As a PokeLens user, I want the calculator to disclose only unsupported behavior that can mislead its promised outputs, so that generic battle mechanics do not create warning fatigue.

## Implementation Decisions

### 1. Scope and Non-goals

- The delivery covers exactly the frozen 85 real Held items in the inventory below, plus the existing application-owned `none`, Mega Stone, and Unknown Mega Stone behavior outside that count.
- Supported outputs are direct damage rolls, hit probability, critical probability, OHKO probability, and two-hit KO probability within the current Matchup model.
- The implementation remains a direct-damage calculator, not a battle-history simulator. Only represented current-Scenario inputs may activate an item effect.
- The current Pokémon Champions ruleset and VGC doubles Battle format remain fixed. The M-B field is a pinned Showdown executable proxy, not an official per-item allowlist.
- Usage-driven Held item defaults/ranking and a general Held item Track visual redesign are not part of this delivery.

### 2. Sources and Held-item Identity

- Persist every real Held item by PokeAPI numeric id. Showdown slugs are mechanics joins only; localized labels, PokeAPI names, and sprites are presentation data.
- Keep `none` as the application-owned Explicit no-item sentinel. It is not a PokeAPI item.
- Map Showdown `leek` explicitly to PokeAPI id `236`, whose PokeAPI name is `stick`.
- Resolve labels for the current Supported locale, fall back to English when missing, and emit the existing resource diagnostic. Do not add a handwritten item translation table or another locale fallback chain.
- Vendor every whitelist sprite from the pinned PokeAPI sprites source. Resolve both the flat default collection and the reviewed `gen8/` or `gen9/` paths; do not hotlink a mutable upstream branch at runtime.
- Pin mechanics to Pokémon Showdown `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa`.
- Pin damage-roll validation to `@smogon/calc 0.11.0`, corresponding to upstream commit `264a4ea846a0a0c7724e26c4671ff42e854b5ea1`.
- Generate Item and evolution resources from the repository-pinned PokeAPI gitlink `6629d1506a5ae659bb75d33e8e3ea143f2833642`. Retain the Item-source audit pointer `dbef1b8570119d49b06943bc8ba6f0288d5872d5` for the researched identity/sprite coverage.
- Pin vendored item sprites to PokeAPI sprites commit `8dfa3d97e953caaafaafd4963eff7621811af08e`.
- The accepted specification is normative. Closed Wayfinder decisions and discussion traces provide traceability; pinned Showdown, PokeAPI, and research artifacts provide evidence. A later conflict requires an explicit contract change rather than an implementation-local reinterpretation.

### 3. Frozen 85-item Inventory

Pool codes: `A` = ordinary attacker candidate; `D` = ordinary defender candidate; `LOCK` = only for the corresponding Identity-locked held item and never an ordinary candidate. `M-B` values are Showdown proxy classifications. Evidence codes are defined in Further Notes.

| PokeAPI id | Held item / Showdown join | Pool | M-B | Activation gate | Mechanics family / exact contribution | Warning / item-specific boundary | Evidence |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 247 | Life Orb / `lifeorb` | A | Yes | Any damaging Move | Final damage `5324/4096` | Recoil is out of scope; no warning | M/R/S |
| 245 | Expert Belt / `expertbelt` | A | Yes | Resolved effectiveness `> 1` | Final damage `4915/4096` | None | M/R/S |
| 213 | Light Ball / `lightball` | A | Yes | Holder `speciesId 25` | Battle stat · Attack and Special Attack `8192/4096` | None | M/R/S |
| 243 | Muscle Band / `muscleband` | A | Yes | Physical Move | Base Power `4505/4096` | None | M/R/S |
| 244 | Wise Glasses / `wiseglasses` | A | Yes | Special Move | Base Power `4505/4096` | None | M/R/S |
| 197 | Choice Band / `choiceband` | A | No | Physical Move | Battle stat · Attack `6144/4096` | Move locking is out of scope; no warning | M/R/S |
| 274 | Choice Specs / `choicespecs` | A | No | Special Move | Battle stat · Special Attack `6144/4096` | Move locking is out of scope; no warning | M/R/S |
| 218 | Black Belt / `blackbelt` | A | Yes | Fighting Move | Base Power `4915/4096` | None | M/R/S |
| 217 | Black Glasses / `blackglasses` | A | Yes | Dark Move | Base Power `4915/4096` | None | M/R/S |
| 226 | Charcoal / `charcoal` | A | Yes | Fire Move | Base Power `4915/4096` | None | M/R/S |
| 227 | Dragon Fang / `dragonfang` | A | Yes | Dragon Move | Base Power `4915/4096` | None | M/R/S |
| 2105 | Fairy Feather / `fairyfeather` | A | Yes | Fairy Move | Base Power `4915/4096` | Uses reviewed `gen9/` sprite path | M/R/S |
| 215 | Hard Stone / `hardstone` | A | Yes | Rock Move | Base Power `4915/4096` | None | M/R/S |
| 219 | Magnet / `magnet` | A | Yes | Electric Move | Base Power `4915/4096` | None | M/R/S |
| 210 | Metal Coat / `metalcoat` | A | Yes | Steel Move | Base Power `4915/4096` | None | M/R/S |
| 216 | Miracle Seed / `miracleseed` | A | Yes | Grass Move | Base Power `4915/4096` | None | M/R/S |
| 220 | Mystic Water / `mysticwater` | A | Yes | Water Move | Base Power `4915/4096` | None | M/R/S |
| 223 | Never-Melt Ice / `nevermeltice` | A | Yes | Ice Move | Base Power `4915/4096` | None | M/R/S |
| 222 | Poison Barb / `poisonbarb` | A | Yes | Poison Move | Base Power `4915/4096` | None | M/R/S |
| 221 | Sharp Beak / `sharpbeak` | A | Yes | Flying Move | Base Power `4915/4096` | None | M/R/S |
| 228 | Silk Scarf / `silkscarf` | A | Yes | Normal Move | Base Power `4915/4096` | None | M/R/S |
| 199 | Silver Powder / `silverpowder` | A | Yes | Bug Move | Base Power `4915/4096` | None | M/R/S |
| 214 | Soft Sand / `softsand` | A | Yes | Ground Move | Base Power `4915/4096` | None | M/R/S |
| 224 | Spell Tag / `spelltag` | A | Yes | Ghost Move | Base Power `4915/4096` | None | M/R/S |
| 225 | Twisted Spoon / `twistedspoon` | A | Yes | Psychic Move | Base Power `4915/4096` | None | M/R/S |
| 176 | Babiri Berry / `babiriberry` | D | Yes | Super-effective Steel damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 172 | Charti Berry / `chartiberry` | D | Yes | Super-effective Rock damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 177 | Chilan Berry / `chilanberry` | D | Yes | Any Normal damage | Incoming damage · final phase `2048/4096` | No super-effective gate; persistent N-hit warning | M/R/S |
| 166 | Chople Berry / `chopleberry` | D | Yes | Super-effective Fighting damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 169 | Coba Berry / `cobaberry` | D | Yes | Super-effective Flying damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 175 | Colbur Berry / `colburberry` | D | Yes | Super-effective Dark damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 174 | Haban Berry / `habanberry` | D | Yes | Super-effective Dragon damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 173 | Kasib Berry / `kasibberry` | D | Yes | Super-effective Ghost damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 167 | Kebia Berry / `kebiaberry` | D | Yes | Super-effective Poison damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 161 | Occa Berry / `occaberry` | D | Yes | Super-effective Fire damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 162 | Passho Berry / `passhoberry` | D | Yes | Super-effective Water damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 170 | Payapa Berry / `payapaberry` | D | Yes | Super-effective Psychic damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 164 | Rindo Berry / `rindoberry` | D | Yes | Super-effective Grass damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 723 | Roseli Berry / `roseliberry` | D | Yes | Super-effective Fairy damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 168 | Shuca Berry / `shucaberry` | D | Yes | Super-effective Ground damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 171 | Tanga Berry / `tangaberry` | D | Yes | Super-effective Bug damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 163 | Wacan Berry / `wacanberry` | D | Yes | Super-effective Electric damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 165 | Yache Berry / `yacheberry` | D | Yes | Super-effective Ice damage | Incoming damage · final phase `2048/4096` | Berry consumption unsupported; persistent N-hit warning | M/R/S |
| 190 | Bright Powder / `brightpowder` | D | Yes | Opponent uses numeric accuracy | Numeric accuracy · incoming `3686/4096` | None | M/R/S |
| 242 | Wide Lens / `widelens` | A | Yes | Current Move uses numeric accuracy | Numeric accuracy · outgoing `4505/4096` | None | M/R/S |
| 209 | Scope Lens / `scopelens` | A | Yes | Any attacker holder; source classification follows §6 after probability-mode compilation | Critical stage `+1` | None | M/R/S |
| 232 | Lax Incense / `laxincense` | D | No | Opponent uses numeric accuracy | Numeric accuracy · incoming `3686/4096` | None | M/R/S |
| 303 | Razor Claw / `razorclaw` | A | No | Any attacker holder; source classification follows §6 after probability-mode compilation | Critical stage `+1` | None | M/R/S |
| 236 | Leek (`stick`) / `leek` | A | No | Ordinary/Galar Farfetch'd or Sirfetch'd | Critical stage `+2` | Explicit PokeAPI alias; no warning | M/R/S |
| 233 | Lucky Punch / `luckypunch` | A | No | Chansey holder | Critical stage `+2` | None | M/R/S |
| 288 | Draco Plate / `dracoplate` | A | No | Dragon Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 289 | Dread Plate / `dreadplate` | A | No | Dark Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 282 | Earth Plate / `earthplate` | A | No | Ground Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 280 | Fist Plate / `fistplate` | A | No | Fighting Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 275 | Flame Plate / `flameplate` | A | No | Fire Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 279 | Icicle Plate / `icicleplate` | A | No | Ice Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 285 | Insect Plate / `insectplate` | A | No | Bug Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 290 | Iron Plate / `ironplate` | A | No | Steel Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 278 | Meadow Plate / `meadowplate` | A | No | Grass Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 284 | Mind Plate / `mindplate` | A | No | Psychic Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 684 | Pixie Plate / `pixieplate` | A | No | Fairy Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 283 | Sky Plate / `skyplate` | A | No | Flying Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 276 | Splash Plate / `splashplate` | A | No | Water Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 287 | Spooky Plate / `spookyplate` | A | No | Ghost Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 286 | Stone Plate / `stoneplate` | A | No | Rock Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 281 | Toxic Plate / `toxicplate` | A | No | Poison Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 277 | Zap Plate / `zapplate` | A | No | Electric Move | Base Power `4915/4096` | Form/Judgment behavior out of scope; no warning | M/R/S |
| 291 | Odd Incense / `oddincense` | A | No | Psychic Move | Base Power `4915/4096` | Breeding behavior out of scope; no warning | M/R/S |
| 292 | Rock Incense / `rockincense` | A | No | Rock Move | Base Power `4915/4096` | Breeding behavior out of scope; no warning | M/R/S |
| 295 | Rose Incense / `roseincense` | A | No | Grass Move | Base Power `4915/4096` | Breeding behavior out of scope; no warning | M/R/S |
| 231 | Sea Incense / `seaincense` | A | No | Water Move | Base Power `4915/4096` | Breeding behavior out of scope; no warning | M/R/S |
| 294 | Wave Incense / `waveincense` | A | No | Water Move | Base Power `4915/4096` | Breeding behavior out of scope; no warning | M/R/S |
| 235 | Thick Club / `thickclub` | A | No | Holder `speciesId 104` or `105` | Battle stat · Attack `8192/4096` | Includes Alolan Marowak; no warning | M/R/S |
| 203 | Deep Sea Tooth / `deepseatooth` | A | No | Holder `speciesId 366` | Battle stat · Special Attack `8192/4096` | None | M/R/S |
| 204 | Deep Sea Scale / `deepseascale` | D | No | Holder `speciesId 366` | Battle stat · Special Defense `8192/4096` | None | M/R/S |
| 683 | Assault Vest / `assaultvest` | D | No | Special incoming Move | Battle stat · Special Defense `6144/4096` | Status-Move restriction out of scope; no warning | M/R/S |
| 581 | Eviolite / `eviolite` | D | No | Generated per-identity eligibility | Battle stat · Defense and Special Defense `6144/4096` | Reviewed overrides required; no warning | M/R/E/S |
| 112 | Adamant Orb / `adamantorb` | A | No | Dialga `speciesId 483`; Steel or Dragon Move | Identity-gated Base Power `4915/4096` | Form forcing is not inferred; no warning | M/R/S |
| 113 | Lustrous Orb / `lustrousorb` | A | No | Palkia `speciesId 484`; Water or Dragon Move | Identity-gated Base Power `4915/4096` | Form forcing is not inferred; no warning | M/R/S |
| 442 | Griseous Orb / `griseousorb` | A | No | Giratina `speciesId 487`; Ghost or Dragon Move | Identity-gated Base Power `4915/4096` | Form forcing is not inferred; no warning | M/R/S |
| 202 | Soul Dew / `souldew` | A | No | Latias/Latios `speciesId 380/381`; Psychic or Dragon Move | Identity-gated Base Power `4915/4096` | None | M/R/S |
| 2108 | Cornerstone Mask / `cornerstonemask` | LOCK | No | Ogerpon-Cornerstone identity uses a damaging Move | Identity-gated Base Power `4915/4096` | `gen9/` sprite; Ability/form transitions out of scope; no item warning | M/R/S |
| 2107 | Hearthflame Mask / `hearthflamemask` | LOCK | No | Ogerpon-Hearthflame identity uses a damaging Move | Identity-gated Base Power `4915/4096` | `gen9/` sprite; Ability/form transitions out of scope; no item warning | M/R/S |
| 2106 | Wellspring Mask / `wellspringmask` | LOCK | No | Ogerpon-Wellspring identity uses a damaging Move | Identity-gated Base Power `4915/4096` | `gen9/` sprite; Ability/form transitions out of scope; no item warning | M/R/S |
| 1181 | Utility Umbrella / `utilityumbrella` | D | No | Defender holds it under ordinary sun/rain Fire/Water damage | Holder-relative Weather · suppress ordinary modifier | Only ordinary Weather damage supported; static warning; `gen8/` sprite | M/R/S |

The ordinary pools contain 58 attacker items and 24 defender items; the three Masks are lock-only. The inventory contains 44 `Yes` and 41 `No` M-B proxy rows. Adamant Crystal, Lustrous Globe, and Griseous Core are not inventory aliases and must not be added.

### 4. Held item Track and State Rules

- Build ordinary attacker and defender pools statically from the inventory's pool field. Do not hide an ordinary candidate because the current holder, Move, Type, category, effectiveness, probability mode, or later override leaves its effect inactive.
- An unlocked Track defaults to only `none`, always offers `none`, allows `none` alongside real items for Scenario comparison, and restores `none` when the last selection is removed.
- A locked Track exposes exactly the required Mega Stone, Unknown Mega Stone, or Ogerpon Mask. It offers no `none` and no ordinary candidates.
- Ogerpon Masks are lock-only on either side when the corresponding masked identity is selected. Their Base Power contribution is active only when that holder is the Matchup attacker using a damaging Move; an otherwise locked selection has no incoming defender effect.
- Changing Battle Pokémon identity rebuilds the target identity's default Track state. Do not preserve or restore the previous identity's selections, except for the existing Mega Rayquaza item-preservation path.
- Keep multi-select ordering deterministic by the catalog's pool order. Selection count continues to participate in the Row product rule.
- Reuse the existing accessible Track-option tooltip pattern for the red warning dot. Do not add a second warning surface or redesign the Track's information architecture.

### 5. Damage and Stat Compilation

- Keep the damage kernel item-agnostic. The Scenario compiler owns item lookup, holder/Move activation, source state, and folding active contributions into existing phase fields.
- Use `4096` as the neutral fixed-point modifier. Chain active modifiers within one phase as `floor((current × next + 2048) / 4096)` and apply the resulting chain once as `floor((value × modifier + 2047) / 4096)`.
- Preserve exact phase placement: type boosters, Plates, Incenses, retained signature Orbs, Soul Dew, and Masks use Base Power `4915`; Muscle Band and Wise Glasses use Base Power `4505`; Choice Band/Specs use the relevant Attack stat `6144`; Light Ball, Thick Club, and Deep Sea Tooth use the relevant Attack stat `8192`; Assault Vest and Eviolite use the relevant Defense stat `6144`; Deep Sea Scale uses Special Defense `8192`; Expert Belt uses final damage `4915`; Life Orb uses final damage `5324`; a triggered Resistance Berry uses final damage `2048`.
- Preserve the existing ordered formula path: Base Power → stage-aware Attack/Defense and their stat modifiers → integer core formula → spread → holder-relative Weather → Critical modifier → random roll → STAB → effectiveness → burn → final damage. Existing Terrain and Ability hooks remain at their already-contracted positions.
- Read current Scenario inputs, including the editable Move snapshot power, resolved Move Type/category/effectiveness, Battle Pokémon identities, stat endpoint, Stat stage, Weather, Screens, Abilities, and probability mode. Do not use template defaults after a snapshot exists.
- Stat-item modifiers remain on normal and critical branches. Critical hits continue to suppress only the already-contracted negative attacker Stat stage, positive defender Stat stage, and eligible Screen effect.
- Compile an unmet supported activation gate with neutral contribution and `inactive` source state. Use `neutral` only for `none` and defined neutral locked identities. No whitelist core effect is `unsupported`.
- Resistance Berries use matching incoming Type plus super effectiveness, except Chilan, which needs only Normal Type. Substitute, item consumption, prior state, and other battle history are not inputs.

### 6. Accuracy, Critical, Weather, and N-hit Rules

- Keep probability item effects in the Scenario compiler. The Atomic Damage Distribution receives only final hit probability, final conditional critical probability, and the compiled damage branches.
- Chain attacker Wide Lens `4505` and defender Bright Powder/Lax Incense `3686` in the single `ModifyAccuracy` phase and apply that completed chain once with the same half-down application rule. Accuracy/evasion stages are not exposed by the current Matchup model and remain neutral. Apply the existing Move/Weather accuracy override afterward; when present, it replaces the numeric result and makes an erased item contribution inactive.
- Semantic always-hit bypasses the numeric item chain. Unconfigured accuracy `0` remains unavailable. In `Actual probability`, use `min(1, finalAccuracy / 100)`.
- Derive total Critical stage as `min(3, snapshot stage + eligible item contribution)` without mutating the Move snapshot. Use the current `0 → 1/24`, `1 → 1/8`, `2 → 1/2`, `3 → 1` table.
- In `16 roll`, use hit probability `1` and random critical probability `0`; derived stage `3` still creates the guaranteed-critical branch with critical probability `1`. In `Actual probability`, compile the final hit and conditional critical probabilities.
- An Accuracy or Critical item is `effective` only when removing it changes a probability-mode-visible compiled result. In `Actual probability`, that means normalized hit probability, conditional Critical probability, or branch selection. In `16 roll`, Accuracy items and non-guaranteeing Critical contributions are `inactive`; a Critical item is `effective` only when its contribution makes the derived total stage reach `+3` and selects the guaranteed-critical branch. Contributions erased by normalization, stage capping, a later accuracy override, or holder-identity failure are `inactive`.
- Resistance Berry OHKO and two-hit outputs reuse the same Berry-modified Atomic Damage Distribution for every hit. The Track warning must state that consumption is not modeled and N-hit treats the Berry as persistently held.
- Defender-held Utility Umbrella suppresses only ordinary sun/rain Fire/Water damage modification for that holder. It does not contribute a scalar and does not suppress Move-specific Weather power/type, accuracy, charge turns, healing, Abilities, status, or strong-weather cancellation. Its warning must state this supported boundary.

### 7. Identity Gates and Locked Items

- Evaluate every gate against the selected current Battle Pokémon identity or its recorded base `speciesId`; never use a localized label or the template that originally produced the Scenario.
- Generate one Eviolite eligibility boolean per Battle Pokémon identity. A default identity is eligible when it has an outgoing evolution without `base_form_id`; a non-default identity is eligible only when an outgoing evolution names that Pokémon numeric id as `base_form_id`.
- Add positive Eviolite overrides for Pumpkaboo-Small `10027`, Pumpkaboo-Large `10028`, Pumpkaboo-Super `10029`, and Gimmighoul-Roaming `10263`. Runtime compilation reads the generated boolean and does not traverse evolution chains.
- Use the exact holder gates in the inventory. All Pikachu identities share `speciesId 25`; Thick Club uses `104/105`; Deep Sea items use `366`; signature Orbs and Soul Dew use `483`, `484`, `487`, and `380/381`; Leek covers ordinary/Galar Farfetch'd and Sirfetch'd; Lucky Punch covers Chansey.
- Ogerpon-Wellspring, Ogerpon-Hearthflame, and Ogerpon-Cornerstone each lock only their corresponding Mask. The selected identity already supplies Type, stats, and Ability relations; the item does not force a form.
- Preserve existing Mega Stone and Unknown Mega Stone rules. The three Masks join the generic locked-item shape but do not join ordinary candidate pools.

### 8. Scenario Merge, Provenance, and Result Display

- Continue generating raw Scenarios through the Row product rule, including both item Tracks, then compile each Scenario before grouping.
- Calculation identity remains the serialized Move snapshot id plus complete compiled damage, probability, and KO inputs. Raw attacker/defender item ids, provenance, warning metadata, tooltip mechanics, and final formatted numbers remain outside the key.
- Aggregate `held-item` and `defender-held-item` provenance separately into existing `effective`, `inactive`, `unsupported`, and `neutral` arrays, deduplicated in first-encountered Track order. Do not retain raw Scenario tuples or run a generic remove-and-recompile counterfactual pass.
- Keep result rows grouped by Move snapshot creation order. Group-internal order remains intentionally implementation-flexible and follows first encounter of each calculation identity; do not add item ranking, label sorting, or damage sorting.
- Show effective items on the corresponding attacker or defender identity line. Put inactive and unsupported sources in the existing folded other-conditions entry. Hide `none`, Unknown Mega Stone, and other defined neutral locked identities.
- Partial-support metadata never enters calculation identity, source state, provenance, ordering, Damage Conditions Card, or another result surface.
- The formula tooltip's Held item row lists only effective attacker items contributing to Base Power and shows that phase's chained modifier. Attack-stat, final-damage, accuracy, Critical-stage, and defender-held effects do not enter that row.

### 9. Partial-support, Error, and Compatibility Rules

- The static partial-support set is exactly the 18 Resistance Berries plus Utility Umbrella. Warnings are grouped by limitation category rather than generated per Scenario.
- Do not warn for Life Orb recoil, Choice locking, Plates/Judgment/form behavior, Knock Off, Fling, generic removal/swap, Mask form/Ability effects, or another omitted rule that cannot mislead the calculator outputs promised by this delivery.
- Items outside the frozen whitelist receive no new effect, compatibility, candidate, or warning semantics.
- Delivery acceptance fails if the 85-row inventory is incomplete or duplicated, a PokeAPI/Showdown join is broken, an effect descriptor is invalid, a locale resource lacks both target and English resolution, or a vendored sprite is absent. Whether generation, build, or tests enforce a particular check is an implementation-plan choice.
- If a target locale label is missing but English exists, use English and record the existing resource diagnostic.
- Reject a saved Scenario as a whole when it contains a legacy synthetic item id, an id outside the appropriate whitelist pool, or an id restored on the wrong side; return to the Matchup home. Do not migrate these selections.
- Filter unknown entries in the old added-type-boost visibility store. Preserve valid existing Mega Stone locks and valid numeric whitelist selections.

### 10. Normative Examples and Acceptance Matrices

The inventory above is exhaustive identity coverage. The behavior matrix below is representative mechanics coverage; mechanically identical rows do not need 85 duplicated numeric fixtures.

Shared fixtures make every matrix row complete without repeating unchanged inputs:

- **F0 — Water damage:** level-50 VGC doubles Matchup; attacker Crawdaunt `342`, defender Incineroar `727`; one editable Crabhammer `152` Move snapshot (`power 100`, numeric accuracy `90`, Critical stage `0`, not spread); actual Attack `172`; defender `HP 202 / Defense 156`; both Stat stages `0`; neutral Abilities; no Weather, Terrain, or Screen; `Actual probability`; both items `none`. The neutral compiled branches use Base Power/Attack/Defense/spread/Weather/STAB/effectiveness/final modifiers `4096/4096/4096/4096/4096/6144/8192/4096`, with Critical modifier `4096` normal and `6144` critical. Baseline normal rolls are `[126,128,128,132,132,134,134,138,138,140,140,144,144,146,146,150]`; Critical rolls are `[188,192,194,198,198,200,204,206,206,210,212,216,216,218,222,224]`; OHKO is `0.0234375`; two-hit KO is `0.8146875`.
- **F1 — guaranteed Critical plus Screen:** level-50 Sirfetch'd `865` into Snorlax `143`; Close Combat `370` snapshot (`power 120`, accuracy `100`, Critical stage `+1`, not spread); Attack `187`; defender `HP 267 / Defense 128`; neutral Stat stages/Abilities/Weather/Terrain; Reflect; Leek `236`; `16 roll`. Leek must derive stage `+3`, remove the normal branch, and suppress Reflect for the Critical branch.
- **F2 — later accuracy override:** Crawdaunt `342` into Incineroar `727`; Thunder `87` snapshot (`power 110`, numeric accuracy `70`, Critical stage `0`, not spread); Special Attack `142`; defender `HP 202 / Special Defense 156`; neutral Stat stages/Abilities/Terrain/Screen; rain; attacker Wide Lens `242`; defender Bright Powder `190`; `Actual probability`. Rain's existing always-hit override runs after `ModifyAccuracy`.
- **F3 — Deep Sea Scale:** level-50 Palkia `484` using Thunder `87` edited to `power 100`, numeric accuracy `90`, Critical stage `0`, not spread; Special Attack `172`; defender Clamperl `366`, `HP 142 / Special Defense 117`, Rattled, Deep Sea Scale `204`; neutral stages/Weather/Terrain/Screen; `Actual probability`.
- **F4 — Eviolite:** level-50 Crawdaunt `342` using the F0 Crabhammer snapshot with Attack `172`; defender Rhydon `112`, `HP 212 / Defense 189`, neutral Ability, Eviolite `581`; neutral stages/Weather/Terrain/Screen; `Actual probability`.
- **K0 — exact-half kernel boundary:** a direct normal-branch kernel input with `power 225`, Attack `100`, Defense `100`, HP `200`, and every modifier neutral except the tested final modifier. This narrow seam exists only to pin integer application rounding.

Every row below uses the named fixture plus its stated delta. `N/A` means that output is deliberately not part of that row's acceptance because another named row owns it.

| Case | Covered inventory rows / contract rule | Deterministic fixture delta + probability mode | Expected compiled phases / probabilities / branches | Expected damage / KO output | Expected source / merge / order / display / warning | Oracle |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Type booster active/inactive | All 18 unrestricted boosters; §3, §5, §8 | F0; compare Mystic Water `220` with Charcoal `226`; `Actual probability` | Mystic Water Base Power `4915`; Charcoal `4096`; probabilities remain `0.9` and `1/24` | Mystic normal `[152,152,156,156,158,162,162,164,164,168,170,170,174,174,176,180]`; Critical `[228,230,234,236,240,242,242,246,248,252,254,258,260,264,266,270]`; OHKO `0.0375`; two-hit `0.8175`. Charcoal uses F0 baseline output | Mystic Water `effective`; Charcoal `inactive`; distinct compiled inputs do not merge | Showdown phase evidence + `@smogon/calc` rolls + pipeline contract |
| Choice battle stat | Choice Band `197`, Choice Specs `274`; §3, §5 | F0 + Choice Band; `Actual probability` | Attack modifier `6144` on normal and Critical branches; Base Power/final remain `4096` | Normal `[186,188,192,194,194,198,200,204,204,206,210,212,212,216,218,222]`; Critical `[282,284,288,290,294,296,302,306,308,312,314,318,320,324,326,332]`; OHKO `0.52265625`; two-hit `0.91453125` | Attacker item `effective` on identity line; absent from formula-tooltip Held item row | `@smogon/calc` rolls + result contract |
| Assault Vest and Eviolite | Assault Vest `683`, Eviolite `581`; §3, §5, §7 | F4 exactly for Eviolite; for Assault Vest use F3 with Assault Vest instead of Deep Sea Scale; negative deltas use Rhyperior `464` for Eviolite or a Physical Move for Assault Vest; `Actual probability` | Eligible Eviolite applies Defense modifier `6144`; eligible Assault Vest applies Special Defense modifier `6144`; failed identity/category gate uses `4096` | Eviolite normal `[136,144,144,144,144,148,148,148,156,156,156,156,160,160,160,168]`; Critical `[208,216,216,216,220,220,228,228,232,232,232,240,240,244,244,252]`; OHKO `0.03515625`; two-hit `0.81703125`. Assault Vest normal `[76,76,78,78,80,80,80,82,82,84,84,86,86,88,88,90]`; Critical `[112,114,116,116,118,120,120,122,124,124,126,128,128,130,132,134]`; OHKO `0`; two-hit `0.81` | Eligible item `effective`; wrong category/identity `inactive` and may merge with `none` | `@smogon/calc` rolls + generated Eviolite contract |
| Deep Sea Scale | Deep Sea Scale `204`; §3, §5, §7 | F3 exactly; negative deltas use a Physical Move or non-Clamperl holder | Eligible Special branch uses Special Defense modifier `8192`; failed category/identity gate uses `4096` | Normal `[56,58,58,58,60,60,60,62,62,62,64,64,64,66,66,68]`; Critical `[86,86,88,88,90,90,92,92,94,94,96,96,98,98,100,102]`; OHKO `0`; two-hit `0.06609375` | Eligible item `effective`; wrong category/identity `inactive` | `@smogon/calc` rolls + compiler gate contract |
| Life Orb plus matching Berry | Life Orb `247`; all 18 Berries; §5, §6 | F0 + Life Orb + Passho Berry `162`; `Actual probability` | Final chain `chain(5324,2048)=2662`; both branches use `2662` | Normal `[82,83,83,86,86,87,87,90,90,91,91,94,94,95,95,97]`; Critical `[122,125,126,129,129,130,133,134,134,136,138,140,140,142,144,146]`; OHKO `0`; two-hit `0.06609375` | Attacker and defender items `effective`; Berry warning Track-only | `@smogon/calc` phase oracle + fixed-point evidence + ADD contract |
| Expert Belt effectiveness gate | Expert Belt `245`; §3, §5 | F0 is positive; negative delta changes defender identity to Corviknight `823` with neutral Ability and explicit `HP 202 / Defense 156`, making Water neutral; `Actual probability` | Positive final `4915`; negative final `4096` | Positive normal `[151,154,154,158,158,161,161,166,166,168,168,173,173,175,175,180]`; Critical `[226,230,233,238,238,240,245,247,247,252,254,259,259,262,266,269]`; OHKO `0.0375`; two-hit `0.8175`. Negative normal `[63,64,64,66,66,67,67,69,69,70,70,72,72,73,73,75]`; Critical `[94,96,97,99,99,100,102,103,103,105,106,108,108,109,111,112]`; OHKO `0`; two-hit `0.0010546875` | Positive `effective`; negative `inactive` | `@smogon/calc` rolls + compiler gate contract |
| Exact-half application | All fixed-point families; §5 rounding | K0; compare final `4096` with Berry final `2048`; probability/KO mode N/A | Neutral rolls before Berry `[85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,101]`; applying `2048` yields `[42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,50]`; exact `101 × 0.5` rounds down to `50` | Damage arrays as compiled; KO `N/A` | Display/provenance `N/A`; this is the one intentionally narrow kernel boundary | Fixed-point formula + kernel oracle |
| Chilan exception | Chilan Berry `177`; §3, §5, §6 | F0 delta: Tackle `33`, Normal, `power 40`, accuracy `100`; defender Chilan; neutral effectiveness; `16 roll` | Final modifier `2048` without a super-effective gate | Damage/KO `N/A`; exact Berry application owned by exact-half and Passho rows | Chilan `effective`; Berry warning present | Showdown gate evidence + pipeline contract |
| Persistent Berry N-hit | All 18 Berries; §6, §9 | F0 + Passho Berry only; `Actual probability` | Final modifier `2048`; the same ADD is convolved twice | Normal `[63,64,64,66,66,67,67,69,69,70,70,72,72,73,73,75]`; Critical `[94,96,97,99,99,100,102,103,103,105,106,108,108,109,111,112]`; OHKO `0`; two-hit `0.0010546875` | Warning states consumption is unmodeled and N-hit treats the Berry as persistently held | Damage-distribution contract; not a Showdown consumption oracle |
| Numeric accuracy chain | Wide Lens `242`, Bright Powder `190`, Lax Incense `232`; §6 | F0 + Wide Lens + Bright Powder; `Actual probability` | Chain `4054`; apply to `90` gives `89`; hit probability `0.89`; Critical probability `1/24` | Damage/KO `N/A`; this row accepts probability compilation | Both items `effective` on their respective sides | Pinned Showdown `ModifyAccuracy` semantics |
| Accuracy normalization | Wide Lens `242`; §6, §8 | F0 delta accuracy `100` + Wide Lens; `Actual probability` | Internal numeric accuracy `110`; normalized hit probability `1` | Damage/KO `N/A` | Wide Lens `inactive` because removing it leaves probability `1`; merges with no-item `100%` result | Pinned Showdown semantics + merge contract |
| Accuracy override erases items | Wide Lens `242`, Bright Powder `190`; §6 | F2 exactly; `Actual probability` | Item chain occurs, then rain override returns always-hit; hit probability `1` | Damage/KO `N/A` | Both item contributions `inactive`; Weather provenance retained by existing contract | Pinned Showdown event order + compiler contract |
| Always-hit and unconfigured accuracy | All Accuracy items; §6 | F0 delta semantic always-hit with Wide Lens; separate delta accuracy `0`; both modes | Always-hit bypasses chain; accuracy `0` remains unavailable | Damage/KO `N/A` | Wide Lens `inactive`; unconfigured snapshot emits no result row | Compiler contract |
| Critical identity, cap, and Screen | Leek `236`, Lucky Punch `233`; §6, §7 | F1 exactly; negative deltas use ineligible Garchomp `445` and already-capped snapshot `+3`; `16 roll` | Eligible Leek makes total `+3`, removes normal branch, Critical probability `1`, ignores Reflect; ineligible/redundant contribution inactive | Critical rolls `[300,302,306,308,314,318,320,324,326,330,336,338,342,344,348,354]`; OHKO `1`; two-hit `1` | Eligible Leek `effective`; Reflect `inactive`; no formula-tooltip item row | Pinned Showdown stage semantics + `@smogon/calc` Critical rolls + pipeline contract |
| Probability modes | Scope Lens `209`, Razor Claw `303`; §6 | F0 + Scope Lens; compare `Actual probability` and `16 roll` | Actual: total `+1`, Critical probability `1/8`, source effective. `16 roll`: Critical probability `0`, source inactive. Snapshot `+2` + Scope Lens reaches `+3`, removes the normal branch, and makes the source effective in both modes | Actual OHKO `0.0703125`, two-hit `0.8240625`; `16 roll` non-guaranteed OHKO `0`, two-hit `1`. Guaranteed F0 branch uses Critical rolls `[188,192,194,198,198,200,204,206,206,210,212,216,216,218,222,224]`; in `16 roll`, OHKO `0.625`, two-hit `1` | Mode-visible source-state rule enforced | Probability and ADD contracts |
| Utility Umbrella | Utility Umbrella `1181`; §6, §9 | F0 + rain; compare defender Umbrella vs `none`; `Actual probability`; unaffected negative delta uses Ground Move with same scalar fixture | Without Umbrella rain Weather modifier `6144`; with Umbrella `4096`; unaffected Move stays at its Weather contract value | Rain without Umbrella normal `[188,192,194,198,198,200,204,206,206,210,212,216,216,218,222,224]`, Critical `[284,288,290,294,296,300,302,308,312,314,318,320,324,326,330,336]`; Umbrella returns F0 baseline rolls/OHKO/two-hit | Umbrella effective only for affected result; limitation warning Track-only | Showdown holder-relative Weather evidence + `@smogon/calc` rolls |
| Signature Orb double gate | Adamant Orb `112`, Lustrous Orb `113`, Griseous Orb `442`, Soul Dew `202`; §3, §7 | Hold F0 calculation inputs fixed, use Palkia `484` + Lustrous Orb + Water Move as positive; use Garchomp `445` or Ground Move as negative; `Actual probability` | Positive Base Power `4915`; either failed gate gives `4096` | Positive uses the type-booster roll/KO oracle above; negative uses the corresponding neutral fixture | Positive `effective`; negative `inactive`; item never synthesizes identity | Showdown gate evidence + pipeline contract |
| Mask lock and reset | Masks `2106/2107/2108`; §4, §7 | Hold F0 scalar inputs fixed; attacker Ogerpon-Wellspring `10273` + Wellspring Mask; then change attacker identity to `445`; `Actual probability` | Mask Base Power `4915` while locked holder attacks; identity change rebuilds item defaults | Positive uses the type-booster roll/KO oracle; post-change damage `N/A` | Only Wellspring Mask visible, no `none`, no item warning; after change no Mask selection survives | Catalog/state + pipeline contract |
| Effect-equivalent merge and ordering | All inventory rows; §8 | F0; attacker selections in order `[none, Charcoal 226, Mystic Water 220, Splash Plate 276]`; defender `[none, Utility Umbrella 1181]`; no Weather; `Actual probability` | Eight raw Scenarios produce two calculation identities: F0 baseline and Base Power `4915` | Baseline row uses F0 output; boosted row uses type-booster output | Baseline attacker provenance `neutral:[none], inactive:[226]`; boosted `effective:[220,276]`; both defender sets `neutral:[none], inactive:[1181]`; rows remain in first-encountered order; warning absent from results | Pipeline, provenance, ordering, and result-card contracts |
| Formula tooltip | Every Base Power family versus all other families; §8 | Use the boosted merge row above; compare Choice Band, Life Orb, Wide Lens, and defender item F0 deltas; `Actual probability` | Only Base Power row supplies tooltip item modifier `4915` | Damage/KO `N/A`; owned by family rows | Tooltip lists effective Mystic Water and Splash Plate sources with one phase modifier; other item families add no Held item tooltip row | Result tooltip contract |
| Invalid restoration | All pools and locks; §4, §9 | Saved F0 state with, separately, legacy `type-boost-water`, whitelist-external `1659`, attacker-only `247` on defender side, or wrong locked item; separate added-visibility array contains unknown id; probability mode unchanged | Scenario validation fails as a whole for each invalid selection; unknown visibility id is filtered | Damage/KO `N/A` because invalid Scenario never runs | App returns to Matchup home; valid numeric ids and Mega locks still round-trip | Storage validation contract |

The specification is complete only when all 85 inventory rows remain unique, every closed Wayfinder decision and linked discussion trace has been audited line by line, every representative case has deterministic fixture values and expected external behavior, and no product-behavior `TBD` remains. Intentionally flexible behavior must be named as flexible.

## Testing Decisions

- Prefer the existing end-to-end Scenario pipeline seam: construct a Matchup catalog plus Track state, run the Row product through compilation, damage/probability calculation, Effect-equivalent scenario merge, provenance, and result summaries, then assert externally observable rows. This is the primary test seam confirmed by the Wayfinder decisions.
- Use one narrower resource-generation seam to assert exactly 85 unique numeric ids, the `44/41` M-B proxy split, the `58/24/3` pool split, explicit Showdown joins, localized-name fallback behavior, 85 vendored sprites, valid descriptors, and generated Eviolite eligibility/overrides.
- Use direct damage-kernel oracle checks only where phase placement and integer rounding require exact roll arrays. Compare supported normal and critical arrays with `@smogon/calc`; do not make the runtime depend on that package's resource names.
- Use pinned Showdown semantics as the accuracy and Critical-stage oracle, because `@smogon/calc` does not cover the full event/probability chain. Assert final numeric accuracy, normalized probability, total Critical stage, branch selection, and source state.
- Use the existing damage-distribution seam for Resistance Berry OHKO/two-hit behavior and for Actual-probability composition. Tests must assert the current repeated-ADD approximation rather than simulate consumption.
- Use thin component tests for locked Track behavior, explicit no-item fallback, static red-dot tooltip content and accessibility, and the absence of warning metadata from result surfaces.
- Use the existing saved-Scenario seam for valid numeric identity round trips, wrong-side/external/legacy rejection, lock validation, and unknown added-visibility filtering.
- Reuse prior-art patterns from the repository's scenario compiler tests, cross-mechanism pipeline tests, damage-kernel oracle tests, Held item Track tests, Damage Conditions Card tests, and Scenario storage tests.
- Tests assert contracts, not descriptor layout, helper names, internal loop structure, or a particular generation/build enforcement tool.
- Do not duplicate a full numeric damage case for every mechanically identical item. Exhaustive inventory tests prove identity/metadata coverage; the behavior matrix proves each mechanics family, negative gate, probability mode, merge state, warning, and cross-mechanism edge.
- The final implementation must pass the repository test, lint, build, and performance checks. Because the Track and warning UI change, complete the required `design-taste-frontend` review-and-correct pass before delivery.

## Out of Scope

- Held items outside the frozen 85-item whitelist, including Adamant Crystal, Lustrous Globe, and Griseous Core.
- Champions usage-driven Held item defaults, ranking, or legality claims.
- A general Held item Track visual redesign or any change to the contracted result-surface information hierarchy.
- Berry consumption, item removal/swap, Knock Off, Fling, Natural Gift, Recycle, Harvest, or other battle-history behavior.
- Life Orb recoil, Choice-item Move locking, Assault Vest Status-Move restriction, Plate/Judgment form behavior, Mask form transitions, Terastallization, Embody Aspect, and unsupported Ability effects.
- Speed/order mechanics, survival items, priority, move-specific item mechanics, grounding/immunity-changing items, indirect damage, healing, or inter-turn state.
- Utility Umbrella effects beyond ordinary holder-relative sun/rain Fire/Water damage modification.
- Runtime network fetching or hotlinking for item labels, mechanics, or sprites.
- Migration of invalid legacy item selections or historical aliases.
- CAP expansion, future ruleset refreshes, and independently claiming an official M-B per-item allowlist.

## Further Notes

- Wayfinder source: [[20260731_open_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]].
- Acceptance contract: [[archive/20260731_closed_decide-held-item-spec-acceptance-contract|Decide held-item spec acceptance contract]].
- `M`: [Frozen held-item mechanics matrix](../docs/research/2026-07-31-frozen-held-item-mechanics-matrix.md).
- `R`: [Held-item modifier phases and rounding](../docs/research/2026-07-31-held-item-modifier-phases-and-rounding.md).
- `E`: [PokeAPI Eviolite eligibility](../docs/research/2026-07-31-pokeapi-eviolite-eligibility.md).
- `S`: [PokeAPI Held-item sprite coverage](../docs/research/2026-07-31-pokeapi-held-item-sprite-coverage.md).
- Discussion trace: [Held-item spec acceptance contract](../docs/traces/discussion/2026-07-31-held-item-spec-acceptance-contract.md).
- This issue is the authoritative `to-spec` publication selected by the user after Wayfinder. It replaces only the previously anticipated `docs/spec/held-item-effects.md` publication path; all substantive Wayfinder decisions and acceptance obligations remain unchanged.
- The earlier [[20260731_open_implement-defender-held-item-effects|Implement defender held-item effects]] issue is covered by this unified attacker-and-defender contract; tracker cleanup of that issue is separate from this publication.
- The AFK implementation must use `implementation-with-traces` only for implementation choices the contract genuinely leaves unresolved.

## Parent issue

[[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]]
