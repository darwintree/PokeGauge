---
# This section is managed by the CLI. Do not edit manually.
id: "16e68b3d-91d7-441c-a913-ac51290669c8"
title: "Enforce an audited Move calculation boundary"
status: "open"
priority: "high"
labels: ["BUG", "NEEDS-TRIAGE"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-12T10:30:00Z"
---
## Problem

当前 Move 候选池主要以「具备可用威力」为准入条件，但部分会改变伤害或概率语义的结构化字段没有进入 `CatalogMoveOption`、Move Snapshot 或计算管线。用户因此可能得到一个正常展示、但按错误语义计算的结果。

已确认的代表问题：

- 资源中的 `minHits`／`maxHits` 未进入 Snapshot；多段招式仍可被选择并按单 Hit 威力计算。
- 资源中的 `critRate` 未作为 Snapshot 默认会心等级；高会心招式可能按普通会心率计算。
- 特殊伤害、逐 Hit 命中、固定伤害、特殊威力与其他非普通单 Hit 语义尚无统一准入审计。

Release 前必须建立 fail-closed 的 Move Calculation Support 边界：一个 Move 只有在其影响当前输出的单次使用语义均能准确表达时才可正常计算；否则必须 fail closed，不能静默退化为普通单 Hit。跨多次使用或多回合的后续效果可额外披露，但不会单独使 Move 成为 unsupported。

## Issue Assessment

- Impact：这是计算正确性问题；错误结果比明确的暂未支持更危险，并直接影响公开 release 的可信度。
- Evidence：`NormalizedMove` 已含 `minHits`／`maxHits`／`critRate`／`damageKind`，但当前 `LocalizedMoveResource`、`CatalogMoveOption` 与 `MoveSnapshot` 未完整承载这些语义；候选过滤仍会放行固定威力多段招式。
- Scope：定义审计状态与准入规则；盘点当前候选池；正确传递已支持的高会心等语义；对未支持的 multi-hit、特殊伤害及缺失元数据 fail closed；保持用户可理解的反馈。
- Decision：valid；公开 release blocker。

## Confirmed contract

- Move Calculation Support 只判定影响 PokeLens 当前输出的单次 Move 使用直接伤害语义，不以实现完整战斗模拟为前提。
- 同一次使用的段数、逐段威力、命中与会心属于支持判定；不改变当前直接伤害输出的回复、反伤、状态、场地、换人与回合末效果不单独导致 unsupported。
- 跨多次使用或多回合的后续效果不单独导致 unsupported；对这类 Move，`<=2HKO` 仍按当前状态下两个相同 Atomic Damage Distribution 计算，并在该数值处用 Tooltip 披露这一假设。
- 仅对支持矩阵标记为「跨使用语义会变化」的 Move 显示上述 `<=2HKO` Tooltip；普通 Move 不增加该噪声。
- 支持判定以结构化语义规则为基准，并预留具名例外的扩展点；本票不在没有具体案例时预先规定例外的资格、覆盖方向或验收规则。
- 支持状态仅分 `supported` 与 `unsupported`；已知不支持与元数据不足均 fail closed 为 `unsupported`。
- unsupported Move 保持当前产品的候选池与 Scenario 处理，本票不新增禁用候选项、原因披露或额外说明 UI。
- 「可选择」不得隐含「按普通单 Hit 近似」。
- 支持的 Move 语义必须从资源边界稳定传入 Snapshot 与 Scenario compiler。
- 缺失或未覆盖的当前输出相关语义必须 fail closed，不能用默认值掩盖。
- 用户编辑威力、命中率等字段不能绕过 Move 身份本身的 unsupported gate。
- 招式固有会心等级用作创建 Snapshot 时的默认值；用户编辑后完整覆盖该默认，新建或重置 Snapshot 时恢复模板默认。
- Snapshot 编辑只覆盖被编辑字段的基础数值；招式属性、flags、破墙及天气／场地等 Move-ID-bound 语义继续生效。
- 对带额外 ID 逻辑的可编辑 Move，在招式编辑面新增统一 Tooltip，文案提示「修改 Snapshot 可能导致不可预期的结算问题」；本票不按具体机制解释每个编辑值的组合顺序。
- 支持边界按稳定 Move identity 工作，不依赖本地化名称。

## Related issues

- [[20260715_open_specify-random-multi-hit-and-accuracy-mechanics|Specify random multi-hit and accuracy mechanics]]：完整 Hit Composition 与 multi-hit 计算模型。
- [[20260806_open_complete-missing-pokeapi-move-behavioral-metadata-upstream|Complete missing PokeAPI move behavioral metadata upstream]]：上游 Move 行为元数据缺口。
- [[20260717_open_define-ruleset-aware-move-candidate-pool-and-learnset-validation|Define ruleset-aware Move candidate pool and learnset validation]]：候选招式的 ruleset／learnset 合法性；与本票的「是否可可信计算」正交。
- [[20260812_open_publish-auditable-calculation-cases-and-case-submission|Publish auditable calculation cases and case submission]]：将已审计案例公开给用户。
- [[20260812_open_support-weather-ball-before-release|Support Weather Ball before release]]：公开 release 前支持 Weather Ball 在天气下的直接伤害语义。

## Out of scope

- 在本票内实现完整 multi-hit 概率与状态传递模型。
- ruleset-aware learnset 本身。
- 以 `@smogon/calc` 或 Showdown 直接替换本地运行时 kernel。

## Verification Checklist

- [ ] 当前 Move 候选池已按所有会影响本产品输出的语义完成盘点和分类。
- [ ] 高会心等已支持语义从资源到 Snapshot、compiler 与概率结果保持一致。
- [ ] multi-hit 和其他未支持语义不会产出伪装成普通计算的结果。
- [ ] 跨使用语义不同的 Move 在 `<=2HKO` 处披露「重复当前 Atomic Damage Distribution」假设。
- [ ] 带额外 ID 逻辑的可编辑 Move 显示统一编辑风险 Tooltip。
- [ ] 编辑 Snapshot 不会绕过 Move 级 unsupported gate。
- [ ] unsupported／unavailable 反馈在四种 Supported locale 下清楚可理解。
- [ ] 代表性支持、未支持、缺失元数据与持久化恢复路径均有回归覆盖。
- [ ] build、完整测试及 frontend review-and-correct 通过。

## Progress Log

- 2026-08-12：release readiness 讨论确认该问题为公开发布前必须关闭的正确性边界。
