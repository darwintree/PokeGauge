# Implementation Trace: Held-item controls

Date: 2026-06-29
Source: docs/traces/2026-06-29-held-item-controls-grill.md
Language: 中文

## Entries

### 1. Catalog 注册形态

Type: decision

Context:
Grill trace §4 留待实现阶段决定扁平 list vs 分字段。

Decision:
`catalog.attackerItems` 采用 **扁平 list**：core（none / life-orb / choice）+ 18 个 `type-boost-{type}`，顺序固定。UI 可见池由 `buildVisibleItemIds` 从 core + STAB + localStorage 派生，不写入 catalog。

Reason:
Pipeline 已有 `configOrder(catalog.attackerItems)` 排序契约；扁平 list 零 schema 变更即可接入 row product。

Follow-up:
None.

### 2. 结果行图标

Type: interpretation

Context:
Grill trace §6 / §10 将结果行图标 defer 到 results display issue。

Decision:
本实现仅替换 sidebar 道具 track；结果行仍用现有文字展示。

Follow-up:
[[20260626_open_damage-comparison-results-info-display-needs-refinement]]
