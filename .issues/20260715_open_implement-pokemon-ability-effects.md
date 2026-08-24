---
# This section is managed by the CLI. Do not edit manually.
id: "b2408539-8119-4aa8-b8af-928bb8710e3b"
title: "Implement Pokémon ability effects"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-08-24T15:21:00Z"
---
## Goal

跟踪 `@smogon/calc` 运行时迁移后仍需要产品侧处理的 Ability 缺口，而不是逐项在本地复刻伤害公式。

calc 能识别且现有 Scenario 输入足以表达的 Ability 直接参与运行时伤害。只有以下情况需要后续子 issue：

- 当前 calc 版本不认识该 Ability；
- Ability 需要当前产品未建模的战斗状态、历史或队友输入；
- 本地 Track activation／provenance 无法诚实解释 calc 已执行的效果；
- Ability 需要改变 Scenario 生成，而不仅是单次伤害调用。

调研、Champions 可用特性与使用率优先级见 [Champions ability inventory and priority](../docs/research/2026-07-30-champions-ability-inventory-and-priority.md)。

伤害计算器相关性分桶与首批冻结候选见 [Champions ability damage-calc relevance and first freeze](../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze.md)（规划调研，非产品契约）。

## Tracking

- 不再为 calc 已处理的 Ability 创建本地公式实现票。
- 新子 issue 必须写明缺失的产品输入、calc 版本缺口或展示错误；仅“checklist 未勾选”不是工作依据。
- 共享同一输入契约的多个 Ability 可以合并处理。
- 下方 checklist 已于 2026-08-24 按运行时是否诚实还原普通命中伤害贡献重审并重打勾，现代表迁移后支持状态。
- calc 认识并不等于产品支持：仍需区分 calc 能应用但产品未提供输入（HP%、状态、队友、KO 数、多段等）、calc 无对应伤害钩子，以及 calc 0.11.0 缺失三类。

## Child issues

