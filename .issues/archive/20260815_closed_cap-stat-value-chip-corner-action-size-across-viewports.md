---
# This section is managed by the CLI. Do not edit manually.
id: "5a3a92f4-9966-4907-acc0-ed595ecf204c"
title: "Cap Stat Value chip corner-action size across viewports"
status: "closed"
priority: "medium"
labels: ["BUG", "NEEDS-TRIAGE"]
created_at: "2026-08-15T14:54:00Z"
updated_at: "2026-08-15T15:02:00Z"
---
## Problem

在特定页面宽度 / 比例下，Stat Value 选项上的角标会异常放大，盖住或压过 chip 本身。角标是 TrackOption 的 persist / delete / cycle-allocation 控件，不是 chip 填色。

## Likely lead

`src/styles/track-options.css` 在 `@layer` 外有 `@media (max-width: 1023px)`，把 `.track-option-action` 从默认 `1rem` 提到 `2rem`。该规则不进 layer，窄视口或分栏下会盖过组件层尺寸。

## Scope

- 角标在桌面窄窗、分栏、以及 ≤1023px 下仍是相对 chip 的小角标，而不是接近 chip 本体。
- 若要保留触控命中区，放大的是命中热区，不是可见角标本身。

## Out of scope

- 改 chip 配色、Temporary 虚线、或角标功能集合。

## Related

- [[20260815_closed_mark-selected-stat-values-on-the-stat-axis|Mark selected Stat Values on the stat axis]]
- [[20260815_closed_swap-range-handles-on-cross-without-moving-the-other-endpoint|Swap Range handles on cross without moving the other endpoint]]
- [[20260815_closed_drag-either-coincident-range-endpoint-while-the-other-stays|Drag either coincident Range endpoint while the other stays]]
- [[20260815_closed_add-a-new-stat-value-by-dragging-on-the-existing-range-axis|Add a new Stat Value by dragging on the existing Range axis]]

## Verification Checklist

- [x] ≤1023px 下角标可见尺寸仍是 `1rem`，不盖住 chip 本体。
- [x] 窄视口仍保留约 `2rem` 的命中热区（`::before`），不把可见盒撑大。
- [x] 不改 chip 配色、Temporary 虚线、或角标功能。

## Resolution

根因是 `src/styles/track-options.css` 在 `@layer` 外的 `@media (max-width: 1023px)` 把 `.track-option-action` 可见盒从 `1rem` 提到 `2rem`。窄视口下 chip 约 40px 高，32px 角标会盖住本体。

可见尺寸固定为组件层的 `1rem`。同一媒体查询改为 `.track-option-action::before { inset: -0.5rem; pointer-events: inherit }`，命中盒保持原来的 `2rem`。800px 视口实测：角标 16×16，热区约 30×30。

实现记录：[`docs/traces/implementations/2026-08-15-stat-value-chip-corner-action-size.md`](../docs/traces/implementations/2026-08-15-stat-value-chip-corner-action-size.md)