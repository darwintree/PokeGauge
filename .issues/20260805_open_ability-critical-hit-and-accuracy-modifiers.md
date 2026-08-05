---
# This section is managed by the CLI. Do not edit manually.
id: "addef56e-abc2-4b47-9b6e-217fc64643f2"
title: "Ability critical-hit and accuracy modifiers"
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

实现普通命中的特性暴击与命中修正，并保持 Classic／Battle Odds 与结果展示语义一致。

## Scope

- 阻止暴击：Shell Armor、Battle Armor
- 暴击等级／伤害：Super Luck、Sniper
- 必中与命中率：No Guard、Sand Veil、Snow Cloak、Compound Eyes、Keen Eye、Illuminate
- 复合效果：Hustle 的 Physical Atk 与命中修正

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- 名单内特性须从 `unsupported` 转为可审计的 `effective`／`inactive`，不得把未实现分支误报为未生效。

## Open questions

- Shell Armor／Battle Armor 下 guaranteed-critical snapshot、零概率暴击和结果 whisker 的展示契约。
- Super Luck／Sniper 在 Classic 与 Battle Odds 中的 source state 与概率／伤害边界。
- No Guard 双方生效、天气必中与 numeric accuracy 修正的优先级。
- 当前没有 accuracy／evasion Stage 输入时 Keen Eye／Illuminate 的支持状态。
- Hustle 的 direct Atk 阶段与既有能力值／道具修正的整数顺序。

## Out of scope

- 普通伤害与防御特性、Unaware、Infiltrator
- 新增完整 accuracy／evasion Stage Track，除非后续契约明确要求
- 绿点条件族、Mold Breaker

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Acceptance criteria

- [ ] Scope 内暴击、命中与 Hustle 分支已按最终契约实现并验证。
- [ ] Classic／Battle Odds 的概率、来源状态与结果展示保持一致。
- [ ] 修正阶段、4096 整数链与支持范围内 oracle 一致。
- [ ] 拆分讨论记录与后续契约讨论记录可逐条审计。