---
# This section is managed by the CLI. Do not edit manually.
id: "8c4f7897-54b8-40d1-abb1-78a4a48199c9"
title: "Offensive and defensive ability damage modifiers"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-06T08:51:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现当前 PokeAPI 结构化字段能够判定的普通命中进攻／防守 Ability modifier，并按 Gen 9 整数顺序接入现有 Scenario compiler；damage kernel interface 保持不变。

## Scope

- 已实现基线：Adaptability（仅回归检查）
- 进攻能力：Huge Power、Pure Power、Fire Mane、Water Bubble（Water 进攻）
- Move 语义／Base Power：Tough Claws、Technician、Mega Launcher、Iron Fist、Strong Jaw
- 场域与天气条件：Fairy Aura、Sand Force、Solar Power
- 防守能力／伤害：Water Bubble（Fire 减伤）、Thick Fat、Filter、Solid Rock、Purifying Salt、Heatproof、Fur Coat

## Modifier matrix

| Phase | Ability | Active gate | Modifier |
| --- | --- | --- | ---: |
| STAB | Adaptability | 招式具有本系加成 | `8192` |
| Attack | Huge Power／Pure Power | 物理招式 | `8192` |
| Attack | Fire Mane | Fire 招式，物理／特殊均可 | `6144` |
| Attack | Water Bubble（进攻） | Water 招式，物理／特殊均可 | `8192` |
| Attack | Solar Power | Sun + 特殊招式 | `6144` |
| Attack | Water Bubble（防守） | 受到 Fire 招式 | `2048` |
| Attack | Thick Fat | 受到 Fire／Ice 招式 | `2048` |
| Attack | Purifying Salt | 受到 Ghost 招式 | `2048` |
| Attack | Heatproof | 受到 Fire 招式 | `2048` |
| Base Power | Technician | 已解析原始威力 ≤ 60 | `6144` |
| Base Power | Tough Claws | PokeAPI flag `contact` | `5325` |
| Base Power | Iron Fist | PokeAPI flag `punch` | `4915` |
| Base Power | Strong Jaw | PokeAPI flag `bite` | `6144` |
| Base Power | Mega Launcher | PokeAPI flag `pulse` | `6144` |
| Base Power | Sand Force | Sand + Rock／Ground／Steel 招式 | `5325` |
| Base Power | Fairy Aura | Fairy 招式；场上最多应用一次 | `5448` |
| Defense | Fur Coat | 受到物理招式 | `8192` |
| Final | Filter／Solid Rock | 最终属性相克倍率 > 1 | `3072` |

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- Move 资源与行为语义以 PokeAPI 为唯一 source of truth；不为缺失数据增加本地 fallback、Showdown / calc 生产依赖或效果文本解析。
- PokeAPI 当前的 Move 行为数据缺口由 [[../20260806_open_complete-missing-pokeapi-move-behavioral-metadata-upstream|Complete missing PokeAPI move behavioral metadata upstream]] 跟踪，并回推上游修正。
- 本 issue 支持的 Ability 从 `unsupported` 转为可审计的 `active`／`inactive`；不满足 gate 时为 `inactive`。Sharpness、Reckless 与 Sheer Force 保持 `unsupported`。
- PokeAPI 缺少 contact／punch／bite／pulse 映射时按 flag 不存在处理，因此对应已支持 Ability 为 `inactive`。
- Fire Mane 使用 PokeAPI `fire-mane` 身份及当前 PokeAPI id，不使用 Showdown 的 numeric id。
- Fairy Aura 双方同时存在时 modifier 只应用一次；Fairy 招式下双方 Ability Selection 都为 `active`。
- Sand Force／Solar Power 生效时，对应 Sand／Sun Weather Selection 同时为 `active`。
- 本 issue 沿用现有 compiler → kernel 接口，只传每个 phase 的最终 modifier；不新增 `modifierDetails` 或 contribution 输出。伤害条件卡的 modifier 来源展示由 [[../20260806_open_show-damage-modifier-contributions-on-condition-cards|Show damage modifier contributions on condition cards]] 独立跟踪。

