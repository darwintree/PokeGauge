---
# This section is managed by the CLI. Do not edit manually.
id: "ddd56c38-7dc0-4768-9dbf-c1ed32f81841"
title: "Define Range endpoint identity and merge semantics"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-17T03:42:00Z"
updated_at: "2026-08-20T08:30:00Z"
---
## Context

Core battle mechanics 规格规定单个 Stat Range 使用 lowOutcome／highOutcome 两个计算端点，但不决定不同端点选择吸附到相同值后是否计算等价。

## Question

定义 Stat Range 原始端点值、可达端点、calculation identity 与 Scenario Merge 之间的关系，以及是否需要跨不同区间保留 Track 来源。

## Source

[[20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]]

## Resolution

2026-08-20：现有领域契约与实现已经回答本票问题。

- `CONTEXT.md` 将 Stat Range 定义为两个完整 Stat Value 端点；防守端为 `(min HP, min Def)` 与 `(max HP, max Def)`，不生成四角笛卡尔积。
- calculation identity 包含 low／high 两个具体端点输入及顺序，不以最终四舍五入后的伤害相等作为合并依据。
- provenance 不进入 calculation identity；计算等价的 Selection 可以合并，同时保留其 Track 来源集合。
- pipeline 测试覆盖精确端点传递、Range 单行身份、KO probability 端点范围与 effect-equivalent merge。

无需新增 Range 专用 identity 或额外来源模型。
