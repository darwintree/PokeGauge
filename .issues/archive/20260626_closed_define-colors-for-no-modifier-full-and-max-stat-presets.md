---
# This section is managed by the CLI. Do not edit manually.
id: "212c36d9-9aab-45d6-a59a-27055bbce3a1"
title: "Define colors for no-modifier, full, and max stat presets"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-27T23:18:00Z"
---
## Context

攻击方 preset 与防守 bulk preset 在 UI 中缺乏一致的颜色编码。Grill 已确定 tier 语义、色板与落点（数轴 snap 档色 defer）。

**Discussion trace:** [`docs/traces/2026-06-28-stat-tier-color-tokens-grill.md`](../../docs/traces/2026-06-28-stat-tier-color-tokens-grill.md)  
**数轴 snap 档色（defer）：** [[../20260626_open_stat-range-axis-ui-needs-refinement|Stat range axis UI needs refinement]]

相关实现：
- `src/components/scenario-explorer/config-multi-select.tsx`
- `src/components/scenario-explorer/damage-box-plot.tsx`
- `src/components/scenario-explorer/track-controls.tsx`
- catalog `attackerStats` / `defenderBulks`

## Tier 语义（grill 定稿）

### 进攻 — pill：`0` · `max` · `ex`

| 档 | 语义 |
| --- | --- |
| 0 | 无修正 |
| max | 满努力 |
| ex | 满努力 + 性格修正 |

### 防守 — pill：`0` · `32HP` · `ex`

| 档 | 语义 | 备注 |
| --- | --- | --- |
| 0 | 无修正 | |
| 32HP | 仅分配 HP 努力 | Champions 点数标签 `(EV+4)/8` → 252 HP = **32** |
| ex | 满 HP + 满防 + 性格修正 | |

## 色板（grill 定稿）

与 18 属性色、伤害 viz token 分层；不混用 shadcn `--primary` / `--destructive`。

| 档 | 进攻 | 防守 | CSS token |
| --- | --- | --- | --- |
| 0 | 灰 | 灰 | `--stat-tier-0-*`（共用） |
| 中 | 深蓝（max） | 浅蓝（32HP） | `--stat-offense-max-*` / `--stat-bulk-mid-*` |
| ex | 紫 | 紫 | `--stat-tier-ex-*`（**进攻与防守完全相同**） |

每档 token 含 `fg` / `bg` / `border` / `muted`。色值对齐 Geist（`design.md` / `design.dark.md`）：gray、blue-600/700、purple。

**防守 track 不使用深蓝**；浅蓝仅用于 32HP 档。

## 视觉编码

**本 issue 范围：Tinted chip** — 选中 pill / 结果行块用 tier bg + border + fg。

> **临时方案：** 实现后仍可能调整编码方式（如 stripe）；不在本 issue 阻塞。

## Surfaces

| Surface | 位置 | 本 issue |
| --- | --- | --- |
| A | 攻击方 preset `ConfigMultiSelect` pills | ✅ tinted chip |
| B | `StatRangeAxis` snap 刻度与标签 | ⏸ **defer** → 数轴 issue |
| D | `DamageBoxPlot` 结果行：进攻块 + vs 防守块 | ✅ tinted chip |
| E | 防守 bulk `ConfigMultiSelect` pills | ✅ tinted chip |

**不做：** 数轴选中区间高亮（保持 primary）、SelectionSummary、招式/道具 track。数轴 envelope 结果行的进攻侧不上单一 tier 色。

## Acceptance criteria

- [x] `--stat-tier-0-*`、`--stat-offense-max-*`、`--stat-bulk-mid-*`、`--stat-tier-ex-*` 定义在 `index.css`，light/dark 可读
- [x] A：攻击 preset pills 可见 tier 色（tinted chip）
- [x] D：结果行进攻块与防守块分别按对应 tier 上色（tinted chip）
- [x] E：防守 bulk pills 可见 tier 色（tinted chip）
- [x] 进攻 ex 与防守 ex 共用同一组 `--stat-tier-ex-*` 值
- [x] 数轴 snap 档色 **不在本 issue**（见数轴 issue）
- [x] 对照 [`docs/traces/2026-06-28-stat-tier-color-tokens-grill.md`](../../docs/traces/2026-06-28-stat-tier-color-tokens-grill.md) 逐条核对实现与决定一致

## Resolution

Implemented stat tier CSS tokens in `src/index.css` (light/dark), mapping in `src/lib/stat-tier-colors.ts`, tinted chips on attack/defense `ConfigMultiSelect` pills and `DamageBoxPlot` result labels. Unified pill labels via `src/lib/catalog/preset-labels.ts` (`0` / `max` / `ex`, `0` / `32HP` / `ex`); offense catalog trimmed to three presets (removed `standard`); added `hp-32` defender bulk. CSS component classes (not dynamic Tailwind arbitrary values) so tier colors render on toggle pressed state. Implementation trace: [`docs/traces/implementations/2026-06-28-stat-tier-color-tokens.md`](../../docs/traces/implementations/2026-06-28-stat-tier-color-tokens.md).

**Deferred:** Stat range axis snap tier colors → [[../20260626_open_stat-range-axis-ui-needs-refinement|Stat range axis UI needs refinement]].
