---
# This section is managed by the CLI. Do not edit manually.
id: "323d3f26-fac7-4f02-a268-b256a1c51a07"
title: "Stat range axis UI needs refinement"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-28T02:39:00Z"
---
## Context

攻击方与防守方实数值均支持「数轴选段」模式，用于在合法 stat 区间内选段生成对比行（Range track，row product n=1）。当前进攻方已有初版 `StatRangeAxis`（装饰轨 + 独立 Slider，待替换）；防守方仍仅 preset 多选。本 issue 覆盖数轴视觉/交互 refinement、防守双轴选段、以及 value-first 的 bounds/snap 重构。

相关实现：
- `src/components/scenario-explorer/stat-range-axis.tsx`
- `src/components/scenario-explorer/track-controls.tsx`（Tabs：预设 / 数轴选段）

## Related

- Tier 色板：[[archive/20260626_closed_define-colors-for-no-modifier-full-and-max-stat-presets|Define colors for stat presets]]；grill 见 [`docs/traces/2026-06-28-stat-tier-color-tokens-grill.md`](../../docs/traces/2026-06-28-stat-tier-color-tokens-grill.md)
- 数轴 snap 档色与 `--primary` 区间高亮分开处理；区间高亮保持 `--primary`

## Decisions（grill 2026-06-28）

### 数轴结构与交互

- **单轴直接拖选**：在轨道内双柄拖动；**移除**下方独立 Slider
- **两行布局**：stat 左列对齐 + **snap tier 标签行** + **轨/端点行**（端点柄下小字实数值）
- 无常驻 min/max stepper；**短按端点**展开微调行，**拖动**端点调区间；再点同端点或轴外关闭
- 微调行：`[min − val +]` 或 `[max − val +]`；stepper **±1**，按钮微调**不 snap**
- 选段端点**不在 snap 行动态贴标签**；未命中 snap 的端点仅在柄下/微调行显示整数

### 防守 track

- Mirror 进攻：`预设 | 数轴选段` Tabs **互斥**
- Range 模式提供 **两条数轴**：**HP** + **物防/特防**（随招式类别）
- 双轴共同构成 **一个** Range track（row product **n = 1**）

### 伤害 envelope（防守 range）

- 与进攻同模式：`(HP_min, Def_min)` → `(HP_max, Def_max)` 对角端点外包围（合并端点 × 16 roll）

### Snap 锚点（数值优先 → 标签）

先从 reference spread 算出 stat 实数值，再挂标签；**不用** preset→range 映射表。

| 轴 | 锚点（显示标签） | 说明 |
| --- | --- | --- |
| **HP** | `0` · `32` | 两档；`32` = 252 HP 努力（性格不影响 HP） |
| **防** | `0` · `32` · `ex` | 三档；`32` = 252 防努力无性格；`ex` = 252 + 性格修正 |
| **进攻** | `0` · `32` · `ex` | 维持现有三档语义 |

显示标签 **32** 替代 **max**（避免与区间上限歧义）；内部语义仍为 252 EV 档。

### 默认选段（冷启动 / 全 span）

| 轴 | 默认区间 |
| --- | --- |
| HP | `[0, 32]` |
| 防 | `[0, ex]` |

### Preset → Range 切换

- **通用逻辑**（非映射表）：选中 preset spreads → 各自算出 `(HP, 防)` 实数值 → 各轴 `[min, max]` 外包围
- **单选 preset** → 双轴各 **collapse 为单点**（`min = max`，数轴上可见单点）
- **多选 preset** → 各轴取选中集 **外包围 band**（例：`0` + `ex` → HP `[0, 32]`，防 `[0, ex]`）
- 用户拖过 range 后，切回 preset 再切回 range 时 **保留上次 range**（mirror 进攻）

### Snap 锚点 tier 上色（推荐，随原型定稿）

| 锚点 | token |
| --- | --- |
| `0` | `--stat-tier-0` |
| HP / 防 `32` | `--stat-bulk-mid`（HP）· `--stat-offense-max`（防） |
| 防 / 进攻 `ex` | `--stat-tier-ex` |

编码：snap tick + 标签着色（不限于 tinted chip）。

### UI 定稿（原型 2026-06-28，已删除 throwaway 代码）

- **微调形式**：**展开微调行** — 点击端点 → 轴下 stepper 行；否决 Popover、柄上 Chip
- **布局**：stat 左列 + 两行数轴；防守 HP+防 双轴 `space-y-2`
- **吸收**：按上述决策重写 production `StatRangeAxis`；勿 promote 已删原型代码

## What to build

- 进攻 + 防守数轴：轨内拖选、两行数轴、点击端点展开微调行
- 防守 range：HP + 防双轴；`track-controls` 增加防守 Tabs
- Value-first bounds/snap 管线（spread → stat 值 → 标签/锚点）
- Preset → range 外包围逻辑（calc + pipeline 扩展防守 range 行）
- 与 sidebar 密度、Geist 间距对齐
- 按 UI 定稿重写 `StatRangeAxis` 并接入 sidebar

## Acceptance criteria

- [ ] 数轴选段 UI 在 desktop sidebar 内布局合理、不溢出
- [ ] 单轴轨内拖选；snap tier 行 + 轨/端点值；点击端点展开微调行；无独立 Slider、无常驻 stepper
- [ ] 防守 range：HP + 物防/特防双轴；与 preset Tabs 互斥
- [ ] 用户能清楚看到当前选中区间（含单点 collapsed）
- [ ] Preset 单选 → range 单点；多选 → 外包围 band
- [ ] 切换 preset/range 后状态反馈清晰（range 值保留）
- [ ] 移动端 stacked 布局下仍可用
- [ ] Snap 锚点 tier 色与 `--primary` 区间高亮区分清晰

## Open

- [x] UI variant 定稿 → **展开微调行**
- [ ] Snap tier 上色编码细节（若与上表推荐有偏差）
