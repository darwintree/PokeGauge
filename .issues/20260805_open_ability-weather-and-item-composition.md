---
# This section is managed by the CLI. Do not edit manually.
id: "21a56f0a-d719-42c9-843b-45775f885211"
title: "Ability weather and item composition"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:25:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现特性与 Weather／Held item 的组合语义。

## Scope

- Cloud Nine／Air Lock：压制 Weather Track 对伤害的影响
- Mega Sol：视为自带晴天伤害模
- Unnerve：对方抗性树果减伤不生效
- 天气条件进攻补全（若未在 ordinary-hit 子 issue 完成）：Sand Force、Solar Power 等与 Weather Track 的组合

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §7、§12、§13
- Held-item frozen-85 树果与 Utility Umbrella 先例
- 天气／场地初始化投射见 [[20260805_open_ability-init-projection-to-weather-terrain-stage|Ability init projection to Weather Terrain Stage]]

## Out of scope

- 天气／场地 Track 的初始化投射

## Acceptance criteria

- [ ] Cloud Nine／Air Lock、Mega Sol、Unnerve 行为符合讨论记录。
- [ ] 与 frozen-85 树果模型组合可测。
- [ ] 父 issue checklist 对应项可勾选。