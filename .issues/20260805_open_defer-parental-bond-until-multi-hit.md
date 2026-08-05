---
# This section is managed by the CLI. Do not edit manually.
id: "a96db475-c145-4916-8831-3522eef385cf"
title: "Defer Parental Bond until multi-hit"
status: "open"
priority: "low"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:25:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

明确 Parental Bond 不进入特性首批；待多段伤害契约就绪后再实现。

## Blocked by

- [[20260715_open_specify-random-multi-hit-and-accuracy-mechanics|Specify random multi-hit and accuracy mechanics]]

## Scope

- 记录 defer 决定与依赖
- 多段 issue 完成后，另开实现子 issue 或将本 issue 升格为实现票

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §15

## Acceptance criteria

- [ ] 父 issue／首批冻结名单不把 Parental Bond 标为已支持。
- [ ] 与多段伤害 issue 的依赖关系可发现。