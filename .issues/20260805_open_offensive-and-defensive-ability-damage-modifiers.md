---
# This section is managed by the CLI. Do not edit manually.
id: "8c4f7897-54b8-40d1-abb1-78a4a48199c9"
title: "Offensive and defensive ability damage modifiers"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-05T10:30:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[archive/20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现普通命中中的进攻能力、Base Power、最终伤害与防御能力修正，并接入现有 Scenario compiler 和本地 damage kernel 阶段。

## Scope

- 已实现基线：Adaptability（仅回归检查）
- 进攻能力：Huge Power、Pure Power、Fire Mane、Water Bubble（Water 进攻）
- Move 语义／Base Power：Tough Claws、Technician、Sharpness、Mega Launcher、Sheer Force、Iron Fist、Reckless、Strong Jaw
- 场域与天气条件：Fairy Aura、Sand Force、Solar Power
- 防守能力／伤害：Water Bubble（Fire 减伤）、Thick Fat、Filter、Solid Rock、Purifying Salt、Heatproof、Fur Coat

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- 名单内特性须从 `unsupported` 转为可审计的 `active`／`inactive`，不得把未实现分支误报为未生效。

## Open questions

- 各特性的精确 gate、倍率、整数阶段与双方组合矩阵。
- Move contact／punch／bite／pulse／slicing／recoil／secondary 语义的结构化来源。
- Fairy Aura 在双方同时选择时是否只应用一次，以及 source state 如何归属。
- Water Bubble 等多分支特性的完整支持与结果 provenance。

## Out of scope

- Dry Skin（完整归入 immunity issue）
- Fluffy、Long Reach、Klutz
- 暴击、命中、Unaware、Infiltrator
- 类型重写、免疫表、绿点条件族、Mold Breaker

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Acceptance criteria

- [ ] Scope 内特性的完整普通命中相关分支已按最终契约实现并验证。
- [ ] 修正阶段、4096 整数链与支持范围内 oracle 一致。
- [ ] 不与 sibling issue 重复实现或产生部分支持误报。
- [ ] 拆分讨论记录与后续契约讨论记录可逐条审计。