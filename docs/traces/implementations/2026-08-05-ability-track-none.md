# Implementation Trace: Ability Track none

Date: 2026-08-05
Source: `.issues/archive/20260805_closed_ability-track-none.md` (stable id: `b14815db-011e-40a2-bc68-141930312d9a`)
Language: 中文

## Entries

### 1. `none` 的持久化身份

Type: unresolved-implementation-decision

Context:
契约要求 `none`、真实特性与 `Unknown ability` 使用不同身份，但未指定 `none` 的内部表示。现有 Scenario、catalog、persistence 与 provenance seam 都使用数值 ability id；PokeAPI 真实 id 为正整数，`Unknown ability` 已使用 `0`。

Decision:
使用 `-1` 作为本地 `NO_ABILITY_ID`，继续复用现有数值 ability id 数据流。

Reason:
该值不与现有上游身份或 `Unknown ability` 冲突，不需要扩展 TrackState 与存档 schema，也让旧存档无需迁移即可继续读取。

Follow-up:
None.
