# Pokémon Champions Ability Inventory and Priority Data

Checked on **2026-07-30**. This note supports ability implementation planning; it does not change a product contract or product code.

## Executive result

- The vendored PokeAPI data contains **313 main-series abilities** (IDs 1–313) and 60 non-main-series abilities. Under the competitive trainer-battle definition below, **310/313 affect battle**; the three exclusions are **Run Away, Honey Gather, and Ball Fetch**.
- The current official ruleset is **Pokémon Champions Regulation Set M-B**, active from **2026-06-17 02:00 UTC through 2026-09-02 01:59 UTC**. Its official eligible pool has **235 non-Mega species/form entries** and **75 allowed Mega Evolutions** (59 retained from M-A plus 16 added in M-B).
- The current Champions Battle Data index exposes 236 battle-data entries, 73 nested Mega forms, and **200 unique canonical abilities**. All 200 resolve to this repository's generated PokeAPI ability resources. The difference between the official roster counts and this battle-data index is a reason to use the official page for legality and the index only for ability/set observations.
- The official game data available publicly provides Pokémon **rank**, not Pokémon **usage percentage**. Therefore the requested exact official product `Pokémon usage × ability usage` cannot be reproduced.
- The closest single, public, reproducible source is Pokémon Showdown's June 2026 `gen9championsvgc2026regmb` monthly data. The ranking below uses the unweighted cutoff-0 file (all 1,163,315 recorded battles), VGC doubles only. It is an implementation-priority proxy, **not official Champions ladder usage**.

## Sources and provenance

### First-party rules and roster

