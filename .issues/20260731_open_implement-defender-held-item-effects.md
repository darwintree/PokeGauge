---
# This section is managed by the CLI. Do not edit manually.
id: "7d55bfc9-1d6d-48f7-9605-29af6da711c0"
title: "Implement defender held-item effects"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-07-31T08:48:00Z"
updated_at: "2026-07-31T08:49:00Z"
---
## Goal

在已完成的防守方 Held item Track 与状态传递基础上，实现会影响承伤结果的防守方携带道具效果。

## Context

- 已完成轨道与状态传递：[[20260730_closed_add-defender-held-item-track|Add defender held-item track]]。
- 道具效果总清单与实现优先级由 [[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]] 跟踪。
- 本 issue 只处理防守方效果接入，不重复实现 Track、持久化或 Mega Stone 锁定。

## Scope

- 让支持的防守方道具进入伤害编译与计算路径。
- 对无效果、未支持效果及效果等价结果沿用现有合并语义。
- 为每类新增防守效果补充最小计算与场景回归测试。
- 按父 issue 的道具子任务逐步交付，不要求一次实现全部道具。

## Acceptance criteria

- [ ] 支持的防守方道具能够改变对应伤害结果。
- [ ] 攻击方与防守方同名道具不会混用作用方向。
- [ ] 无效果和未支持效果不会产生伪结果分支。
- [ ] 已保存的防守方道具选择恢复后保持相同计算语义。
