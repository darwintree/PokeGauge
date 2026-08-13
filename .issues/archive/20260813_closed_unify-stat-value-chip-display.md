---
# This section is managed by the CLI. Do not edit manually.
id: "a168911a-b5a8-4447-918e-41fa7e1dfc8e"
title: "Unify stat value chip display"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:PROTOTYPE"]
created_at: "2026-08-13T02:49:00Z"
updated_at: "2026-08-13T06:05:00Z"
---
## Parent map

[[../20260812_open_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]]

## Blocked by

- [[20260813_closed_style-expandable-range-items-on-parent-result-rows|Style expandable range items on parent result rows]]

## Problem

结果行、Stat Track 选项、折叠摘要里的能力值展示并不统一。Range / Choice 切换会让同一条能力值在「普通文案」「可展开入口」「Preset 标签」之间来回变，现有 chip / 纯文本混用会放大这种跳变。

这不是 Range 切换 issue 的原范围，但切换交互已经把能力值展示推到前台，一并处理。

## Scope

统一能力值的视觉语言：Preset 名、实数值、Range 区间文案在结果行身份卡和 Stat Track 里应共用一套展示，而不是各写各的。可展开态的交互由 sibling 定稿，本票只收口「值本身长什么样」。

## Out of scope

- 母行可展开入口的展开/收起示能，见 [[20260813_closed_style-expandable-range-items-on-parent-result-rows|Style expandable range items on parent result rows]]。
- 折叠 Stat Track 模式切换按钮。
- 改变 Preset / Range 的数据契约。

## Verification Checklist

- [x] 进攻与防守能力值在结果行和 Track 上使用同一套视觉语言。
- [x] Range 文案与 Preset 文案属于同一体系，而不是两种无关控件。
- [x] 不回退 sibling 已选定的可展开入口样式。

## Resolution

Stat Value 的默认身份是 Label chip。结果行进攻/防守身份、折叠 Stat Track 摘要、Choice 选项共用同一套 chip；TrackOption 只是可点态。Range 身份是两端点 chip（防守从 HP×Def 矩形取 min/min 与 max/max，不改存储）。颜色按相对 0 修正的实数加值分四档（灰 / 青绿 / 钴蓝 / EX 紫），填色编码，临时只叠加虚线。契约见 [`docs/spec/stat-value-display.md`](../docs/spec/stat-value-display.md) 与 `design.md`。

## Progress Log

- 2026-08-13：用户确认 spec；实现产品面 chip，归档本票。展开示能仍由 sibling 处理。