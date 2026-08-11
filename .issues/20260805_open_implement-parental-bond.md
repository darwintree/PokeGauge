---
# This section is managed by the CLI. Do not edit manually.
id: "a96db475-c145-4916-8831-3522eef385cf"
title: "Implement Parental Bond"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-07T10:37:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现 Parental Bond（亲子爱）对普通命中伤害的第二击语义，并纳入可审计的 `active`／`inactive`。

首批冻结已将其剔出当时交付范围（见讨论记录 §15）；本票是**实现票**，不是「记录 defer」票。契约细节待多段伤害规格就绪后再 grilling，当前不标 `READY-FOR-AGENT`。

## Blocked by

- [[20260715_open_specify-random-multi-hit-and-accuracy-mechanics|Specify random multi-hit and accuracy mechanics]]

## Scope（待多段契约后冻结）

- Parental Bond 第二击威力比例、与多段／会心／命中模型的组合
- Ability Track 支持态（去红点）与 provenance
- 与既有普通命中 Ability／道具链的顺序

## Out of scope（当前）

- 在多段 issue 关闭前实现或宣称已支持
- 把「暂不实现」本身当作本票的验收目标

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §15
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]（Parental Bond / multi-hit gap）
- [[20260715_open_specify-random-multi-hit-and-accuracy-mechanics|Specify random multi-hit and accuracy mechanics]]

## Acceptance criteria

- [ ] 多段伤害契约已足以支撑 Parental Bond；本票完成独立 grilling 并达到 `READY-FOR-AGENT` 或等价成文契约。
- [ ] Parental Bond 第二击按契约实现；有 active／inactive 与代表数值覆盖。
- [ ] 无红色 unsupported 误标；父 issue checklist 可勾选 Parental Bond。
