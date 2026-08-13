---
# This section is managed by the CLI. Do not edit manually.
id: "0c920ff7-e059-44d0-a111-2b2328d711cc"
title: "Style collapsed Stat Track mode switch"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:PROTOTYPE"]
created_at: "2026-08-13T02:49:00Z"
updated_at: "2026-08-13T02:49:00Z"
---
## Parent map

[[20260812_open_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]]

## Blocked by

- [[archive/20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]

## Problem

折叠 Stat Track 必须能从外部直接切换 Preset / Range。交互已定稿。当前原型把一个迷你「预设 | 数轴」分段控件放在折叠标题右侧，只是占位：300px 侧栏里和展开按钮抢空间，文案被缩短成「数轴」，和展开后的 Tabs 也不统一。

## Scope

只定折叠态（以及是否与展开态共用）模式切换控件的视觉与布局：位置、尺寸、当前态、与标题/摘要/chevron 的分工。不改「点击即切该轴全局模式」的契约。

参考工作区原型：`src/features/scenario-explorer/tracks/stats/prototype/`（不进主分支）。

讨论记录：[`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md)

## Out of scope

- 母行可展开项样式。
- 能力值 chip 体系。
- Range ↔ Preset 的值继承 / touched / 和解规则。

## Verification Checklist

- [ ] 折叠态不必展开面板就能切模式。
- [ ] 切换控件与展开 chevron 的命中目标分开，不易误触。
- [ ] 当前模式在折叠摘要旁可读。
- [ ] 选定样式后对照讨论记录确认：该切换仍是该轴的全局模式切换。