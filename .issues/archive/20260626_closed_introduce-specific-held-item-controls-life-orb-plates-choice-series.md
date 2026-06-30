---
# This section is managed by the CLI. Do not edit manually.
id: "54dd9e9b-4bbe-4dfe-9d8b-2bee2e22edb1"
title: "Introduce specific held-item controls (Life Orb, Plates, Choice series)"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-30T08:26:00Z"
---
## Context

攻击方「道具」track：通用多选（`ConfigMultiSelect`），catalog + pipeline 乘算。

原始 backlog 曾列生命宝珠、石板、讲究全系列；后续 trace 收窄 scope（见下）。

## Design verdict (trace-aligned)

### In scope (v1 — delivered)

| 道具 | Catalog id | 说明 |
| --- | --- | --- |
| 无道具 | `none` | explicit no-item |
| 生命宝珠 | `life-orb` | 默认选中集含 `none` + `life-orb` |
| 讲究头带 / 眼镜 | `choice-band` / `choice-specs` | 随 `moveCategory` 切换（slice 5） |

- **UI**：保留 flat 多选 pill（`track-controls.tsx` → `ConfigMultiSelect`）；不重组专用控件。
- **Pipeline**：`attackerItemIds` 参与 row product；`ATTACKER_ITEM_NAMES` → `@smogon/calc`。
- **结果行**：有道具时 muted 文本标签（stat-tier grill D 面；非 tier chip）。

### Out of scope (trace / 产品决定)

| 项 | 依据 |
| --- | --- |
| 石板 Plates | 产品决定：不再需要 |
| 讲究围巾 Choice Scarf | [[../docs/traces/implementations/2026-06-26-slice-5-matchup-selector-and-catalog-expansion\|slice 5]]：v1 仅头带/眼镜 |
| 道具 track tier 上色 | [[../docs/traces/2026-06-28-stat-tier-color-tokens-grill\|stat-tier grill]] §1 |
| 专用分组 UI / Wrap grid | [[../docs/traces/2026-06-28-stat-value-template-grill\|stat-value grill]] §10 仅覆盖实数值 preset |
| 多选选中态强化 | [[../20260626_open_multi-select-selected-vs-unselected-state-is-hard-to-distinguish]] |

### Trace references

- Slice 1/3：道具多选 track + pipeline
- [[../docs/traces/implementations/2026-06-26-slice-5-matchup-selector-and-catalog-expansion\|Slice 5]]：category-aware Choice（头带/眼镜）
- [[../docs/traces/2026-06-28-stat-tier-color-tokens-grill\|Stat tier grill]]：结果行 muted 道具、道具 track 不上色

## Acceptance criteria

- [x] 生命宝珠、讲究头带/眼镜可在 UI 中选择并参与对比
- [x] 各道具选项标签与伤害 pipeline / `@smogon/calc` 行为一致（Life Orb golden test 覆盖代表路径）
- [x] 与「无道具」多选共存，符合 track 累乘收紧语义
- [x] catalog 经 `buildAttackerItems(category)` 扩展；后续道具可复用同一 `CatalogOption` + `ATTACKER_ITEM_NAMES` 模式

## Resolution

v1 基线已在 slice 1/3/5 交付；石板与专用 UI 重组按上表 defer/取消。Issue 关闭，无额外实现待办。
