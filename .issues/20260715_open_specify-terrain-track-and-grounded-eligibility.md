---
# This section is managed by the CLI. Do not edit manually.
id: "fc91bd21-69ee-4cf3-85e3-ac90394fc9dd"
title: "Specify terrain track and grounded eligibility"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Context

从 [[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]] 延后。场地的伤害效果依赖攻击方／防御方是否接地，而接地又与属性、道具、特性及其他战斗状态相交；当前用户明确暂不做此 feature。

## Question

未来 effort 需要定义无场地、电气、青草、精神、薄雾场地的 Track 契约，接地 eligibility 如何得到，以及只支持直接伤害影响时哪些场地规则仍属于不可回避的最小范围。

## Deferred constraints

- 本 issue 不属于当前 Wayfinder map 的 child frontier。
- 不在当前核心机制规格中引入额外“接地”Track。
