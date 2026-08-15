---
# This section is managed by the CLI. Do not edit manually.
id: "8c56bbdf-d71f-4db0-b0f6-a8784e6bdefc"
title: "Mark selected Stat Values on the stat axis"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-15T14:54:00Z"
updated_at: "2026-08-15T14:55:00Z"
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
- 不在数轴上直接增删点，见 [[20260815_open_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]。

## Related

- [[archive/20260815_closed_cap-stat-value-chip-corner-action-size-across-viewports|Cap Stat Value chip corner-action size across viewports]]
- [[20260815_open_swap-range-handles-on-cross-without-moving-the-other-endpoint|Swap Range handles on cross without moving the other endpoint]]
- [[20260815_open_drag-either-coincident-range-endpoint-while-the-other-stays|Drag either coincident Range endpoint while the other stays]]
- [[20260815_open_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]