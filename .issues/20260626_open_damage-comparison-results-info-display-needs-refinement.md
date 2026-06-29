---
# This section is managed by the CLI. Do not edit manually.
id: "64adddc9-f320-4b07-b6b0-7fe44867dfc5"
title: "Damage comparison results info display needs refinement"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-29T14:48:00Z"
---
## Context

Scenario Explorer 右侧伤害对比区（箱线图 + 结果摘要）的信息层级与展示方式需要调整，以便用户更快理解当前筛选条件下的对比结果。

相关实现：
- `src/components/scenario-explorer/scenario-explorer-page.tsx`
- `src/components/scenario-explorer/damage-box-plot.tsx`
- `src/components/scenario-explorer/selection-summary.tsx`（如有）

## What to build

- 梳理并调整伤害对比区的信息架构（摘要、行数、图例、OHKO/阈值标注等）
- 减少冗余或难以扫读的信息
- 与左侧 track 选择状态形成清晰对应

### Held-item display（grill 2026-06-29）

- 结果行携带道具改为 **图标**（与 sidebar 同源 `public/items/`）
- **hover** 时 tooltip 补全道具名称
- 属性强化对当前招式 **无加成** 时，结果行注明 **「无加成」**（v1 不合并重复行；合并方案 → [[20260629_open_merge-scenario-rows-when-item-has-no-damage-effect]]）

## Acceptance criteria

- [ ] 结果区关键信息（对比对象、伤害区间语义、选中规模）优先可见
- [ ] 图例与箱线图语义一致且易读
- [ ] 筛选变化时摘要更新及时、无歧义
- [ ] 道具图标 + hover 名称；无加成标注

## Related

- [[20260626_open_introduce-specific-held-item-controls-life-orb-plates-choice-series|Held-item controls]]
- [[20260629_open_merge-scenario-rows-when-item-has-no-damage-effect|Merge no-boost rows]]
