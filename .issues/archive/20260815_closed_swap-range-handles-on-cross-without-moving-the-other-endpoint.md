---
# This section is managed by the CLI. Do not edit manually.
id: "6e62a679-d218-46f5-b5b7-a41a16c8b72f"
title: "Swap Range handles on cross without moving the other endpoint"
status: "closed"
priority: "medium"
labels: ["BUG", "NEEDS-TRIAGE"]
created_at: "2026-08-15T14:54:00Z"
updated_at: "2026-08-16T02:58:00Z"
---
## Goal

拖动 Range 一端越过另一端时，未拖动的端点值保持不动，只交换两个端点的角色。

## Problem

当前 `useDualHandleDrag` 允许写入 `min > max`，随后 `orderedStatRange` 把两端排序。交叉后被拖的柄会跳回较大 / 较小的那一侧，看起来像把另一端一起拽走了，而不是换角色。

先前 map [[20260812_closed_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]] 已定：交叉换角色。

## Acceptance

- 把 max 拖过 min：原 min 值留在原地成为新 max；指针下的柄继续跟手，身份变成 min。
- 对称：min 拖过 max 同理。
- 包络内已选中的内部点不因这次交叉被清掉。

## Related

- [[../20260815_open_drag-either-coincident-range-endpoint-while-the-other-stays|Drag either coincident Range endpoint while the other stays]]：重合后再拉开，是同一套换角色拖法的另一端。
- [[20260815_closed_mark-selected-stat-values-on-the-stat-axis|Mark selected Stat Values on the stat axis]]
- [[20260815_closed_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]

## Resolution

2026-08-16：`useDualHandleDrag` 在 pointerdown 钉住未拖端点。交叉后写出有序区间，指针下的柄换角色继续跟手，另一端值不动。包络因此始终含原未拖端点，仍在包络内的选中值不会被这次交叉清掉。Fine-tune 身份跟着换。重合后再向两边拉开仍见 sibling ticket。

Trace: [`docs/traces/implementations/2026-08-16-swap-range-handles-on-cross.md`](../../docs/traces/implementations/2026-08-16-swap-range-handles-on-cross.md)
