---
# This section is managed by the CLI. Do not edit manually.
id: "68a9f34f-3d7d-44fd-bef8-f6d47f46dfa8"
title: "Drag either coincident Range endpoint while the other stays"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-15T14:54:00Z"
updated_at: "2026-08-16T03:04:00Z"
---
## Goal

数轴两个端点重合时，可以把该点向左或向右拖开，另一端留在原地。

## Problem

重合时两柄叠在一起。按当前「柄身份固定 + 事后排序」的拖法，往某一侧拖会像在挪整段，或只能朝一个方向拉开。

先前 map [[20260812_closed_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]] 已定：单值可把两个手柄向两边拖。

## Acceptance

- `min === max` 时，向左拖：一柄跟手成为 min，另一柄留在原值。
- 向右拖：一柄跟手成为 max，另一柄留在原值。
- 不要求先点中「某一个」柄；拖动方向决定谁动。

## Related

- [[20260815_closed_swap-range-handles-on-cross-without-moving-the-other-endpoint|Swap Range handles on cross without moving the other endpoint]]：拉开后若再交叉，按换角色处理。
- [[20260815_closed_mark-selected-stat-values-on-the-stat-axis|Mark selected Stat Values on the stat axis]]
- [[20260815_closed_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]

## Resolution

2026-08-16：与 [[20260815_closed_swap-range-handles-on-cross-without-moving-the-other-endpoint|Swap Range handles on cross without moving the other endpoint]] 同一套手势。`min === max` 时 pointerdown 的 anchor 就是该点；向左跟手成 min，向右跟手成 max，另一端留在原值。重合时轴上只画一柄，故不需要先点中某一个。落地于 `5a4430b`。
