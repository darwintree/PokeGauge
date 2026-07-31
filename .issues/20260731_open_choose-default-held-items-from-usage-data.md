---
# This section is managed by the CLI. Do not edit manually.
id: "b1cfc64c-cfc0-4278-b430-b1a6286737a8"
title: "Choose default held items from usage data"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-07-31T08:48:00Z"
updated_at: "2026-07-31T08:49:00Z"
---
## Goal

攻击方与防守方 Held item Track 的默认选择应考虑当前 Battle Pokémon identity 的道具使用率，而不是仅依赖静态目录顺序。

## Questions to resolve

- 使用哪个 Champions 双打赛季与数据源作为 source of truth。
- 默认选一个还是多个道具，以及“无道具”是否参与默认选择。
- 使用率记录与 PokeAPI item identity 的关联、缺失记录和不可识别道具如何处理。
- Mega 形态强制 Mega Stone 时，锁定规则如何覆盖使用率默认值。
- 切换宝可梦、形态或恢复已保存 Matchup 时，何时重新计算默认值。

## Acceptance direction

- 默认值规则确定、可复现，并同时适用于攻击方与防守方。
- 使用率只决定默认选择或排序，不改变道具候选资格。
- 用户显式选择和 Mega Stone 锁定不会被异步使用率结果覆盖。
