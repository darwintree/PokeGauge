---
# This section is managed by the CLI. Do not edit manually.
id: "8c56bbdf-d71f-4db0-b0f6-a8784e6bdefc"
title: "Mark selected Stat Values on the stat axis"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-15T14:54:00Z"
updated_at: "2026-08-16T02:05:00Z"
---
## Goal

把当前选中的 Stat Value 标在数轴上，让 Choice 离散点与 Range 包络能在同一条轴上对读。

## Problem

展开 Stat Track 现在上下同时显示选项和区间，但数轴只画 snap 锚点和包络段，不标已选中的内部点。选了多个 Stat Value 时，轴上看不出除端点外还有哪些值在参与计算。

## Scope

- 进攻轴与防守 HP / Def 轴都标出当前选中 Stat Value。
- 端点、内部点、Temporary 都要能辨认，但不另造一套身份语言（沿用现有 chip / Temporary 虚线语义即可）。

## Out of scope

- 不改选中集合或包络写入规则。
- 不在数轴上直接增删点，见 [[../20260815_open_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]。

## Related

- [[20260815_closed_cap-stat-value-chip-corner-action-size-across-viewports|Cap Stat Value chip corner-action size across viewports]]
- [[../20260815_open_swap-range-handles-on-cross-without-moving-the-other-endpoint|Swap Range handles on cross without moving the other endpoint]]
- [[../20260815_open_drag-either-coincident-range-endpoint-while-the-other-stays|Drag either coincident Range endpoint while the other stays]]
- [[../20260815_open_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]

## Verification Checklist

- [x] 进攻轴：选中 0A / 32A / EX 时，32A 在包络内部显示 6px 实心圆，颜色与 32A 选项一致。
- [x] 防守 HP / Def 轴同样标出内部已选值，颜色与对应选项一致。
- [x] 端点手柄保持实线空心圆；Temporary 身份只留在 chip 虚线上。
- [x] 内部点不可拖动，不改选中集合或包络写入。

## Resolution

数轴现在接收当前选中 Stat Value 的投影标记。内部点画不可交互的 6px 实心圆，颜色用该点的 invest band 前景色（与选项 / chip 同一套 token）；端点仍用原实线 ink 手柄。Temporary 不在轴上改虚线。无 snap 标签的内部点补轴下数字。

实现记录：[`docs/traces/implementations/2026-08-15-mark-selected-stat-values-on-axis.md`](../../docs/traces/implementations/2026-08-15-mark-selected-stat-values-on-axis.md)