- [[archive/20260805_closed_ability-track-none|Ability Track none]]
- [[archive/20260805_closed_ability-init-projection-to-weather-terrain-stage|Ability init projection to Weather Terrain Stage]]
- [[archive/20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]
- [[archive/20260805_closed_ability-critical-hit-and-accuracy-modifiers|Ability critical-hit and accuracy modifiers]]
- [[archive/20260805_closed_ability-stage-and-screen-bypass|Ability stage and screen bypass]]
- [[archive/20260805_closed_ability-contact-and-held-item-interactions|Ability contact and held-item interactions]]
- [[archive/20260805_closed_green-dot-conditional-ability-effects|Green-dot conditional ability effects]]
- [[archive/20260805_closed_ability-immunities-and-type-exceptions|Ability immunities and type exceptions]]
- [[archive/20260805_closed_scenario-move-type-rewriting-and-protean-family-stab|Scenario Move Type rewriting and Protean-family STAB]]
- [[archive/20260805_closed_ability-weather-and-item-composition|Ability weather and item composition]]
- [[archive/20260824_closed_repair-ability-support-classification-and-assumed-conditions|Repair ability support classification and assumed conditions]]
- [[20260805_open_implement-parental-bond|Implement Parental Bond]]

## Runtime support checklist (313, re-audited 2026-08-24)

下列勾选项代表当前运行时（`@smogon/calc` 0.11.0 + 本地 compiler／projection）是否诚实还原该 Ability 的普通命中伤害／命中率／会心贡献。`[x]` 只表示运行时数值正确；`[ ]` 表示算不出（calc 缺失、需要产品未建模输入、无对应伤害钩子，或尚未实现）。Track activation／provenance 是否能解释该数值另行记录，不影响本勾选。标记不代表「已判断无效（inactive）」。

### 分类依据

- `[x]`：本地 `compileAbilityEffect`／`scenario-compiler` 处理且 calc 能按已提供输入正确生效；或 calc 直接应用且伤害正确。部分 calc 直应用项存在 provenance 显示为 inactive 的展示缺口，见 Current state。
- 例外：A 桶的 Illuminate（35）、Keen Eye（51）虽被调研归入 A（普通命中），但产品未实现其命中率防护效果，故仍按 `[ ]`；其余 A 桶普通命中项均按 `[x]`。
- `[ ]`：calc 0.11.0 不认识的（Dragonize、Mega Sol、Eelevate、Fire Mane）；仍需产品未建模输入的（队友项如 Friend Guard、KO 数如 Supreme Overlord、多段如 Parental Bond/Skill Link）；calc 无普通命中钩子的（如 Dragon’s Maw、Rough Skin、Iron Barbs、Flame Body）；以及交叉能力压制（Mold Breaker/Teravolt/Turboblaze/Neutralizing Gas）。Mind’s Eye 另因本地生成名使用 Unicode `’` 而 calc 的 `hasAbility` 使用 ASCII `'` 精确匹配，当前 hook 不会触发。
- Assumed-Satisfied 例外：十五项条件特性选中即默认满足约定的 HP、状态、队友或行动顺序条件，并在 Ability Track 显示静态绿点；这不是要求新增对应 Track。calc 适配层现已传入这些假设条件，运行时正确的项目按 `[x]` 记录。

### Generation III (76)

- [ ] Stench
- [x] Drizzle
- [ ] Speed Boost
- [x] Battle Armor
- [ ] Sturdy
- [ ] Damp
- [ ] Limber
- [x] Sand Veil
- [ ] Static
- [x] Volt Absorb
- [x] Water Absorb
- [ ] Oblivious
- [x] Cloud Nine
- [x] Compound Eyes
- [ ] Insomnia
- [ ] Color Change
- [ ] Immunity
- [x] Flash Fire
- [ ] Shield Dust
- [ ] Own Tempo
- [ ] Suction Cups
- [x] Intimidate
- [ ] Shadow Tag
- [ ] Rough Skin
- [x] Wonder Guard
- [x] Levitate
- [ ] Effect Spore
- [ ] Synchronize
- [ ] Clear Body
- [ ] Natural Cure
- [x] Lightning Rod
- [ ] Serene Grace
- [ ] Swift Swim
- [ ] Chlorophyll
- [ ] Illuminate
- [ ] Trace
- [x] Huge Power
- [ ] Poison Point
- [ ] Inner Focus
- [ ] Magma Armor
- [ ] Water Veil
- [ ] Magnet Pull
- [x] Soundproof
- [ ] Rain Dish
- [x] Sand Stream
- [ ] Pressure
- [x] Thick Fat
- [ ] Early Bird
- [ ] Flame Body
- [x] Run Away — N/A: no competitive trainer-battle effect
- [ ] Keen Eye
- [ ] Hyper Cutter
- [ ] Pickup
- [ ] Truant
- [x] Hustle
- [ ] Cute Charm
- [x] Plus
- [x] Minus
- [ ] Forecast
- [ ] Sticky Hold
- [ ] Shed Skin
- [x] Guts
- [x] Marvel Scale
- [ ] Liquid Ooze
- [x] Overgrow
- [x] Blaze
- [x] Torrent
- [x] Swarm
- [ ] Rock Head
- [x] Drought
- [ ] Arena Trap
- [ ] Vital Spirit
- [ ] White Smoke
- [x] Pure Power
- [x] Shell Armor
- [x] Air Lock

### Generation IV (47)

- [ ] Tangled Feet
- [x] Motor Drive
- [ ] Rivalry
- [ ] Steadfast
- [x] Snow Cloak
- [ ] Gluttony
- [ ] Anger Point
- [ ] Unburden
- [x] Heatproof
- [ ] Simple
- [x] Dry Skin
- [x] Download
- [x] Iron Fist
- [ ] Poison Heal
- [x] Adaptability — implemented
- [ ] Skill Link
- [ ] Hydration
- [x] Solar Power
- [ ] Quick Feet
- [x] Normalize
- [x] Sniper
- [ ] Magic Guard
- [x] No Guard
- [ ] Stall
- [x] Technician
- [ ] Leaf Guard
- [x] Klutz
- [ ] Mold Breaker
- [x] Super Luck
- [ ] Aftermath
- [ ] Anticipation
- [ ] Forewarn
- [x] Unaware
- [x] Tinted Lens
- [x] Filter
- [ ] Slow Start
- [x] Scrappy
- [x] Storm Drain
- [ ] Ice Body
- [x] Solid Rock
- [x] Snow Warning
- [x] Honey Gather — N/A: no competitive trainer-battle effect
- [ ] Frisk
- [x] Reckless
- [ ] Multitype
- [x] Flower Gift
- [ ] Bad Dreams

### Generation V (41)

- [ ] Pickpocket
- [x] Sheer Force
- [ ] Contrary
- [x] Unnerve
- [x] Defiant
- [ ] Defeatist
- [ ] Cursed Body
- [ ] Healer
- [ ] Friend Guard
- [ ] Weak Armor
- [ ] Heavy Metal
- [ ] Light Metal
- [x] Multiscale
- [x] Toxic Boost
- [x] Flare Boost
- [ ] Harvest
- [ ] Telepathy
- [ ] Moody
- [ ] Overcoat
- [ ] Poison Touch
- [ ] Regenerator
- [ ] Big Pecks
- [ ] Sand Rush
- [ ] Wonder Skin
- [x] Analytic
- [ ] Illusion
- [ ] Imposter
- [x] Infiltrator
- [ ] Mummy
- [ ] Moxie
- [ ] Justified
- [ ] Rattled
- [ ] Magic Bounce
- [x] Sap Sipper
- [ ] Prankster
- [x] Sand Force
- [ ] Iron Barbs
- [ ] Zen Mode
- [ ] Victory Star
- [ ] Turboblaze
- [ ] Teravolt

### Generation VI (27)

- [ ] Aroma Veil
- [ ] Flower Veil
- [ ] Cheek Pouch
- [x] Protean
- [x] Fur Coat
- [ ] Magician
- [x] Bulletproof
- [x] Competitive
- [x] Strong Jaw
- [x] Refrigerate
- [ ] Sweet Veil
- [ ] Stance Change
- [ ] Gale Wings
- [x] Mega Launcher
- [x] Grass Pelt
- [ ] Symbiosis
- [x] Tough Claws
- [x] Pixilate
- [ ] Gooey
- [x] Aerilate
- [ ] Parental Bond
- [x] Dark Aura
- [x] Fairy Aura
- [x] Aura Break
- [ ] Primordial Sea
- [ ] Desolate Land
- [ ] Delta Stream

### Generation VII (42)

- [ ] Stamina
- [ ] Wimp Out
- [ ] Emergency Exit
- [ ] Water Compaction
- [x] Merciless
- [ ] Shields Down
- [ ] Stakeout
- [x] Water Bubble
- [x] Steelworker
- [ ] Berserk
- [ ] Slush Rush
- [x] Long Reach
- [x] Liquid Voice
- [ ] Triage
- [x] Galvanize
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
- [x] Fluffy
- [ ] Dazzling
- [ ] Soul-Heart
- [ ] Tangling Hair
- [ ] Receiver
- [ ] Power of Alchemy
- [ ] Beast Boost
- [ ] RKS System
- [x] Electric Surge
- [ ] Psychic Surge
- [ ] Misty Surge
- [ ] Grassy Surge
- [ ] Full Metal Body
- [x] Shadow Shield
- [x] Prism Armor
- [x] Neuroforce

### Generation VIII (34)

- [x] Intrepid Sword
- [x] Dauntless Shield
- [x] Libero
- [x] Ball Fetch — N/A: no competitive trainer-battle effect
- [ ] Cotton Down
- [ ] Propeller Tail
- [ ] Mirror Armor
- [ ] Gulp Missile
- [ ] Stalwart
- [ ] Steam Engine
- [x] Punk Rock
- [x] Sand Spit
- [x] Ice Scales
- [ ] Ripen
- [ ] Ice Face
- [ ] Power Spot
- [ ] Mimicry
- [ ] Screen Cleaner
- [x] Steely Spirit
- [ ] Perish Body
- [ ] Wandering Spirit
- [x] Gorilla Tactics
- [ ] Neutralizing Gas
- [ ] Pastel Veil
- [ ] Hunger Switch
- [ ] Quick Draw
- [ ] Unseen Fist
- [ ] Curious Medicine
- [x] Transistor
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
- [x] Purifying Salt
- [x] Well-Baked Body
- [x] Wind Rider
- [ ] Guard Dog
- [x] Rocky Payload
- [ ] Wind Power
- [ ] Zero to Hero
- [ ] Commander
- [ ] Electromorphosis
- [ ] Protosynthesis
- [ ] Quark Drive
- [ ] Good as Gold
- [x] Vessel of Ruin
- [x] Sword of Ruin
- [x] Tablets of Ruin
- [x] Beads of Ruin
- [x] Orichalcum Pulse
- [x] Hadron Engine
- [ ] Opportunist
- [ ] Cud Chew
- [x] Sharpness
- [ ] Supreme Overlord
- [ ] Costar
- [ ] Toxic Debris
- [ ] Armor Tail
- [x] Earth Eater
- [ ] Mycelium Might
- [ ] Mind’s Eye
- [ ] Supersweet Syrup
- [ ] Hospitality
- [ ] Toxic Chain
- [ ] Embody Aspect
- [ ] Tera Shift
- [x] Tera Shell
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

- 2026-08-24：重审全部 313 项支持情况，把「calc 认识」细化为「运行时诚实还原」。确认以下偏差：
  - 大将（Supreme Overlord 293）与粗糙皮肤（Rough Skin 24）当前 **无法触发** —— calc 认识 Supreme Overlord 但产品从不传入 `alliesFainted`，calc 0.11.0 对 Rough Skin 无普通命中伤害钩子；二者均应按 `[ ]` 处理，而不是当作已支持但未激活。
  - Assumed-Satisfied 契约已扩展并冻结为十五项；calc adapter 现会传入对应 HP、状态、`abilityOn` 与行动顺序输入，默认条件重新实际生效。
  - Protean、Libero 的完整战斗状态类型持久化不在产品输入契约内，但普通出招伤害已支持：本地 `scenario-move-type` 在非原生同属性招式上补普通 STAB，calc 0.11.0 的 `getStabMod` 也直接处理这两个 Ability；因此恢复为 `[x]`。Dragonize、Mega Sol、Eelevate、Fire Mane 维持 `[ ]`（calc 0.11.0 缺失）。
  - Dragon’s Maw（263）虽能通过 `toID` 的识别检查，但 calc 0.11.0 没有对应的普通伤害钩子；Mind’s Eye（299）传入 calc 时保留了 Unicode `’`，而 calc 内部按 ASCII `'` 精确比较，导致其 hook 不会触发；二者均维持 `[ ]`。
  - Download（88）、Intrepid Sword（234）、Normalize（96）、Tinted Lens（110）、Ruin 族等由 calc 直接应用、伤害正确，但 provenance/本地 Track 仍显示 inactive —— 属展示缺口，纳入 Child issue 处理，本身按 `[x]` 计。
- 2026-08-24：[[archive/20260824_closed_repair-ability-support-classification-and-assumed-conditions|独立修复]]建立 `supported`、`assumed-satisfied`、`unsupported`、`none` 集中裁决；Ability Track、catalog 与 compiler／calc adapter 共用该来源。Rough Skin（24）与 Supreme Overlord（293）现显示红点，none 不再显示，calc 未支持项不再保留本地公式补丁。
- 清单勾选已重打为运行时支持状态；若某项机制后续被 calc 版本或产品输入变化影响，需重新确认，不能沿用本次勾选。
- Run Away、Honey Gather、Ball Fetch 在竞技训练家战斗中无效果，历史上记为 `N/A`。
- 2026-08-05：伤害相关性调研见 Goal 中的 first-freeze 笔记；首批范围产品决策见 [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]]。已按机制族开子 issue（见 Child issues）。Mold Breaker 族剔出首批；Parental Bond 不进首批，实现见 [[20260805_open_implement-parental-bond|Implement Parental Bond]]（blocked by 多段伤害规格）。
- 2026-08-07：原「Defer Parental Bond until multi-hit」误把 defer 记录当成票；已改写为实现票 [[20260805_open_implement-parental-bond|Implement Parental Bond]]，并在多段 issue 标明 downstream。
