---
# This section is managed by the CLI. Do not edit manually.
id: "43fafe38-886a-46cb-a5f9-d8c483e7e424"
title: "Ability contact and held-item interactions"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-07T10:34:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[archive/20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现 Ability、Move contact 语义与 Held Item hooks 的普通命中组合。

## Scope

- Fluffy：接触招式减伤与 Fire 招式增伤
- Long Reach：取消防守方 Fluffy 的接触减伤 facet
- Klutz：压制持有方 Held Item 的普通命中 hooks

## Domain contract

### Contact SoT

- 接触判定只认 `NormalizedMove.flags` 的 PokeAPI `contact`（与 Tough Claws 一致）。
- 缺失 flag 按未接触；本票不做本地补丁。

### Fluffy

- 防守方 Ability；机制单算两 facet：
  - 有效接触（`contact` 且进攻方无 Long Reach）→ `finalModifier` 链入 `2048`
  - 已解析招式属性为火 → 链入 `8192`
  - 两 facet 皆命中 → `chainModifiers([2048, 8192])`（净 `4096`）
- 任一 facet 成立 → Fluffy `active`（含净 1×）。
- 火属性用 Scenario **已解析**招式属性。
- 进攻方 Fluffy：支持但恒 `inactive`；无绿点。
- **数值默认对齐 `@smogon/calc`**。

### Long Reach

- 仅进攻方有可到达钩子：取消防守方 Fluffy 的接触 `2048` facet。
- 不回写 Move Snapshot；招式本非接触 → Long Reach `inactive`。
- 防守方 Long Reach：支持但恒 `inactive`；无绿点。
- 同侧不可同时选 Long Reach 与 Tough Claws → 不改 Tough Claws。

### Klutz

- 只压制持有方自己那一侧 `compileHeldItem` 的全部普通命中 hooks：`base-power`／`battle-stat`／`final-damage`／`accuracy`／`critical-stage`／`suppress-ordinary-weather-damage`（含树果、形态锁面具 BP、万能伞）。
- 不改 Held Item Track 选项。
- 若无 Klutz 时该侧至少有一个 hook 会 `active` → Klutz `active`，被压制道具 `inactive`；否则 Klutz `inactive`（含 `none`／Mega 本就 `neutral`、道具 gate 未命中）。

### Shared rules

- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序。
- 支持范围内数值与 `@smogon/calc` 对齐；Showdown 钉 commit 与 calc 的编码差异见 [[20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]]，本票不阻塞于该审计。
- 贡献判定对齐现有模式；跨机制总契约见 [[20260807_open_clarify-active-marking-for-ignore-guaranteed-track-conflicts|Clarify active marking for ignore/guaranteed Track conflicts]]，本票不阻塞。
- 名单内特性从 `unsupported` 转为可审计的 `active`／`inactive`；无绿点；去红点。

## Out of scope

- Tough Claws 的 Base Power 修正（已实现；本票不因 Long Reach 改写）
- Unnerve 与抗性树果
- 接触触发的反伤、状态或其他击后事件
- Mold Breaker
- 本地补齐缺失 PokeAPI contact flags
- Showdown vs calc 全局审计（见独立 issue）

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/traces/discussion/2026-08-07-ability-contact-and-held-item-interactions|Ability 接触与道具组合讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]
- [[20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]]

## Acceptance criteria

- [ ] Fluffy：接触／火／双命中／Long Reach 去接触／错侧／非火非接触的 active／inactive 与 `finalModifier` 链有 compiler 覆盖；数值对齐 `@smogon/calc` 代表案例。
- [ ] Long Reach：仅在挡下 Fluffy 接触 facet 时 `active`；不改 Snapshot；不改 Tough Claws。
- [ ] Klutz：攻／守两侧压制全部普通命中 item hooks；贡献判定与 `none`／Mega／gate 未命中边界有覆盖；不改 Held Item Track 选项。
- [ ] 三者无红色 unsupported、无绿点；父 issue checklist 可勾选。
- [ ] 对 [[../docs/traces/discussion/2026-08-07-ability-contact-and-held-item-interactions|讨论记录]] 的每项决定逐行完成实现审计。
