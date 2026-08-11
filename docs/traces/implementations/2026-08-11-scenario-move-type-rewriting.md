# Implementation Trace: Scenario Move Type rewriting

Date: 2026-08-11
Source: `.issues/20260805_working_scenario-move-type-rewriting-and-protean-family-stab.md`
Language: 中文

## Entries

### 1. Type rewrite 与 compileAbilityEffect 的衔接

Type: unresolved-implementation-decision

Context:
Issue 要求类型重写先于克制／道具／天气／场地／其他 Ability gate，并要求类型改写 BP 与 Fairy Aura 在 Ability 内部 chain，但未规定解析函数的边界与返回形状。

Decision:
新增 `resolveAbilityScenarioMoveType`，在 `compileScenario` 中于 identity 解析之后、effectiveness／item／weather／terrain／ability 之前调用；将其 `basePowerModifier`／`active` 作为 `typeRewriteBasePower`／`typeRewriteActive` 传入 `compileAbilityEffect`，Fairy Aura 用 `chainModifiers` 叠在其上。

Reason:
保证 Scenario Move Type 单一来源驱动全部消费者，同时复用既有 Ability 编译与 activation／provenance 路径，避免双份 gate。

Follow-up:
None.

### 2. ScenarioResult 字段名

Type: interpretation

Context:
Issue 要求 Scenario Result 携带 Scenario Move Type，未规定字段名。

Decision:
使用 `ScenarioResult.moveType`，结果卡 badge 读该字段，catalog Move 仅提供 label。

Reason:
与 `CalculableScenario.move.type` 对齐，最短路径贯通 evaluate → UI。

Follow-up:
None.
