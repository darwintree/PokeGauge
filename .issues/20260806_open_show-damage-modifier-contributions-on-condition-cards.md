---
# This section is managed by the CLI. Do not edit manually.
id: "cda89071-fe8c-4337-83ad-3bc0598343f8"
title: "Show damage modifier contributions on condition cards"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-06T06:31:00Z"
updated_at: "2026-08-20T08:30:00Z"
---
## Problem

伤害条件卡需要诚实解释参与结果的条件来源。运行时伤害现由 `@smogon/calc` 黑盒产生；当前 formula-details 仍由本地 compiler 投影通用 phase 与等效威力，它不是 calc 的执行 trace，也不能可靠拆出每个 Ability、Held item、天气等来源的独立数值贡献。

[[archive/20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]] 只负责正确计算能力效果。没有当前消费者的纯数值 contribution 明细不在其中提前实现。

## Issue Assessment

- Impact：影响伤害条件卡能否解释能力、道具、天气等条件如何参与当前伤害结果。
- Evidence：`docs/adr/0007-smogon-calc-runtime-damage-engine.md` 明确本地 modifier 只作展示投影。独立 `modifierLabels` 会再制造一份无法由 calc 验证的平行规则表。
- Scope：先确认卡片要回答“哪些条件参与”还是“每项精确乘数”；从 calc 公共输出与现有 Selection provenance 能证明的数据反推最小契约。
- Decision：valid but deferred；不得把本地 projection 描述为 calc 的精确执行过程。

## Discussion baseline

- 此前关于 localized string、独立 label map、`LabeledSelection` 和内建项 label 来源的决定全部撤回。
- 此前关于新增通用 `modifierDetails` 和纯数值 `contributions` 的决定同样撤回。
- 不从此前讨论推断任何 label 数据模型。
- [[archive/20260812_closed_unify-modifier-execution-and-explanation-representation|Unify modifier execution and explanation representation]] 已由 ADR 0007 取代；本票不再等待本地 execution record 架构。
- 先确认伤害条件卡实际展示什么，再决定数据应由 compiler、pipeline 或既有 provenance 提供。
- 后续需重新确认 label 表示“来源名称”还是“效果说明”。
- 后续需重新确认本地化边界，以及 Selection 来源和内建公式项是否采用同一种表示。
- label 不应迫使调用方维护一套与 compiler 输入平行、可能失配的映射。
- 若 calc 公共 API 无法提供来源级精确乘数，首个可接受切片应只展示可证明的 Selection activation 与 calc 最终描述，不伪造 contribution 数值。

## Out of scope

- 为当前能力 modifier 实现预埋无消费者的 contribution 数据。
- 修改 damage kernel。
- 修改伤害计算或 calculation identity。

## Verification Checklist

- [ ] 伤害条件卡的具体展示与交互已经确认。
- [ ] label 语义、本地化边界和数据所有者已经确认。
- [ ] 明确区分 calc 真实输出、Selection provenance 与本地估算投影。
- [ ] Selection 来源和需要展示的内建公式项都无需维护一份平行数值规则表。
- [ ] label 不进入 kernel 或 calculation identity。
- [ ] 没有为未展示的数据增加通用 compiler 输出。

## Progress Log

- 2026-08-06：从能力 modifier issue 拆出；撤回 label 与通用 modifier details 相关决定，等待从伤害条件卡需求重新 grilling。
- 2026-08-20：按 ADR 0007 重写。运行时 calc 黑盒取代本地 kernel；本票改为定义黑盒边界下可证明、不会误导的解释能力。
