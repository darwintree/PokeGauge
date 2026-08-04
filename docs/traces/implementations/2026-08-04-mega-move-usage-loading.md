# Implementation Trace: Mega Move Usage 数据加载

Date: 2026-08-04
Source: docs/spec/changes/2026-08-04-mega-move-usage-inheritance.md · docs/traces/discussion/2026-08-04-mega-move-usage-inheritance.md
Language: 中文

## Entries

### 1. dataVersion 取自索引响应

Type: interpretation

Context: 契约要求每条 usage 记录携带上游数据版本（`dataVersion`），但 battle rows 端点（`/api/battle/Doubles/{name}?season=...`）的响应只包含 `pokemon` / `format` / `season` / `source` / `rows`，没有 `dataVersion`；只有索引端点 `/api` 提供 `dataVersion`。

Decision: 从会话缓存的索引响应读取 `dataVersion`，附加到 battle rows 结果后写入每条 move usage 记录。

Reason: 与 `defaultSeason` 同源，单一来源且不依赖 battle rows 端点的上游字段形状。

Follow-up: None

### 2. Mega 的 ability usage 随共享 battle rows 继承

Type: interpretation

Context: 决策 7 要求同一种源 identity 的 battle rows 只 fetch 一次并由 move/ability 消费共享；决策 9 只把 Mega Move usage 纳入契约。共享实现会让 `listChampionsAbilityUsageRecords(megaId)` 也返回基础形态的 ability rows。

Decision: 不特判，ability usage 随共享 battle rows 继承基础形态。

Reason: 最简实现且符合决策 7 的共享语义。产品无观察差异：Mega 特性轨道已锁定为该 Mega 特性，`resolveDefaultAbilityIds` 只取合法集合中的首项；继承行若不含该特性则结果与空数据一致，若包含（如基础形态同特性）也与锁定默认一致。

Follow-up: None
