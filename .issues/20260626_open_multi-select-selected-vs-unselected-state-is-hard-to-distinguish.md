---
# This section is managed by the CLI. Do not edit manually.
id: "b4752613-a2dd-42bd-a83c-ae76a50dee73"
title: "Multi-select selected vs unselected state is hard to distinguish"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-26T14:23:00Z"
---
## Context

Scenario Explorer 侧边栏各 track（招式、实数值、道具、防守方配置）使用 `ConfigMultiSelect` + shadcn `ToggleGroup`。当前选中（`data-[state=on]`）与未选中项的视觉对比偏弱，用户容易混淆哪些选项已纳入对比。

相关实现：`src/components/scenario-explorer/config-multi-select.tsx`

## What to build

- 强化选中 / 未选中状态的视觉区分（背景、边框、字重、类型色等），保持 Geist / shadcn 语义
- 确保 `aria-pressed` / ToggleGroup 可访问性语义不变
- 各 track 控件风格一致

## Acceptance criteria

- [ ] 未选中项与选中项在浅色主题下一眼可辨
- [ ] 选中态不依赖 hover 才能识别
- [ ] 多 track 控件视觉语言一致
- [ ] 键盘与屏幕阅读器行为无回归