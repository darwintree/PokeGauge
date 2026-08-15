---
# This section is managed by the CLI. Do not edit manually.
id: "c20349c0-6b85-4366-8aea-e85567cc39e5"
title: "Redesign damage condition card: duo-column layout"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-15T03:24:00Z"
updated_at: "2026-08-15T03:31:00Z"
---
## Goal

把伤害条件卡从「身份行 + 行尾 token 簇」改为攻/防双栏(duo)布局,解决拥挤与道具不显著两个问题,并让 range 满载场景不截断地完整展示。

## Decision(2026-08-15 原型评审)

原型: `src/features/scenario-explorer/results/prototype/condition-card.prototype.tsx` (`?prototype=condition-card`),5 变体 × 6 场景实测:

| 变体 | 空载 | 满载(range) | 结论 |
| --- | --- | --- | --- |
| current 基线 | 75px | 133px 且换行挤乱 | 拥挤根源 |
| **duo(选定)** | 79px | **117px** | 全部可见 |
| banner(战场上移) | 75px | 133+26px | 身份行放不下区间对,换行 |
| ledger(台账) | 72px | 164px | 可读但最高 |
| drawer(按需展开) | 75px | 95+面板 | 依赖点击 |

duo 布局契约:
- 卡头不变:属性徽章 + 招式名 + 等效威力 + 命中 + 公式 tooltip
- 攻/防两栏,每栏两行:行首为 攻/防标签 + 道具 icon(固定位置,title 给名称)+ 特性 chip + 阶级右锚;第二行为数值 chip 组(含 range 展开按钮)
- 战场条件(天气/场地/墙)与「其他条件」折叠合并为卡底同一行
- 左侧 stage rail 随双栏移除(阶级右锚在行首)

附带变更(同一批):compact 数值 chip 收紧(min-height 24→18px、padding 6→4px、边框 2→1.5px、圆角 9→6px),range 展开 chevron 在 compact 下 24→18px。该 compact 样式只被条件卡与统计轨道摘要使用。

## Non-goals

- 移动端 `DamageRowCaption` 不变
- 伤害 plot、KO 列、结果行 grid 不变
- 道具 icon 仍为 16px 无名称(显著性由固定位置承担);换 160×160 背包图见 [[../20260815_open_replace-padded-30-30-held-item-pixel-icons-with-160-160-bag-art]]
- banner 变体的「战场条件全场共享一条横幅」留作后续候选(需要结果列表层改造)

## Acceptance

- [x] 满载(range 双区间 + 双道具 + 双特性 + 天气/场地/墙 + 双阶级)在 14.75rem 卡宽内不截断
- [x] 道具位置固定且居行首,不再埋入 token 簇
- [x] 等效威力/命中/公式入口/其他条件保留

## Resolution(2026-08-15)

已落地。`DamageScenarioSummary` 重写为双栏:`UnitPanel`(攻/防栏:标签 + 道具 icon + 特性 chip + 阶级右锚 + 数值 chip 组)与 `ConditionsStrip`(战场条件 + 「其他条件」同一行)。实现 trace:[[../docs/traces/implementations/2026-08-15-condition-card-duo-layout]]。

落地与原型的两处偏差:
1. 「其他条件」折叠用无状态 `<details>` + flex order(summary 右锚、chips 不入点击区),而非原型的 useState button——结果行测试链是 `renderToStaticMarkup`,断言折叠内容在静态 markup 中,不能引入 hook。
2. 特性/战场 chip 补了 `max-w-[5rem] truncate` + `title`,防长名在 118px 半栏内换行。

实测(原型页 current 变体 = 落地实现):六场景 79 / 79 / 98 / 79 / 98 / 98px,极限满载 98px 无截断;`pnpm tsc` 干净,`pnpm test` 577/577。ADR-0002 的信息层级门禁由用户显式产品请求满足;`design.md` 行级契约(桌面卡保留等效威力/命中/公式/其他条件)不变。