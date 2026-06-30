# TrackOption 统一视觉 讨论记录

对应 issue: [[20260626_open_multi-select-selected-vs-unselected-state-is-hard-to-distinguish|Multi-select selected vs unselected state is hard to distinguish]]

UI 定稿：[`docs/prototypes/track-option-matrix.html`](../prototypes/track-option-matrix.html)（A + flat + 1B + 2B + 3B）

Superseded（视觉部分）：[`2026-06-29-held-item-controls-grill.md`](2026-06-29-held-item-controls-grill.md) §7 选中/未选中样式；实数值模版 interim toggle 样式

## 1. Inclusion 与 modifier 是否正交

问题：选中态（纳入对比）与选项语义（tier / kind / 道具类别）是同一视觉层还是两层？

决定：**正交两层**。inclusion 只回答「进不进对比」；modifier（tier、system/user/temporary、core/stab-boost/added-boost 等）**未选中时仍须可读**。

## 2. 既有道具 / 实数值样式是否约束本次

问题：held-item grill §7 与 stat-value interim 样式是否作为定稿继承？

决定：**不作约束**；统一逻辑优先，可推翻上述视觉定稿。

## 3. 统一逻辑落在哪一层

问题：各 track 是共享一个 primitive，还是独立组件 + 共享 helper？

决定：**方案 1** — 统一 **`TrackOption`** primitive，layout variant 区分 `text`（招式、实数值）与 `icon`（道具）；行为与 a11y 只写一遍。

## 4. 次要操作是否属于 TrackOption

问题：删除模版、持久化临时模版、⟳ 分配切换、移除 added-boost 是否算 option 单元的一部分？

决定：**算**。`TrackOption` 提供 **`actions` slot**（0–N），toggle 区与 action 按钮分离，action 不触发 `onToggle`。Action 种类：`remove`（删除模版与移除 added-boost **合并为同一概念**）、`persist`、`cycleAllocation`。招式 track 无 action。

## 5. Modifier 如何建模

问题：跨 track 通用 modifier 枚举，还是按 track 分类型？

决定：**按 track 分类型**（discriminated union / per-track props），不强行统一为跨 track 大枚举。

## 6. 选项容器

问题：保留 `ToggleGroup` + muted 托盘，还是全部改为独立 toggle + flex-wrap？

决定：**`TrackOptionGroup`** — `role="group"` + flex-wrap（sidebar ~`w-72`）；每个选项为 `button` + `aria-pressed`；**废弃 track 级 `ToggleGroup`**。

## 7. Prototype 覆盖与交付

问题：prototype 要比哪些状态；放在哪？

决定：**状态矩阵 A** — 各 track 枚举 inclusion × modifier × action 代表组合；视觉 variant 在同一格子上切换对比。**独立 HTML** 交付（非 dev 路由），定稿文件 `docs/prototypes/track-option-matrix.html`。

## 8. Inclusion 层（定稿 A）

问题：选中 / 未选中的 baseline 视觉如何表达？

决定：

| 状态 | text layout | icon layout |
|------|-------------|-------------|
| 选中 | `primary` border + ~12% primary tint bg + `font-weight: 600` + subtle ring | `primary` border + ~15% primary tint bg |
| 未选中 | 白底 + input border | 白底 + input border |

未采纳：inclusion variant B（选中/未选中对比弱）、C（temporary 选中态难辨）。

## 9. 容器（flat）

问题：选项是否放在 muted 托盘（`bg-muted/30`）内？

决定：**flat** — 选项直接落在 sidebar 表面，无 ToggleGroup 式托盘。

## 10. Tier modifier · 未选中（定稿 1B）

问题：系统档 tier 在未选中时如何保留可读性？

决定：**白底 + 默认 border**；tier 身份靠 **文字色**（`--mod-fg` / `--mod-muted` on summary），**不用 tier fill**。

未采纳：1A（full tier fill）、1C（tier border only）。

## 11. Tier modifier · 选中（定稿 2B）

问题：系统档 tier 选中时 inclusion 与 tier 色如何叠加？

决定：primary tint inclusion **+** tier 文字色 **+** 浅 tier bg wash：`color-mix(mod-bg 50%, primary-tint-bg)`。

未采纳：2A（仅文字、对称未选中）、2C（tier border 主导）。

## 12. 虚线 modifier · 选中（定稿 3B）

问题：`temporary`、`stab-boost`、`added-boost` 选中时虚线边框是否改为实线？

决定：**保持 `border-dashed`**（选中与未选中均虚线）；不因 inclusion 改为 solid。

未采纳：3A（选中改 solid）、3C（primary 色虚线）。

## 13. 实现范围（defer）

问题：dark theme、hover/focus/corner-action 细节是否纳入本 issue 设计定稿？

决定：**dark theme defer**（issue AC 仅要求浅色）；hover/focus/action 露出规则在 **React 实现阶段** 按 prototype 行为验收，不另开 visual grill。
