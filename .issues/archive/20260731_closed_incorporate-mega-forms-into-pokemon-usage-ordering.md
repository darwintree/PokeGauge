---
# This section is managed by the CLI. Do not edit manually.
id: "24471122-238d-4826-8efa-fd4970970415"
title: "Incorporate Mega forms into Pokémon usage ordering"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-07-31T08:48:00Z"
updated_at: "2026-08-05T01:50:00Z"
---
## Goal

宝可梦选择器的默认使用率排序应在一定程度上反映 Mega 信息，而不是把普通形态与 Mega 形态完全割裂或简单重复计数。

## Questions to resolve

- 使用率应按 Battle Pokémon Identity 独立排序，还是按同一 Pokémon Species 聚合后再分配给各 Pokémon Form。
- 普通形态与一个或多个 Mega 形态的使用率如何综合，避免重复计算同一条对战选择链。
- 该排序与“同一 Pokémon Species 形态优先”“Mega 优先”两个显式优先选项如何正交组合。
- 数据缺失、形态无法关联或不同来源赛季不一致时如何回退。

## Acceptance direction

- 明确 source of truth、聚合公式、稳定排序和缺失数据回退。
- Mega 信息能够影响默认候选顺序，但不改变候选资格。
- 显式形态优先选项仍高于默认使用率排序。

## Resolution

2026-08-05 经 batch-grill-me 确认设计后实现：

- 排序按 Battle Pokémon Identity 独立排名；每个有使用率排名的基础形态，其 Mega 形态（`isMega` 且 `speciesId` 相同）紧随其后，按现有 option 顺序展示；不聚合、不重复计数。
- 基础形态不在 Champions 索引或拉取失败时，对应 Mega 留在尾部原有顺序。
- `sameSpeciesFirst` / `megaFirst` 两个显式开关不变，仍在使用率排序之后生效。
- 改动仅落在 `rankPokemonOptionsByChampionsUsage`（catalog 层），并新增测试覆盖 Charizard (6) → Mega Charizard X (10034) → Mega Charizard Y (10035)。
