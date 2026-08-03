---
# This section is managed by the CLI. Do not edit manually.
id: "b782e64a-b63e-4e1b-a7c2-e11af70071d5"
title: "Decide Mega icon treatment in Pokémon Selector"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:31:00Z"
updated_at: "2026-08-03T04:31:00Z"
---
## Goal

确定 Pokémon Selector 中 Mega 形态的图标与标识方式，使用户能快速区分普通形态、Mega 形态及 X/Y 等变体。

## Questions to resolve

- Mega 图标显示在 Mega identity 行、可 Mega 的普通 identity 行，还是两者以不同语义显示。
- 图标采用什么视觉资产或符号，是否需要区分 Mega X、Mega Y 与单一 Mega 形态。
- 图标在候选行、搜索结果、分组标题、当前选中值和 Selector trigger 中分别如何出现。
- 图标是纯信息标识还是可交互入口；若可交互，如何避免与整行选择冲突。
- 本地化名称、无障碍文本、非颜色识别、触控尺寸和移动端密度要求。
- 图标如何与现有形态优先选项、使用率排序和同种形态分组共存。

## Non-goals

- 不决定 Mega 使用率数据的来源或排序公式。
- 不决定 Held item 是否能够改变宝可梦形态。
- 不改变 Mega identity、Mega Stone 锁定或候选资格。

## Acceptance direction

- 普通形态与每个 Mega identity 在所有 Selector 状态下均可无歧义识别。
- 标识不只依赖颜色，并具有明确的 accessible name 或等价文本。
- 图标不会改变选择行为、候选排序或 identity 语义。