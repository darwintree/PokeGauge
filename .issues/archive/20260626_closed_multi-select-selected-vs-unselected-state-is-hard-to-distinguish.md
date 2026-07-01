---
# This section is managed by the CLI. Do not edit manually.
id: "b4752613-a2dd-42bd-a83c-ae76a50dee73"
title: "Multi-select selected vs unselected state is hard to distinguish"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-30T10:02:00Z"
---
## Context

Scenario Explorer 侧边栏 multi-select track（招式、攻击/防守实数值模版、道具）缺少统一的选中 / 未选中视觉语言。当前实现分裂：

- 招式：`MoveMultiSelect`（`ToggleGroup` + 弱 `data-[state=on]` 对比）
- 实数值：`StatValueTemplatePreset`（按 kind 各自 toggle 样式）
- 道具：`HeldItemTrack`（独立 icon tile 样式）

用户容易混淆哪些选项已纳入对比。

**设计已定稿**（实现待做）：

- 讨论 trace：[`docs/traces/2026-06-30-track-option-visual-grill.md`](../../docs/traces/2026-06-30-track-option-visual-grill.md)

相关布局 / 领域语义（仍有效）：[`docs/traces/2026-06-28-stat-value-template-grill.md`](../../docs/traces/2026-06-28-stat-value-template-grill.md) §7–§11

## What to build

- 新增 **`TrackOption`** + **`TrackOptionGroup`**（`text` / `icon` layout；`button` + `aria-pressed`；`actions` slot）
- 迁移 **`MoveMultiSelect`**、**`StatValueTemplatePreset`**、**`HeldItemTrack`** 至统一 primitive
- 移除 track 级 **`ToggleGroup`**；清理未使用的 **`ConfigMultiSelect`**
- CSS 按 trace §8–§12 与 prototype 映射（inclusion A、flat 容器、1B / 2B / 3B modifier 层）
- 保持 Geist / shadcn token 语义；modifier 按 track 分类型
- 实现验收后 **清理原型代码**：删除 `docs/prototypes/track-option-matrix.html`；若 `docs/prototypes/` 无其它文件则移除该目录

## Acceptance criteria

- [x] 未选中项与选中项在浅色主题下一眼可辨
- [x] 选中态不依赖 hover 才能识别
- [x] 多 track 控件视觉语言一致（同一 inclusion 层 + 正交 modifier 层）
- [x] 键盘与屏幕阅读器行为无回归（`aria-pressed`；action 与 toggle 分离）
- [x] 逐条对照 [`docs/traces/2026-06-30-track-option-visual-grill.md`](../../docs/traces/2026-06-30-track-option-visual-grill.md) §1–§12，确认每项决定已在代码中落地
- [x] 原型代码已清理（`docs/prototypes/track-option-matrix.html` 已删除；无残留引用）

## Resolution

Implemented unified `TrackOption` / `TrackOptionGroup` primitive with inclusion layer A CSS (primary border + tint + ring), flat flex-wrap container, and per-track modifier classes (tier 1B/2B, dashed 3B). Migrated move, stat template, and held-item tracks; removed `ConfigMultiSelect` and the HTML prototype.

- `src/components/scenario-explorer/track-option.tsx`
- `src/components/scenario-explorer/move-multi-select.tsx`
- `src/index.css` — `.track-option-*` component classes
