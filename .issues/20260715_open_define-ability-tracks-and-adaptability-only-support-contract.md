---
# This section is managed by the CLI. Do not edit manually.
id: "257a6b6e-ce20-4b1f-ac9a-c23445d021a9"
title: "Define ability tracks and Adaptability-only support contract"
status: "open"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义攻击方与防御方 Ability Track 的候选来源、默认全选、已支持／暂未支持状态、结果标注与效果等价合并契约，并把适应力规格化为本轮唯一具有计算效果的特性。明确换宝可梦、隐藏特性、双方同名特性与 unsupported 分组的边界案例。

## Confirmed constraints

- 双方各有一个 Ability Track，并默认选中当前宝可梦形态的全部合法特性，包括隐藏特性。
- 特性选择后默认生效，不提供额外启用开关。
- 本轮仅适应力产生已支持计算效果。
- 其他真实特性仍可选择，但标记“效果暂未支持”，计算上使用中性修正并参与效果等价合并。
- “暂未支持”不得显示为“已判断对当前 Scenario 无效”。

## Skills

使用 `grilling` 与 `domain-modeling`；核对 PokeAPI 特性归属和当前 ruleset 的适应力语义。
