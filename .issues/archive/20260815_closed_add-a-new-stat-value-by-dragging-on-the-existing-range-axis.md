---
# This section is managed by the CLI. Do not edit manually.
id: "03c06632-d8c7-4c3e-b470-d982a26e9f44"
title: "Add a new Stat Value by dragging on the existing Range axis"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-INFO"]
created_at: "2026-08-15T14:55:00Z"
updated_at: "2026-08-16T02:24:00Z"
---
## Goal

在选项里点添加新点时，直接在已有数轴上放置新点，而不是另开一块单点轴。

## Tentative interaction

交互待定。暂定：

- 既有区间半透明保留，新点可在轴上自由拖动。
- 结果区即时只显示该新点的结果，其他 Stat Value 暂时隐藏。
- 添加完成（确认或取消）后恢复原选中集合与结果。

## Current

`AddOffensePresetPanel` / `AddDefensePresetPanel` 在选项下方另渲染一条 `mode="single"` 的 `StatRangeInput`。

## Notes

实现前需要把拖点、确认 / 取消、以及结果区临时过滤的示能定下来。本票先记下方向，不定稿交互。

## Related

- [[20260815_closed_mark-selected-stat-values-on-the-stat-axis|Mark selected Stat Values on the stat axis]]：添加完成后，新点应出现在轴上。
- [[20260815_closed_swap-range-handles-on-cross-without-moving-the-other-endpoint|Swap Range handles on cross without moving the other endpoint]]
- [[20260815_closed_drag-either-coincident-range-endpoint-while-the-other-stays|Drag either coincident Range endpoint while the other stays]]

## Resolution

按暂定交互落地：点添加后，新点叠在已有 Range 轴上拖；既有区间带 / 手柄 / 内部点降到 40% 且不可拖。结果走派生 TrackState，该侧临时切到只含草稿点的 Choice，真实选中集合与 persistence 不动。确认走原来的 `confirmAdd*`；取消丢掉 overlay。拆掉另开的单点轴面板。

实现记录：[`docs/traces/implementations/2026-08-16-add-stat-value-on-range-axis.md`](../../docs/traces/implementations/2026-08-16-add-stat-value-on-range-axis.md)