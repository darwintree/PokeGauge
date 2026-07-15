---
# This section is managed by the CLI. Do not edit manually.
id: "b2408539-8119-4aa8-b8af-928bb8710e3b"
title: "Expand supported ability effects beyond Adaptability"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Context

从 [[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]] 延后。当前 map 只把适应力规格化为具有计算效果的特性；其他合法特性可被选择，但使用明确的“效果暂未支持”状态。

## Question

未来 effort 应如何按机制族扩展攻击方／防御方特性效果，并处理 HP、异常状态、上一回合事件、忽略其他修正等外部条件，而不把伤害计算器扩张成完整战斗模拟器？需要确定首批能力族、条件输入模型及与效果等价合并的交互。

## Deferred constraints

- 本 issue 不属于当前 Wayfinder map 的 child frontier。
- 未实现特性不得被标记为已判断无效。
