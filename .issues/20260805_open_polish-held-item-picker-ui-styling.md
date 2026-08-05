---
# This section is managed by the CLI. Do not edit manually.
id: "f4c20b62-30d9-46db-857a-d9ad9cf10000"
title: "Polish held-item picker UI styling"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-05T04:44:00Z"
updated_at: "2026-08-05T04:44:00Z"
---
## Goal

优化 Held item Picker 的前端视觉与交互样式，使其与 Scenario Explorer / game HUD 的整体质感对齐，而不仅是功能可用。

## Context

Held item pick 契约已落地（使用率默认池、单选 tag、holder-eligible、形态道具确认切换）。验收时发现 Picker 的样式仍偏脚手架：标签条、持有者开关、列表行、形态道具提示等需要一轮视觉打磨。

实现入口：`src/features/scenario-explorer/tracks/held-item/held-item-picker-dialog.tsx`（以及必要时共用的 `PickerDialog`）。

## Scope to decide / polish

- Tag 单选条的密度、选中态、与搜索框的间距节奏
- 「当前持有者可用」开关行的层级与对齐
- 列表行：sprite / 名称 / 形态提示的排版与 hover、focus 态
- 形态道具行与普通道具行的可区分度（不靠额外文案堆砌）
- 空结果态与整体对话框比例是否跟 Move / Pokémon picker 一致
- 移动端与桌面端的触控/点击目标

## Constraints

- 遵循 [`design.md`](../design.md) game HUD；shadcn-first，优先扩展现有 primitive
- **不改** picker 过滤语义：tag 单选、holder-eligible 默认开、目录 = 侧资格池 + 合法形态道具
- **不改** 形态道具 confirm-to-switch 流程与 result-surface 信息层级

## Related

- Spec: `docs/spec/held-item-pick.md`（Picker 段）
- [[archive/20260803_closed_decide-held-item-track-presentation-and-selection-model]]
- 同批实现：`docs/traces/implementations/2026-08-05-held-item-pick-and-form-switch.md`

## Acceptance ideas

- [ ] 在默认 Matchup 打开攻击方/防守方 Held item Picker，视觉与 Move picker 同属一套 HUD，无明显「临时控件」感
- [ ] Tag 单选、搜索、holder 开关、列表选择的交互状态清晰可读
- [ ] 形态道具行可一眼区分，且不破坏列表扫描节奏
- [ ] 经 design-taste-frontend 复查无新增 AI-slop / 与现有 HUD 冲突的样式