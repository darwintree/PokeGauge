---
# This section is managed by the CLI. Do not edit manually.
id: "f806d623-07e0-4f83-9b08-5f6ec5881c69"
title: "Ability immunities and type exceptions"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T10:31:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现免疫／属性例外类特性：按规则结算本击无效或等价免疫结果；**不加绿点、不加充能开关**。

## Scope

- Levitate、Eelevate
- Flash Fire、Volt Absorb、Water Absorb、Lightning Rod、Motor Drive、Sap Sipper、Earth Eater
- Soundproof、Bulletproof
- Scrappy
- Dry Skin：Water 免疫与 Fire 招式 `1.25×` 伤害分支整体实现，不拆成部分支持
- 其他首批冻结中的 tryHit／typeMod 免疫例外（以调研 A 类免疫组为准）

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §9
- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]] §7–§8
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Out of scope

- Flash Fire 等充能加攻状态
- Mold Breaker 忽略防守方特性
- Water Bubble 的 Water 进攻与 Fire 防守减伤，见 [[archive/20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]

## Acceptance criteria

- [ ] 匹配属性／招式旗标时按免疫或约定例外结算。
- [ ] Dry Skin 的 Water 免疫与 Fire 增伤同批完成，不出现部分支持状态。
- [ ] 无充能 UI；不与绿点条件族混淆。
- [ ] 父 issue checklist 对应项可勾选。
