---
# This section is managed by the CLI. Do not edit manually.
id: "8cc5da68-6eb4-48c5-9bcc-47dcafb80c3e"
title: "Define stat-stage tracks and critical-hit interactions"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T02:05:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义攻击方与防御方能力阶级 Track 的产品与公式契约：合法选择、默认值、物理／特殊招式映射、标签与结果来源，以及会心发生时如何忽略不利攻击阶级和有利防御阶级。产出足以支持后续实现与验收的边界案例。

## Confirmed constraints

- 攻击方与防御方各自拥有一个 multi-select Track，范围均为 `-6`～`+6`，默认只选 `0`。
- 物理招式映射物攻／物防，特殊招式映射特攻／特防；不包含速度、命中或闪避阶级。
- 会心等级是 Move snapshot 上独立的 `0`～`+3` 概念。
- 会心忽略攻击方负能力阶级与防御方正能力阶级；攻击方正阶级与防御方负阶级仍生效。

## Skills

使用 `grilling` 与 `domain-modeling`；机制事实从当前 ruleset 的高可信来源核对。

## Discussion trace

[[../docs/traces/discussion/2026-07-17-stat-stage-and-critical-interactions|能力阶级与会心交互讨论记录]]

## Resolution

- 攻击方与防御方各使用一个 `-6`～`+6` multi-select Track，默认均为 `{0}`。每个 Track 至少保留一项；清空或取消最后一项时自动选中 `0`。更换进攻方、防守方或切换 Move side 时，双方 Track 都重置为 `{0}`。
- 物理招式把双方 Track 映射到物攻／物防，特殊招式映射到特攻／特防。Stage 作用于对应实数值：非负 stage `s` 使用 `(2 + s) / 2`，负 stage 使用 `2 / (2 - s)`，结果向下取整。
- 普通伤害使用所选 stage。会心伤害把攻击方负 stage 与防御方正 stage 的有效值改为 `0`；攻击方正 stage 与防御方负 stage 保持原值。
- Track 与结果来源只显示原始 stage 值，不显示 stat 名、倍率、换算实数值或“会心按 0 计算”等公式说明。结果主行省略 `0`，但折叠来源仍保留该选择。
- `Actual probability` 的 Critical stage 概率为 `+0 = 1/24`、`+1 = 1/8`、`+2 = 1/2`、`+3 = 1`。`16 roll` 模式下 `+0`～`+2` 不引入随机会心；`+3` 仍按 `100%` 命中、`100%` 会心计算 KO。
- `+0`～`+2` 保持普通伤害箱体与会心须须。`+3` 使用会心 16 rolls 作为主箱体并隐藏会心须须。
- `+3` 下被完全忽略的攻击方负 stage 与防御方正 stage 不进入主行；同一 Move snapshot 内的效果等价组合合并，原始选择在折叠来源中标记为“未生效”。
- 规格不锁定多个 stage 组合的结果行排序。

## Acceptance criteria

- [ ] 后续实现完成前，逐行审计讨论记录中的每项决定均已实现或由明确的新决策替代。
- [ ] 双方 Track 默认 `{0}`、不可清空，并在更换进攻方、防守方或 Move side 后重置为 `{0}`；结果主行不显示 `0`。
- [ ] 物理／特殊 stat 映射正确，且 `-6`、`0`、`+6` 与整数取整符合当前 Gen 9 阶级公式。
- [ ] 会心覆盖四个符号分支：负攻／正防得到 `0/0`，负攻／负防得到 `0/负防`，正攻／正防得到 `正攻/0`，正攻／负防保持原值。
- [ ] 四档会心概率正确；`+3` 在 `16 roll` 与 `Actual probability` 中都使用会心箱体和会心 KO，且不显示会心须须。
- [ ] `+3` 下被忽略的多个 stage 合并为效果等价行，全部原始选择保留在“未生效”折叠来源中。
