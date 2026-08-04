# Mega Move Usage Inheritance 讨论记录

对应 spec change: [`docs/spec/changes/2026-08-04-mega-move-usage-inheritance.md`](../../spec/changes/2026-08-04-mega-move-usage-inheritance.md)

## 1. Nature 使用率是否纳入需求

问题：Mega Battle Pokémon Identity 的性格使用率从哪里取得、如何关联。

决定：从需求中取消。当前没有性格使用率的产品需求，不定义 nature usage 契约。

## 2. stat_points SP 分布是否纳入契约

问题：上游 stat_points 行是否一并纳入 usage 数据契约。

决定：不纳入。本次契约只覆盖 Move usage。

## 3. Source of truth 的赛季、格式与版本

问题：使用哪个 Champions 赛季、格式和版本作为 usage 的 source of truth。

决定：使用 championsbattledata.com、Doubles 格式，并显式跟随索引 `defaultSeason`（Current）解析赛季；每条 usage 记录携带 `season`、`source` 与 `dataVersion` 用于审计。现有实现中优先使用 `battleDataCsvs`（M4 每日快照）的解析路径需要修正为跟随 `defaultSeason`。

## 4. Mega 形态的 usage 关联策略

问题：上游只提供基础 Pokémon Form 的 battle rows，Mega Battle Pokémon Identity 如何取得 usage。

决定：无条件继承——凡上游存在该物种基础条目的 Mega identity，其 Move usage 等于基础形态的 Move usage；无 Mega Stone 门控、无加权、无第二数据源。上游没有该物种基础条目的 Mega identity 视作无 usage 数据。

## 5. 继承数据在 Move pick 中的语义

问题：继承来的 usage 是否与原生 usage 同规则参与默认候选与排序。

决定：完全同规则。继承数据沿用现有 Move pick 契约：top-10 边界、使用率 >50% 或克制时默认选中、按 rank 排序。

## 6. 来源标注与可审计性

问题：契约或 UI 是否需要标注 usage 来源于基础形态。

决定：不需要。契约与 UI 均不新增来源标注，issue 验收措辞不再额外处理。

## 7. 加载阶段

问题：数据在资源生成时 vendoring、构建时生成还是运行时加载。

决定：运行时加载，延续已归档的在线 Champion API 决策；同一种源 identity 的 battle rows 只 fetch 一次，move/ability 消费共用会话缓存；沿用 5 秒超时。

## 8. 缺失与失败的产品行为

问题：数据缺失、加载失败或超时时产品如何表现。

决定：返回空 usage 记录并沿用现有 fallback——不产生默认 Move 快照、手动选择保持可用、不新增 UI 状态。

## 9. 契约范围

问题：最终数据契约包含哪些内容。

决定：只包含 Mega Move usage（继承基础形态 + 赛季/来源/数据版本字段）；nature、stat_points、Mega Stone 加权均不在范围。
