---
# This section is managed by the CLI. Do not edit manually.
id: "b1cfc64c-cfc0-4278-b430-b1a6286737a8"
title: "Choose default held items from usage data"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-07-31T08:48:00Z"
updated_at: "2026-08-05T03:59:00Z"
---
## Goal

攻击方与防守方 Held item Track 的默认选择应考虑当前 Battle Pokémon Identity 的道具使用率，而不是仅依赖静态目录顺序。

## Decision

产品决策已确认。权威记录：

- 讨论：[[docs/traces/discussion/2026-08-05-held-item-track-usage-defaults-and-form-switch]]
- Spec change（accepted）：`docs/spec/changes/2026-08-05-held-item-pick-and-form-switch.md`
- 最终 spec：`docs/spec/held-item-pick.md`

摘要：Champions 默认赛季；Mega 继承 base；top 10 为高使用率边界；默认选中边界内全部非形态触发且有资格的道具；`none` / `nothing` 不进默认；不 backfill；不扩大 frozen 资格（形态例外另见形态 issue）；untouched 异步写入；Identity 变更重走默认；恢复 Matchup 不覆盖。重算策略迭代：[[../20260805_open_iterate-held-item-default-recompute-untouched-policy]]。

## Related

- [[20260803_closed_decide-held-item-track-presentation-and-selection-model]]
- [[20260803_closed_decide-whether-held-items-may-change-pokemon-form]]
- [[../20260805_open_iterate-held-item-default-recompute-untouched-policy]]

## Acceptance

- [x] Spec change 已 accepted，且 `docs/spec/held-item-pick.md` 反映使用率池与默认契约
- [x] 实现完成后：逐条审计讨论记录中与本 issue 相关的决定均已落地
- [x] 攻防双方默认规则可复现；用户显式选择与形态锁定不被异步使用率覆盖

## Resolution

Implemented: `listChampionsItemUsageRecords` + `resolveDefaultHeldItemPick`, catalog `default*ItemPoolIds` / untouched sync, locked short-circuit. Trace: `docs/traces/implementations/2026-08-05-held-item-pick-and-form-switch.md`.

## Non-goals

- 不把 Smogon chaos 订为 source of truth。
- 不在本 issue 迭代 untouched 粒度（见独立 issue）。
