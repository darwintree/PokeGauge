---
# This section is managed by the CLI. Do not edit manually.
id: "653c4de0-3231-407b-98b1-b38ba4eab12a"
title: "Migrate runtime damage calculation to @smogon/calc"
status: "open"
priority: "high"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-08-19T06:05:00Z"
updated_at: "2026-08-19T06:05:00Z"
---
## Problem Statement

当前伤害计算依赖本地实现的 damage kernel（ADR 0001 决策）：从 PokeAPI 生成的资源出发，手写 Gen 9 固定威力公式、能力/道具/天气/场地修正，并用 @smogon/calc 仅作为测试 oracle。这带来三方面问题：

1. **维护成本高**：本地 kernel 要逐项复刻 calc 的能力、道具、天气、场地语义，239 个生成能力被标为 unsupported，能力/道具的战斗语义硬编码在本地代码里。
2. **语义不完整**：动态威力招式（Low Kick / Grass Knot 等）依赖手填 initialPower；Body Press / Foul Play / Psyshock 等 override 招式无法表达；版本漂移时（calc 0.11.0 缺 7 个新能力）只能本地拦截。
3. **信任断层**：本地 kernel 与 calc 之间的数值偏差需要持续的 oracle 审计（见 [[20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]]），测试用 calc 当 oracle 本质是"用实现测实现"。

## Solution

把运行时伤害计算切换到 @smogon/calc 黑盒：本地 calculateDamageRolls 内部替换为 calc.calculate() 调用，输出形状保持 { low: { normal, critical?, defenderHp }, high? } 不变，概率层（KO 概率、两下击杀、命中/会心卷积）一行不改。会心与命中保留本地逻辑，calc 只消费 isCrit 布尔。能力/道具支持边界切换为"calc 是否认识"，239 个能力自动解封；版本缺失条目显式拦截并显示 unsupported。

## User Stories

1. As a damage calculator user, I want the damage numbers for my Scenario to match the authoritative Smogon calc engine, so that my results are consistent with the competitive community's reference.
2. As a damage calculator user, I want abilities like Sharpness, Stakeout, and Beast Boost to no longer show "unsupported", so that I can calculate the damage of more realistic builds.
3. As a damage calculator user, I want the crit (会心) and accuracy (命中) probabilities to keep working exactly as before, so that my existing battle-odds expectations are unchanged.
4. As a damage calculator user, I want dynamic-power moves like Low Kick and Grass Knot to compute their power from the calc engine, so that their damage reflects weight-based formulas instead of a fixed approximation.
5. As a damage calculator user, I want the spread move toggle to keep working, so that I can still switch a spread move's 0.75x modifier on and off.
6. As a damage calculator user, I want the weather and terrain modifiers to be computed by the calc engine, so that Sun/Rain/Snow/Sand and Electric/Grassy/Misty/Psychic Terrain effects are consistent with Smogon.
7. As a damage calculator user, I want abilities missing from the installed calc version (e.g. Mega Sol, Dragonize, Eelevate, Fire Mane) to still display as unsupported, so that I am never silently given a wrong neutral calculation.
8. As a developer, I want to delete the local damage kernel and its oracle tests, so that I stop maintaining two damage engines and the "test the implementation with the implementation" pattern disappears.
9. As a developer, I want the calc engine to be the single source of truth for damage rolls, so that future rule changes only require bumping the calc dependency.
10. As a developer, I want a one-time old-vs-new comparison verification script, so that I can prove migration equivalence before deleting the local kernel.
11. As a developer, I want the resource generation script to keep emitting calc-usable names (calcAbilityName, calcItemName, calcSpeciesName), so that the runtime mapping to calc stays deterministic.
12. As a developer, I want unsupported moves like Body Press / Foul Play / Psyshock to remain explicitly unsupported, so that the product never silently computes them with the wrong stat.
13. As a developer, I want the probability layer to remain untouched, so that the classic/battle-odds probability modes and the KO probability convolution keep their exact behavior.

## Implementation Decisions

### 引擎方向与集成方式

- 运行时改用 @smogon/calc 做伤害计算，推翻 ADR 0001（本地 kernel 决策）；会心与命中保留本地逻辑。
- 黑盒直接消费 calc.calculate() 的 damage 数组，不复制公式；本地 calculateDamageRolls 内部替换为 calc 调用，输出形状保持 { low: { normal, critical?, defenderHp }, high? } 不变，概率层一行不改。
- 计算引擎是唯一 seam：下游 evaluate 的 summarizeDamage / fixedKOProbabilities 原样保留。

### 会心与命中（本地保留）

