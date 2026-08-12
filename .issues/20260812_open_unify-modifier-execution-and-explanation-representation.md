---
# This section is managed by the CLI. Do not edit manually.
id: "f36c2b11-ff0c-4878-b1bb-3d8a05147f80"
title: "Unify modifier execution and explanation representation"
status: "open"
priority: "high"
labels: ["TECH-DEBT", "NEEDS-TRIAGE"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-12T07:51:00Z"
---
## Problem

当前 Scenario compiler 将多个来源折叠为各 kernel phase 的最终 modifier，计算沿用这些标量；结果解释则通过 provenance、`MoveMechanics.phases` 和未来 label 映射另行拼装。若展示层维护一份平行的 modifier／label／顺序数据，它可能与真实执行路径漂移，产生“页面解释正确但计算不同”或反向不一致。

需要设计一个深模块，使 modifier 的执行与解释来自同一结构化表示：实际 kernel 输入由它产生，审计页和结果解释也只投影它，而不是重建公式。

## Issue Assessment

- Impact：这是公开审计体系的基础不变量；没有同源机制，展示越详细，产生错误解释的风险越高。
- Evidence：当前 Ability、Held item、Terrain、Weather 等模块分别返回 modifier 与 activation；`scenario-compiler.ts` 再按 phase 链接，`mechanics-projection.ts` 只看到链后标量，provenance 则保存来源状态但不保存其数值贡献。
- Scope：定义 modifier execution record 的最小 interface、阶段顺序、来源 identity、gate／activation、链式舍入和分支语义；由同一 record 生成 kernel 输入、公开审计投影与结果解释。
- Decision：valid；在 modifier contribution UI 与公开 case 深化前完成架构设计，实施可在首次 release 后进行。

## Architecture direction

- 计算模块对调用方暴露一个小 interface；复杂的来源组合、阶段顺序、整数舍入和分支差异封装在模块实现中。
- 每个真实参与计算的 modifier 只有一个运行时表示。执行器消费它，解释器只读取它，不允许 UI 维护独立数值或独立排序表。
- 本地化文案是解释 adapter，不进入计算 identity、kernel 或数值 record。
- record 必须表达原始来源、phase、精确 fixed-point modifier、应用顺序、active／inactive 原因，以及 normal／critical 等分支适用性。
- phase 内链式舍入与最终 operand 应用仍由计算实现决定；展示不得用浮点乘积重算结果。
- 不是 scalar modifier 的规则（忽略、压制、必中、伤害无效、属性重写等）需要统一的可解释 operation 形状，或明确由相邻同源 record 表达，不能伪装成 `1×` scalar。
- 测试穿过与生产调用方相同的 interface；公开 Calculation Case 验证执行结果与解释投影的一致性。

## Related issues

- [[20260806_open_show-damage-modifier-contributions-on-condition-cards|Show damage modifier contributions on condition cards]]：具体 UI 消费者；不得在本架构前建立平行 label 映射。
- [[20260812_open_publish-auditable-calculation-cases-and-case-submission|Publish auditable calculation cases and case submission]]：公开审计消费者。
- [[20260807_open_clarify-active-marking-for-ignore-guaranteed-track-conflicts|Clarify active marking for ignore/guaranteed Track conflicts]]：operation 的贡献与 activation 规则。
- [[20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]]：数值 oracle 与阶段差异来源。

## Non-goals

- 建立通用战斗事件总线或完整 Battle State。
- 让 kernel 识别 Ability、Held item、Move 名称或本地化文案。
- 为尚无消费者的数据无限扩张通用 schema。
- 用解释层重新执行一遍计算来“校验”生产结果。

## Verification Checklist

- [ ] 深模块的 seam、interface、invariants 与 error modes 已形成书面架构契约。
- [ ] 至少比较两种 interface 设计，并证明选择方案不会把当前 compiler 复杂度泄漏给调用方。
- [ ] scalar modifier、阶段顺序、固定点舍入、normal／critical 分支及非 scalar operation 均可同源表达。
- [ ] kernel input、结果解释和公开 case 不维护任何平行 modifier 数值或顺序。
- [ ] 本地化、来源 label 与 UI 格式化保持在 adapter 中。
- [ ] 代表性 Ability × item × weather × screen 组合证明执行结果与解释投影一致。
- [ ] 旧的重复或越过 interface 的测试在新 interface 覆盖后得到收敛。

## Progress Log

- 2026-08-12：release 讨论确认 modifier 展示必须与实际计算机制同源；该要求先作为独立架构 issue 跟踪。
