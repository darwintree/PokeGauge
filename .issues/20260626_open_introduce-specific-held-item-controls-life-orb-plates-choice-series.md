---
# This section is managed by the CLI. Do not edit manually.
id: "54dd9e9b-4bbe-4dfe-9d8b-2bee2e22edb1"
title: "Introduce specific held-item controls (Life Orb, type boosts, Choice series)"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-29T14:55:00Z"
---
## Context

当前攻击方「道具」track 为通用文字多选。需改为 **纯图标** 控件（定稿见 grill trace §7–§9）。

Grill（2026-06-29）：[`docs/traces/2026-06-29-held-item-controls-grill.md`](../../docs/traces/2026-06-29-held-item-controls-grill.md)

相关实现：
- `src/components/scenario-explorer/track-controls.tsx`
- catalog / pipeline `attackerItems` 与 item modifier
- `public/items/` 本地 sprite（源自 Serebii ItemDex SV）

## What to build

- 合并单一图标池：core + 本系强化（默认可见 ≤2）+ `+` 添加的强化道具（localStorage 按 attacker 持久化）
- 道具 track **多选**（对比互斥方案；每 scenario 行仅一件）；default view 仅选中 **无道具**
- catalog 扩展 `type-boost-{type}` → @smogon/calc 名称；pipeline 一致
- 结果行道具展示 defer → [[20260629_open_merge-scenario-rows-when-item-has-no-damage-effect|Merge no-boost rows]] 与 [[20260626_open_damage-comparison-results-info-display-needs-refinement|Results info display]]

## Acceptance criteria

- [ ] 无道具 / 生命玉 / 讲究 / 属性强化可多选并参与对比（每行仅一件、效果互斥）
- [ ] 各选项与伤害计算 item modifier 一致
- [ ] Default view 默认选中无道具
- [ ] `+` 添加的强化道具按攻击方持久化
- [ ] catalog 扩展方式可复用于后续道具类别
- [ ] 无加成时结果行注明「无加成」（在 results display issue 中验收）

## Out of scope (v1)

- 讲究围巾（无伤害 modifier）
- 石板
- 合并无加成重复行 → [[20260629_open_merge-scenario-rows-when-item-has-no-damage-effect]]
