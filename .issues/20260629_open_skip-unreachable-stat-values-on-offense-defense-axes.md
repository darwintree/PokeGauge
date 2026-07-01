---
# This section is managed by the CLI. Do not edit manually.
id: "4cdd6cf4-edb8-4bc2-ae47-5adb5f62219c"
title: "Skip unreachable stat values on offense/defense axes"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-29T06:57:00Z"
updated_at: "2026-06-29T06:57:00Z"
---
## Context

Scenario Explorer 的数轴（`StatRangeAxis`）用于 **数轴选段** 与 **添加实数值模版**（单点模式）。

EV/性格组合只能产生 **离散的合法实数值**；`bounds.min`–`bounds.max` 之间的整数并不全部可达。当前实现允许：

- 拖拽：指针位置 `Math.round(min + pct × span)` 可能落在不可达值
- 微调（±1）：`clampStat(value ± 1, min, max)` 逐步经过不可达整数

不可达值会导致：

- 实数值模版标签无法映射到能力点数（需回退 / 确认时吸附）
- 数轴选段端点与真实可计算 spread 不一致

**当前临时处理**（2026-06-28）：`confirmAddOffense` / `confirmAddDefense` 在保存前吸附到最近可达值；`templateCardLabel` 在枚举为空时回退到最近 spread 的能力点数标签。这是确认层补丁，**未** 阻止用户在轴上选到不可达值。

## Desired behavior

数轴交互层 **跳过** 不可达实数值，使用户 **无法** 通过拖动或 ±1 微调到达不可达值：

- 进攻轴：手柄 / 单点只能在 `enumerateStatSpreads` 产生的唯一 offense stat 集合上移动
- 防守轴：HP、Def 各自只能在对应可达集合上移动（添加模版时 HP+Def 组合仍需与 `getDefenderSpreadGrid` 一致——若需独立轴，需明确组合约束策略）
- 轴下方展示的 endpoint 数字始终是可达值
- 与 snap 预设点（0 / 32 / ex 等）行为一致，不破坏现有 tier 标记

## Open questions

- 数轴选段（range 模式）两端是否都约束为可达值？中间 band 语义是否仍按「实数值区间」理解？
- 防守双轴：独立吸附各自可达 HP/Def，还是添加模版时只提供 **grid 内存在的 (HP, Def) 对**？
- 不可达整数是否在轴视觉上有空隙 / 跳变提示，还是仅表现为「拖不过去」？

## Acceptance criteria

- [ ] 进攻 `StatRangeAxis`：drag 与 ±1 仅在可达 offense stat 集合内步进
- [ ] 防守 `StatRangeAxis`（HP / Def）：同上，各自可达集合
- [ ] 添加模版确认 **不再依赖** 确认时吸附作为唯一正确性保障（可保留为防御性兜底）
- [ ] 现有 preset / range 切换与实数值模版流程仍可用
- [ ] 测试或自洽检查覆盖：不可达整数不可被轴状态产出

## Related

- 实数值模版 formalization → [`docs/traces/2026-06-28-stat-value-template-grill.md`](../../docs/traces/2026-06-28-stat-value-template-grill.md)
- 默认模版命名 → [[archive/20260628_closed_define-derived-display-labels-for-stat-value-templates]]
- 组件：`StatRangeAxis`、`use-dual-handle-drag`；数据：`stat-bounds.ts`（`enumerateStatSpreads`、`getDefenderSpreadGrid`）