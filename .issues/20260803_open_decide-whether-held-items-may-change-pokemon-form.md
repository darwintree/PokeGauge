---
# This section is managed by the CLI. Do not edit manually.
id: "e2793198-2a9c-4066-bf8e-9361948fd037"
title: "Decide whether held items may change Pokémon form"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-05T03:35:00Z"
---
## Goal

决定选择或移除特定 Held item 时，是否允许应用主动切换到另一 Battle Pokémon Identity（即具备独立对战数据的 Pokémon Form）。

## Decision

产品决策已确认：**允许**，经确认对话框，且仅限显式映射表内、目标可选且合法可达的形态触发道具。权威记录：

- 讨论：[[docs/traces/discussion/2026-08-05-held-item-track-usage-defaults-and-form-switch]]
- Spec change（accepted）：`docs/spec/changes/2026-08-05-held-item-pick-and-form-switch.md`
- 最终 spec：`docs/spec/held-item-pick.md`

摘要：点击形态道具 = 导航而非多选；确认后等同 Pokémon 重选 transition；目标 Identity 锁定对应道具；离开形态仅 Selector；目标不可选不进池。废止旧讨论中「选道具绝不切换 Identity」的绝对禁令（以 accepted spec 为准）。

## Related

- [[20260803_open_decide-held-item-track-presentation-and-selection-model]]
- [[20260731_open_choose-default-held-items-from-usage-data]]
- [[archive/20260731_closed_implement-frozen-85-item-held-item-effects|Implement frozen 85-item Held-item effects]]

## Acceptance

- [x] Spec change 已 accepted，且 `docs/spec/held-item-pick.md` 反映形态切换与锁定契约
- [ ] 实现完成后：逐条审计讨论记录中与本 issue 相关的决定均已落地
- [ ] 任一 UI 选择、保存和恢复状态都不产生道具与 Identity 相互矛盾的稳定态

## Non-goals

- 不在本 issue 扩展具体道具的伤害效果。
- 不默认实现战斗历史、回合内变身或道具消耗。
