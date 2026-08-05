---
# This section is managed by the CLI. Do not edit manually.
id: "1297980f-a56c-4dc7-907c-23d486c6c319"
title: "Result-side move-type rewrite and Protean STAB"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:25:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现招式属性在 **result 计算与展示** 中的重写；Move 列表／snapshot 选型不变。Protean 类下招式一律适用 STAB。

## Scope

- Pixilate、Refrigerate、Aerilate、Dragonize、Liquid Voice（及调研首批中的同类）
- Protean：result 侧按与招式一致的属性结算，**所有招式适用 STAB**
- 与 Adaptability 的叠乘规则需在实现前写清（见 Open questions）

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §10–§11

## Open questions

- Protean × Adaptability：是否恒为 2× STAB？
- Protean 是否只改进攻结算（STAB／招式属性展示），防御方 identity 属性不变？

## Out of scope

- 改写 Move Track 列表中的招式属性
- Parental Bond

## Acceptance criteria

- [ ] result 使用变化后属性；Move 列表不变。
- [ ] Protean 类招式均吃 STAB。
- [ ] 父 issue checklist 对应项可勾选。