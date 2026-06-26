---
# This section is managed by the CLI. Do not edit manually.
id: "323d3f26-fac7-4f02-a268-b256a1c51a07"
title: "Stat range axis UI needs refinement"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-26T14:23:00Z"
---
## Context

攻击方实数值支持「数轴选段」模式（`StatRangeAxis`），用于在 min–max 区间内选段生成对比行。当前数轴选段 UI 在布局、刻度、拖拽手柄、与「预设」模式切换等方面需要调整。

相关实现：
- `src/components/scenario-explorer/stat-range-axis.tsx`
- `src/components/scenario-explorer/track-controls.tsx`（Tabs：预设 / 数轴选段）

## What to build

- 调整数轴选段的视觉与交互（刻度、区间高亮、手柄、标签等）
- 与 sidebar 整体密度、Geist 间距对齐
- 明确区间边界与当前选中范围的反馈

## Acceptance criteria

- [ ] 数轴选段 UI 在 desktop sidebar 内布局合理、不溢出
- [ ] 用户能清楚看到当前选中区间及对应实数值范围
- [ ] 与「预设」多选模式切换后状态反馈清晰
- [ ] 移动端 stacked 布局下仍可用