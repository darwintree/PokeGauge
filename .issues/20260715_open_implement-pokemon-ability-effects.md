---
# This section is managed by the CLI. Do not edit manually.
id: "b2408539-8119-4aa8-b8af-928bb8710e3b"
title: "Implement Pokémon ability effects"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-08-05T10:31:00Z"
---
## Goal

逐步实现主系列全部特性对伤害计算器的有效影响，并让每一次后续实现都可追踪、可验证。

当前只有 Adaptability 已作为伤害效果实现；其他合法特性仍须保持明确的“效果暂未支持”状态，不能被误标为已判断无效。

调研、Champions 可用特性与使用率优先级见 [Champions ability inventory and priority](../docs/research/2026-07-30-champions-ability-inventory-and-priority.md)。

伤害计算器相关性分桶与首批冻结候选见 [Champions ability damage-calc relevance and first freeze](../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze.md)（规划调研，非产品契约）。

## Tracking

- 这是长期 issue，按需逐步实现，不预设固定实现顺序。
- 今后的特性实现使用子 issue 跟踪，并在子 issue 的 `## Parent issue` 中链接本 issue。
- 子 issue 同时追加到下面的 `## Child issues`，仅用于关联，不表示优先级。
- 共享同一机制的多个特性可以合并在一个子 issue 中。
- 实现完成并验证后，勾选本页对应特性。
- checkbox 表示该特性在本计算器中的处置已完成；`N/A` 表示确认无需实现竞技训练家战斗效果。

## Child issues

