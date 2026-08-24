# Implementation Trace: Ability support classification

Date: 2026-08-24
Source: `.issues/archive/20260824_closed_repair-ability-support-classification-and-assumed-conditions.md`
Language: 中文

## Entries

### 1. 用 calc 原生输入表达 Analytic 的最后行动条件

Type: unresolved-implementation-decision

Context:
issue 要求选中 Analytic 即按最后行动计算，但 `@smogon/calc` 0.11.0 没有直接的行动顺序输入：它根据速度判断，或在防守方被标记为正在换出时触发 Analytic。修改速度会同时改变 Electro Ball、Gyro Ball 等招式；标记换出则会额外使 Pursuit 翻倍。

Decision:
普通招式使用 calc 的防守方换出字段触发 Analytic，不修改速度。Pursuit 单独令双方速度相同，使 calc 判定攻击方最后行动，同时不设置换出字段。

Reason:
这最大限度保持其他招式输入不变，同时继续由 calc 原生公式计算 Analytic；唯一冲突招式有明确、可测试的无副作用路径。

Follow-up:
None.

### 2. 阻止 calc 为无特性输入自动选择物种默认特性

Type: unresolved-implementation-decision

Context:
`@smogon/calc` 的 `Pokemon` 在省略 ability 时会自动选择物种的第一特性。产品中的 No Ability、unsupported 和 none 都要求不应用特性效果，直接省略字段会让这些场景意外获得默认特性。

Decision:
adapter 在没有可用特性名时统一传入 calc 不识别效果的 `No Ability` 占位名，而不是省略 ability。

Reason:
占位名经过 calc 的原生对象构造与 clone 流程仍保持稳定，同时不会命中任何 `hasAbility` 效果钩子；无需 fork calc 或在每个调用点清理默认特性。

Follow-up:
None.
