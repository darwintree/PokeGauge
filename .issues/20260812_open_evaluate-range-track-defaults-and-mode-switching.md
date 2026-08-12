---
# This section is managed by the CLI. Do not edit manually.
id: "eec647ff-28a1-4854-937b-72a1d3d2eaea"
title: "Evaluate Range Track defaults and mode switching"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-12T07:51:00Z"
---
## Problem

Stat Track 当前默认展示 Preset，并通过 Track 内的 `Preset / Range` tabs 切换。Range 是 Scenario 模型中的一等分支，但默认呈现、模式命名和值继承规则是否符合用户心智尚未经过 release 前评估。

当前切换包含不明显的状态转换：

- 首次从 Preset 切到 Range 时，若 Range 尚未 touched，会从当前已选 Preset 推导区间。
- Range 一旦被编辑，后续切换会保留旧 Range，不再随 Preset 变化自动重算。
- 从 Range 切回 Preset 时，进攻方把区间端点转成一个或两个 Preset；防守方把 HP 与 Defense 两轴端点转成最多四个角点 Preset，并可能生成 temporary presets。
- 默认折叠摘要只显示当前模式的结果，用户无法在切换前预知上述转换或旧状态是否仍被保留。

需要评估默认模式、切换交互与状态保留规则，确保新用户理解自己在比较「典型配置」还是「连续端点范围」，且切换不会造成惊讶的数据变化或结果行变化。

## Issue Assessment

- Impact：Stat 输入是每个结果的基础。默认方式若与主要任务不符，或切换产生隐式临时 Preset，会直接影响结果数量、可解释性和用户对比较范围的判断。
- Evidence：`defaultTrackState` 固定双方为 `preset`；`setStatMode`／`setDefenderMode` 使用 touched gate 与 Range↔Preset reconciliation；防守方区间回切会做端点笛卡尔积。
- Scope：通过实际桌面／窄屏交互、代表性用户任务和状态迁移矩阵，评估默认模式、tabs 文案与层级、值继承／保留／重置、摘要和结果反馈；确认产品契约后再实施。
- Decision：valid；release 前完成评估与契约决策，是否阻塞发布取决于是否发现默认态或切换导致重大误解／丢失。

## Questions to resolve

- 初次进入时应默认 Preset、Range，还是依据用户任务／历史偏好决定。
- `Preset` 与 `Range` 是否是用户可理解的互斥模式，还是应表现为同一 Stat Track 的两种添加方式。
- 切换时应转换当前值、恢复各模式最后状态，还是显式询问用户。
- touched 状态的可见语义与重置入口是什么。
- 防守方二维 Range 回切为最多四个角点是否符合用户预期；temporary presets 是否应暴露。
- 当前值、范围端点、SP allocation label 与结果行之间应如何反馈，避免用户只看到数值变化却不知道 Scenario set 已改变。
- 桌面 300px 侧栏与窄屏 Setup 页是否需要不同展开／精调交互。

## Related issues

- [[20260717_open_define-range-endpoint-identity-and-merge-semantics|Define Range endpoint identity and merge semantics]]：Range 端点与 Scenario Merge 的领域契约。
- [[20260803_open_decide-whether-stat-allocation-internals-should-use-native-sp|Decide whether stat allocation internals should use native SP]]：数值与 SP allocation 的内部等价性。
- [[20260717_open_scenario-brief-adopt-inline-expand-sidebar-interaction-c|Scenario Brief: adopt inline-expand sidebar interaction (C)]]：侧栏整体展开交互。

## Out of scope

- 在评估前直接重做 Range 控件视觉。
- 改变 Range endpoint 的伤害计算或 Scenario Merge 语义。
- 增加新的 Stat 维度或将性格／SP 变为独立 Track。

## Verification Checklist

- [ ] 记录当前 offense／defense 在 untouched／touched 下双向切换的完整状态矩阵。
- [ ] 在桌面侧栏与窄屏 Setup 中完成默认态、发现性、拖拽、精调和切换 review。
- [ ] 用至少“快速比较常用配置”“查看完整能力范围”“精确自定义端点”三类任务评估方案。
- [ ] 默认模式、切换时的转换／保留规则、重置行为和摘要反馈形成明确产品契约。
- [ ] 与 Range endpoint identity／merge issue 的边界和依赖明确。
- [ ] 若评估发现静默覆盖、误导或不可恢复状态，拆出 release blocker；否则形成可执行的 post-release 改进票。

## Progress Log

- 2026-08-12：release 讨论将 Range Track 默认展示与模式切换列为必须评估的体验问题。
