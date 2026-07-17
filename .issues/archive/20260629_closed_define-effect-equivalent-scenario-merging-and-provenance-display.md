---
# This section is managed by the CLI. Do not edit manually.
id: "0b43d1d4-3010-4e3f-b7c7-38f5db9247f0"
title: "Define effect-equivalent Scenario merging and provenance display"
status: "closed"
priority: "high"
labels: ["WAYFINDER:PROTOTYPE", "FEATURE-REQUEST"]
created_at: "2026-06-29T14:47:00Z"
updated_at: "2026-07-16T09:01:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

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

## Resolution

- 同一 Move snapshot 下，以实际送入伤害与概率计算的完整输入作为效果等价键；UI 文案、原始来源选择与最终展示数字不进入键。
- 当前 map 范围内，合并来源按 Track 保存选项集合，不保存每个原始 Scenario 的完整组合列表。
- 采用原型方向 A「行内来源」：每条结果行按 Track 直接展示生效要素，并在同一行提供默认折叠的其他已选项。
- 展开区只展示折叠要素，不重复主行生效要素；已判断未生效与效果暂未支持使用不同状态标记。
- 不规格化折叠入口的计数、分类摘要或全局展开行为；实现采用满足上述契约的最简单形态。
- 验收矩阵保持既定结果：喷射火焰／地震 × 无道具／木炭／柔软沙子 × 沙暴／晴天的 12 个原始组合合并为 6 行。

Prototype primary source:

- Branch: `prototype/effect-equivalent-scenario-merge`
- Commit: `a2f9bea`
- Path: `docs/prototypes/effect-equivalent-scenario-merge.html`

讨论记录：[[../../docs/traces/discussion/2026-07-16-effect-equivalent-scenario-provenance|效果等价 Scenario 来源展示讨论记录]]

## Implementation handoff

- [ ] 后续实现票逐条审计讨论记录中的决定均已落实。
