---
# This section is managed by the CLI. Do not edit manually.
id: "dfdb40c5-e467-4b47-8d6c-2d923da52605"
title: "Decide Mega Pokémon move usage-data loading"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-04T08:41:00Z"
---
## Goal

确定 Mega Battle Pokémon Identity 的招式使用率从哪里取得、如何关联和加载，以及数据不可用时的产品行为。

## Resolved

- Source of truth：championsbattledata.com · Doubles · 跟随索引 `defaultSeason`（Current）；每条记录携带 `season` / `source` / `dataVersion`；修正现有优先使用 `battleDataCsvs`（M4 每日快照）的解析路径。
- Mega 关联：无条件继承——凡上游存在该物种基础条目的 Mega identity，其 Move usage 等于基础形态的 Move usage；无 Mega Stone 门控、无加权、无第二数据源；上游无该物种基础条目即无 usage 数据。
- Move pick 语义：继承数据与原生 usage 完全同规则（top-10 边界、>50% 或克制默认选中、按 rank 排序）。
- 加载阶段：运行时加载，延续已归档的在线 Champion API 决策；同一种源 identity 的 battle rows 只 fetch 一次并共用会话缓存；沿用 5 秒超时。
- 缺失与失败：空 usage 记录 + 现有 fallback——不产生默认 Move 快照、手动选择保持可用、不新增 UI 状态。
- 来源标注：契约与 UI 均不新增来源标注。

## Non-goals

- Nature（性格）使用率：当前无产品需求，从本 issue 取消。
- stat_points SP 分布：不纳入契约。
- 不决定 Mega 宝可梦本身在宝可梦选择器中的使用率排序。
- 不在本 issue 决定招式如何转化为最终默认选择；这里只定义可用的数据契约。
- 不改变 Mega 形态候选资格和 Mega Stone 锁定语义。

## Acceptance direction

- 明确可复现的数据源、加载阶段、版本与 fallback。
- 每条可用记录能稳定关联到 Mega Battle Pokémon Identity，并保留 Move 使用率。
- 数据缺失或加载失败不会阻塞现有招式候选与 Stat Preset 功能。
- [x] 逐条审计 `docs/traces/discussion/2026-08-04-mega-move-usage-inheritance.md` 中的每个决策已在后续数据加载实现中落实。

## Resolution

已通过 batch-grill-me 完成决策，讨论记录见 `docs/traces/discussion/2026-08-04-mega-move-usage-inheritance.md`；契约变更见 `docs/spec/changes/2026-08-04-mega-move-usage-inheritance.md`，并已同步至 `docs/spec/move-pick.md`。
