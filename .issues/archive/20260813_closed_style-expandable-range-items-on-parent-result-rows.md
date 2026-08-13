---
# This section is managed by the CLI. Do not edit manually.
id: "995c60c8-ee79-4be4-9e15-a5c1a0984fca"
title: "Style expandable range items on parent result rows"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:PROTOTYPE"]
created_at: "2026-08-13T02:49:00Z"
updated_at: "2026-08-13T08:56:00Z"
---
## Parent map

[[../20260812_open_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]]

## Problem

Range 母行上的进攻 / 防守区间是展开子行的唯一入口。交互已定稿：可展开项必须能点、展开态必须看得出、子行不可再点。能力值身份已是 Label chip；展开示能不能包住 chip（会抢 tooltip，也会用到结果行不该用的选中黄）。

## Scope

只定母行可展开项的视觉：未展开、展开中、不可展开（子行或该轴已是 Choice）三种状态。不改交互契约，不顺手改能力值 chip 体系，不改折叠 Stat Track 的模式切换按钮。

能力值身份已收成 Label chip，见 sibling [[20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]。本票只处理展开示能。

讨论记录：[`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md)

本票视觉不进 `docs/spec/`；定稿写在下面 Decision。

## Out of scope

- 能力值 chip 的全局统一，见 sibling [[20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]。
- 折叠 Stat Track 切换按钮样式，见后续 sibling [[20260813_closed_style-collapsed-stat-track-mode-switch|Style collapsed Stat Track mode switch]]。
- Range 端点计算、Preset 和解、默认模式。
- 正式 spec / `design.md`。

## Decision

2026-08-13：采用 Chip 落地后原型里的 sibling chevron，不包住 chip。

Range 身份仍是两端点 Stat Value Label chip。展开示能是 chip 旁一枚独立 chevron：chip 继续当数据标记（悬停 / 聚焦看 tooltip），箭头才是展开入口。

三种状态：

| 状态 | 视觉 |
| --- | --- |
| 可展开、未展开 | 端点 chip + 灰色 chevron |
| 展开中 | 同一组 chip 铺浅底（`token-bg`），chevron 转 180°、变 ink |
| 不可展开（子行，或该轴已是 Choice） | 只有 chip，没有 chevron |

约束：

- 命中目标是箭头，不是 chip。箭头至少 24px。
- 不用选中黄；结果行 chip 仍是数据标记。
- 交互不变：只展开该母行对应轴；子行不可再点；不改变 Stat Track 全局模式。

否决：早先 Chip（黄底描边块包住区间）、Caret（纯文本 + 尾箭头）、Row（整行披露）。那三种是身份还是纯文本时的对比；Chip 定稿后不再适用。

参考：产品结果行上的 sibling chevron（`StatValueChipPair`）。

## Progress Log

- 2026-08-13：在 `?prototype=stat-mode-switch` 上加了三种母行可展开项：Chip（描边块）、Caret（纯文本 + 尾箭头）、Row（整行披露）。底栏切换。
- 2026-08-13：Stat Value Label chip 落地后，原型改为端点 chip + sibling chevron。
- 2026-08-13：用户确认采用 sibling chevron；视觉记在本票 Decision，不进 spec。
- 2026-08-13：chevron 与按轴展开进入产品结果表。Stat Track 原型已删除。

## Resolution

Range 母行展开示能是 chip 旁独立 chevron（≥24px）。点箭头展开该轴 Choice 子行；chip 仍是数据标记。子行与 Choice 轴没有箭头。行内展开不改变 Stat Track 全局模式。

## Verification Checklist

- [x] 可展开项在母行上能与普通能力值文案区分，且命中面积足够。
- [x] 展开中与未展开状态可一眼分辨。
- [x] 子行同一位置不再表现为可点。
- [x] 选定样式后对照讨论记录逐条确认：只展开该母行对应轴，不改变 Stat Track 全局模式。
