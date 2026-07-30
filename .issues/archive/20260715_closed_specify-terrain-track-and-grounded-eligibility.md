---
# This section is managed by the CLI. Do not edit manually.
id: "fc91bd21-69ee-4cf3-85e3-ac90394fc9dd"
title: "Specify terrain track and grounded eligibility"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-30T06:05:00Z"
---
## Context

从 [[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]] 延后。场地的伤害效果依赖攻击方／防御方是否接地，而接地又与属性、道具、特性及其他战斗状态相交；当前用户明确暂不做此 feature。

## Question

未来 effort 需要定义无场地、电气、青草、精神、薄雾场地的 Track 契约，接地 eligibility 如何得到，以及只支持直接伤害影响时哪些场地规则仍属于不可回避的最小范围。

## Deferred constraints

- 本 issue 不属于当前 Wayfinder map 的 child frontier。
- 不在当前核心机制规格中引入额外“接地”Track。

## Resolution

- 新增无场地、电气、青草、精神、薄雾五项 multi-select Terrain Track，默认无场地且至少保留一项。
- 接地由当前 Battle Pokémon 属性和所选特性推导：飞行属性或飘浮特性不接地；不新增接地 Track。
- 覆盖第九世代通用场地倍率、青草场地对地震／重踏的减伤，以及电力上升、精神剑、广域战力、薄雾炸裂、铁滚轮和大地波动的直接影响。
- 大地波动在场地导致属性变化时明确标记暂不可计算；场地回复、状态免疫、种子、优先度阻挡和未暴露状态导致的接地变化不进入本轮。
- 场地参与 Row product rule、效果等价 Scenario 合并、结果来源、威力详情、持久化校验和四语言 UI。
