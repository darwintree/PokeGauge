---
# This section is managed by the CLI. Do not edit manually.
id: "f19779aa-27c4-48be-8dca-afe78da62272"
title: "Define Move snapshot creation and editing contract"
status: "open"
priority: "high"
labels: ["WAYFINDER:PROTOTYPE", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义从 Move template 创建、复制、编辑与移除 Move snapshot 的完整产品契约和交互原型，包括重复快照的识别、未配置字段的阻断与提示、变量威力常见档位如何与上游标量及手动输入共存，以及编辑后结果如何稳定对应到快照。

## Confirmed constraints

- Move template 不可变；选择招式会创建可编辑 Move snapshot，不修改共享资源。
- 同一模版允许创建多个独立快照；快照是刻意比较单位，彼此永不做效果等价合并。
- 可编辑字段为威力、命中、会心等级与 Spread move modifier 开关。
- 会心等级为 `0`～`+3`，不另设“必定会心”类型；`+3` 即必定会心。
- 只有支持多目标的模版显示 Spread 开关，VGC 默认开启；单体招式不能强制开启。
- 威力复制上游标量，`null` 映射为 `0`；`0` 表示未配置，不生成伤害结果。
- 数字命中直接复制；已审核必中初始化为 `100%` 并保留必中语义；其他 `null` 映射为未配置的 `0`，不生成实际概率结果。
- PokeAPI 没有统一的变量威力档位模型；调查资产为 [[../docs/research/2026-07-15-pokeapi-variable-power-move-data|PokeAPI Variable-power Move Data]]。本票需要在保留“常见档位可选”产品目标的同时明确其受审核来源与无来源时的降级。

## Skills

使用 `prototype`、`grilling` 与 `domain-modeling`。
