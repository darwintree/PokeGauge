---
# This section is managed by the CLI. Do not edit manually.
id: "0b43d1d4-3010-4e3f-b7c7-38f5db9247f0"
title: "Merge scenario rows when item has no damage effect"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-29T14:47:00Z"
updated_at: "2026-06-29T14:48:00Z"
---
## Context

属性强化道具仅对同属性招式有 1.2× 加成。道具 track **多选**时，多行可能伤害相同（错配强化或无加成）。Grill 决定（2026-06-29）：v1 **不合并**；结果行标注「无加成」。本 issue 跟踪将来是否合并无加成/重复行。

相关：
- [[20260626_open_introduce-specific-held-item-controls-life-orb-plates-choice-series|Held-item controls]]
- [[20260626_open_damage-comparison-results-info-display-needs-refinement|Results info display]]（「无加成」标注）

## What to explore

- 合并键：同 move × 同 offense × 同 defender × 同 damage envelope，且 item modifier 均为 1×？
- UI：单行多图标 vs 折叠 vs 主行 + 附注
- 与「显式对比无道具 vs 带错强化」用户意图是否冲突

## Acceptance criteria

- [ ] 产品决策：合并 / 不合并 / 可选开关
- [ ] 若合并，定义合并规则与结果行展示
- [ ] 与 pipeline row product 契约文档化
