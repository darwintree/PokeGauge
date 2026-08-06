---
# This section is managed by the CLI. Do not edit manually.
id: "1297980f-a56c-4dc7-907c-23d486c6c319"
title: "Scenario Move Type rewriting and Protean-family STAB"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-06T10:20:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现 Ability 对 Scenario Move Type 与当前 Scenario STAB 资格的影响；Move 列表、Move Snapshot 与 Battle Pokémon Identity 保持不变。

## Scope

- Normalize
- Aerilate、Pixilate、Refrigerate、Galvanize、Dragonize
- Liquid Voice
- Protean、Libero

## Domain contract

**Scenario Move Type（场景招式属性）**是当前 Scenario 最终用于结算和结果展示的招式属性。它按以下顺序派生：

1. PokeAPI Move 原始属性；
2. 既有 `(move id, attacker identity)` 招式属性解析；
3. 攻击方 Ability 的招式属性重写。

Scenario Move Type 统一驱动：

- 普通 STAB 与 Adaptability eligibility；
- 属性克制与免疫倍率；
- Held item、Weather、Terrain 及其他 Ability 的 move-type gate；
- compiler outcome、Scenario Result 与结果卡属性 badge。

Move Track／Picker 继续展示 catalog Move 属性；Move Snapshot 不新增或改写 type；Battle Pokémon Identity 与原始属性集合不变。

## Ability matrix

| Ability | Gate | Scenario Move Type | Base Power | STAB |
| --- | --- | --- | ---: | --- |
| Normalize | pinned 规则允许改写的 damaging Move | Normal | `4915` | 仅按攻击方原始 Normal 属性 |
| Aerilate | pinned 规则允许改写的 Normal Move | Flying | `4915` | 按攻击方原始 Flying 属性 |
| Pixilate | 同上 | Fairy | `4915` | 按攻击方原始 Fairy 属性 |
| Refrigerate | 同上 | Ice | `4915` | 按攻击方原始 Ice 属性 |
| Galvanize | 同上 | Electric | `4915` | 按攻击方原始 Electric 属性 |
| Dragonize | 同上 | Dragon | `4915` | 按攻击方原始 Dragon 属性 |
| Liquid Voice | PokeAPI `sound` flag | Water | `4096` | 按攻击方原始 Water 属性 |
| Protean | 当前招式原本无 STAB | 不改写 | `4096` | 当前 Scenario 使用普通 `6144` |
| Libero | 当前招式原本无 STAB | 不改写 | `4096` | 当前 Scenario 使用普通 `6144` |

`4915`、`4096` 与 `6144` 均为现有 4096 整数 modifier 表示。

### Eligibility exclusions

- Aerilate／Pixilate／Refrigerate／Galvanize／Dragonize 不改写 Judgment、Multi-Attack、Natural Gift、Revelation Dance、Techno Blast、Terrain Pulse 与 Weather Ball。
- Normalize 使用同一排除名单，并额外不改写 Hidden Power 与 Struggle。
- 当前已全局排除的 Z／Max／Hidden Power 等 Move 不重新放入候选池。
- 当前没有 Terastallization 状态，不新增 Tera 分支或推断。
- Liquid Voice 只读取 `NormalizedMove.flags` 的 `sound` membership；不得增加本地 Move id fallback、Showdown／calc 生产数据依赖或效果文本解析。
- PokeAPI 当前缺失的 recent `sound` mapping 按 gate 未命中处理，Selection 为 `inactive`；该数据缺口由 [[20260806_open_complete-missing-pokeapi-move-behavioral-metadata-upstream|Complete missing PokeAPI move behavioral metadata upstream]] 跟踪。

## Protean-family contract

- Protean／Libero 不改写 Scenario Move Type，只让当前 Scenario 获得与 Scenario Move Type 相同的普通 `1.5×` STAB 资格。
- 每侧 Scenario 只有一个 Ability Selection；Protean／Libero 不与 Adaptability 同时存在，也不产生 `2×` STAB。
- 不修改 Battle Pokémon Identity、原始属性集合或 groundedness。
- 不记录换场、已触发次数或跨 Move Snapshot 的战斗历史；每个 Scenario 独立投影。

## Compiler and modifier contract

