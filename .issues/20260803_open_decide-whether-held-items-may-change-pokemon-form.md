---
# This section is managed by the CLI. Do not edit manually.
id: "e2793198-2a9c-4066-bf8e-9361948fd037"
title: "Decide whether held items may change Pokémon form"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:31:00Z"
updated_at: "2026-08-03T08:24:00Z"
---
## Goal

决定选择或移除特定 Held item 时，是否允许应用主动切换到另一 Battle Pokémon Identity（即具备独立对战数据的 Pokémon Form）。

## Current contract

现有 frozen-85 Held-item spec 规定选择道具不得合成另一 Battle Pokémon Identity，并将 Mask form transitions 等形态行为排除在范围外；改变该规则需要显式 spec change。

## Questions to resolve

- 哪些道具族允许触发形态变化：Mega Stone、Ogerpon Mask、signature Orb，或其他明确白名单。
- 道具到 Battle Pokémon Identity 是单向建议、自动切换还是双向锁定；移除或替换道具时是否回退。
- 宝可梦 Selector、Held item Track 与 Identity lock 中谁拥有最终身份，冲突时优先级如何确定。
- Held item Choice Track 遇到多个可能改变 Identity 的选项时如何限制或报错。
- 切换宝可梦、恢复保存场景和异步默认值如何保持转换原子性。
- 形态变化只发生在配置阶段，还是还要表达战斗中的动态变身。

## Non-goals

- 不在本 issue 扩展具体道具的伤害效果。
- 不默认实现战斗历史、回合内变身或道具消耗。

## Related issues

- [[archive/20260731_closed_implement-frozen-85-item-held-item-effects|Implement frozen 85-item Held-item effects]]

## Acceptance direction

- 明确 Battle Pokémon Identity 的唯一 owner、允许触发转换的道具集合和完整状态转换规则。
- 任一 UI 选择、保存和恢复状态都不能产生道具与 Battle Pokémon Identity 相互矛盾的场景。
- 明确需要修改的现有 spec 契约与不兼容行为。
