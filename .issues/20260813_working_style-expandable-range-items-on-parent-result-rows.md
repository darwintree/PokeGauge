---
# This section is managed by the CLI. Do not edit manually.
id: "995c60c8-ee79-4be4-9e15-a5c1a0984fca"
title: "Style expandable range items on parent result rows"
status: "working"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:PROTOTYPE"]
created_at: "2026-08-13T02:49:00Z"
updated_at: "2026-08-13T06:05:00Z"
---
## Parent map

[[20260812_open_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]]

## Problem

Range 母行上的进攻 / 防守区间是展开子行的唯一入口。交互已定稿：可展开项必须能点、展开态必须看得出、子行不可再点。当前原型用带箭头的黄底 chip 充当这个入口，只是占位，不是定稿样式。

## Scope

只定母行可展开项的视觉：未展开、展开中、不可展开（子行或该轴已是 Choice）三种状态。不改交互契约，不顺手改能力值 chip 体系，不改折叠 Stat Track 的模式切换按钮。

能力值身份已收成 Label chip，见 sibling [[archive/20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]。本票只处理展开示能。交互原型在工作区 `src/features/scenario-explorer/tracks/stats/prototype/`，不进主分支。

讨论记录：[`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md)

## Out of scope

- 能力值 chip 的全局统一，见后续 sibling。
- 折叠 Stat Track 切换按钮样式，见后续 sibling。
- Range 端点计算、Preset 和解、默认模式。

## Progress Log

- 2026-08-13：在 `?prototype=stat-mode-switch` 上加了三种母行可展开项：Chip（描边块）、Caret（纯文本 + 尾箭头）、Row（整行披露）。底栏切换。

## Verification Checklist

- [ ] 可展开项在母行上能与普通能力值文案区分，且命中面积足够。
- [ ] 展开中与未展开状态可一眼分辨。
- [ ] 子行同一位置不再表现为可点。
- [ ] 选定样式后对照讨论记录逐条确认：只展开该母行对应轴，不改变 Stat Track 全局模式。