# Champions ability damage-calc relevance and first freeze

Checked on **2026-08-05**. Planning research only: classifies the **200 current Champions abilities** from [Champions ability inventory and priority](./2026-07-30-champions-ability-inventory-and-priority.md) by damage-calculator relevance and proposes a first implementation freeze. This note does **not** change product code, issues, or specs.

## Executive result

| Bucket | Count |
| --- | ---: |
| **A_direct_damage** | **59** |
| **B_scenario_state** | **28** |
| **C_needs_input_contract** | **27** |
| **D_non_damage_calc** | **86** |
| **Total (Champions 200)** | **200** |

- **Proposed first freeze size: 58 abilities** (all **A_direct_damage** except **Mold Breaker**, which stays A but is deferred from the freeze for cross-cutting ability-suppression product work).
- **Freeze criterion (one line):** ordinary-hit damage / accuracy / crit / type-effectiveness / STAB / battle-stat hooks that compile from **existing Scenario seams** (Move snapshot, Ability tracks, Held Item tracks, Weather / Terrain / Screen tracks, Stat / Stage tracks, species types) without inventing battle-history or new first-class inputs — mirroring the held-item frozen-85 ordinary-hit scope in [frozen held-item mechanics matrix](./2026-07-31-frozen-held-item-mechanics-matrix.md).
- **Adaptability** is in the freeze as the already-done baseline.
- High-usage abilities such as **Prankster, Intimidate, Hospitality, Rough Skin, Drought/Drizzle, Armor Tail, Unburden, Friend Guard** are deliberately **outside** the freeze (battle control, scenario-state setters, or missing inputs).

## Sources and provenance

### Reused inventory (do not re-fetch unless verifying)

- [docs/research/2026-07-30-champions-ability-inventory-and-priority.md](./2026-07-30-champions-ability-inventory-and-priority.md): the **200** Champions ability names, PokeAPI identity join, and June 2026 Showdown `gen9championsvgc2026regmb-0` usage proxy ranks/scores.
- Parent issue [`.issues/20260715_open_implement-pokemon-ability-effects.md`](../../.issues/20260715_open_implement-pokemon-ability-effects.md): 313-ability checklist; Adaptability implemented; Run Away / Honey Gather / Ball Fetch = N/A (outside the 200); deferred constraints (no full battle simulator; history abilities need a minimal input contract first; Mega post-Mega fixed abilities; unimplemented ≠ judged inactive).

### Showdown mechanics (pinned)

