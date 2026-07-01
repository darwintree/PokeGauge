---
# This section is managed by the CLI. Do not edit manually.
id: "64adddc9-f320-4b07-b6b0-7fe44867dfc5"
title: "Damage comparison results info display needs refinement"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-07-01T02:55:00Z"
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
- 属性强化对当前招式 **无加成** 时，结果行注明 **「无加成」**（v1 不合并重复行；合并方案 → [[../20260629_open_merge-scenario-rows-when-item-has-no-damage-effect]]）

### Row cleanup（grill 2026-07-01，详见 trace）

- 删除结果行底部冗余摘要行（区间说明已在上方展示；道具改图标后该行只剩重复文字）
- 「无加成」标注放在道具图标旁的行内小字，不需要 hover
- OHKO 标记合并为单一标记，统一用百分比形式（`X% OHKO`），去掉静态「OHKO」徽章
- 仅暴击可 OHKO（普通 roll < 100% 但暴击 roll ≥ 100%）时，v1 显示文字标签「仅暴击 OHKO」；综合命中+暴击的完整概率计算另见 [[../20260701_open_ohko-2hko-probability-should-combine-normal-and-crit-rolls|OHKO/2HKO combined probability]]

## Acceptance criteria

- [x] 结果区关键信息（对比对象、伤害区间语义、选中规模）优先可见——已由 stat/defender tier chip、header `SelectionSummary` 覆盖；本轮删除了行底部的冗余摘要行
- [x] 图例与箱线图语义一致且易读——`BoxPlotLegend` 与箱体/须须/均线含义一致，未变更
- [x] 筛选变化时摘要更新及时、无歧义——React 状态驱动，无额外改动需要
- [x] 道具图标 + hover 名称；无加成标注——`damage-box-plot.tsx` 改用 `itemSprite` + `title` tooltip + 行内「无加成」文字
- [x] 逐条核对 [[../docs/traces/2026-07-01-damage-comparison-results-info-display-grill|discussion trace]] 中的每条决定均已实现——4 条决定均已落地（见 Resolution）

## Resolution

- 删除 `DamageBoxPlot` 左侧标签区底部的冗余摘要行（`src/components/scenario-explorer/damage-box-plot.tsx`），连带清理 `scenario-results.tsx` 中不再需要的 `summary` 字段拼接
- 道具展示改为图标（`itemSprite`）+ `title` 属性 hover 全名，与暴击端点 tooltip 的现有写法一致
- 新增 `itemHasNoBoostForMove`（`src/lib/held-item/items.ts`），行内小字标注「无加成」；已补单测
- 合并 OHKO 双徽章为单一百分比标记；普通 roll 打不到 100% 但暴击能一击必杀时显示「仅暴击 OHKO」，完整命中+暴击综合概率计算移至新 issue
- `CONTEXT.md` 补充「No-boost row」词条

## Related

- [[20260626_open_introduce-specific-held-item-controls-life-orb-plates-choice-series|Held-item controls]]
- [[../20260629_open_merge-scenario-rows-when-item-has-no-damage-effect|Merge no-boost rows]]
- [[../20260701_open_ohko-2hko-probability-should-combine-normal-and-crit-rolls|OHKO/2HKO combined probability]]