Track Selection Activation 程序符号由 [[20260806_closed_rename-track-selection-activation-state-from-effective-to-active|Rename track selection activation state from effective to active]] 统一为 `active`；实现者沿用该命名，不在本 issue 重做术语迁移。

## Compiler contract

- 在 `damage-calculation` 内新增与 weather、terrain、screen 同层的 Ability compiler；它解析 Ability gate、各 phase modifier、双方 Ability activation，以及 Weather 是否因 Ability gate 而 active。
- Scenario compiler 仍向 kernel 传原始 power／attack／defense operand 与每个 phase 的单一最终 modifier；不得把 modifier 直接写入 operand。
- Kernel 不接收 Ability id、Move flag、来源、priority、label 或 contribution 列表。
- 不新增通用 effect／priority framework。

同 phase modifier 必须按以下顺序一次性 `chainModifiers`：

```text
Base Power: ability → attacker item → terrain → move/weather callback
Attack:     attacker ability → defender ability → attacker item
Defense:    defender ability → defender item
Final:      screen → defender ability → attacker item → defender item
```

Critical 分支只移除 screen，其他顺序不变。现有 Base Power 组合顺序若不符合上述契约，应在本 issue 一并修正。

## PokeAPI Move flags

- 资源生成器读取 PokeAPI `move_flag_map.csv` 与 `move_flags.csv`。
- `NormalizedMove.flags: string[]` 保存 PokeAPI 当前提供的全部 flag slug。
- Ability gate 只使用 flag membership，不维护 Ability 专用 Move id 集合。
- PokeAPI 上游增加 `slicing` 等结构化 flag 后，更新 pin 并重新生成资源；当前 issue 不预实现对应 Ability。

## Result provenance and support UI

- Ability 与 Weather 使用既有 Track Selection Activation／provenance 合并路径，不进入 calculation identity。
- `[无 Aura, 有 Aura] × [无 Aura, 有 Aura]` 只产生无 Aura 与有 Aura 两种计算 identity；合并行累积双方 active 来源。
- 本 issue 支持的 Ability 移除红色 unsupported 提示；Sharpness、Reckless 与 Sheer Force 保留红色提示。
- 不新增绿色支持提示。

## Out of scope

- Sharpness、Reckless、Sheer Force（保持完整 `unsupported`，等待 PokeAPI 上游数据）
- Dry Skin（完整归入 immunity issue）
- Fluffy、Long Reach、Klutz
- 暴击、命中、Unaware、Infiltrator
- 类型重写、免疫表、绿点条件族、Mold Breaker
- Damage kernel interface 变更
- Modifier contribution／label 与伤害条件卡展示
- Track Selection Activation 程序符号重命名（由独立 issue 完成）

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/traces/discussion/2026-08-06-offensive-defensive-ability-modifiers-contract|进攻与防守特性伤害修正契约讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]
- [[../docs/research/2026-08-06-pokeapi-move-trait-coverage|PokeAPI move-trait coverage for ability gates]]

## Acceptance criteria

