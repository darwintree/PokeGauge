---
# This section is managed by the CLI. Do not edit manually.
id: "dfdb40c5-e467-4b47-8d6c-2d923da52605"
title: "Decide Mega Pokémon move and nature usage-data loading"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-03T04:31:00Z"
---
## Goal

确定 Mega Battle Pokémon identity 的招式使用率与性格使用率从哪里取得、如何关联和加载，以及数据不可用时的产品行为。

## Questions to resolve

- 使用哪个 Champions 赛季、格式和版本作为招式与性格 usage 的 source of truth。
- 上游数据是否直接提供 Mega identity 的招式与性格分布；若只提供普通形态、队伍或 Mega Stone 记录，如何建立可审计的关联。
- 招式使用率如何关联到 Move identity；性格使用率如何关联到受支持的 nature identity。
- 数据在资源生成时 vendoring、构建时生成还是运行时加载。
- 缓存、刷新、版本固定、缺失记录和加载失败如何处理。
- 加载结果如何向 Move 默认候选与性格／数值模板逻辑暴露稳定的 usage shape。

## Non-goals

- 不决定 Mega 宝可梦本身在宝可梦选择器中的使用率排序。
- 不在本 issue 决定招式或性格如何转化为最终默认选择；这里只定义可用的数据契约。
- 不改变 Mega 形态候选资格和 Mega Stone 锁定语义。

## Acceptance direction

- 明确可复现的数据源、加载阶段、版本与 fallback。
- 每条可用记录能稳定关联到 Mega Battle Pokémon identity，并分别保留 Move 或 nature 的使用率。
- 数据缺失或加载失败不会阻塞现有招式候选与数值模板功能。