- 类型重写必须在属性克制、道具、天气、场地及其他 Ability gate 之前解析；这些消费者只使用 Scenario Move Type。
- damage kernel interface 不变；kernel 继续只接收已编译的 phase modifier。
- 类型改写 Ability 的 Base Power 与场上 Aura Ability 的 Base Power 必须在 Ability 内部 chain，不能互相覆盖。代表组合为攻击方 Pixilate + 防守方 Fairy Aura：Normal Move 先成为 Fairy，Ability Base Power chain 同时包含 `4915` 与 `5448`，双方 Ability Selection 均为 `active`。
- Ability Base Power 合成后继续沿用既有总顺序：Ability → attacker item → Terrain → move／Weather callback。
- 不新增通用 effect／priority framework，也不新增 modifier contributions 或 label 输出。

## Track Selection Activation

- Normalize 在其 `4915` Base Power boost 生效时为 `active`，即使输入招式本来就是 Normal。
- Aerilate／Pixilate／Refrigerate／Galvanize／Dragonize 符合 gate 时为 `active`。
- Liquid Voice 仅在 PokeAPI 标记的 sound Move 从非 Water 改为 Water 时为 `active`；原本就是 Water 或缺少 `sound` flag 时为 `inactive`。
- Protean／Libero 仅在为原本无 STAB 的 Move 增加 `6144` STAB 时为 `active`；原本已有 STAB 时为 `inactive`。
- 即使最终伤害数字碰巧相同，只要 Scenario Move Type／结果属性 badge 改变，类型改写 Ability 仍为 `active`。

## Result merge and display

- Scenario Move Type 进入 calculation identity；伤害数字相同但 Scenario Move Type 不同的结果不得合并。
- Scenario Move Type 相同且其他 calculation identity 相同的结果仍可合并，并累积既有 provenance。
- Scenario Result 必须携带 Scenario Move Type；结果卡继续使用 catalog Move label，但属性 badge 使用 Scenario Move Type。
- 这 9 个 Ability 从 `unsupported` 转为可审计的 `active`／`inactive`，移除红色 unsupported 提示；不新增绿色提示。

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §10–§11
- [[../docs/traces/discussion/2026-08-06-scenario-move-type-and-protean-stab|Scenario Move Type 与 Protean STAB 讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]
- Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override

## Out of scope

- 改写 Move Track 列表中的招式属性
- 修改 Move Snapshot 或 Battle Pokémon Identity
- Protean／Libero 的换场与一次触发历史
- Terastallization 与 generation／ruleset selector
- Parental Bond
- damage kernel interface 变更
- 本地 Move 行为 fallback

## Acceptance criteria

- [ ] 9 个 Ability 均有 active／inactive compiler 覆盖；Normalize 原生 Normal、Liquid Voice 原生 Water／PokeAPI 缺 flag、Protean／Libero 原生 STAB 均有边界用例。
- [ ] Scenario Move Type 按固定顺序派生，并统一驱动 STAB、属性克制、type-gated Item／Weather／Terrain／Ability 与 compiler outcome；Move 列表、Move Snapshot、Identity 和 groundedness 不变。
- [ ] pinned 的类型改写排除 Move 有回归覆盖；PokeAPI `sound` 是 Liquid Voice 唯一生产 gate，无 fallback。
- [ ] Pixilate + defender Fairy Aura 证明 `4915` 与 `5448` 同时进入 Ability Base Power chain，且双方 activation 正确；至少一个代表 case 对支持范围内 normal／critical 全部 16 rolls 使用 `@smogon/calc` 作 oracle。
- [ ] Protean／Libero 对 off-type Move 使用普通 `6144` STAB，对原生 STAB Move 为 `inactive`；不出现 `8192` 或跨 Snapshot 状态。
- [ ] calculation identity 包含 Scenario Move Type；不同 type 的数值等价结果不合并，同 type 等价结果仍合并并保留 provenance。
- [ ] Scenario Result 和结果卡展示 Scenario Move Type；9 个 Ability 无红色 unsupported 提示，且未新增绿色提示。
- [ ] 结果 UI 完成 design-taste-frontend desktop／mobile review-and-correct，未改变既有结果信息层级。
- [ ] 父 issue checklist 只勾选本 issue 已完成的 9 个 Ability。
- [ ] 对 [[../docs/traces/discussion/2026-08-06-scenario-move-type-and-protean-stab|讨论记录]] 的每项决定逐行完成实现审计。
