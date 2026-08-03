---
# This section is managed by the CLI. Do not edit manually.
id: "0e286ed4-14d8-49f4-a8eb-625c3c095607"
title: "Specify random multi-hit and accuracy mechanics"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-08-03T08:24:00Z"
---
## Context

从 [[archive/20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]] 延后。随机段数相对其他当前功能独立，不应阻塞能力阶级、天气、适应力、墙或 Move Snapshot 的基础规格。

## Question

未来 effort 需要区分并规格化：视为必中的随机段数、整招只判定一次命中后再抽取段数、逐段独立命中／失败终止，以及逐段威力或会心是否独立。应明确每类招式如何形成单次使用的 Atomic Damage Distribution、与 Move Snapshot 编辑的关系及可支持的首个最小切片。

## Deferred constraints

- 本 issue 不属于当前 Wayfinder map 的 child frontier。
- 不要在未区分整招命中与逐段命中前把所有 multi-hit move 归为一种模型。
