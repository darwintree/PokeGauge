# Stat tier color tokens 讨论记录

对应 issue: [[20260626_open_define-colors-for-no-modifier-full-and-max-stat-presets|Define colors for stat presets]]

## 1. 落点范围

问题：tier 颜色应落在 Scenario Explorer 哪些 surface；哪些明确不做。

决定：本 issue 覆盖 **A**（攻击 preset pills）、**D**（结果行进攻块 + 防守块）、**E**（防守 bulk pills）。**B**（数轴 snap 刻度/标签）defer 至 [[20260626_open_stat-range-axis-ui-needs-refinement|Stat range axis UI needs refinement]]。不做：数轴选中区间高亮（保持 `--primary`）、SelectionSummary、招式/道具 track；数轴 envelope 结果行进攻侧不上单一 tier 色。

## 2. Tier 语义 — 进攻

问题：进攻 preset 分几档、各档含义与 pill 短标签如何定。

决定：三档 **0 · max · ex**。语义：0 = 无修正；max = 满努力；ex = 满努力 + 性格修正。Pill 标签即用 **0 / max / ex**（summary 本讨论未定稿）。

## 3. Tier 语义 — 防守

问题：防守 bulk 分几档、中间档如何命名；顶档是否含性格修正。

决定：三档 **0 · 32HP · ex**。0 = 无修正；**32HP** = 仅分配 HP 努力，标签用 Champions 点数规则 `(EV+4)/8`（252 HP → 32）；ex = 满 HP + 满防 + **性格修正**。Pill 顶档标签 **ex**（与进攻顶档同词）。

## 4. 色板 — 档位与色相

问题：各 tier 对应什么颜色；进攻与防守 track 是否分色相；防守是否出现深蓝。

决定：

| 档 | 进攻 | 防守 | CSS token |
| --- | --- | --- | --- |
| 0 | 灰 | 灰 | `--stat-tier-0-*`（共用） |
| 中 | 深蓝（max） | 浅蓝（32HP） | `--stat-offense-max-*` / `--stat-bulk-mid-*` |
| ex | 紫 | 紫 | `--stat-tier-ex-*`（共用） |

每档含 `fg` / `bg` / `border` / `muted`；色值对齐 Geist gray、blue-600/700、purple。**防守 track 不使用深蓝**；浅蓝仅用于 32HP。

## 5. ex 紫色 token 是否共用

问题：进攻 ex 与防守 ex 是否使用完全相同的一组 CSS 变量值。

决定：**是**，共用 `--stat-tier-ex-*`，值完全相同。

## 6. 视觉编码

问题：Production 采用 stripe / tinted chip / text hue 哪种编码；数轴 snap 是否在本 issue 一并定稿。

决定：本 issue 范围暂用 **tinted chip**（全 pill / 结果行块 tier bg + border + fg）；标注为**临时方案**，后续可改。数轴 snap 编码随数轴 issue 整体样式再定，不在本 issue 实现。

## 7. Token 分层边界

问题：stat tier 色与现有 UI / 领域 token 的关系。

决定：独立于 18 属性色、伤害可视化 token；不混入 shadcn `--primary` / `--destructive`。
