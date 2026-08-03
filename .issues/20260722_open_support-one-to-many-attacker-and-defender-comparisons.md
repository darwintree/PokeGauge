---
# This section is managed by the CLI. Do not edit manually.
id: "27d5eb15-e0b1-4573-84e7-e5b67de95ac5"
title: "Support one-to-many attacker and defender comparisons"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-22T08:42:00Z"
updated_at: "2026-08-03T08:24:00Z"
---
## Goal

支持两种 Battle Pokémon Identity 批量对比模式：

- 单个攻击方 Battle Pokémon Identity 对多个防守方 Battle Pokémon Identity
- 单个防守方 Battle Pokémon Identity 对多个攻击方 Battle Pokémon Identity

## Acceptance criteria

- 两种模式都能在同一结果视图中比较多个对象。
- 一次只有一侧为多个对象，另一侧保持单个。
- 每条结果能明确对应其攻击方与防守方 Battle Pokémon Identity。
- 现有单一 Matchup 流程继续可用。

## Out of scope

- 多 attacker 对多 defender 的全组合比较。
