---
# This section is managed by the CLI. Do not edit manually.
id: "58c4eca8-605e-42c3-addc-df3522635f5b"
title: "Apply damage-comparison display decisions: row card, non-linear axis, hover tooltip"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-01T05:31:00Z"
updated_at: "2026-07-01T07:19:00Z"
---
<!--
This body is user-owned. Adjust the sections freely to fit the issue.
Use the CLI to update front matter fields such as title, status, priority, and labels.
-->

## Problem

伤害对比行的显示经过三轮原型已敲定方向（行标识布局 / 数轴 / hover 样式），决策记录在 [`docs/traces/2026-07-01-damage-display-row-track-hover-grill.md`](../docs/traces/2026-07-01-damage-display-row-track-hover-grill.md)。当前生产 `damage-box-plot.tsx` 只吸收了前两轮的一部分（row-identity A 卡片 + 非线性轴 + 标签压缩，hover 仍是原生 `title`）；第三轮的 shadcn `Tooltip` 行级信息卡还留在 `hover-style.prototype.tsx` 原型里，未落生产。需要把三轮决策完整落进正式组件，并清理原型与 switcher 接线。

## Decisions to apply

来自 trace 的 6 个已决问题：

1. **行标识布局**：左侧 `w-60` 带边框卡片，纵向「标签: 值」三行（招式 / 攻击 / 防御），道具图标内联在「攻击」行、无加成时附「无加成」；右侧箱线图占满剩余宽度，左右关系同「现状」。
2. **百分比数轴与实数值**：保留数轴，`sticky top-0` 冻结顶行，刻度起点与左侧卡片宽 + gap 对齐；不显示伤害实数值，track 底部仅百分比区间 + 暴击区间 + OHKO。
3. **默认标签密度**：内联只留「通常区间 + OHKO」；暴击区间、平均移入 hover。
4. **超出 100% 的展示**：非线性轴——0–100% 线性占 72% 宽，100–200% `sqrt` 压缩进剩 28%，100% 处虚线 scale-break，硬上限 200%。
5. **hover 样式**：shadcn `Tooltip`（base-ui `Positioner`）行级合并卡片；trigger = 整条 track，content = 通常 / 平均 / 暴击 / OHKO 四行（配色对应 track）；`side="top"` `sideOffset={8}` `align="center"`，碰撞检测 + 自动翻转；`TooltipProvider` 包 App 根，`delay=0`。
6. **配色与视觉细节**：deferred —— 不在 trace 内定，留给本 issue 实现阶段自行决策（卡片底色、字色对比、箭头、对齐等）。

## Issue Assessment

- Impact: 伤害对比是 Scenario Explorer 的核心读图区，直接影响可读性。
- Evidence: 三轮原型 + trace；`hover-style.prototype.tsx` 已验证 shadcn Tooltip 不再压住箱形图。
- Scope: `damage-box-plot.tsx`、`scenario-results.tsx`、`scenario-explorer-page.tsx`、`App.tsx`（TooltipProvider 已装）；清理 `hover-style.prototype.tsx`、`prototype-switcher.tsx` 与 `variant` 接线。
- Decision: valid

## Verification Checklist

按 trace 逐条审计的实现检查：
- [x] 行标识 = 左侧 `w-60` 键值对卡片（招式/攻击/防御），道具内联 + 「无加成」
- [x] 标识与箱线图左右关系，不上下堆叠
- [x] 数轴 `sticky top-0` 冻结，刻度起点对齐左侧卡片宽 + gap
- [x] 不显示伤害实数值；track 底部仅通常区间 + 暴击区间 + OHKO
- [x] 内联默认只留通常区间 + OHKO；暴击区间、平均仅在 hover
- [x] 非线性轴：0–100 线性 72%，100–200 `sqrt` 压缩，200 硬上限，100% 处 scale-break
- [x] hover = shadcn `Tooltip` 行级卡片（四行，配色对应 track），trigger = 整条 track
- [x] `side=top sideOffset=8 align=center`，碰撞翻转不压住箱形图/冻结轴
- [x] `TooltipProvider` 包 App 根，`delay=0`
- [x] 配色/视觉细节由实现阶段定，结果记录在 Progress Log
- [x] 原型清理：删除 `hover-style.prototype.tsx`、`prototype-switcher.tsx`、`variant` prop 与 switcher 接线
- [x] 自洽检查 / 测试覆盖非线性映射与 hover 卡片渲染

## Related

- 决策记录 → [`docs/traces/2026-07-01-damage-display-row-track-hover-grill.md`](../docs/traces/2026-07-01-damage-display-row-track-hover-grill.md)
- 前序 issue → [[20260626_open_damage-comparison-results-info-display-needs-refinement|Results info display]]
- 组件：`damage-box-plot.tsx`、`scenario-results.tsx`、`scenario-explorer-page.tsx`、`hover-style.prototype.tsx`、`prototype-switcher.tsx`、`ui/tooltip.tsx`

## Progress Log

- 2026-07-01: 三轮原型完成，决策记入 trace；新建本 issue 跟踪落生产与清理。生产代码暂未改动，原型与 switcher 保留待清理。
- 2026-07-01: 落生产完成。`damage-box-plot.tsx` 改为左侧 `w-60` 三行标识卡片 + 右侧 track；非线性映射 `pctToFraction`（0–100 线性 72%，100–200 `sqrt` 压缩 28%，200 硬上限），刻度 `[0,25,50,75,100,150,200]`，100% 处虚线 scale-break；数轴 `sticky top-0 z-10 bg-background`，左 padding `15.75rem` 对齐卡片宽 + gap；内联仅通常区间 + OHKO，暴击/平均移入 hover；hover 用 shadcn `Tooltip`（base-ui `Positioner`）行级四行卡片，`side=top sideOffset=8 align=center`，trigger = 整条 track（`render={<div tabIndex={0}>}`）；`App.tsx` 根包 `TooltipProvider delay={0}`。配色取 shadcn 默认深色 pill + Arrow，四行用色点/竖条标记对应 track。原型 `hover-style.prototype.tsx` / `prototype-switcher.tsx` / `variant` 接线在仓库中不存在，无需清理。测试 `damage-box-plot.test.ts` 覆盖非线性映射（线性段 / sqrt 段 / clamp / 单调）。浏览器验证：行卡片布局、非线性轴、sticky 数轴（缩视口滚动确认）、hover 四行 tooltip 均正常。
