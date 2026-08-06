---
# This section is managed by the CLI. Do not edit manually.
id: "cda89071-fe8c-4337-83ad-3bc0598343f8"
title: "Show damage modifier contributions on condition cards"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-06T06:31:00Z"
updated_at: "2026-08-06T06:36:00Z"
---
## Problem

伤害条件卡需要展示参与伤害修正的来源，但当前计算结果只保留每个 kernel phase 的最终 modifier，无法直接得到面向用户的贡献来源 label。

[[archive/20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]] 只负责正确计算能力效果。没有当前消费者的纯数值 contribution 明细不在其中提前实现。

## Issue Assessment

- Impact：影响伤害条件卡能否解释能力、道具、天气等条件如何参与当前伤害结果。
- Evidence：独立 `modifierLabels` 会让调用方维护平行对应关系；把 label 附着于 Selection 又无法自然覆盖 STAB、属性相克、双打衰减、要害等内建公式项。
- Scope：从伤害条件卡的展示需求反推最小的数据契约；不得改变 modifier 数值、阶段顺序或 kernel 输入。
- Decision：defer；能力 modifier 先沿用现有 compiler 输出。

## Discussion baseline

- 此前关于 localized string、独立 label map、`LabeledSelection` 和内建项 label 来源的决定全部撤回。
- 此前关于新增通用 `modifierDetails` 和纯数值 `contributions` 的决定同样撤回。
- 不从此前讨论推断任何 label 数据模型。
- 先确认伤害条件卡实际展示什么，再决定数据应由 compiler、pipeline 或既有 provenance 提供。
- 后续需重新确认 label 表示“来源名称”还是“效果说明”。
- 后续需重新确认本地化边界，以及 Selection 来源和内建公式项是否采用同一种表示。
- label 不应迫使调用方维护一套与 compiler 输入平行、可能失配的映射。

## Out of scope

- 为当前能力 modifier 实现预埋无消费者的 contribution 数据。
- 修改 damage kernel。
- 修改伤害计算或 calculation identity。

## Verification Checklist

- [ ] 伤害条件卡的具体展示与交互已经确认。
- [ ] label 语义、本地化边界和数据所有者已经确认。
- [ ] Selection 来源和需要展示的内建公式项都无需平行对应表。
- [ ] label 不进入 kernel 或 calculation identity。
- [ ] 没有为未展示的数据增加通用 compiler 输出。

## Progress Log

- 2026-08-06：从能力 modifier issue 拆出；撤回 label 与通用 modifier details 相关决定，等待从伤害条件卡需求重新 grilling。
