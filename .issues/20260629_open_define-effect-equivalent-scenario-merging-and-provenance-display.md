---
# This section is managed by the CLI. Do not edit manually.
id: "0b43d1d4-3010-4e3f-b7c7-38f5db9247f0"
title: "Define effect-equivalent Scenario merging and provenance display"
status: "open"
priority: "high"
labels: ["WAYFINDER:PROTOTYPE", "FEATURE-REQUEST"]
created_at: "2026-06-29T14:47:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

在已确认采用局部效果等价策略 A 的前提下，定义可执行的 Scenario 等价键、跨多个 Track 的来源保留模型，以及结果行如何清晰展示被合并的原始选择。用一个低成本交互原型比较单行多标签、折叠来源与按 Track 汇总等呈现，确保用户仍能看出自己选择了哪些配置。

## Confirmed constraints

- 只允许在同一 Move snapshot 内合并；不同快照即使数值完全相同也不合并。
- 以实际生效机制与计算输入判断等价，不能以取整后伤害或最终展示数字碰巧相同判断。
- 部分 Track 无效时也合并，只要剩余有效机制相同；不要求整个 Scenario 或整个 Track 全部无效。
- 合并行必须保留全部原始选择来源，并区分“已判断无效”与“机制暂未支持”。
- 原始测试矩阵：喷射火焰／地震 × 无道具／木炭／柔软沙子 × 沙暴／晴天，共 12 个组合；策略 A 必须形成 6 行：喷射火焰 4 行、地震 2 行。
- `CONTEXT.md` 中 Row product rule 表达原始组合数，最终展示行数允许因效果等价合并而减少。

## Skills

使用 `prototype`、`grilling` 与 `domain-modeling`。
