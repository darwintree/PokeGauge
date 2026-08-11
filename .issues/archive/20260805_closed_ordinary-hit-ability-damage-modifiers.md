---
# This section is managed by the CLI. Do not edit manually.
id: "f1fba7c1-20ce-4100-804e-2aabece3fb1d"
title: "Ordinary-hit ability damage modifiers"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T10:32:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

将原本跨越多个计算阶段的普通命中特性批次拆为可独立讨论、实现和验证的同级 issue。

## Split result

- [[20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]
- [[20260805_closed_ability-critical-hit-and-accuracy-modifiers|Ability critical-hit and accuracy modifiers]]
- [[20260805_closed_ability-stage-and-screen-bypass|Ability stage and screen bypass]]
- [[../20260805_open_ability-contact-and-held-item-interactions|Ability contact and held-item interactions]]

四个新 issue 直接挂到总父 issue；本 issue 不再作为中间 umbrella 或实现任务。

## Boundary updates

- Dry Skin 的 Water 免疫与 Fire 增伤整体归入 [[../20260805_open_ability-immunities-and-type-exceptions|Ability immunities and type exceptions]]。
- Water Bubble 的 Water 进攻与 Fire 防守减伤归入 offensive／defensive modifiers issue。
- Sand Force 与 Solar Power 归入 offensive／defensive modifiers issue，不再由 weather/item composition issue 兜底。
- Mold Breaker、类型重写、绿点条件族、Track 初始化投射、Cloud Nine、Mega Sol 与 Unnerve 的既有 sibling 归属不变。

## References

- [[../../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §1、§14
- [[../../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Resolution

2026-08-05：已按计算机制拆为四个同级 issue，并同步父 issue 与 overlapping sibling 的归属。新 issue 在分别完成契约讨论前不标记 `READY-FOR-AGENT`。

## Acceptance criteria

- [x] 四个同级 issue 已创建，并按确认的机制边界分配原 Scope。
- [x] 父 issue 的原链接已替换为四个新链接。
- [x] Dry Skin、Water Bubble、Sand Force 与 Solar Power 的 sibling 归属已去重。
- [x] 拆分讨论记录中的决定已逐条审计到 issue 结构与内容。
