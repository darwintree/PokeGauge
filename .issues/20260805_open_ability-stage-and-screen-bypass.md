---
# This section is managed by the CLI. Do not edit manually.
id: "aef1ee92-a146-4e6a-81e9-e8c790a97e29"
title: "Ability stage and screen bypass"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-05T10:30:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[archive/20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现 Unaware 对对方能力阶级的忽略，以及 Infiltrator 对 Screen Track 的绕过。

## Scope

- Unaware
- Infiltrator

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- 名单内特性须从 `unsupported` 转为可审计的 `active`／`inactive`。

## Open questions

- Attacker／Defender Unaware 分别忽略哪一侧 Stage，以及普通与会心分支如何组合。
- Infiltrator 对 Reflect／Light Screen／Aurora Veil 及破墙招式的 source state。
- 被绕过的 Stage／Screen 来源在合并结果中的 active／inactive provenance。

## Out of scope

- 自动修改 Stage Track 或 Screen Track
- 其他普通伤害、暴击、命中、接触与道具特性
- Mold Breaker

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Acceptance criteria

- [ ] Unaware 与 Infiltrator 的双方矩阵按最终契约实现。
- [ ] Stage／Screen 本身不被修改，仅在对应 Scenario 编译分支中被忽略。
- [ ] 来源状态与结果合并可审计。
- [ ] 拆分讨论记录与后续契约讨论记录可逐条审计。
