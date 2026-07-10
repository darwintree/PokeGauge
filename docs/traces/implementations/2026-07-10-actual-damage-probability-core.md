# Implementation Trace: 实际伤害概率核心

Date: 2026-07-10
Source: `.issues/20260710_working_implement-and-test-the-actual-damage-probability-core.md`
Language: 中文

## Entries

### 1. 通用稀疏卷积的最小导出面

Type: unresolved-implementation-decision

Context:
已确认契约规定通用模块接收 `ReadonlyMap<number, number>[]`，但没有规定函数名，也没有说明是否应额外导出分布别名或实现类型。

Decision:
只导出 `convolveSparseDistributions` 一个函数，并在签名中直接使用 `ReadonlyMap<number, number>`；不导出额外类型、类或可配置策略。

Reason:
单一函数足以承载当前调用方和独立测试，同时避免把可替换的内部表示扩展成更大的公共契约。

Follow-up:
None.
