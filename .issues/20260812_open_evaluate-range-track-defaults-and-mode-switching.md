---
# This section is managed by the CLI. Do not edit manually.
id: "eec647ff-28a1-4854-937b-72a1d3d2eaea"
title: "Evaluate Range Track defaults and mode switching"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:MAP"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-13T06:05:00Z"
---
## Destination

让 Range / Preset 切换符合「先看区间、再按需展开某一行的配置」的心智：Range 母行可就地展开对应 Choice，折叠 Stat Track 可直接切模式。视觉细节拆成子票，按顺序处理。

## Discussion Trace

[`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md)

## Problem

Stat Track 当前默认展示 Preset，并通过 Track 内的 `Preset / Range` tabs 切换。Range 是 Scenario 模型中的一等分支，但默认呈现、模式命名和值继承规则是否符合用户心智尚未经过 release 前评估。

当前切换包含不明显的状态转换：

- 首次从 Preset 切到 Range 时，若 Range 尚未 touched，会从当前已选 Preset 推导区间。
- Range 一旦被编辑，后续切换会保留旧 Range，不再随 Preset 变化自动重算。
- 从 Range 切回 Preset 时，进攻方把区间端点转成一个或两个 Preset；防守方把 HP 与 Defense 两轴端点转成最多四个角点 Preset，并可能生成 temporary presets。
- 默认折叠摘要只显示当前模式的结果，用户无法在切换前预知上述转换或旧状态是否仍被保留。

行级展开与折叠态切换的交互契约已经定稿；默认模式、值继承与视觉仍待处理。

## Tickets

- [[20260813_working_style-expandable-range-items-on-parent-result-rows|Style expandable range items on parent result rows]]
- [[archive/20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]
- [[20260813_open_style-collapsed-stat-track-mode-switch|Style collapsed Stat Track mode switch]]

## Decisions so far

- Range 模式下原始结果行是母行。点击母行中的 Range 区间，只在该母行下展开子行；其他母行不变。
- 点进攻只展开进攻 Choice，点防守只展开防守 Choice。两项都可展开时都可以点；都展开时子行是该母行两轴 Choice 的组合。
- 子行不可展开。
- 行内展开不改变 Stat Track 的全局模式。
- 折叠 Stat Track 上有可从外部点击的切换控件，点击后直接切换该轴的全局模式。
- 交互定稿；视觉拆成上面三张子票，按 Tickets 顺序处理。
- [[archive/20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]：Stat Value 默认身份是 Label chip（结果行 / 折叠摘要 / Choice 共用）；Range 为两端点 chip；色按相对 0 修正加值分四档。

## Not yet specified

- 初次进入时默认 Preset、Range，还是依据任务／历史偏好。
- 切换 Track 模式时如何转换／保留／重置值，touched 与 temporary presets 的可见语义。
- 防守方二维 Range 回切为最多四个角点是否保留。
- 母行可展开项、折叠切换按钮的视觉（另两张子票）。
- 能力值 chip 已收口，见 Decisions so far。

## Related issues

- [[20260717_open_define-range-endpoint-identity-and-merge-semantics|Define Range endpoint identity and merge semantics]]：Range 端点与 Scenario Merge 的领域契约。
- [[20260803_open_decide-whether-stat-allocation-internals-should-use-native-sp|Decide whether stat allocation internals should use native SP]]：数值与 SP allocation 的内部等价性。
- [[20260717_open_scenario-brief-adopt-inline-expand-sidebar-interaction-c|Scenario Brief: adopt inline-expand sidebar interaction (C)]]：侧栏整体展开交互。

## Out of scope

- 改变 Range endpoint 的伤害计算或 Scenario Merge 语义。
- 增加新的 Stat 维度或将性格／SP 变为独立 Track。

## Verification Checklist

- [ ] 对照讨论记录逐条确认：每条决定已实现，或已明确推迟到对应子票。
- [ ] 记录当前 offense／defense 在 untouched／touched 下双向切换的完整状态矩阵。
- [ ] 默认模式、切换时的转换／保留规则、重置行为形成明确产品契约，或拆出后续票。
- [ ] 与 Range endpoint identity／merge issue 的边界和依赖明确。

## Progress Log

- 2026-08-12：release 讨论将 Range Track 默认展示与模式切换列为必须评估的体验问题。
- 2026-08-13：grilling 定稿行内展开与折叠 Track 切换交互；记录见讨论 trace。视觉拆成三张子票。交互原型留在工作区 `src/features/scenario-explorer/tracks/stats/prototype/`，不进主分支。
- 2026-08-13：Stat Value Label chip 契约落地产品；见 Decisions so far。
