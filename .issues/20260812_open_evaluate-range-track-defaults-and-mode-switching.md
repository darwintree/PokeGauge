---
# This section is managed by the CLI. Do not edit manually.
id: "eec647ff-28a1-4854-937b-72a1d3d2eaea"
title: "Evaluate Range Track defaults and mode switching"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:MAP"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-13T14:20:00Z"
---
## Destination

让 Range / Choice 切换符合「先看区间、再按需展开某一行的配置」的心智：一条 Stat Track 只有一组选中 Stat Value；Range 是其包络，Choice 是同一集合的离散分支；Range 母行可只读展开对应 Choice；折叠 Stat Track 可直接切模式。

## Discussion Trace

[`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md)

ADR: [`docs/adr/0003-stat-track-one-selected-value-set.md`](../docs/adr/0003-stat-track-one-selected-value-set.md)

## Problem

Stat Track 值模型已改为单选中集合：Choice 与 Range 是同一组 Stat Value 的两种模式。剩余开放工作是 Range 端点身份与 Scenario Merge（见 Related），不是再拆一套库。

## Tickets

- [[archive/20260813_closed_style-expandable-range-items-on-parent-result-rows|Style expandable range items on parent result rows]]
- [[archive/20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]
- [[archive/20260813_closed_style-collapsed-stat-track-mode-switch|Style collapsed Stat Track mode switch]]
- [[archive/20260813_closed_unify-stat-track-onto-one-selected-stat-value-set|Unify Stat Track onto one selected Stat Value set]]

## Decisions so far

交互与视觉（trace 1–8）：

- Range 模式下原始结果行是母行。点击母行中的 Range 区间，只在该母行下展开子行；其他母行不变。
- 点进攻只展开进攻 Choice，点防守只展开防守 Choice。两项都可展开时都可以点；都展开时子行是该母行两轴 Choice 的组合。
- 子行不可展开。
- 行内展开不改变 Stat Track 的全局模式。
- 折叠 Stat Track 上有可从外部点击的切换控件，点击后直接切换该轴的全局模式。
- [[archive/20260813_closed_unify-stat-value-chip-display|Unify stat value chip display]]：Stat Value 默认身份是 Label chip；Range 为两端点 chip。
- [[archive/20260813_closed_style-expandable-range-items-on-parent-result-rows|Style expandable range items on parent result rows]]：母行 Range 展开示能是 chip 旁独立 chevron。
- [[archive/20260813_closed_style-collapsed-stat-track-mode-switch|Style collapsed Stat Track mode switch]]：折叠 well + tick（点浅井切、点 chip 不切）。

值模型（trace 9–21）：

- 一条 Stat Track 只有一组选中 Stat Value；Choice 与 Range 是这组值的两种模式。选中的是 Stat Value，与 Stat Preset 正交，按值去重。
- 防守 Range 端点是 `(min HP, min Def)` 与 `(max HP, max Def)`，不是四角笛卡尔积。
- 进入 Range 或拖边界时，缺的包络端点有对应 Preset 则选中，否则补 Temporary Stat Value。展开只读，不写选中集合。
- 包络内的选中值保持选中；扩大时旧端点留作内部点；落到包络外的取消选中。Temporary Stat Value 取消即删，可保存成用户 Preset。
- 不允许 0 个选中。单值可把两个手柄向两边拖，交叉换角色。Choice 不能取消最后一个值。
- 新对阵默认 Range。进攻选中 `0A`、`EX` 及该 Identity 全部用户进攻 Preset；防守选中 `0H0B`、`32H0B` 及全部用户防守 Preset。
- 换 Identity 重置为上述默认。恢复已保存 Matchup 以保存的模式和选中为准。
- 母行展开子行 = 当前整组选中值。

## Not yet specified

- 值模型已实现，见 [[archive/20260813_closed_unify-stat-track-onto-one-selected-stat-value-set|Unify Stat Track onto one selected Stat Value set]]。伤害计算端点与 Scenario Merge 仍见 [[20260717_open_define-range-endpoint-identity-and-merge-semantics|Define Range endpoint identity and merge semantics]]，本票不改。

## Related issues

- [[20260717_open_define-range-endpoint-identity-and-merge-semantics|Define Range endpoint identity and merge semantics]]：Range 端点与 Scenario Merge 的领域契约。
- [[20260803_open_decide-whether-stat-allocation-internals-should-use-native-sp|Decide whether stat allocation internals should use native SP]]：数值与 SP allocation 的内部等价性。
- [[20260717_open_scenario-brief-adopt-inline-expand-sidebar-interaction-c|Scenario Brief: adopt inline-expand sidebar interaction (C)]]：侧栏整体展开交互。

## Out of scope

- 改变 Range endpoint 的伤害计算或 Scenario Merge 语义。
- 增加新的 Stat 维度或将性格／SP 变为独立 Track。

## Verification Checklist

- [x] 逐条核对 [`docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md`](../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md) 每一条决定已实现，或已明确推迟。
- [x] 去掉两套库、`touched` 保护、以及 Range → Choice 四角覆盖。
- [x] 新对阵默认 Range，选中集合符合第 17 条。
- [x] 与 Range endpoint identity／merge issue 的边界仍成立：本票不改计算端点语义。

## Progress Log

- 2026-08-12：release 讨论将 Range Track 默认展示与模式切换列为必须评估的体验问题。
- 2026-08-13：grilling 定稿行内展开与折叠 Track 切换交互；记录见讨论 trace。视觉拆成三张子票。
- 2026-08-13：Stat Value Label chip、母行 chevron、折叠 well + tick 进入产品；相关子票归档。
- 2026-08-13：grilling 定稿单选中集合、默认 Range、包络端点与 Temporary Stat Value 生命周期；trace 第 9–21 条。实现未开始。
- 2026-08-13：值模型写成 `READY-FOR-AGENT` 实现票 [[archive/20260813_closed_unify-stat-track-onto-one-selected-stat-value-set|Unify Stat Track onto one selected Stat Value set]]。
- 2026-08-13：值模型实现完成；Stat Track 只有一组选中 Stat Value，新对阵默认 Range。
