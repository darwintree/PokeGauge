---
# This section is managed by the CLI. Do not edit manually.
id: "4d2d962d-955b-4c23-ab42-598e6f33a7bf"
title: "Green-dot conditional ability effects"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:30:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现条件触发类特性：选中即默认条件满足并生效；一并交付 Track 绿点指示灯（含 hover），不新增 HP%／状态 Track。

## Scope

### 绿点指示灯

- 条件触发类特性在选中时显示**绿点**：「按条件已满足结算」。
- hover 说明已生效假设。
- 绿点不得与红点「效果暂未支持」、结果侧「未生效」、或「已判断无效」混淆。

### 特性效果（选中即条件满足）

- Multiscale
- Overgrow、Blaze、Torrent、Swarm
- Guts、Marvel Scale、Merciless

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §8
- `none` Track 基建：[[20260805_open_ability-track-none|Ability Track none]]

## Out of scope

- Unburden、Supreme Overlord、Friend Guard、Disguise 等仍 defer
- 真实 HP%／状态输入模型（若未来要做，另开 issue）
- Ability Track `none`（见 none 子 issue）

## Acceptance criteria

- [ ] 选中即按「条件已满足」编译伤害／暴击等效果。
- [ ] 绿点 + hover 说明生效假设；语义可与红点／未生效区分。
- [ ] 父 issue checklist 对应项可勾选。
