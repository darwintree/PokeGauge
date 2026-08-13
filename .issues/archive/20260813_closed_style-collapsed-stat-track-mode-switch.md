---
# This section is managed by the CLI. Do not edit manually.
id: "0c920ff7-e059-44d0-a111-2b2328d711cc"
title: "Style collapsed Stat Track mode switch"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:PROTOTYPE"]
created_at: "2026-08-13T02:49:00Z"
updated_at: "2026-08-13T08:57:00Z"
---
## Parent map

[[20260812_closed_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]]

## Blocked by

- [[20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]

## Problem

折叠 Stat Track 必须能从外部直接切换 Preset / Range。交互已定稿。当前原型把一个迷你「预设 | 数轴」分段控件放在折叠标题右侧，只是占位：300px 侧栏里和展开按钮抢空间，文案被缩短成「数轴」，和展开后的 Tabs 也不统一。

## Scope

只定折叠态（以及是否与展开态共用）模式切换控件的视觉与布局：位置、尺寸、当前态、与标题/摘要/chevron 的分工。不改「点击即切该轴全局模式」的契约。

讨论记录：[`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md)

本票视觉不进 `docs/spec/`；定稿写在下面 Decision。

## Out of scope

- 母行可展开项样式。
- 能力值 chip 体系。
- Range ↔ Preset 的值继承 / touched / 和解规则。
- 正式 spec / `design.md`。

## Decision

2026-08-13：折叠用 **well + tick**。展开用黄底分段。不是同一枚控件。

- **折叠**：chip 坐在 `token-bg` 浅井里。井底是模式轨 + 右端 `选项` / `区间`。点浅井（空隙、井底轨）切该轴全局模式；点 chip 不切，只走 tooltip。结果行 chip 仍是数据标记。
- **Range 轨**：两端圆点 + 连续轴，占满井底标记槽。
- **Choice 轨**：四枚方点串在发丝上，与 Range 同一 `flex-1` 槽宽，右端同样跟单位词。
- **单值**：Range 两端点相同或 Choice 只选一个时，井底轨仍显示、仍可切。
- **位置**：整套井在 chip 行，不进标题行。标题行只留轴名 + chevron。展开后 chip 行收起，井随之离开。
- **展开态**：内部 `选项 | 区间` 用 HUD 黄底分段（选中黄、未选纸色），不用灰 Tabs。
- **Choice 选项**：保持投入档填色，不用选中黄。未选 = 描边（纸底 + 档位边/字）；已选 = 填色（与结果行 chip 同脸）+ ink 边 + HUD 阴影。
- **归档**：等 [[20260813_closed_style-expandable-range-items-on-parent-result-rows|母行 chevron]] 进入产品后归档。已进入产品。

## Progress Log

- 2026-08-13：三种折叠切换挂在生产 Scenario Explorer（300px 侧栏、真数据）。底栏切 `inline` / `title` / `flip`。
- 2026-08-13：前三个 variant 和 chip 行抢位、和邻轨头不对齐。换成 `rail` / `caption` / `icon`，接到现有 TrackPanel 槽位上。
- 2026-08-13：上一票把 Stat chip 放在标题行；改为与 Move Track 相同：标题一行、chip 第二行并可换行。
- 2026-08-13：锁定 icon。格子/滑杆；单值仍显示；图标改到 chip 行；展开用黄底分段；Choice 选项未选描边、已选填色。
- 2026-08-13：chip 行方向保留，但不要描边按钮。新一轮 `ghost` / `rail` / `word`：幽灵图标、chip 底下模式轨、贴在 chip 后的「区间 / 选项」。
- 2026-08-13：用户认 rail。下一轮克服「不像控件 / 单值难读」：`tick` 轴标签、`well` 浅井、`grip` 滑块端点。
- 2026-08-13：Choice 摘要加折行夹具（虚线临时 chip），轨改为 chip 行全宽，对照两排时的样子。
- 2026-08-13：锁定 well + tick。Choice 方点串发丝，与 Range 同槽宽。已写入生产 Stat Track；`?prototype=stat-mode-switch` 只留折行夹具。
- 2026-08-13：grilling：点 chip 不切模式；点浅井其余区域才切。不立刻归档，等母行 chevron 进产品后再归档。
- 2026-08-13：母行 chevron 已进产品。Stat Track 原型已删除。本票归档。

## Resolution

折叠 Stat Track 用 well + tick 切该轴全局模式；点 chip 不切。展开面板用 HUD 黄底分段。母行 chevron 进入产品后归档。

## Verification Checklist

- [x] 折叠态不必展开面板就能切模式。
- [x] 切换控件与展开 chevron 的命中目标分开，不易误触。
- [x] 当前模式在折叠摘要旁可读。
- [x] 选定样式后对照讨论记录确认：该切换仍是该轴的全局模式切换。
- [x] 点 chip 不切模式；点浅井其余区域切模式。
- [x] 母行 chevron 进入产品后归档本票。