- Pokémon Showdown commit [`71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa`](https://github.com/smogon/pokemon-showdown/tree/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa) — same pin as the held-item freeze note.
- Ability callbacks: [`data/abilities.ts`](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/abilities.ts) (fetched once for this note).
- Champions mod overrides: [`data/mods/champions/abilities.ts`](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/mods/champions/abilities.ts) (small inherit patches; Champions-era identities live in base `abilities.ts` as `isNonstandard: "Future"`).

### Local calculator / calc library

- Vendored **`@smogon/calc@0.11.0`** ability damage hooks: `node_modules/@smogon/calc/src/mechanics/gen789.ts` and `.../mechanics/util.ts` (primary calculator-shaped reading of Gen 9 ability modifiers).
- Repo seams: `src/lib/damage-calculation/scenario-compiler.ts` (Adaptability → `stabModifier` 8192; unsupported abilities → `"unsupported"` source state, never `"inactive"` unless Adaptability off-STAB), `src/lib/ability/index.ts` (`ADAPTABILITY_ABILITY_ID = 91`), `src/features/scenario-explorer/tracks/common/ability-track.tsx` (red-dot “效果暂未支持”), plus weather / terrain / screen / held-item / stage compilers under `src/lib/damage-calculation/`.
- Levitate already participates in terrain grounding: `src/lib/damage-calculation/terrain.ts` (`LEVITATE_ABILITY_ID`).

### Identity / names

- Local PokeAPI CSVs: `PokeAPI/pokeapi/data/v2/csv/ability_names.csv` (language 9) for numeric IDs matching the inventory note.

### Held-item freeze precedent

- [docs/research/2026-07-31-frozen-held-item-mechanics-matrix.md](./2026-07-31-frozen-held-item-mechanics-matrix.md): ordinary-hit damage/accuracy/crit/stat hooks from static Scenario inputs; consumption/history deferred. Ability freeze size is **not** forced to 85 — it falls out of the criterion (**58**).

### Refresh gap (usage only)

- Attempt to probe [https://www.smogon.com/stats/2026-07/](https://www.smogon.com/stats/2026-07/) from this research environment returned no usable listing (connection failure). **June 2026 ranks remain the prioritization proxy.** If a full July monthly `gen9championsvgc2026regmb` chaos file becomes available, re-score within the freeze for implementation order sensitivity; do not block freeze acceptance on a re-rank.

## Definitions

### Buckets (closed set)

Every Champions ability gets exactly one **primary** bucket. When an ability has multiple facets, assign by highest-priority damage-calc facet: **A > C > B > D**, and note secondary facets in the rationale where useful.

| Bucket | Meaning |
| --- | --- |
| **A_direct_damage** | Changes ordinary damaging-hit outputs the calculator already promises (power, Atk/SpA/Def/SpD, final damage, STAB, type effectiveness / immunities that zero or alter damage, accuracy of the hit, critical stage/rate) from **current Scenario state**. |
| **B_scenario_state** | Mainly sets or alters weather / terrain / screens / stages / form. The ability’s own “effect” is the state change (or needs a product decision whether selecting the ability implies that state), rather than a per-hit modifier. |
| **C_needs_input_contract** | Can affect damage, but needs HP%, prior KO count, ally presence, turn order, consumed item, status, multi-hit child modeling, typing override, etc. that are **not** first-class Scenario inputs today. Rationale lists the missing input. |
| **D_non_damage_calc** | Meaningful in battle but does not change a **resolved** damaging hit’s damage/accuracy/crit under ordinary calculator assumptions (priority, switching, status infliction, trapping, information, Speed-only, residuals after the hit, Protect-bypass, etc.). Consistent with the inventory’s three N/A exclusions living **outside** this 200. |

### “Current Scenario inputs”

As wired in Scenario Explorer / `scenario-compiler.ts` today:

- **Move snapshot** — power, accuracy, always-hits, crit stage, type, category, identity (flags inferred from move resources where needed).
- **Attacker/defender Ability tracks** — selected ability IDs (any legal ability selectable; only Adaptability effect supported).
- **Held Item tracks** — attacker required; defender optional; frozen-85 damage hooks.
- **Weather / Terrain / Screen tracks** — explicit scenario options.
- **Stat tracks + Stage tracks** — numeric battle stats and −6…+6 stages.
- **Species types** — from the selected Pokémon/form identity (Mega = post-Mega identity/ability).

**Not** first-class today (examples that force **C**): HP%, non-volatile status, gender, ally-on-field flags, turn order, KO counts, item-consumed flags, multi-hit schedules, free typing overrides, copied-ability identity.

### Source-state rule (product constraint reminder)

Unsupported abilities must remain **unsupported / “效果暂未支持”**, never marked **judged inactive**. Only Adaptability currently uses effective/inactive based on STAB. This note’s **D** bucket is “no ordinary-hit damage facet to implement,” not “mark inactive in UI.”

## Full assignment (all 200)

English names match the inventory note. Scores are the June 2026 Showdown proxy from that note.

### A_direct_damage (59)

| Rank | ID | Ability | Score | Rationale |
| ---: | ---: | --- | ---: | --- |
| 5 | 91 | Adaptability | 22.798% | onModifySTAB: STAB 2× (Showdown; calc; repo compiler already effective) |
| 7 | 26 | Levitate | 20.497% | Ground immunity (repo grounded + calc) |
| 11 | 181 | Tough Claws | 18.052% | onBasePower: contact BP ×5325/4096 |
| 16 | 182 | Pixilate | 12.127% | Normal→Fairy + BP ×4915/4096 |
| 18 | 99 | No Guard | 11.262% | moves by/against always hit |
| 20 | 37 | Huge Power | 9.697% | onModifyAtk: Physical Atk ×2 (calc atMods) |
| 21 | 187 | Fairy Aura | 9.206% | Fairy moves field BP ×5448/4096 |
| 22 | 31 | Lightning Rod | 7.495% | Electric immunity (redirect secondary) |
| 28 | 127 | Unnerve | 4.892% | blocks foe Berry eat → no resist-berry damage cut |
| 31 | 312 | Eelevate | 4.453% | Champions-era Ground immunity; KO stat-boost secondary |
| 32 | 101 | Technician | 4.141% | onBasePower: BP≤60 → ×6144/4096 |
| 33 | 313 | Fire Mane | 3.793% | Champions-era: Fire Atk/SpA ×1.5 |
| 35 | 18 | Flash Fire | 3.549% | Fire immunity (abilityOn boost secondary C) |
| 36 | 47 | Thick Fat | 3.506% | incoming Fire/Ice attacking-stat ×0.5 |
| 38 | 204 | Liquid Voice | 3.240% | sound moves become Water-type |
| 40 | 109 | Unaware | 3.155% | ignore opposing Atk/Def stages in damage |
| 41 | 113 | Scrappy | 3.152% | Normal/Fighting hit Ghost |
| 43 | 104 | Mold Breaker | 2.837% | ignore target abilities that affect the hit |
| 45 | 292 | Sharpness | 2.604% | onBasePower: slicing BP ×6144/4096 |
| 47 | 178 | Mega Launcher | 2.458% | onBasePower: pulse BP ×6144/4096 |
| 56 | 125 | Sheer Force | 1.947% | onBasePower: secondary-bearing damaging moves ×5325/4096 |
| 60 | 8 | Sand Veil | 1.707% | accuracy mod in sand |
| 61 | 310 | Mega Sol | 1.638% | Champions-era: sun weather-damage mods without needing sun |
| 63 | 151 | Infiltrator | 1.608% | bypass Reflect/Light Screen/Aurora Veil |
| 68 | 199 | Water Bubble | 1.412% | Water Atk ×2; Fire incoming ×0.5 |
| 70 | 75 | Shell Armor | 1.322% | cannot be critically hit |
| 71 | 89 | Iron Fist | 1.137% | onBasePower: punch BP ×4915/4096 |
| 72 | 14 | Compound Eyes | 1.135% | accuracy ×1.3 |
| 73 | 159 | Sand Force | 1.119% | Rock/Ground/Steel BP ×5325/4096 in sand (Weather Track) |
| 74 | 43 | Soundproof | 1.049% | sound immunity |
| 78 | 87 | Dry Skin | 0.918% | Water immunity; Fire source BP ×5120/4096 |
| 82 | 10 | Volt Absorb | 0.865% | Electric immunity (heal secondary) |
| 88 | 111 | Filter | 0.682% | SE final damage ×3072/4096 |
| 93 | 94 | Solar Power | 0.585% | SpA ×1.5 in sun (Weather Track) |
| 94 | 171 | Bulletproof | 0.577% | ball/bomb immunity |
| 99 | 116 | Solid Rock | 0.478% | SE final damage ×3072/4096 |
| 100 | 297 | Earth Eater | 0.461% | Ground immunity |
| 103 | 272 | Purifying Salt | 0.436% | Ghost incoming Atk/SpA ×0.5 |
| 107 | 157 | Sap Sipper | 0.390% | Grass immunity (Atk boost secondary) |
| 109 | 81 | Snow Cloak | 0.358% | accuracy mod in snow |
| 112 | 309 | Dragonize | 0.327% | Champions-era: Normal→Dragon + BP ×4915/4096 |
| 115 | 11 | Water Absorb | 0.290% | Water immunity |
| 117 | 120 | Reckless | 0.261% | onBasePower: recoil/crash BP ×4915/4096 |
| 118 | 51 | Keen Eye | 0.251% | prevent accuracy drop / ignore evasion |
| 119 | 74 | Pure Power | 0.243% | onModifyAtk: Physical Atk ×2 (Huge Power family) |
| 120 | 174 | Refrigerate | 0.229% | Normal→Ice + BP ×4915/4096 |
| 125 | 85 | Heatproof | 0.206% | Gen9 Fire incoming attacking-stat ×0.5 |
| 128 | 173 | Strong Jaw | 0.173% | onBasePower: bite BP ×6144/4096 |
| 135 | 218 | Fluffy | 0.156% | contact final ×0.5; Fire final ×2 |
| 136 | 184 | Aerilate | 0.136% | Normal→Flying + BP ×4915/4096 |
| 142 | 55 | Hustle | 0.128% | Physical Atk ×1.5; accuracy ×0.8 |
| 157 | 78 | Motor Drive | 0.092% | Electric immunity (Speed boost secondary) |
| 163 | 105 | Super Luck | 0.068% | crit stage +1 |
| 168 | 203 | Long Reach | 0.058% | user moves lose contact |
| 170 | 97 | Sniper | 0.045% | crit final damage ×1.5 |
| 174 | 35 | Illuminate | 0.033% | Gen9: prevent accuracy drop / ignore evasion |
| 180 | 169 | Fur Coat | 0.022% | physical Def ×2 |
| 187 | 103 | Klutz | 0.013% | suppress holder item damage hooks |
| 191 | 4 | Battle Armor | 0.009% | cannot be critically hit |

### B_scenario_state (28)

| Rank | ID | Ability | Score | Rationale |
| ---: | ---: | --- | ---: | --- |
| 2 | 22 | Intimidate | 36.298% | lowers foe Atk on entry |
| 6 | 128 | Defiant | 21.507% | Atk up when stats lowered |
| 8 | 70 | Drought | 20.363% | sets sun on entry |
| 9 | 2 | Drizzle | 19.338% | sets rain on entry |
| 10 | 126 | Contrary | 18.749% | inverts stage changes |
| 15 | 192 | Stamina | 12.698% | Def up when hit |
| 19 | 117 | Snow Warning | 10.890% | sets snow on entry |
| 23 | 172 | Competitive | 6.578% | SpA up when stats lowered |
| 25 | 45 | Sand Stream | 5.627% | sets sand on entry |
| 27 | 3 | Speed Boost | 4.933% | Spe up each turn |
| 48 | 240 | Mirror Armor | 2.450% | reflects stat drops |
| 51 | 226 | Electric Surge | 2.296% | sets Electric Terrain on entry |
| 53 | 176 | Stance Change | 2.128% | Aegislash form from move category |
| 69 | 278 | Zero to Hero | 1.411% | Palafin form on switch cycle |
| 80 | 201 | Berserk | 0.893% | SpA up when HP crosses half |
| 96 | 13 | Cloud Nine | 0.558% | suppresses weather while present |
| 101 | 133 | Weak Armor | 0.454% | Def down/Spe up when hit physically |
| 104 | 251 | Screen Cleaner | 0.432% | clears screens on entry |
| 106 | 153 | Moxie | 0.399% | Atk up after KO |
| 131 | 83 | Anger Point | 0.168% | max Atk after crit taken |
| 137 | 258 | Hunger Switch | 0.136% | Morpeko form each turn |
| 139 | 261 | Curious Medicine | 0.134% | resets ally stages on entry |
| 140 | 183 | Gooey | 0.132% | lowers attacker Spe on contact |
| 145 | 300 | Supersweet Syrup | 0.115% | lowers foe evasion on entry |
| 149 | 290 | Opportunist | 0.103% | copies foe boosts |
| 151 | 141 | Moody | 0.099% | random ±stages each turn |
| 156 | 154 | Justified | 0.093% | Atk up when hit by Dark |
| 181 | 245 | Sand Spit | 0.021% | sets sand when hit |

### C_needs_input_contract (27)

| Rank | ID | Ability | Score | Rationale |
| ---: | ---: | --- | ---: | --- |
| 14 | 84 | Unburden | 14.030% | missing item-lost + ability-on flag |
| 26 | 132 | Friend Guard | 5.408% | missing ally-on-field side flag |
| 34 | 136 | Multiscale | 3.730% | missing defender HP% (full HP ×0.5) |
| 49 | 168 | Protean | 2.430% | missing attacker typing override vs species types |
| 66 | 293 | Supreme Overlord | 1.512% | missing ally KO count |
| 75 | 209 | Disguise | 0.943% | missing costume-intact state |
| 76 | 185 | Parental Bond | 0.940% | missing multi-hit second-strike contract |
| 77 | 66 | Blaze | 0.934% | missing attacker HP% ≤1/3 |
| 84 | 67 | Torrent | 0.744% | missing attacker HP% ≤1/3 |
| 85 | 150 | Imposter | 0.738% | missing transform target identity |
| 87 | 36 | Trace | 0.686% | missing copied ability identity |
| 90 | 280 | Electromorphosis | 0.636% | missing prior-hit charge flag |
| 97 | 65 | Overgrow | 0.524% | missing attacker HP% ≤1/3 |
| 108 | 92 | Skill Link | 0.372% | missing multi-hit hit-count seam |
| 126 | 196 | Merciless | 0.190% | missing defender poison/toxic |
| 133 | 63 | Marvel Scale | 0.161% | missing defender status |
| 141 | 62 | Guts | 0.130% | missing attacker status |
| 150 | 68 | Swarm | 0.103% | missing attacker HP% ≤1/3 |
| 171 | 77 | Tangled Feet | 0.043% | missing confusion volatile |
| 172 | 59 | Forecast | 0.040% | missing Castform typing override from weather |
| 173 | 57 | Plus | 0.033% | missing ally Plus/Minus |
| 175 | 222 | Receiver | 0.032% | missing fainted ally ability identity |
| 177 | 148 | Analytic | 0.028% | missing turn-order / moved-last flag |
| 178 | 250 | Mimicry | 0.024% | missing typing override from terrain |
| 185 | 247 | Ripen | 0.017% | missing berry-activation state |
| 190 | 79 | Rivalry | 0.012% | missing genders |
| 195 | 58 | Minus | 0.007% | missing ally Plus/Minus |

### D_non_damage_calc (86)

| Rank | ID | Ability | Score | Rationale |
| ---: | ---: | --- | ---: | --- |
| 1 | 158 | Prankster | 53.811% | status priority / Dark immunity — battle control |
| 3 | 301 | Hospitality | 32.432% | heals ally on entry |
| 4 | 24 | Rough Skin | 26.526% | contact residual to attacker |
| 12 | 296 | Armor Tail | 17.640% | blocks priority — control |
| 13 | 33 | Swift Swim | 15.981% | Speed in rain |
| 17 | 283 | Good as Gold | 11.281% | status-move immunity |
| 24 | 144 | Regenerator | 6.180% | heal on switch-out |
| 29 | 177 | Gale Wings | 4.876% | Flying priority at full HP — priority control |
| 30 | 34 | Chlorophyll | 4.840% | Speed in sun (Speed ≠ hit damage) |
| 37 | 23 | Shadow Tag | 3.375% | trapping |
| 39 | 39 | Inner Focus | 3.225% | flinch / Intimidate immunity |
| 42 | 156 | Magic Bounce | 2.914% | reflects status moves |
| 44 | 214 | Queenly Majesty | 2.623% | blocks priority — control |
| 46 | 146 | Sand Rush | 2.552% | Speed in sand |
| 50 | 29 | Clear Body | 2.407% | prevents stat drops |
| 52 | 143 | Poison Touch | 2.289% | poison chance on contact |
| 54 | 119 | Frisk | 2.105% | reveals held item |
| 55 | 49 | Flame Body | 2.070% | burn chance on contact |
| 57 | 12 | Oblivious | 1.831% | Attract/Taunt/Intimidate immunity |
| 58 | 311 | Spicy Spray | 1.824% | burns attacker when damaged |
| 59 | 295 | Toxic Debris | 1.769% | sets Toxic Spikes when hit |
| 62 | 69 | Rock Head | 1.612% | negates recoil residual |
| 64 | 140 | Telepathy | 1.577% | ally moves skip user |
| 65 | 46 | Pressure | 1.517% | extra PP cost |
| 67 | 149 | Illusion | 1.442% | appearance disguise |
| 79 | 5 | Sturdy | 0.908% | survive OHKO — faint rule |
| 81 | 98 | Magic Guard | 0.871% | blocks indirect damage |
| 83 | 242 | Stalwart | 0.806% | ignores redirection |
| 86 | 130 | Cursed Body | 0.705% | Disable chance |
| 89 | 165 | Aroma Veil | 0.663% | ally volatile protection |
| 91 | 152 | Mummy | 0.605% | changes attacker ability on contact |
| 92 | 124 | Pickpocket | 0.599% | steals item on contact |
| 95 | 260 | Unseen Fist | 0.562% | contact bypasses Protect — out of ordinary-hit scope |
| 98 | 131 | Healer | 0.478% | ally status cure chance |
| 102 | 52 | Hyper Cutter | 0.440% | prevents Atk drops |
| 105 | 20 | Own Tempo | 0.406% | confusion / Intimidate immunity |
| 110 | 254 | Wandering Spirit | 0.344% | swaps abilities on contact |
| 111 | 212 | Corrosion | 0.332% | poison Steel/Poison rules |
| 113 | 308 | Piercing Drill | 0.318% | contact bypasses Protect |
| 114 | 291 | Cud Chew | 0.304% | re-eat Berry later |
| 116 | 56 | Cute Charm | 0.277% | infatuation chance |
| 121 | 142 | Overcoat | 0.228% | powder/weather residual immunity |
| 122 | 166 | Flower Veil | 0.224% | protects Grass allies |
| 123 | 27 | Effect Spore | 0.220% | contact status chance |
| 124 | 9 | Static | 0.218% | paralysis on contact |
| 127 | 28 | Synchronize | 0.182% | passes status to foe |
| 129 | 139 | Harvest | 0.169% | Berry recovery residual |
| 130 | 44 | Rain Dish | 0.169% | rain heal residual |
| 132 | 215 | Innards Out | 0.166% | damages foe on faint |
| 134 | 115 | Ice Body | 0.159% | snow heal residual |
| 138 | 15 | Insomnia | 0.134% | cannot sleep |
| 143 | 259 | Quick Draw | 0.118% | fractional priority |
| 144 | 72 | Vital Spirit | 0.116% | cannot sleep |
| 146 | 175 | Sweet Veil | 0.114% | allies cannot sleep |
| 147 | 6 | Damp | 0.110% | blocks Explosion/Aftermath |
| 148 | 7 | Limber | 0.106% | cannot be paralyzed |
| 152 | 30 | Natural Cure | 0.098% | cure status on switch-out |
| 153 | 80 | Steadfast | 0.097% | Spe up on flinch |
| 154 | 202 | Slush Rush | 0.095% | Speed in snow |
| 155 | 207 | Surge Surfer | 0.094% | Speed on Electric Terrain |
| 158 | 38 | Poison Point | 0.090% | poison on contact |
| 159 | 90 | Poison Heal | 0.078% | heal from poison residual |
| 160 | 82 | Gluttony | 0.076% | earlier Berry HP threshold |
| 161 | 73 | White Smoke | 0.075% | prevents stat drops |
| 162 | 19 | Shield Dust | 0.071% | blocks additional effects |
| 164 | 95 | Quick Feet | 0.068% | Speed when statused |
| 165 | 102 | Leaf Guard | 0.063% | status immunity in sun |
| 166 | 167 | Cheek Pouch | 0.063% | extra Berry HP |
| 167 | 180 | Symbiosis | 0.062% | passes item to ally |
| 169 | 17 | Immunity | 0.057% | cannot be poisoned |
| 176 | 93 | Hydration | 0.030% | cure status in rain |
| 179 | 108 | Forewarn | 0.023% | reveals strong move |
| 182 | 61 | Shed Skin | 0.020% | status cure chance |
| 183 | 53 | Pickup | 0.019% | picks up items |
| 184 | 48 | Early Bird | 0.019% | sleep duration halved |
| 186 | 170 | Magician | 0.017% | steals item with damaging move |
| 188 | 107 | Anticipation | 0.013% | warns of SE/OHKO |
| 189 | 134 | Heavy Metal | 0.012% | weight ×2; ordinary fixed-BP hits unchanged |
| 192 | 60 | Sticky Hold | 0.009% | prevents item removal |
| 193 | 106 | Aftermath | 0.008% | damages foe on contact faint |
| 194 | 1 | Stench | 0.008% | flinch chance |
| 196 | 135 | Light Metal | 0.006% | weight ×0.5; ordinary fixed-BP hits unchanged |
| 197 | 100 | Stall | 0.005% | moves last in priority bracket |
| 198 | 21 | Suction Cups | 0.004% | cannot be forced out |
| 199 | 40 | Magma Armor | 0.003% | cannot be frozen |
| 200 | 145 | Big Pecks | <0.001% | prevents Def drops |

## Proposed first freeze whitelist (58)

### Inclusion criterion

Include an ability iff:

1. Primary bucket is **A_direct_damage**, and
2. Its ordinary-hit hook can be expressed with **existing** Move / Ability / Item / Weather / Terrain / Screen / Stat / Stage / species-type seams, and
3. It does not require a new battle-history input or a multi-hit child model, and
4. It is not a **cross-cutting ability-suppression** meta (Mold Breaker / future Turboblaze / Teravolt / Neutralizing Gas) that needs a separate product contract for “which defender abilities still apply.”

This mirrors held-item frozen-85: ship the static ordinary-hit hooks; defer consumption, turn history, and full battle control.

### Explicit exclusions from the freeze (even if high usage or A-shaped)

| Ability | Why deferred |
| --- | --- |
| **Mold Breaker** (A, rank 43) | Cross-cutting ignore-ability interaction with every defender A/C hook; needs product rules before batch implementation. |
| All **B_scenario_state** (e.g. Drought, Drizzle, Intimidate, Contrary, Electric Surge) | State setters — Weather/Stage/Terrain tracks already exist; auto-implying state from ability is an open product question. |
| All **C_needs_input_contract** (e.g. Multiscale, Overgrow family, Guts, Friend Guard, Parental Bond, Protean, Supreme Overlord, Unburden) | Missing first-class inputs or multi-hit contract. |
| All **D_non_damage_calc** (e.g. Prankster, Hospitality, Rough Skin, Armor Tail, Speed weathers) | No ordinary resolved-hit damage/accuracy/crit change under calculator assumptions. |

### Shared mechanism groups (implement as families)


**Already implemented (baseline)** (1): Adaptability (#5).
**Physical Atk doublers** (2): Huge Power (#20), Pure Power (#119).
**Type attacking-stat boosters** (2): Fire Mane (#33), Water Bubble (#68).
**Move-flag / BP families** (8): Tough Claws (#11), Technician (#32), Sharpness (#45), Mega Launcher (#47), Sheer Force (#56), Iron Fist (#71), Reckless (#117), Strong Jaw (#128).
**Type-changing movers (-ate / Liquid Voice)** (5): Pixilate (#16), Liquid Voice (#38), Dragonize (#112), Refrigerate (#120), Aerilate (#136).
**Field aura** (1): Fairy Aura (#21).
**Weather-conditional offense** (3): Mega Sol (#61), Sand Force (#73), Solar Power (#93).
**Defensive damage / stat mods** (8): Thick Fat (#36), Dry Skin (#78), Filter (#88), Solid Rock (#99), Purifying Salt (#103), Heatproof (#125), Fluffy (#135), Fur Coat (#180).
**Critical hit** (4): Shell Armor (#70), Super Luck (#163), Sniper (#170), Battle Armor (#191).
**Accuracy / always-hit** (7): No Guard (#18), Sand Veil (#60), Compound Eyes (#72), Snow Cloak (#109), Keen Eye (#118), Hustle (#142), Illuminate (#174).
**Stage / screen interaction** (2): Unaware (#40), Infiltrator (#63).
**Type-effectiveness immunities & exceptions** (12): Levitate (#7), Lightning Rod (#22), Eelevate (#31), Flash Fire (#35), Scrappy (#41), Soundproof (#74), Volt Absorb (#82), Bulletproof (#94), Earth Eater (#100), Sap Sipper (#107), Water Absorb (#115), Motor Drive (#157).
**Contact-flag / item interaction** (3): Unnerve (#28), Long Reach (#168), Klutz (#187).

### Adaptability baseline

**Adaptability is in the freeze** and is the only ability whose damage effect is already compiled (`stabModifier` 8192 when STAB). Treat it as the reference pattern for source-state effective/inactive/unsupported and for mechanism projection UI.

### Suggested implementation order *within* the freeze (by family, not raw usage)

1. **Stat doublers** — Huge Power / Pure Power (clean Atk hook; high reuse).
2. **Type attacking-stat boosters** — Fire Mane, Water Bubble (pattern for future out-of-roster Steelworker / Transistor / Dragon’s Maw).
3. **Move-flag BP** — Tough Claws → Technician → Iron Fist / Reckless / Mega Launcher / Strong Jaw / Sharpness → Sheer Force.
4. **Type changers** — Pixilate family + Dragonize + Liquid Voice (requires resolving Move-type ownership product question; see Gaps).
5. **Fairy Aura** — field BP hook (either-side ability).
6. **Weather-conditional offense** — Sand Force, Solar Power, Mega Sol (reuse Weather Track / weather damage path).
7. **Defensive mods** — Thick Fat / Heatproof / Filter / Solid Rock / Fur Coat / Fluffy / Purifying Salt / Dry Skin.
8. **Crit pipeline** — Battle Armor / Shell Armor / Super Luck / Sniper.
9. **Accuracy pipeline** — Compound Eyes / Hustle / No Guard / Sand Veil / Snow Cloak / Illuminate / Keen Eye.
10. **Unaware + Infiltrator** — stage ignore + screen bypass (reuse Stage + Screen seams).
11. **Immunities / Scrappy** — Levitate / Eelevate / absorb-style immunities / Bulletproof / Soundproof / Scrappy (type-effectiveness / tryHit zero branch).
12. **Long Reach / Klutz / Unnerve** — flag and item-interaction polish (compose with Fluffy and frozen berries).

Flash Fire / Sap Sipper / Lightning Rod / etc. freeze scope is the **immunity (or Ghost-halving) facet** that affects the resolved hit; secondary boosts-on-absorb remain unsupported until their input contracts exist — still show unsupported/partial carefully, never “judged inactive.”

### High-usage deliberate deferrals (rank ≤ 40, not in freeze)

| Rank | Ability | Bucket | Deferral reason |
| ---: | --- | --- | --- |

| 1 | Prankster | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 2 | Intimidate | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 3 | Hospitality | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 4 | Rough Skin | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 6 | Defiant | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 8 | Drought | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 9 | Drizzle | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 10 | Contrary | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 12 | Armor Tail | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 13 | Swift Swim | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 14 | Unburden | C_needs_input_contract | needs new Scenario input or multi-hit contract |
| 15 | Stamina | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 17 | Good as Gold | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 19 | Snow Warning | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 23 | Competitive | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 24 | Regenerator | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 25 | Sand Stream | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 26 | Friend Guard | C_needs_input_contract | needs new Scenario input or multi-hit contract |
| 27 | Speed Boost | B_scenario_state | sets weather/stages/form — use existing tracks; auto-imply open question |
| 29 | Gale Wings | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 30 | Chlorophyll | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 34 | Multiscale | C_needs_input_contract | needs new Scenario input or multi-hit contract |
| 37 | Shadow Tag | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |
| 39 | Inner Focus | D_non_damage_calc | battle control / residual / Speed / information — not ordinary-hit damage |

## Seam fit audit (freeze families → existing phases)

| Freeze family | Kernel / compiler phase | Existing seam to reuse | Gap |
| --- | --- | --- | --- |
| Adaptability | STAB (`stabModifier`) | `scenario-compiler.ts` Adaptability branch | None for this ability |
| Huge Power / Pure Power | Attack stat mods | Held-item Atk hooks pattern; calc `atMods` | No general ability Atk mod pipeline yet |
| Fire Mane / Water Bubble (offense) | Attack stat mods | Same | Type-conditional Atk/SpA ability mods |
| Water Bubble / Thick Fat / Heatproof / Purifying Salt | Incoming attacking-stat cut | Defender ability path mostly unused | Defender ability → atk-mod compiler |
| Tough Claws / Technician / Iron Fist / … / Sheer Force | Base power (`basePowerModifier`) | Held-item BP chain in compiler | Move flags (contact/punch/bite/pulse/slicing/recoil/secondary) must be available to compiler |
| -ate / Liquid Voice / Dragonize | Move type rewrite + BP | Move snapshot type today is user-owned | **Product:** ability-owned type vs Move Track type |
| Fairy Aura | BP field aura | None yet | Either-side ability → field BP; Aura Break not in Champions 200 |
| Sand Force / Solar Power | BP / SpA × weather | Weather Track + weather compiler | Ability×weather compose |
| Mega Sol | Weather damage modifiers | `compileWeatherEffect` / weather damage path | Ability applies sun-like damage mods without Weather=`sun` |
| Filter / Solid Rock | Final damage | Expert Belt / Life Orb final-mod pattern | SE-gated defender final mods |
| Fur Coat | Defense stat | Defender stage/stat path | Def ×2 ability mod |
| Fluffy | Final damage | Final-mod chain | Contact vs Fire dual hook; Long Reach interaction |
| Dry Skin / immunities / Scrappy | Type effectiveness / tryHit 0 | Type effectiveness modifier; Levitate grounded | Unified ability immunity table; redirect/heal secondaries out of freeze |
| Battle Armor / Shell Armor / Super Luck / Sniper | Crit stage / crit damage | Move crit stage + item crit stage | Ability crit stage & crit damage multiplier |
| Compound Eyes / Hustle / No Guard / veils / Keen Eye / Illuminate | Accuracy / always-hits | Item accuracy + weather accuracy | Ability accuracy chain; No Guard → always-hits both ways |
| Unaware | Stage ignore | Crit already ignores stages partially | Attacker Unaware vs defender stages & vice versa |
| Infiltrator | Screens | `compileScreenEffect` | Ability bypasses screen reduction |
| Klutz / Unnerve | Held-item compose | Frozen item hooks + berries | Klutz suppresses holder item; Unnerve suppresses foe berry damage cut |
| Mold Breaker (not in freeze) | Meta | — | Which defender abilities are ignorable; Ability Shield later |

Speed-only weather abilities (Swift Swim, Chlorophyll, …) intentionally **D**: Speed does not change a resolved hit’s damage under current calculator promises.

## Gaps / open product questions

Research-discovered open questions only — **not** resolved here:

1. **Does selecting Drought / Drizzle / Sand Stream / Snow Warning / Electric Surge imply Weather/Terrain Track values, or must those tracks be set separately?** (B setters vs explicit tracks.)
2. **Cloud Nine:** does selecting it suppress Weather Track effects for the scenario, or only when modeling “ability present” as a separate weather-visibility flag (cf. Utility Umbrella)?
3. **Mold Breaker / Turboblaze / Teravolt / Neutralizing Gas:** which defender (and attacker) ability hooks are suppressed; interaction with Ability Shield; freeze explicitly deferred.
4. **Parental Bond:** how to model the second strike (power fraction, multi-hit UI, Parental Bond Child) without a full multi-hit engine.
5. **Protean / Libero-style typing:** who owns attacker types mid-calc — species identity, Ability effect, or Move snapshot? (Libero not in Champions 200; Protean is.)
6. **-ate / Liquid Voice / Dragonize type rewrite:** does the ability rewrite Move snapshot type for the calculation, or must the user pick the post-change type manually?
7. **Flash Fire / Sap Sipper / Lightning Rod / Motor Drive / Volt Absorb / Water Absorb / Earth Eater:** freeze immunity only, or also “boosted/charged” states — and if so, what minimal toggle?
8. **Friend Guard / Plus / Minus / Power Spot-style ally fields:** add ally side flags, or keep out of scope for singles-oriented scenarios?
9. **Intimidate / Defiant / Competitive / Stamina:** auto-apply stages when ability selected, or require Stage Track to already reflect them?
10. **Multiscale / Overgrow family / Guts / Marvel Scale / Merciless:** introduce HP% and status as Scenario inputs, or keep as future C batch?
11. **Unnerve vs resistance berries:** with berries currently modeled as if still held, should Unnerve immediately disable berry damage cuts?
12. **Mega Sol vs Weather Track:** can Mega Sol’s sun-like damage mods stack with, replace, or ignore explicit weather?
13. **Eelevate:** Ground immunity only in freeze vs also Beast-Boost-on-KO (needs KO event)?
14. **Skill Link / multi-hit moves:** when (if) multi-hit lands in the calculator, is Skill Link automatic max hits?
15. **Stance Change / Zero to Hero / Hunger Switch:** form owned by Pokémon identity picker vs ability-driven form toggle?
16. **Heavy Metal / Light Metal:** when variable-power weight moves are supported, promote from D to A/C?
17. **July 2026 Showdown stats refresh** for ranking sensitivity inside the freeze (probe failed in this environment).

## Reproduction outline

1. Read the 200 names + ranks/scores from `docs/research/2026-07-30-champions-ability-inventory-and-priority.md` § “Full 200-ability proxy ranking.”
2. Join English names → PokeAPI IDs via `PokeAPI/pokeapi/data/v2/csv/ability_names.csv` (language_id = 9).
3. For each ability, open Showdown `data/abilities.ts` at commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` and note damage-relevant callbacks (`onModifyAtk`, `onBasePower`, `onModifySTAB`, `onSourceModifyDamage`, `onModifyAccuracy`, `onCriticalHit`, `onTryHit`, `onModifyType`, …).
4. Cross-check calculator-shaped application in `@smogon/calc@0.11.0` `mechanics/gen789.ts` / `util.ts` (`hasAbility(...)` sites for BP, Atk, Def, final, crit, type, grounded).
5. Compare to repo seams: `scenario-compiler.ts`, `ability-track.tsx`, weather/terrain/screen/held-item compilers — decide A vs C by whether a **current** Scenario field can fire the hook.
6. Assign bucket with priority A > C > B > D; build freeze = A minus Mold Breaker.
7. Optionally re-fetch Showdown July monthly chaos if available and diff ranks within the freeze only.

## How this feeds planning

Use the **{n_freeze}-ability freeze** as the first coherent implementation batch for ability damage effects (Adaptability already done). Schedule **C** abilities only after their missing inputs are specified. Keep **B** as product decisions about auto-linking Ability Track ↔ Weather/Stage/Terrain/Form. Keep **D** off the damage checklist without marking them inactive in the Ability Track. Do not treat this note as a Wayfinder ticket list or a product contract.
