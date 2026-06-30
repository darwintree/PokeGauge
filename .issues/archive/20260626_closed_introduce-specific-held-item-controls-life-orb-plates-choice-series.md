---
# This section is managed by the CLI. Do not edit manually.
id: "54dd9e9b-4bbe-4dfe-9d8b-2bee2e22edb1"
title: "Introduce specific held-item controls (Life Orb, type boosts, Choice series)"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-30T08:26:00Z"
---
## Context

攻击方「道具」track：由通用文字多选改为 **纯图标池**（grill 方案 B）。

**Grill:** [`docs/traces/2026-06-29-held-item-controls-grill.md`](../../docs/traces/2026-06-29-held-item-controls-grill.md)  
**Implementation:** [`docs/traces/implementations/2026-06-29-held-item-controls.md`](../../docs/traces/implementations/2026-06-29-held-item-controls.md)

## Design verdict

### Delivered (v1)

| 类别 | 内容 |
| --- | --- |
| Core | `none` / `life-orb` / `choice-band\|specs`（category-aware） |
| 属性强化 | `type-boost-{type}` × 18；默认可见本系 ≤2；`+` 添加其余（localStorage 按 attacker） |
| UI | `HeldItemTrack` 图标池（sidebar） |
| Pipeline | 扁平 `attackerItems`；多选 row product；每行单道具、modifier 互斥 |
| Default | 仅 `none` |
| Tests | type-boost modifier golden path（`pipeline.test.ts`） |

### Out of scope (v1)

| 项 | 依据 |
| --- | --- |
| 石板 Plates | 产品决定：不再需要 |
| 讲究围巾 Choice Scarf | Grill §2 |
| 结果行图标 / 「无加成」标注 | Grill §6 → [[20260626_open_damage-comparison-results-info-display-needs-refinement]] |
| 合并无加成重复行 | [[20260629_open_merge-scenario-rows-when-item-has-no-damage-effect]] |

## Acceptance criteria

- [x] 无道具 / 生命玉 / 讲究 / 属性强化可多选并参与对比（每行仅一件、效果互斥）
- [x] 各选项与伤害 pipeline / `@smogon/calc` item modifier 一致
- [x] Default view 默认选中无道具
- [x] `+` 添加的强化道具按攻击方持久化（localStorage）
- [x] catalog 扁平 list 扩展（core + type-boost）
- [ ] 无加成时结果行注明「无加成」— defer [[20260626_open_damage-comparison-results-info-display-needs-refinement]]

## Resolution

Sidebar 道具 track 与 catalog/pipeline 已在 `8d71485` 按 grill 交付。石板取消；结果行展示与无加成合并留给 follow-up issues。Issue 关闭。
