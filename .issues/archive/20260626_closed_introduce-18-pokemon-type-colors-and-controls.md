---
# This section is managed by the CLI. Do not edit manually.
id: "3dc0aa1e-367a-4b33-855d-77db3a4d8667"
title: "Introduce 18 Pokémon type colors and controls"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-07-30T05:43:00Z"
---
## Context

按 [[AGENTS.md]]，Pokémon 领域 token（属性、克制、HP 等）与 Geist/shadcn 语义分离。

与 [[20260626_closed_audit-and-align-domain-color-systems|Audit and align domain color systems]] 互补。

## Design verdict (grill + prototype)

### 用途

识别展示 only — 不表达克制倍率，不做 type 选择控件。

### Species typing

Combobox **输入框 trailing TypeBadge**（无下拉 badge）。

### Move typing

**Track + row badge**（grill 称 variant D）

- 招式 track：TypeBadge + 招式名（**无 summary**）
- 结果行：`showMoveOnRow` 时招式名旁 inline TypeBadge

### 色板

Showdown / Bulbapedia 惯例 hex；**light / dark 共用同一套**（不单独 dark 调色）。

### Out of scope

- 克制倍率可视化
- Combobox 下拉项 badge
- 行左侧 move-type 色条（variant C）
- 使用率排序文案（summary 去掉后 v1 不展示）

## Acceptance criteria

- [x] 18 属性 `--pokemon-type-*` 集中定义（Showdown hex，light/dark 共用）
- [x] `TypeBadge` 组件
- [x] catalog 结构化 species types + move type
- [x] MatchupSelector trailing species badge
- [x] Move track：TypeBadge + label，无 summary
- [x] 结果行 move badge（`showMoveOnRow` 时）

## Resolution

Implemented variant D (track + row badge): `--pokemon-type-*` in `src/index.css`, `TypeBadge` / `TypeBadgeRow` in `src/components/pokemon/`, structured `types` / `type` on catalog, trailing species badges in `matchup-selector.tsx`, `MoveMultiSelect` in track controls, inline move badge in `damage-box-plot.tsx` when `showMoveOnRow`.
