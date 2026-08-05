---
# This section is managed by the CLI. Do not edit manually.
id: "f4c20b62-30d9-46db-857a-d9ad9cf10000"
title: "Polish held-item picker UI styling"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-05T04:44:00Z"
updated_at: "2026-08-05T05:37:00Z"
---
## Goal

优化 Held item Picker 的前端视觉与交互样式，使其与 Scenario Explorer / game HUD 的整体质感对齐，而不仅是功能可用。

## Context

Held item pick 契约已落地（使用率默认池、单选 tag、形态道具确认切换）。验收时发现 Picker 的样式仍偏脚手架。

实现入口：`src/features/scenario-explorer/tracks/held-item/held-item-picker-dialog.tsx`（以及必要时共用的 `PickerDialog`）。

## Resolution

- Prototype: `?prototype=held-item-picker` — **B chrome + C tag pills**; holder toggle removed (always filter by current-holder eligibility).
- Spec change: `docs/spec/changes/2026-08-05-held-item-picker-always-holder-eligible.md` (accepted) → `docs/spec/held-item-pick.md`.
- Folded into production picker (2026-08-05): toolbar search + All/tag pills; flat rows with sprite tile + `FORM` mark; no holder chip.

## Acceptance ideas

- [x] 在默认 Matchup 打开攻击方/防守方 Held item Picker，视觉与 Move picker 同属一套 HUD，无明显「临时控件」感
- [x] Tag 单选、搜索、列表选择的交互状态清晰可读
- [x] 形态道具行可一眼区分，且不破坏列表扫描节奏
- [x] 经 design-taste-frontend 复查无新增 AI-slop / 与现有 HUD 冲突的样式
