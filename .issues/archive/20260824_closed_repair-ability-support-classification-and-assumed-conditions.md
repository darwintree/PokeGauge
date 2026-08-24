---
# This section is managed by the CLI. Do not edit manually.
id: "71eefccc-03f0-4e96-a379-8061adbf1f8c"
title: "Repair ability support classification and assumed conditions"
status: "closed"
priority: "medium"
labels: ["BUG"]
created_at: "2026-08-24T11:56:00Z"
updated_at: "2026-08-24T23:49:00Z"
---
## Problem

Ability Track 当前用 `@smogon/calc` 是否认识 Ability 名称来决定红色“不支持”标记，但“calc 认识”不等于产品能够正确计算：

- Rough Skin 虽被 calc 识别，但没有当前普通命中伤害所需的效果钩子；
- Supreme Overlord 虽被 calc 识别，但产品没有传入 `alliesFainted`；
- 迁移前约定为“选中即默认条件满足”的 Ability，迁移后没有把假设状态传给 calc，绿点仍在但效果可能没有生效。

因此 UI 标记与实际运行时支持状态不一致。完整审计见 [[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]。

## Required behavior

### 1. 统一判定产品支持状态

- 每项 Ability 归入且仅归入 `supported`、`assumed-satisfied`、`unsupported`、`none` 四类。
- `supported`：产品保留显示，当前计算行为已支持，不显示状态点。
- `assumed-satisfied`：产品保留显示，选中即代表约定条件满足，显示绿色状态点。
- `unsupported`：产品保留显示，效果可能在计算器结果中体现且产品计划支持，但当前尚未正确计算，显示红色状态点。
- `none`：效果与产品计算范围无关或产品明确不计划支持；在 Ability 列表中以灰色禁用项显示，不可选择。
- 建立一个集中、可测试的 Ability 支持判定，供 Ability Track、Scenario compiler 与 calc adapter 共同使用；不要在组件内逐项打补丁。
- `unsupported` 必须同时满足：效果可能在计算器结果中体现；产品计划支持。仅“长期 checklist 未勾选”或“calc 能识别名称”都不足以进入该集合。
- calc 不认识、缺少对应效果钩子或产品未提供必要输入，只是判断已计划 Ability 是否 unsupported 的实现证据。
- Rough Skin 和 Supreme Overlord 必须被判定并显示为当前不支持。

### 2. 修复默认条件满足

保持迁移前已经冻结的产品契约：选中以下 Ability 即代表条件已满足，并显示静态绿点，不新增 HP、状态或对手状态 Track：

- Multiscale：满 HP；
- Overgrow、Blaze、Torrent、Swarm：低 HP；
- Guts、Marvel Scale：处于满足效果的异常状态；
- Merciless：目标处于中毒状态。
- Plus、Minus：场上已有满足其效果的 Plus／Minus 队友。
- Toxic Boost：自身处于中毒状态。
- Flare Boost：自身处于灼伤状态。
- Analytic：本回合最后行动。
- Shadow Shield：满 HP。
- Tera Shell：满 HP。

适配层必须把这些假设转换为 calc 实际读取的输入，确保绿点与最终伤害结果一致。

### 3. 不复刻 calc 未支持的效果

- `@smogon/calc` 当前版本没有实现或不认识的 Ability，现阶段产品不实现本地公式补丁。
- 已计划支持且因此无法正确计算的 Ability 判定为不支持并显示红色标记；没有支持计划的归入 none 并以灰色禁用项显示。
- Champions 使用率默认若命中 none Ability，选择中性的 No Ability（`-`）项，不顺延到下一项 Ability。
- 后续若升级 calc 后获得原生支持，只需重新验证并调整集中支持判定；本 issue 不升级 calc。

## Generation III reviewed decisions

2026-08-24 用户完成 76 项逐项审阅并确认导出结果为最终裁决。导出中的 Flame Body 与 Keen Eye 虽未勾 `reviewed`，但均已设置明确 decision；本轮“审阅完毕”的确认覆盖该布尔遗漏。

### Assumed-Satisfied（8）

- Plus（57）、Minus（58）
- Guts（62）、Marvel Scale（63）
- Overgrow（65）、Blaze（66）、Torrent（67）、Swarm（68）

### Unsupported（16）

- Damp（6）：与 Self-Destruct／Explosion 的招式失败联动
- Color Change（16）：受击后的属性变化
- Shield Dust（19）、Own Tempo（20）、Serene Grace（32）、Poison Point（38）、Water Veil（41）、Flame Body（49）、Shed Skin（61）：计划中的追加效果／异常状态语义
- Rough Skin（24）：接触反伤
- Clear Body（29）、White Smoke（73）：能力下降防护
- Illuminate（35）：命中率语义
- Rain Dish（44）：天气下的 HP 回复
- Forecast（59）：形态、属性与天气耦合
- Sticky Hold（60）：与 Knock Off 的道具联动

### Supported（21）

Drizzle（2）、Battle Armor（4）、Sand Veil（8）、Volt Absorb（10）、Water Absorb（11）、Cloud Nine（13）、Compound Eyes（14）、Flash Fire（18）、Intimidate（22）、Wonder Guard（25）、Levitate（26）、Lightning Rod（31）、Huge Power（37）、Soundproof（43）、Sand Stream（45）、Thick Fat（47）、Hustle（55）、Drought（70）、Pure Power（74）、Shell Armor（75）、Air Lock（76）。

### None（31）

Stench（1）、Speed Boost（3）、Sturdy（5）、Limber（7）、Static（9）、Oblivious（12）、Insomnia（15）、Immunity（17）、Suction Cups（21）、Shadow Tag（23）、Effect Spore（27）、Synchronize（28）、Natural Cure（30）、Swift Swim（33）、Chlorophyll（34）、Trace（36）、Inner Focus（39）、Magma Armor（40）、Magnet Pull（42）、Pressure（46）、Early Bird（48）、Run Away（50）、Keen Eye（51）、Hyper Cutter（52）、Pickup（53）、Truant（54）、Cute Charm（56）、Liquid Ooze（64）、Rock Head（69）、Arena Trap（71）、Vital Spirit（72）。

## Generation IV reviewed decisions

2026-08-24 用户完成 47 项逐项审阅，导出结果全部标记为 reviewed。

### Assumed-Satisfied（0）

Generation IV 没有新增 Assumed-Satisfied Ability。Slow Start（112）计划未来按 assumed-satisfied 支持，但在实现前保持 unsupported。

### Unsupported（13）

- Tangled Feet（77）：混乱状态下的闪避率
- Rivalry（79）：对手性别条件下的伤害倍率；可考虑支持
- Gluttony（82）：树果触发 HP 阈值
- Simple（86）：能力变化倍率
- Poison Heal（90）、Hydration（93）、Magic Guard（98）、Leaf Guard（102）、Ice Body（115）：异常状态、间接伤害或回合回复语义
- Skill Link（92）：多段招式命中次数
- Mold Breaker（104）：跨 Ability 压制
- Slow Start（112）：回合条件下的攻击修正；计划未来按 assumed-satisfied 支持
- Multitype（121）：持有物驱动的自身属性变化

### Supported（23）

Motor Drive（78）、Snow Cloak（81）、Heatproof（85）、Dry Skin（87）、Download（88）、Iron Fist（89）、Adaptability（91）、Solar Power（94）、Normalize（96）、Sniper（97）、No Guard（99）、Technician（101）、Klutz（103）、Super Luck（105）、Unaware（109）、Tinted Lens（110）、Filter（111）、Scrappy（113）、Storm Drain（114）、Solid Rock（116）、Snow Warning（117）、Reckless（120）、Flower Gift（122）。

Solar Power 的每回合 HP 减少尚未支持，只在 issue 中记录，不在前端显示 unsupported。Flower Gift 的形态／状态选择应作为一般宝可梦状态输入单独处理。

### None（11）

Steadfast（80）、Anger Point（83）、Unburden（84）、Quick Feet（95）、Stall（100）、Aftermath（106）、Anticipation（107）、Forewarn（108）、Honey Gather（118）、Frisk（119）、Bad Dreams（123）。

## Generation V reviewed decisions

2026-08-24 用户完成 41 项逐项审阅，导出结果全部标记为 reviewed。

### Assumed-Satisfied（4）

- Multiscale（136）：按满 HP 计算；当前实现仍需修复到完全符合该契约
- Toxic Boost（137）：选中即按已中毒计算
- Flare Boost（138）：选中即按已灼伤计算
- Analytic（148）：选中即按本回合最后行动计算

### Unsupported（16）

Contrary（126）、Cursed Body（130）、Weak Armor（133）、Heavy Metal（134）、Light Metal（135）、Harvest（139）、Overcoat（142）、Poison Touch（143）、Big Pecks（145）、Wonder Skin（147）、Mummy（152）、Iron Barbs（160）、Zen Mode（161）、Victory Star（162）、Turboblaze（163）、Teravolt（164）。

### Supported（6）

Sheer Force（125）、Unnerve（127）、Defiant（128）、Infiltrator（151）、Sap Sipper（157）、Sand Force（159）。

### None（15）

Pickpocket（124）、Defeatist（129）、Healer（131）、Friend Guard（132）、Telepathy（140）、Moody（141）、Regenerator（144）、Sand Rush（146）、Illusion（149）、Imposter（150）、Moxie（153）、Justified（154）、Rattled（155）、Magic Bounce（156）、Prankster（158）。其中 Moody 明确不计划支持。

## Generation VI reviewed decisions

2026-08-24 用户完成 27 项逐项审阅，导出结果全部标记为 reviewed。

### Assumed-Satisfied（0）

Generation VI 没有新增 Assumed-Satisfied Ability。

### Unsupported（6）

Flower Veil（166）、Cheek Pouch（167）、Parental Bond（185）、Primordial Sea（189）、Desolate Land（190）、Delta Stream（191）。

### Supported（14）

Protean（168）、Fur Coat（169）、Bulletproof（171）、Competitive（172）、Strong Jaw（173）、Refrigerate（174）、Mega Launcher（178）、Grass Pelt（179）、Tough Claws（181）、Pixilate（182）、Aerilate（184）、Dark Aura（186）、Fairy Aura（187）、Aura Break（188）。

Dark Aura、Fairy Aura、Aura Break 当前只确认普通单体计算支持；友方效果暂未支持，但不因此在前端标记 unsupported。

### None（7）

Aroma Veil（165）、Magician（170）、Sweet Veil（175）、Stance Change（176）、Gale Wings（177）、Symbiosis（180）、Gooey（183）。

## Generation VII reviewed decisions

2026-08-24 用户完成 42 项逐项审阅，导出结果全部标记为 reviewed。

### Assumed-Satisfied（2）

- Merciless（196）：选中即按目标已中毒计算
- Shadow Shield（231）：选中即按满 HP 计算

### Unsupported（17）

Stamina（192）、Water Compaction（195）、Shields Down（197）、Stakeout（198）、Berserk（201）、Disguise（209）、Power Construct（211）、Corrosion（212）、Comatose（213）、Queenly Majesty（214）、Battery（217）、Dazzling（219）、RKS System（225）、Psychic Surge（227）、Misty Surge（228）、Grassy Surge（229）、Full Metal Body（230）。

Comatose 需要作为防守方与引起异常状态的招式联动；Battery 的队友伤害加成需要支持，但当前没有对应输入。

### Supported（9）

Water Bubble（199）、Steelworker（200）、Long Reach（203）、Liquid Voice（204）、Galvanize（206）、Fluffy（218）、Electric Surge（226）、Prism Armor（232）、Neuroforce（233）。

### None（14）

Wimp Out（193）、Emergency Exit（194）、Slush Rush（202）、Triage（205）、Surge Surfer（207）、Schooling（208）、Battle Bond（210）、Innards Out（215）、Dancer（216）、Soul-Heart（220）、Tangling Hair（221）、Receiver（222）、Power of Alchemy（223）、Beast Boost（224）。

## Generation VIII reviewed decisions

2026-08-24 用户完成 34 项逐项审阅，导出结果全部标记为 reviewed。

### Assumed-Satisfied（0）

Generation VIII 没有新增 Assumed-Satisfied Ability。

### Unsupported（14）

Mirror Armor（240）、Ripen（247）、Ice Face（248）、Power Spot（249）、Mimicry（250）、Screen Cleaner（251）、Wandering Spirit（254）、Neutralizing Gas（256）、Pastel Veil（257）、Hunger Switch（258）、Curious Medicine（261）、Dragon’s Maw（263）、As One (Glastrier)（266）、As One (Spectrier)（267）。

Screen Cleaner 生效时需要将 Screen Track 归为无墙；Curious Medicine 生效时需要将对应 Stage 全部归零。

### Supported（9）

Intrepid Sword（234）、Dauntless Shield（235）、Libero（236）、Punk Rock（244）、Sand Spit（245）、Ice Scales（246）、Steely Spirit（252）、Gorilla Tactics（255）、Transistor（262）。

Steely Spirit 当前只确认自身钢属性招式增伤；友方支持仍需补充，但不因此在前端标记 unsupported。

### None（11）

Ball Fetch（237）、Cotton Down（238）、Propeller Tail（239）、Gulp Missile（241）、Stalwart（242）、Steam Engine（243）、Perish Body（253）、Quick Draw（259）、Unseen Fist（260）、Chilling Neigh（264）、Grim Neigh（265）。

## Generation IX reviewed decisions

2026-08-24 用户完成 46 项逐项审阅，导出结果全部标记为 reviewed。

### Assumed-Satisfied（1）

- Tera Shell（305）：选中即按满 HP 计算

### Unsupported（29）

Lingering Aroma（268）、Seed Sower（269）、Thermal Exchange（270）、Anger Shell（271）、Guard Dog（275）、Wind Power（277）、Zero to Hero（278）、Commander（279）、Electromorphosis（280）、Protosynthesis（281）、Quark Drive（282）、Opportunist（290）、Cud Chew（291）、Supreme Overlord（293）、Costar（294）、Toxic Debris（295）、Armor Tail（296）、Mind’s Eye（299）、Supersweet Syrup（300）、Toxic Chain（302）、Embody Aspect（303）、Tera Shift（304）、Teraform Zero（306）、Poison Puppeteer（307）、Dragonize（309）、Mega Sol（310）、Spicy Spray（311）、Eelevate（312）、Fire Mane（313）。

### Supported（12）

Purifying Salt（272）、Well-Baked Body（273）、Wind Rider（274）、Rocky Payload（276）、Vessel of Ruin（284）、Sword of Ruin（285）、Tablets of Ruin（286）、Beads of Ruin（287）、Orichalcum Pulse（288）、Hadron Engine（289）、Sharpness（292）、Earth Eater（297）。

Purifying Salt 的异常状态防护、Well-Baked Body 的防御提升尚未支持；灾祸之宝族仍需完整覆盖全场效果。这些属于已支持特性的未覆盖副作用，不因此在前端标记 unsupported。

### None（4）

Good as Gold（283）、Mycelium Might（298）、Hospitality（301）、Piercing Drill（308）。

## Out of scope

- 实现 Rough Skin、Supreme Overlord 或其他 calc 缺失效果；
- 为默认条件族新增用户输入 Track；
- 升级或 fork `@smogon/calc`；

## Issue Assessment

- Impact: 当前红点会漏报真实的不支持项，绿点也可能声称效果已生效但伤害未变化。
- Evidence: Rough Skin 与 Supreme Overlord 当前均无红点；多个 Assumed-Satisfied Ability 在迁移后未向 calc 提供约定条件输入。
- Scope: 支持状态判定、Ability Track 标记、calc 输入适配及对应测试。
- Decision: valid

## Verification Checklist

- [x] 支持判定不再等同于 calc 名称识别，且只有一个权威来源
- [x] Rough Skin、Supreme Overlord 显示红色不支持标记
- [x] calc 未支持且与伤害相关的 Ability 显示红色不支持标记，无本地公式实现
- [x] supported、assumed-satisfied、unsupported、none 由同一个权威来源判定
- [x] none Ability 在产品 Ability 列表中以灰色禁用项显示且不可选择
- [x] 使用率默认命中 none Ability 时选择中性的 No Ability（`-`）项
- [x] 十五个 Assumed-Satisfied Ability 均显示绿点且实际伤害符合默认条件已满足
- [x] Generation III 的 21 项 supported、8 项 assumed-satisfied、16 项 unsupported、31 项 none 与审阅结果一致
- [x] Generation IV 的 23 项 supported、0 项 assumed-satisfied、13 项 unsupported、11 项 none 与审阅结果一致
- [x] Generation V 的 6 项 supported、4 项 assumed-satisfied、16 项 unsupported、15 项 none 与审阅结果一致
- [x] Generation VI 的 14 项 supported、0 项 assumed-satisfied、6 项 unsupported、7 项 none 与审阅结果一致
- [x] Generation VII 的 9 项 supported、2 项 assumed-satisfied、17 项 unsupported、14 项 none 与审阅结果一致
- [x] Generation VIII 的 9 项 supported、0 项 assumed-satisfied、14 项 unsupported、11 项 none 与审阅结果一致
- [x] Generation IX 的 12 项 supported、1 项 assumed-satisfied、29 项 unsupported、4 项 none 与审阅结果一致
- [x] 四种分类路径均有最小回归测试
- [x] 更新父 issue 的运行时 checklist 与说明

## Progress Log

- 2026-08-24: 从 Ability 全量审计中拆出独立修复项，冻结支持标记、默认条件和 calc 缺失效果的处理边界。
- 2026-08-24: 完成 Generation III 全部 76 项人工审阅；新增 Plus／Minus 默认条件满足契约。
- 2026-08-24: 完成 Generation IV 全部 47 项人工审阅；记录 Solar Power 与 Flower Gift 的后续边界。
- 2026-08-24: 完成 Generation V 全部 41 项人工审阅；冻结 4 项 Assumed-Satisfied、16 项 unsupported，并新增 Toxic Boost、Flare Boost、Analytic 默认条件契约。
- 2026-08-24: 将 neutral 拆为 supported 与 none。回溯整理 Generation III-V，分别得到 21/8/16/31、23/0/13/11、6/4/16/15。
- 2026-08-24: 完成 Generation VI 全部 27 项人工审阅；冻结 14 项 supported、0 项 assumed-satisfied、6 项 unsupported、7 项 none，并记录气场族暂不覆盖友方效果。
- 2026-08-24: 完成 Generation VII 全部 42 项人工审阅；冻结 9 项 supported、2 项 assumed-satisfied、17 项 unsupported、14 项 none，并新增 Shadow Shield 满 HP 默认条件契约。
- 2026-08-24: 完成 Generation VIII 全部 34 项人工审阅；冻结 9 项 supported、0 项 assumed-satisfied、14 项 unsupported、11 项 none，并记录 Screen Cleaner、Curious Medicine 与 Steely Spirit 的实现边界。
- 2026-08-24: 完成 Generation IX 全部 46 项人工审阅；冻结 12 项 supported、1 项 assumed-satisfied、29 项 unsupported、4 项 none，并新增 Tera Shell 满 HP 默认条件契约。
- 2026-08-24: 实现集中分类：仅枚举 assumed-satisfied、unsupported、none，其他 Ability 默认 supported；Track、catalog、compiler 和 calc adapter 共用该裁决。
- 2026-08-24: calc adapter 为十五项默认条件传入 HP、状态、`abilityOn` 或行动顺序输入；Analytic 的 Pursuit 冲突处理见 [[../docs/traces/implementations/2026-08-24-ability-support-classification|implementation trace]]。
- 2026-08-24: 移除 Dragonize、Mega Sol、Eelevate、Fire Mane 的残留本地效果路径；Rough Skin 与 Supreme Overlord 明确保持数值中性并显示 unsupported。
- 2026-08-24: 初版将 none 从 Ability catalog 隐藏；没有可见身份特性时回退 No Ability。另修复 calc 在省略 Ability 时自动选择物种默认特性的适配问题。
- 2026-08-25: 按后续确认将 none 改为灰色禁用显示；Champions 使用率默认命中 none 时改选中性的 No Ability（`-`）项。
- 2026-08-24: 验证 `pnpm exec vitest run`（73 files / 702 tests）、`pnpm build` 与 `git diff --check` 全部通过。