- Snapshot 的 criticalStage / alwaysHits / accuracy 字段不变。
- compiler 产出 isCrit（含 preventsCritical、criticalOnly 推导）与命中概率喂给 calc 与现有概率层；calc 只消费 isCrit 布尔（Move.isCrit）。
- 概率模式 classic 与 battle-odds 都保留，ProbabilityMode 原样保留，只有 roll 来源换成 calc。

### 天气与场地

- 天气与场地修正交给 calc 推导，不再维护本地 weather/terrain 修正。

### 招式

- 动态招式（Low Kick / Grass Knot 等）交 calc；本地 reviewedVariablePowerDefault 手填 initialPower 机制退役。
- Override 招式（Body Press / Foul Play / Psyshock / Photon Geyser / Shell Side Arm 等）不放行，继续 unsupported。
- 多段招式暂不支持多段展开，继续按单段计算（Move.hits 不参与伤害生成）；不新增多段逻辑。
- Spread 修正：保留 UI spread 开关；gameType 固定 Doubles，calc 调用时把 "spread 关" 映射成 move.target = normal，其余（含 terrain.makesSpread）交给 calc；删除本地 spreadModifier 逻辑。

### 能力

- 支持边界只看 calc 是否认识（gen.abilities.get(name) 是否存在）；不认识才显示红点/unsupported。
- 本地 DAMAGE_MODIFIER_ABILITY_IDS 白名单退役，239 个能力自动解封。行为不变：不支持的仍然显示不支持。
- 本地已实现但 calc 0.11.0 缺失的 4 个能力（MEGA_SOL / DRAGONIZE / EELEVATE / FIRE_MANE）走显式拦截 + 红点，复用 calc-missing 机制；记 upstream issue 候选；不写本地 patch 覆盖 calc（保持黑盒纯净）。

### 道具

- 非战斗道具忽略；两边都没有的私有 mega 石单独维护（不进入 calc 映射）。

### Species 归并

- 生成脚本 calcSpeciesName 增加归并规则（NFKD 归一化、去后缀、重复 token 去除、特例表），307 个形态名可映射，约 15 个碰撞组战斗等价，风险可控。独立提交。

### 版本漂移

- 有问题的暂不支持（排除），需要时向上游贡献代码。

### 旧实现与测试清理

- 删除本地 kernel（damage-kernel.ts、本地 ability/item/weather/terrain/screen 修正）与 calc oracle 测试。
- 回归保障用一次性新旧对比验证脚本，跑完即弃。

### 实施顺序与 ADR

- 先提交已改的 ability/item 映射重构；落地 species 归并规则；写 ADR 推翻 0001 记录"calc 黑盒 + 本地 crit/accuracy"；实施 calculateDamageRolls 内部替换；清理 oracle 测试。

## Testing Decisions

- 只测试外部行为，不测实现细节：主 seam 是 calculateDamageRolls（输入 CompiledDamageInput、输出 DamageKernelResult），其行为契约在迁移前后不变；下游概率层测试原样保留。
- 资源映射 seam 已有测试：inventory.test.ts 断言 calcItemName 可被 Generations.get(9).items.get() 解析；能力映射在生成产物上断言 calcAbilityName 可被 gen.abilities.get() 解析；species 归并新增归一化规则测试。
- 删除本地 kernel 的 calc oracle 对比测试（damage-kernel.test.ts、weather.test.ts、terrain.test.ts、screen.test.ts、ability.test.ts 中用 calculate() 的 oracle 断言），因为这些测试在用实现测实现。
- 迁移等价性用一次性新旧对比验证脚本（跑完即弃），不在仓库留下双引擎长期对比。
- 能力支持边界（calc 是否认识）的判定测试：对 calc 缺失的 4 个能力断言走 unsupported 拦截；对解封能力断言不再显示红点。

## Out of Scope

- 多段攻击的完整支持（Population Bomb、Triple Axel 的段数展开）——暂按单段计算，独立 feature。
- Override 招式（Body Press / Foul Play / Psyshock 等）的放行——保持 unsupported。
- calc 大版本升级——升级会带来字段变化，单独处理。
- 非战斗道具与私有 mega 石——非战斗道具忽略，私有 mega 石单独维护。
- 等级/单双打 UI 选项——保持 VGC Level 50、gameType Doubles。

## Further Notes

- 讨论 trace: [[../docs/traces/discussion/2026-08-19-smogon-calc-runtime-migration|Smogon calc 运行时迁移讨论记录]]（16 条决策）。
- 与 [[20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]] 的关系：该 issue 的"数值默认与 calc 对齐"策略在此迁移后自然成立——calc 成为运行时引擎，不再需要本地对齐审计。
- 资源生成脚本已产出 calcAbilityName（306 条）与 calcItemName（85 条 + 47 个 mega 石），ability/item 映射重构是本次迁移的前置，已提交。