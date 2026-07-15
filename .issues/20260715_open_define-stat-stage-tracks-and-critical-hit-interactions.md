---
# This section is managed by the CLI. Do not edit manually.
id: "8cc5da68-6eb4-48c5-9bcc-47dcafb80c3e"
title: "Define stat-stage tracks and critical-hit interactions"
status: "open"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义攻击方与防御方能力阶级 Track 的产品与公式契约：合法选择、默认值、物理／特殊招式映射、标签与结果来源，以及会心发生时如何忽略不利攻击阶级和有利防御阶级。产出足以支持后续实现与验收的边界案例。

## Confirmed constraints

- 攻击方与防御方各自拥有一个 multi-select Track，范围均为 `-6`～`+6`，默认只选 `0`。
- 物理招式映射物攻／物防，特殊招式映射特攻／特防；不包含速度、命中或闪避阶级。
- 会心等级是 Move snapshot 上独立的 `0`～`+3` 概念。
- 会心忽略攻击方负能力阶级与防御方正能力阶级；攻击方正阶级与防御方负阶级仍生效。

## Skills

使用 `grilling` 与 `domain-modeling`；机制事实从当前 ruleset 的高可信来源核对。
