---
# This section is managed by the CLI. Do not edit manually.
id: "2eae61ef-1cc0-4c76-8152-b807d8423d2a"
title: "Integrate battle modifier ordering and specification seams"
status: "open"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

在所有独立机制票关闭后，整合一套 decision-complete 的规格：明确 Move snapshot、能力阶级、天气、适应力、墙、既有道具与会心在公式中的顺序和相互作用；定义 adapter 编译输入、effect-equivalence identity、unsupported／unconfigured 传播、来源展示与跨机制验收矩阵。结果必须足以直接拆成后续实现 tickets，但本票不创建或执行实现。

## Blocked by

- [[20260629_open_define-effect-equivalent-scenario-merging-and-provenance-display|Define effect-equivalent Scenario merging and provenance display]]
- [[20260715_open_define-move-snapshot-creation-and-editing-contract|Define Move snapshot creation and editing contract]]
- [[20260715_open_define-stat-stage-tracks-and-critical-hit-interactions|Define stat-stage tracks and critical-hit interactions]]
- [[20260715_open_research-weather-power-and-accuracy-support-matrix|Research weather power and accuracy support matrix]]
- [[20260715_open_define-ability-tracks-and-adaptability-only-support-contract|Define ability tracks and Adaptability-only support contract]]
- [[20260715_open_define-screen-track-and-critical-hit-interactions|Define Screen track and critical-hit interactions]]

## Skills

使用 `grilling`、`domain-modeling` 与 `codebase-design`；保持现有 local damage kernel ADR 的资源／adapter／公式内核边界。