- [x] 每个已支持 Ability 至少有一个 active 与一个 inactive compiler 用例；Water Bubble 的进攻／防守 facet 均覆盖。
- [x] Fairy Aura 双方四种组合验证只应用一次，并正确累积双方 activation；Sand Force／Solar Power 验证 Weather activation。
- [x] PokeAPI flag 生成覆盖代表性正例、反例和当前已知缺失；运行时不存在 fallback 或 Ability 专用 Move id 表。
- [x] Base Power、Attack、Defense、Final 各有一个跨来源组合用例，锁定已确认的 4096 chain 顺序与舍入结果。
- [x] normal／critical 均验证，critical 只移除 screen；支持范围内代表性 case 与 `@smogon/calc` 的全部 16 rolls 一致。
- [x] Fire Mane 与刻意遵循 PokeAPI 缺失数据的差异使用明确数值断言，不强行与 calc 对齐。
- [x] 已支持 Ability 移除红色提示；Sharpness、Reckless 与 Sheer Force 仍显示红色提示；无绿色提示。
- [x] Damage kernel interface、calculation identity 与现有 operand 保持不变，且没有新增 modifier details／contribution 输出。
- [x] 不与 sibling issue 重复实现或产生部分支持误报。
- [x] 对 [[../docs/traces/discussion/2026-08-06-offensive-defensive-ability-modifiers-contract|契约讨论记录]] 的每一项决定完成逐行实现审计。

## Resolution

2026-08-06：已新增最小 Ability compiler seam，并按已确认 phase chain 接入 Scenario compiler。PokeAPI 生成器现保留全部 Move flag slug；kernel interface、raw operand、calculation identity 与结果信息层级未变。

### Discussion trace audit

| 决定 | 落地审计 |
| ---: | --- |
| 1 | 生成器只读取 PokeAPI `move_flags.csv`／`move_flag_map.csv`；无 fallback、文本解析或生产 calc 依赖。 |
| 2 | Technician、Tough Claws、Iron Fist、Strong Jaw、Mega Launcher 已实现；Sharpness、Reckless、Sheer Force 仍完整 `unsupported`。 |
| 3 | compiler 与 provenance 全部沿用 `active`／`inactive`／`unsupported`／`neutral`。 |
| 4 | 未改 activation 既有语义或历史 trace。 |
| 5 | STAB／Attack 矩阵逐项进入 Ability compiler，并有 active／inactive 用例。 |
| 6 | Base Power 矩阵逐项进入 Ability compiler，并有 flag、天气、威力 gate 用例。 |
| 7 | Fur Coat、Filter、Solid Rock 分别进入 Defense／Final，并有正反用例。 |
| 8 | Fire Mane 使用 PokeAPI id `313`，并锁定本地数值结果。 |
| 9 | 已支持 Ability gate 未命中（含 PokeAPI 缺 flag）统一为 `inactive`。 |
| 10 | Fairy Aura 四种双方组合仅形成 neutral／aura 两种 identity，双方 Aura 来源均累积为 active。 |
| 11 | Sand Force／Solar Power 生效时 Weather source 为 active。 |
| 12 | kernel interface 不变；Ability modifier 只以现有 phase scalar 进入。 |
| 13 | 未新增 modifier details、contributions 或 labels。 |
| 14 | Base Power 明确按 ability → attacker item → terrain → move/weather callback 一次 chain。 |
| 15 | Attack、Defense、Final 按契约顺序 chain；critical 仅移除 screen。 |
| 16 | 新增同层 `damage-calculation/ability.ts`，未建立通用 effect／priority framework。 |
| 17 | `NormalizedMove.flags` 保存 PokeAPI 全量 flag slug；无 Ability 专用 Move id 表。 |
| 18 | 已支持 Ability 无红点；Sharpness、Reckless、Sheer Force 保留红点；无绿色提示。 |
| 19 | active/inactive、双方 Aura、Weather、flags、四 phase、normal/critical、16 rolls 与刻意差异均有针对性验证。 |
| 20 | 未新增 ADR；契约继续由现有 ADR、discussion trace 与本 issue 承载。 |

`implementation-with-traces` 审计未发现契约未决且实现必须裁决的事项，因此未创建 implementation trace。

### Verification

- Targeted Ability／cross-mechanism／UI tests：4 files，58 tests passed。
- Full test suite：42 files，406 tests passed。
- `pnpm lint`：通过（仅仓库既有 warnings）。
- `pnpm build`：通过。
- design-taste-frontend 实际 review：支持 Ability 无红点，unsupported 保留红点与可访问文本，无绿色提示；无需视觉修正。
