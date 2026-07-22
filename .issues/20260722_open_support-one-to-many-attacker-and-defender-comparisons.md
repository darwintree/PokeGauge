---
# This section is managed by the CLI. Do not edit manually.
id: "27d5eb15-e0b1-4573-84e7-e5b67de95ac5"
title: "Support one-to-many attacker and defender comparisons"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-22T08:42:00Z"
updated_at: "2026-07-22T08:42:00Z"
---
## Goal

支持两种批量对比模式：

- 单个 attacker 对多个 defender
- 单个 defender 对多个 attacker

## Acceptance criteria

- 两种模式都能在同一结果视图中比较多个对象。
- 一次只有一侧为多个对象，另一侧保持单个。
- 每条结果能明确对应其 attacker 和 defender。
- 现有单 attacker 对单 defender 的流程继续可用。

## Out of scope

- 多 attacker 对多 defender 的全组合比较。