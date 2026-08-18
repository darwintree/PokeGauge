# Implementation Trace: Audited Move Calculation Boundary

Date: 2026-08-17
Source: `.issues/archive/20260812_closed_enforce-an-audited-move-calculation-boundary.md`
Language: 中文

## Entries

### 1. 在 Scenario 结果中承载部分支持度

Type: unresolved-implementation-decision

Context:
issue 明确 `semi-supported` 描述 Scenario，但没有规定该描述在计算管线中的数据形状；同时要求继续产出当前结果，且不在结果区增加标记。

Decision:
在 `CalculableScenario` 与 `ScenarioResult` 增加 `support`，取 `supported` 或 `semi-supported`。计算 identity 不包含它；合并等价结果时只要任一来源为部分支持，就保留 `semi-supported`。

Reason:
让计算边界可被测试和后续消费者审计，同时不改变结果合并与现有结果区的信息层级。Grassy Terrain 即使当前伤害修正恰好为中性，也能通过该元数据保留其缺失的回合结束语义。

Follow-up:
None.
