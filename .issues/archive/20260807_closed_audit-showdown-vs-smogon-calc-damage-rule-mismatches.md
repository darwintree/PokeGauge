---
# This section is managed by the CLI. Do not edit manually.
id: "0f1375bf-4542-4fbd-bce6-54cfcfe90285"
title: "Audit Showdown vs @smogon/calc damage-rule mismatches"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-07T10:30:00Z"
updated_at: "2026-08-20T08:30:00Z"
---
## Goal

建立并执行一项默认对齐策略的审计：**伤害规则与测试 oracle 默认以 `@smogon/calc` 为准**；当 Pokémon Showdown（规则钉 commit）与 `@smogon/calc` 在同一机制上编码不一致时，显式记录差异，并决定本计算器跟哪一边（默认跟 calc），避免实现票各自发明。

## Motivation / highlight

在 [[20260805_closed_ability-contact-and-held-item-interactions|Ability contact and held-item interactions]] 的 grilling 中核对 Fluffy（火＋接触）时发现：

| 来源 | 火＋接触 |
| --- | --- |
| Showdown `71d77d3…` `data/abilities.ts` `fluffy` | 单次回调内 `mod *= 2`（火）且 `mod /= 2`（接触），再 **一次** `chainModify(mod)`；双命中时 `mod === 1` |
| `@smogon/calc` `gen789.ts` `calculateFinalMods…` | **两次** `finalMods.push`：接触 `2048`（且 `!Long Reach`）、火 `8192`；再与其他 final 一起 `chainMods` 后一次应用到伤害 |

Long Reach 表达方式也不相同：Showdown 在 `onModifyMove` 删除 `contact` flag；calc 仅在 Fluffy 接触分支写 `!attacker.hasAbility('Long Reach')`，且 **不**改 Tough Claws 的 contact gate。本计算器同侧只能选一个 Ability，故 Long Reach×Tough Claws unreachable；可到达交叉是攻方 Long Reach×守方 Fluffy。

这类「同一机制、两种 Smogon 资产、编码形态不同」可能在其他 Ability／道具／墙／天气路径上重复出现；本地 kernel 又已用 `chainModifiers` 预乘再单次 `applyModifier`，需要系统核对是否还藏着与 calc（或与 Showdown）的静默**数值**偏差。

## Default policy（产品约定）

- **数值默认与 `@smogon/calc` 对齐**；机制仍可按 facet／来源单算（不必复刻 Showdown 单回调合成），但最终伤害数字以 calc 为代表 oracle。
- Showdown 钉 commit 仍可作为机制存在性／语义阅读来源，但**不再默认覆盖 calc 的数值**。
- 发现不一致时：记入本 issue（或子清单），标明机制、两边行为、本地现状、是否跟 calc；不在各实现票里临时改默认。


## Scope

- 盘点至少：Fluffy 双 facet、以及同票相关的 Long Reach×Fluffy、Klutz×item（Showdown `ignoringItem` vs calc `checkItem`）是否还有文档化差异。
- 扩大扫描：已实现的 Ability／Held Item／Screen／Weather／会心／命中路径中，凡「Showdown 回调合成一次」vs「calc 多次 push 再 chainMods」或等价分叉。
- 核对本地 `chainModifiers`／`applyModifier` 与 calc `chainMods`／`pokeRound` 在代表案例上的一致性；列出已知可接受近似 vs 必须修的偏差。
- 产出：书面差异表 + 对本计算器的逐条处置（跟 calc / 跟 Showdown / 显式近似并标注）。

## Out of scope

- 实现 Fluffy／Long Reach／Klutz 本身（见 contact／held-item 子 issue）
- 升级 `@smogon/calc` 大版本（除非审计结论要求）
- 改 damage kernel 对外接口（除非审计证明必须）

## Acceptance criteria

- [x] 默认策略写清：与 `@smogon/calc` 对齐；Showdown 不一致时的升级路径。
- [x] Fluffy 火＋接触（及 Long Reach 交叉）作为首条已记录案例，处置明确。
- [x] 本地普通命中规则实现已退役，不再需要持续扫描本地 kernel 与 calc 的差异。
- [x] 后续规则差异通过升级 `@smogon/calc` 或独立的产品输入契约处理。

## Resolution

2026-08-20：由 [[20260819_closed_migrate-runtime-damage-calculation-to-smogon-calc|Migrate runtime damage calculation to @smogon/calc]] 与 `docs/adr/0007-smogon-calc-runtime-damage-engine.md` 取代。

运行时伤害已直接使用 `@smogon/calc` 黑盒；本地不再维护需要与 calc 对齐的伤害规则实现，因此本 issue 的持续审计对象已经不存在。Showdown 仍可作为机制语义阅读来源，但不再需要一张跨机制差异清单来约束本地数值实现。