- [[archive/20260805_closed_ability-track-none|Ability Track none]]
- [[20260805_open_ability-init-projection-to-weather-terrain-stage|Ability init projection to Weather Terrain Stage]]
- [[20260805_open_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]
- [[20260805_open_ability-critical-hit-and-accuracy-modifiers|Ability critical-hit and accuracy modifiers]]
- [[20260805_open_ability-stage-and-screen-bypass|Ability stage and screen bypass]]
- [[20260805_open_ability-contact-and-held-item-interactions|Ability contact and held-item interactions]]
- [[20260805_open_green-dot-conditional-ability-effects|Green-dot conditional ability effects]]
- [[20260805_open_ability-immunities-and-type-exceptions|Ability immunities and type exceptions]]
- [[20260805_open_result-side-move-type-rewrite-and-protean-stab|Result-side move-type rewrite and Protean STAB]]
- [[20260805_open_ability-weather-and-item-composition|Ability weather and item composition]]
- [[20260805_open_defer-parental-bond-until-multi-hit|Defer Parental Bond until multi-hit]]

## Ability checklist (313)

### Generation III (76)

- [ ] Stench
- [ ] Drizzle
- [ ] Speed Boost
- [ ] Battle Armor
- [ ] Sturdy
- [ ] Damp
- [ ] Limber
- [ ] Sand Veil
- [ ] Static
- [ ] Volt Absorb
- [ ] Water Absorb
- [ ] Oblivious
- [ ] Cloud Nine
- [ ] Compound Eyes
- [ ] Insomnia
- [ ] Color Change
- [ ] Immunity
- [ ] Flash Fire
- [ ] Shield Dust
- [ ] Own Tempo
- [ ] Suction Cups
- [ ] Intimidate
- [ ] Shadow Tag
- [ ] Rough Skin
- [ ] Wonder Guard
- [ ] Levitate
- [ ] Effect Spore
- [ ] Synchronize
- [ ] Clear Body
- [ ] Natural Cure
- [ ] Lightning Rod
- [ ] Serene Grace
- [ ] Swift Swim
- [ ] Chlorophyll
- [ ] Illuminate
- [ ] Trace
- [ ] Huge Power
- [ ] Poison Point
- [ ] Inner Focus
- [ ] Magma Armor
- [ ] Water Veil
- [ ] Magnet Pull
- [ ] Soundproof
- [ ] Rain Dish
- [ ] Sand Stream
- [ ] Pressure
- [ ] Thick Fat
- [ ] Early Bird
- [ ] Flame Body
- [x] Run Away — N/A: no competitive trainer-battle effect
- [ ] Keen Eye
- [ ] Hyper Cutter
- [ ] Pickup
- [ ] Truant
- [ ] Hustle
- [ ] Cute Charm
- [ ] Plus
- [ ] Minus
- [ ] Forecast
- [ ] Sticky Hold
- [ ] Shed Skin
- [ ] Guts
- [ ] Marvel Scale
- [ ] Liquid Ooze
- [ ] Overgrow
- [ ] Blaze
- [ ] Torrent
- [ ] Swarm
- [ ] Rock Head
- [ ] Drought
- [ ] Arena Trap
- [ ] Vital Spirit
- [ ] White Smoke
- [ ] Pure Power
- [ ] Shell Armor
- [ ] Air Lock

### Generation IV (47)

- [ ] Tangled Feet
- [ ] Motor Drive
- [ ] Rivalry
- [ ] Steadfast
- [ ] Snow Cloak
- [ ] Gluttony
- [ ] Anger Point
- [ ] Unburden
- [ ] Heatproof
- [ ] Simple
- [ ] Dry Skin
- [ ] Download
- [ ] Iron Fist
- [ ] Poison Heal
- [x] Adaptability — implemented
- [ ] Skill Link
- [ ] Hydration
- [ ] Solar Power
- [ ] Quick Feet
- [ ] Normalize
- [ ] Sniper
- [ ] Magic Guard
- [ ] No Guard
- [ ] Stall
- [ ] Technician
- [ ] Leaf Guard
- [ ] Klutz
- [ ] Mold Breaker
- [ ] Super Luck
- [ ] Aftermath
- [ ] Anticipation
- [ ] Forewarn
- [ ] Unaware
- [ ] Tinted Lens
- [ ] Filter
- [ ] Slow Start
- [ ] Scrappy
- [ ] Storm Drain
- [ ] Ice Body
- [ ] Solid Rock
- [ ] Snow Warning
- [x] Honey Gather — N/A: no competitive trainer-battle effect
- [ ] Frisk
- [ ] Reckless
- [ ] Multitype
- [ ] Flower Gift
- [ ] Bad Dreams

### Generation V (41)

- [ ] Pickpocket
- [ ] Sheer Force
- [ ] Contrary
- [ ] Unnerve
- [ ] Defiant
- [ ] Defeatist
- [ ] Cursed Body
- [ ] Healer
- [ ] Friend Guard
- [ ] Weak Armor
- [ ] Heavy Metal
- [ ] Light Metal
- [ ] Multiscale
- [ ] Toxic Boost
- [ ] Flare Boost
- [ ] Harvest
- [ ] Telepathy
- [ ] Moody
- [ ] Overcoat
- [ ] Poison Touch
- [ ] Regenerator
- [ ] Big Pecks
- [ ] Sand Rush
- [ ] Wonder Skin
- [ ] Analytic
- [ ] Illusion
- [ ] Imposter
- [ ] Infiltrator
- [ ] Mummy
- [ ] Moxie
- [ ] Justified
- [ ] Rattled
- [ ] Magic Bounce
- [ ] Sap Sipper
- [ ] Prankster
- [ ] Sand Force
- [ ] Iron Barbs
- [ ] Zen Mode
- [ ] Victory Star
- [ ] Turboblaze
- [ ] Teravolt

### Generation VI (27)

- [ ] Aroma Veil
- [ ] Flower Veil
- [ ] Cheek Pouch
- [ ] Protean
- [ ] Fur Coat
- [ ] Magician
- [ ] Bulletproof
- [ ] Competitive
- [ ] Strong Jaw
- [ ] Refrigerate
- [ ] Sweet Veil
- [ ] Stance Change
- [ ] Gale Wings
- [ ] Mega Launcher
- [ ] Grass Pelt
- [ ] Symbiosis
- [ ] Tough Claws
- [ ] Pixilate
- [ ] Gooey
- [ ] Aerilate
- [ ] Parental Bond
- [ ] Dark Aura
- [ ] Fairy Aura
- [ ] Aura Break
- [ ] Primordial Sea
- [ ] Desolate Land
- [ ] Delta Stream

### Generation VII (42)

- [ ] Stamina
- [ ] Wimp Out
- [ ] Emergency Exit
- [ ] Water Compaction
- [ ] Merciless
- [ ] Shields Down
- [ ] Stakeout
- [ ] Water Bubble
- [ ] Steelworker
- [ ] Berserk
- [ ] Slush Rush
- [ ] Long Reach
- [ ] Liquid Voice
- [ ] Triage
- [ ] Galvanize
- [ ] Surge Surfer
- [ ] Schooling
- [ ] Disguise
- [ ] Battle Bond
- [ ] Power Construct
- [ ] Corrosion
- [ ] Comatose
- [ ] Queenly Majesty
- [ ] Innards Out
- [ ] Dancer
- [ ] Battery
- [ ] Fluffy
- [ ] Dazzling
- [ ] Soul-Heart
- [ ] Tangling Hair
- [ ] Receiver
- [ ] Power of Alchemy
- [ ] Beast Boost
- [ ] RKS System
- [ ] Electric Surge
- [ ] Psychic Surge
- [ ] Misty Surge
- [ ] Grassy Surge
- [ ] Full Metal Body
- [ ] Shadow Shield
- [ ] Prism Armor
- [ ] Neuroforce

### Generation VIII (34)

- [ ] Intrepid Sword
- [ ] Dauntless Shield
- [ ] Libero
- [x] Ball Fetch — N/A: no competitive trainer-battle effect
- [ ] Cotton Down
- [ ] Propeller Tail
- [ ] Mirror Armor
- [ ] Gulp Missile
- [ ] Stalwart
- [ ] Steam Engine
- [ ] Punk Rock
- [ ] Sand Spit
- [ ] Ice Scales
- [ ] Ripen
- [ ] Ice Face
- [ ] Power Spot
- [ ] Mimicry
- [ ] Screen Cleaner
- [ ] Steely Spirit
- [ ] Perish Body
- [ ] Wandering Spirit
- [ ] Gorilla Tactics
- [ ] Neutralizing Gas
- [ ] Pastel Veil
- [ ] Hunger Switch
- [ ] Quick Draw
- [ ] Unseen Fist
- [ ] Curious Medicine
- [ ] Transistor
- [ ] Dragon’s Maw
- [ ] Chilling Neigh
- [ ] Grim Neigh
- [ ] As One (Glastrier)
- [ ] As One (Spectrier)

### Generation IX (46)

- [ ] Lingering Aroma
- [ ] Seed Sower
- [ ] Thermal Exchange
- [ ] Anger Shell
- [ ] Purifying Salt
- [ ] Well-Baked Body
- [ ] Wind Rider
- [ ] Guard Dog
- [ ] Rocky Payload
- [ ] Wind Power
- [ ] Zero to Hero
- [ ] Commander
- [ ] Electromorphosis
- [ ] Protosynthesis
- [ ] Quark Drive
- [ ] Good as Gold
- [ ] Vessel of Ruin
- [ ] Sword of Ruin
- [ ] Tablets of Ruin
- [ ] Beads of Ruin
- [ ] Orichalcum Pulse
- [ ] Hadron Engine
- [ ] Opportunist
- [ ] Cud Chew
- [ ] Sharpness
- [ ] Supreme Overlord
- [ ] Costar
- [ ] Toxic Debris
- [ ] Armor Tail
- [ ] Earth Eater
- [ ] Mycelium Might
- [ ] Mind’s Eye
- [ ] Supersweet Syrup
- [ ] Hospitality
- [ ] Toxic Chain
- [ ] Embody Aspect
- [ ] Tera Shift
- [ ] Tera Shell
- [ ] Teraform Zero
- [ ] Poison Puppeteer
- [ ] Piercing Drill
- [ ] Dragonize
- [ ] Mega Sol
- [ ] Spicy Spray
- [ ] Eelevate
- [ ] Fire Mane

## Deferred constraints

- 不把计算器扩张为完整战斗模拟器；需要额外战斗历史的特性必须先定义最小输入契约。
- 未实现特性不得被标记为已判断无效。
- Mega 形态按其 Mega 后固定特性处理，不能沿用基础形态的特性分布。

## Current state

- Adaptability 已实现，作为历史基线直接勾选。
- Run Away、Honey Gather、Ball Fetch 在竞技训练家战斗中无效果，记为 `N/A`。
- 2026-08-05：伤害相关性调研见 Goal 中的 first-freeze 笔记；首批范围产品决策见 [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]]。已按机制族开子 issue（见 Child issues）。Mold Breaker 族剔出首批；Parental Bond 见 defer 子 issue。
