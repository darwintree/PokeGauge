---
# This section is managed by the CLI. Do not edit manually.
id: "54dd9e9b-4bbe-4dfe-9d8b-2bee2e22edb1"
title: "Introduce specific held-item controls (Life Orb, Plates, Choice series)"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-26T14:23:00Z"
---
## Context

当前攻击方「道具」track 为通用多选列表。需要引入更贴近对战场景的特定道具控件，例如：
- 生命玉（Life Orb）
- 石板（Plates，属性对应）
- 讲究系列（Choice Band / Specs / Scarf）

相关实现：
- `src/components/scenario-explorer/track-controls.tsx`（道具 track）
- catalog / pipeline 中 `attackerItems` 配置与伤害乘算

## What to build

- 扩展或重组道具 track UI，支持上述特定道具的清晰选择与展示
- 确保选项与伤害 pipeline 中的 item modifier 一致
- 与现有多选 / 收紧结果语义兼容（含 explicit no-item）

## Acceptance criteria

- [ ] 生命玉、石板、讲究系列可在 UI 中选择并参与对比
- [ ] 各道具选项标签与伤害计算行为一致
- [ ] 与「无道具」选项的交互清晰、不冲突
- [ ] catalog 扩展方式可复用于后续道具