- [Official Regulation Set M-B notice](https://news.pokemon-home.com/en/page/776.html): dates, one Mega Evolution per battle, and the 16 newly allowed M-B Megas.
- [Official M-B eligible Pokémon page](https://web-view.app.pokemonchampions.jp/battle/pages/events/rs177501629259kmzbny/en/pokemon.html): machine-readable embedded eligible list; 235 species/form rows.
- [Official Regulation Set M-A notice](https://news.pokemon-home.com/en/page/751.html): the prior 59 allowed Megas retained by M-B.
- [Official Champions site](https://champions.pokemon.com/en-us/): confirms that Abilities are part of Champions battles and that roster availability changes.

### Ability identity and effects

- [PokeAPI ability documentation](https://pokeapi.co/docs/v2#abilities).
- [PokeAPI `abilities.csv`](https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/abilities.csv), [`ability_names.csv`](https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/ability_names.csv), and [`ability_prose.csv`](https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/ability_prose.csv). Generation and main-series membership come from `abilities.csv`; English names come from language ID 9 in `ability_names.csv`.
- Local source snapshot: `PokeAPI/pokeapi/data/v2/csv/`, read without making per-ability API requests.

### Current Champions set data

- [Pokémon Champions Battle Data API guide](https://championsbattledata.com/api_guide) and one-time index fetch from [`/api`](https://championsbattledata.com/api).
- [API usage rules](https://championsbattledata.com/api-rules/): the source is unofficial, attribution is required, reasonable caching is allowed, and there is no fixed public rate limit.
- The index was fetched once and cached locally during research. PokeAPI was read entirely from the repository. The published bulk battle-data ZIP was checked before any granular access. No per-Pokémon PokeAPI requests were made.

### Reproducible usage proxy

- [Showdown June 2026 stats directory](https://www.smogon.com/stats/2026-06/).
- [Cutoff-0 usage table](https://www.smogon.com/stats/2026-06/gen9championsvgc2026regmb-0.txt).
- [Cutoff-0 detailed JSON](https://www.smogon.com/stats/2026-06/chaos/gen9championsvgc2026regmb-0.json): per-form `usage` and weighted ability counts; `info.number of battles = 1,163,315`.
- An optional high-ladder sensitivity check is available at [cutoff 1630](https://www.smogon.com/stats/2026-06/chaos/gen9championsvgc2026regmb-1630.json), but it is not mixed into the primary ranking.

## Definitions

### “All abilities”

All rows where PokeAPI `abilities.is_main_series = 1`. This includes the six Champions-era abilities already present in the upstream dataset: Piercing Drill, Dragonize, Mega Sol, Spicy Spray, Eelevate, and Fire Mane. It excludes the 60 Conquest-only/non-main-series rows with IDs 10001+.

### “Affects battle”

For this inventory, an ability affects battle if it can change state, legal actions, targeting, ordering, accuracy, damage, form, status, items, switching, or information during a **competitive trainer battle**. It does not need to change the damage number directly.

With that definition, the battle-impacting set is exactly the 313-name inventory below **minus**:

- **Run Away** — only guarantees escape from wild battles.
- **Honey Gather** — only obtains Honey after battle.
- **Ball Fetch** — only retrieves a failed Poké Ball, a capture flow unavailable in competitive trainer battles.

Important edge cases:

- **Illuminate is included**: its current-generation battle effect prevents accuracy reduction; old prose that only mentions encounter rates is stale.
- **Pickup is included**: it can pick up consumed or Flung items during battle, despite also having an after-battle effect.
- “Affects battle” is broader than “must be implemented in a damage calculator.” A second planning pass should classify the 200 available abilities into direct formula effects, scenario-state effects, and UI-only/unsupported effects rather than treating all 200 as equivalent work.

## All 313 main-series abilities

**Generation III (76):** Stench, Drizzle, Speed Boost, Battle Armor, Sturdy, Damp, Limber, Sand Veil, Static, Volt Absorb, Water Absorb, Oblivious, Cloud Nine, Compound Eyes, Insomnia, Color Change, Immunity, Flash Fire, Shield Dust, Own Tempo, Suction Cups, Intimidate, Shadow Tag, Rough Skin, Wonder Guard, Levitate, Effect Spore, Synchronize, Clear Body, Natural Cure, Lightning Rod, Serene Grace, Swift Swim, Chlorophyll, Illuminate, Trace, Huge Power, Poison Point, Inner Focus, Magma Armor, Water Veil, Magnet Pull, Soundproof, Rain Dish, Sand Stream, Pressure, Thick Fat, Early Bird, Flame Body, Run Away, Keen Eye, Hyper Cutter, Pickup, Truant, Hustle, Cute Charm, Plus, Minus, Forecast, Sticky Hold, Shed Skin, Guts, Marvel Scale, Liquid Ooze, Overgrow, Blaze, Torrent, Swarm, Rock Head, Drought, Arena Trap, Vital Spirit, White Smoke, Pure Power, Shell Armor, Air Lock.

**Generation IV (47):** Tangled Feet, Motor Drive, Rivalry, Steadfast, Snow Cloak, Gluttony, Anger Point, Unburden, Heatproof, Simple, Dry Skin, Download, Iron Fist, Poison Heal, Adaptability, Skill Link, Hydration, Solar Power, Quick Feet, Normalize, Sniper, Magic Guard, No Guard, Stall, Technician, Leaf Guard, Klutz, Mold Breaker, Super Luck, Aftermath, Anticipation, Forewarn, Unaware, Tinted Lens, Filter, Slow Start, Scrappy, Storm Drain, Ice Body, Solid Rock, Snow Warning, Honey Gather, Frisk, Reckless, Multitype, Flower Gift, Bad Dreams.

**Generation V (41):** Pickpocket, Sheer Force, Contrary, Unnerve, Defiant, Defeatist, Cursed Body, Healer, Friend Guard, Weak Armor, Heavy Metal, Light Metal, Multiscale, Toxic Boost, Flare Boost, Harvest, Telepathy, Moody, Overcoat, Poison Touch, Regenerator, Big Pecks, Sand Rush, Wonder Skin, Analytic, Illusion, Imposter, Infiltrator, Mummy, Moxie, Justified, Rattled, Magic Bounce, Sap Sipper, Prankster, Sand Force, Iron Barbs, Zen Mode, Victory Star, Turboblaze, Teravolt.

**Generation VI (27):** Aroma Veil, Flower Veil, Cheek Pouch, Protean, Fur Coat, Magician, Bulletproof, Competitive, Strong Jaw, Refrigerate, Sweet Veil, Stance Change, Gale Wings, Mega Launcher, Grass Pelt, Symbiosis, Tough Claws, Pixilate, Gooey, Aerilate, Parental Bond, Dark Aura, Fairy Aura, Aura Break, Primordial Sea, Desolate Land, Delta Stream.

**Generation VII (42):** Stamina, Wimp Out, Emergency Exit, Water Compaction, Merciless, Shields Down, Stakeout, Water Bubble, Steelworker, Berserk, Slush Rush, Long Reach, Liquid Voice, Triage, Galvanize, Surge Surfer, Schooling, Disguise, Battle Bond, Power Construct, Corrosion, Comatose, Queenly Majesty, Innards Out, Dancer, Battery, Fluffy, Dazzling, Soul-Heart, Tangling Hair, Receiver, Power of Alchemy, Beast Boost, RKS System, Electric Surge, Psychic Surge, Misty Surge, Grassy Surge, Full Metal Body, Shadow Shield, Prism Armor, Neuroforce.

**Generation VIII (34):** Intrepid Sword, Dauntless Shield, Libero, Ball Fetch, Cotton Down, Propeller Tail, Mirror Armor, Gulp Missile, Stalwart, Steam Engine, Punk Rock, Sand Spit, Ice Scales, Ripen, Ice Face, Power Spot, Mimicry, Screen Cleaner, Steely Spirit, Perish Body, Wandering Spirit, Gorilla Tactics, Neutralizing Gas, Pastel Veil, Hunger Switch, Quick Draw, Unseen Fist, Curious Medicine, Transistor, Dragon’s Maw, Chilling Neigh, Grim Neigh, As One (Glastrier), As One (Spectrier).

**Generation IX (46):** Lingering Aroma, Seed Sower, Thermal Exchange, Anger Shell, Purifying Salt, Well-Baked Body, Wind Rider, Guard Dog, Rocky Payload, Wind Power, Zero to Hero, Commander, Electromorphosis, Protosynthesis, Quark Drive, Good as Gold, Vessel of Ruin, Sword of Ruin, Tablets of Ruin, Beads of Ruin, Orichalcum Pulse, Hadron Engine, Opportunist, Cud Chew, Sharpness, Supreme Overlord, Costar, Toxic Debris, Armor Tail, Earth Eater, Mycelium Might, Mind’s Eye, Supersweet Syrup, Hospitality, Toxic Chain, Embody Aspect, Tera Shift, Tera Shell, Teraform Zero, Poison Puppeteer, Piercing Drill, Dragonize, Mega Sol, Spicy Spray, Eelevate, Fire Mane.

Therefore the complete competitive battle-impacting list has **310 names**: every name above except Run Away, Honey Gather, and Ball Fetch.

## Current Champions roster and Mega handling

Regulation M-B added these 16 Megas to the 59 already legal in M-A:

Mega Raichu X, Mega Raichu Y, Mega Sceptile, Mega Blaziken, Mega Swampert, Mega Mawile, Mega Metagross, Mega Staraptor, Mega Scolipede, Mega Scrafty, Mega Eelektross, Mega Pyroar, Mega Malamar, Mega Barbaracle, Mega Dragalge, and Mega Falinks.

Mega forms must be treated as separate battle identities for ability implementation. In particular, a Mega's fixed post-evolution ability must not be inferred from the base Pokémon's ability distribution.

The Champions index yields **200 unique abilities** across its current base and Mega forms. The usage ranking below includes every one; the lowest-use ability is not dropped.

## Product calculation and ranking

For each Showdown battle form \(P\) and canonical ability \(A\):

```text
ability_share(P,A) = ability_weight(P,A) / Σ legitimate ability_weight(P,*)
score(A) = ΣP [ usage(P) × ability_share(P,A) ]
```

The sum is necessary because the same ability appears on several Pokémon/forms. Scores are encounter-exposure weights, so scores across abilities do not sum to 100%.

### Mega correction

The June collector contains `noability` for 11 newly introduced Mega forms during their data rollout. `noability` is not a real ability. For those fixed-ability forms, this ranking maps the form's entire usage to the current ability from the Champions index:

- Mega Staraptor → Contrary
- Mega Raichu X → Electric Surge
- Mega Raichu Y → No Guard
- Mega Eelektross → Eelevate
- Mega Pyroar → Fire Mane
- Mega Scrafty → Intimidate
- Mega Dragalge → Regenerator
- Mega Malamar → Contrary
- Mega Falinks → Defiant
- Mega Scolipede → Shell Armor
- Mega Barbaracle → Tough Claws

This is a deterministic identity repair, not an estimated split: each listed Mega has one fixed ability. It also means the next full-month dataset should replace this provisional June snapshot before implementation order is frozen.

### Full 200-ability proxy ranking

**1–25:** 1. Prankster 53.811%; 2. Intimidate 36.298%; 3. Hospitality 32.432%; 4. Rough Skin 26.526%; 5. Adaptability 22.798%; 6. Defiant 21.507%; 7. Levitate 20.497%; 8. Drought 20.363%; 9. Drizzle 19.338%; 10. Contrary 18.749%; 11. Tough Claws 18.052%; 12. Armor Tail 17.640%; 13. Swift Swim 15.981%; 14. Unburden 14.030%; 15. Stamina 12.698%; 16. Pixilate 12.127%; 17. Good as Gold 11.281%; 18. No Guard 11.262%; 19. Snow Warning 10.890%; 20. Huge Power 9.697%; 21. Fairy Aura 9.206%; 22. Lightning Rod 7.495%; 23. Competitive 6.578%; 24. Regenerator 6.180%; 25. Sand Stream 5.627%.

**26–50:** 26. Friend Guard 5.408%; 27. Speed Boost 4.933%; 28. Unnerve 4.892%; 29. Gale Wings 4.876%; 30. Chlorophyll 4.840%; 31. Eelevate 4.453%; 32. Technician 4.141%; 33. Fire Mane 3.793%; 34. Multiscale 3.730%; 35. Flash Fire 3.549%; 36. Thick Fat 3.506%; 37. Shadow Tag 3.375%; 38. Liquid Voice 3.240%; 39. Inner Focus 3.225%; 40. Unaware 3.155%; 41. Scrappy 3.152%; 42. Magic Bounce 2.914%; 43. Mold Breaker 2.837%; 44. Queenly Majesty 2.623%; 45. Sharpness 2.604%; 46. Sand Rush 2.552%; 47. Mega Launcher 2.458%; 48. Mirror Armor 2.450%; 49. Protean 2.430%; 50. Clear Body 2.407%.

**51–75:** 51. Electric Surge 2.296%; 52. Poison Touch 2.289%; 53. Stance Change 2.128%; 54. Frisk 2.105%; 55. Flame Body 2.070%; 56. Sheer Force 1.947%; 57. Oblivious 1.831%; 58. Spicy Spray 1.824%; 59. Toxic Debris 1.769%; 60. Sand Veil 1.707%; 61. Mega Sol 1.638%; 62. Rock Head 1.612%; 63. Infiltrator 1.608%; 64. Telepathy 1.577%; 65. Pressure 1.517%; 66. Supreme Overlord 1.512%; 67. Illusion 1.442%; 68. Water Bubble 1.412%; 69. Zero to Hero 1.411%; 70. Shell Armor 1.322%; 71. Iron Fist 1.137%; 72. Compound Eyes 1.135%; 73. Sand Force 1.119%; 74. Soundproof 1.049%; 75. Disguise 0.943%.

**76–100:** 76. Parental Bond 0.940%; 77. Blaze 0.934%; 78. Dry Skin 0.918%; 79. Sturdy 0.908%; 80. Berserk 0.893%; 81. Magic Guard 0.871%; 82. Volt Absorb 0.865%; 83. Stalwart 0.806%; 84. Torrent 0.744%; 85. Imposter 0.738%; 86. Cursed Body 0.705%; 87. Trace 0.686%; 88. Filter 0.682%; 89. Aroma Veil 0.663%; 90. Electromorphosis 0.636%; 91. Mummy 0.605%; 92. Pickpocket 0.599%; 93. Solar Power 0.585%; 94. Bulletproof 0.577%; 95. Unseen Fist 0.562%; 96. Cloud Nine 0.558%; 97. Overgrow 0.524%; 98. Healer 0.478%; 99. Solid Rock 0.478%; 100. Earth Eater 0.461%.

**101–125:** 101. Weak Armor 0.454%; 102. Hyper Cutter 0.440%; 103. Purifying Salt 0.436%; 104. Screen Cleaner 0.432%; 105. Own Tempo 0.406%; 106. Moxie 0.399%; 107. Sap Sipper 0.390%; 108. Skill Link 0.372%; 109. Snow Cloak 0.358%; 110. Wandering Spirit 0.344%; 111. Corrosion 0.332%; 112. Dragonize 0.327%; 113. Piercing Drill 0.318%; 114. Cud Chew 0.304%; 115. Water Absorb 0.290%; 116. Cute Charm 0.277%; 117. Reckless 0.261%; 118. Keen Eye 0.251%; 119. Pure Power 0.243%; 120. Refrigerate 0.229%; 121. Overcoat 0.228%; 122. Flower Veil 0.224%; 123. Effect Spore 0.220%; 124. Static 0.218%; 125. Heatproof 0.206%.

**126–150:** 126. Merciless 0.190%; 127. Synchronize 0.182%; 128. Strong Jaw 0.173%; 129. Harvest 0.169%; 130. Rain Dish 0.169%; 131. Anger Point 0.168%; 132. Innards Out 0.166%; 133. Marvel Scale 0.161%; 134. Ice Body 0.159%; 135. Fluffy 0.156%; 136. Aerilate 0.136%; 137. Hunger Switch 0.136%; 138. Insomnia 0.134%; 139. Curious Medicine 0.134%; 140. Gooey 0.132%; 141. Guts 0.130%; 142. Hustle 0.128%; 143. Quick Draw 0.118%; 144. Vital Spirit 0.116%; 145. Supersweet Syrup 0.115%; 146. Sweet Veil 0.114%; 147. Damp 0.110%; 148. Limber 0.106%; 149. Opportunist 0.103%; 150. Swarm 0.103%.

**151–175:** 151. Moody 0.099%; 152. Natural Cure 0.098%; 153. Steadfast 0.097%; 154. Slush Rush 0.095%; 155. Surge Surfer 0.094%; 156. Justified 0.093%; 157. Motor Drive 0.092%; 158. Poison Point 0.090%; 159. Poison Heal 0.078%; 160. Gluttony 0.076%; 161. White Smoke 0.075%; 162. Shield Dust 0.071%; 163. Super Luck 0.068%; 164. Quick Feet 0.068%; 165. Leaf Guard 0.063%; 166. Cheek Pouch 0.063%; 167. Symbiosis 0.062%; 168. Long Reach 0.058%; 169. Immunity 0.057%; 170. Sniper 0.045%; 171. Tangled Feet 0.043%; 172. Forecast 0.040%; 173. Plus 0.033%; 174. Illuminate 0.033%; 175. Receiver 0.032%.

**176–200:** 176. Hydration 0.030%; 177. Analytic 0.028%; 178. Mimicry 0.024%; 179. Forewarn 0.023%; 180. Fur Coat 0.022%; 181. Sand Spit 0.021%; 182. Shed Skin 0.020%; 183. Pickup 0.019%; 184. Early Bird 0.019%; 185. Ripen 0.017%; 186. Magician 0.017%; 187. Klutz 0.013%; 188. Anticipation 0.013%; 189. Heavy Metal 0.012%; 190. Rivalry 0.012%; 191. Battle Armor 0.009%; 192. Sticky Hold 0.009%; 193. Aftermath 0.008%; 194. Stench 0.008%; 195. Minus 0.007%; 196. Light Metal 0.006%; 197. Stall 0.005%; 198. Suction Cups 0.004%; 199. Magma Armor 0.003%; 200. Big Pecks <0.001%.

## What this ranking can and cannot decide

Use the score to order **analysis**, then combine it with implementation shape:

1. high score + direct damage-formula effect;
2. high score + reusable shared mechanic (weather, stat source, typing/STAB, immunity);
3. high score but no damage-calculator effect;
4. lower-score direct effects;
5. stateful/turn-history effects that require a larger product contract.

Do not implement strictly from rank 1 downward. For example, Prankster, Hospitality, and Armor Tail are high-exposure battle abilities but generally do not change a single resolved damage roll, while lower-ranked Huge Power, Pixilate, Tough Claws, Multiscale, Thick Fat, Sheer Force, and Filter directly affect damage.

## Assumptions, gaps, and refresh rule

- **Official usage gap:** no public official endpoint/export was found that provides exact Pokémon usage percentages. Current in-game observations expose rank plus conditional moves/items/abilities. The official product requested by the user is therefore unavailable today.
- **Proxy population:** Showdown players are not the Champions ladder. The June file covers a simulator format using the same Regulation M-B rules, not official game telemetry.
- **Window:** Regulation M-B began mid-month, so the June monthly file covers only the M-B portion of June. July data was not yet published on 2026-07-30.
- **Mega rollout:** 11 new Mega rows contain `noability` contamination; the fixed-ability correction above is necessary. Recompute from the first clean full month before freezing a roadmap.
- **Roster mismatch:** official legality (235 non-Mega form rows + 75 Megas) outranks the unofficial index (236 battle entries + 73 nested Megas). The index is used for canonical ability observations, not legality.
- **Refresh:** rerun after the July Showdown monthly file appears, and again whenever the official regulation or Champions roster changes. Keep Singles and Doubles separate.

## Reproduction outline

1. Parse local PokeAPI CSVs; keep `is_main_series == 1`; join English names on language ID 9.
2. Parse the official M-B embedded eligible array and the official M-A/M-B Mega lists for legality/counts.
3. Fetch the Champions index once; flatten every `summary.forms[].abilities` pipe-separated field; deduplicate canonical names.
4. Fetch the single Showdown chaos JSON for `gen9championsvgc2026regmb-0`.
5. For each form, remove `noability`; apply the fixed current Mega identity correction listed above; normalize ability keys case/punctuation-insensitively to the 200-name Champions set.
6. Compute and aggregate the formula above; sort descending by score, then ability name.
7. Assert: 313 main-series PokeAPI abilities; 200 current-index abilities; every current-index ability resolves locally; no unmatched legitimate Showdown ability key; all 200 appear in the output.
