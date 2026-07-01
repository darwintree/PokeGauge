# 实数值模版派生显示标签 讨论记录

对应 issue: [[20260628_open_define-derived-display-labels-for-stat-value-templates|Define derived display labels for stat-value templates]]

覆盖：[`2026-06-28-stat-value-template-grill.md`](2026-06-28-stat-value-template-grill.md) §7、§8、§12 中关于能力点数命名、默认标签、实数值显示与默认命名的旧结论。

## 1. 模版是否保存名称

问题：实数值模版持久化时是否需要默认名称，还是名称只是一种展示结果。

决定：实数值模版不保存名称；模板只保存最终实数值。UI 上看到的名称 / 标签全部由标签引擎从实数值、物种、stat 轴、当前 stat 名展示策略派生。

## 2. 能力点数英文术语

问题：卡片 shorthand 中“能力点数”的英文领域术语是否继续使用 Ability points。

决定：能力点数的英文术语改为 **SP（Stat points）**；`Ability points` 不再作为领域词。

## 3. Stat 名展示策略

问题：SP 标签中的 stat 名如何展示，是否由用户配置，以及配置作用域是什么。

决定：用户可全局配置 stat 名展示策略；这是读法偏好，用 `localStorage` 持久化，不进入 matchup、模板或计算 pipeline。默认提供三套：`HABCDS`、`HP, Atk, Def, Sp.A, Sp.D, Spd`、`HP，攻击，防御，特攻，特防，速度`。

## 4. 默认 SP 标签格式

问题：默认标签应继续使用旧 shorthand（如 `32HP`），还是统一由 SP、stat 名和修正组成。

决定：默认标签模式为 **SP + stat 名 + 修正**。进攻格式为 `{sp}{stat}{mod?}`，例如 `32A+`、`0C+`、`0S-`；防守格式为 `{hpSp}{hpStat}{defSp}{defStat}{mod?}`，例如 `32H20B+`。HP 无修正后缀；防守组合只在防御 stat 上追加 `+/-`。`32HP` 不再作为默认展示标签。

## 5. EX 标签边界

问题：旧 `ex` shorthand 是否废弃，以及极限值应如何展示。

决定：`EX` 保留，改为大写，并且由实数值派生为固定标签。进攻命中 `32{offenseStat}+` 时显示 `EX`；防守命中 `32H32{defStat}+` 时显示 `EX`。`EX` 只覆盖最大极限值；最小值按普通标签展示，例如 `0A-`。

## 6. 实数值显示模式

问题：用户如何临时查看最终实数值，以及该开关是否持久化或影响计算。

决定：用户可临时切换到实数值显示模式；该模式展示最终实数值而非 SP 标签，不持久化，不改变模板或计算 pipeline。实数值显示模式同时覆盖 track 预设区与结果区；track 预设区每个 track 一个临时开关，结果区一个临时开关作用于整个结果区的所有 scenario 行，三者互不联动。

## 7. 多分配与分配切换

问题：同一最终实数值存在多个合法 SP 分配时，默认展示和分配切换是否沿用旧语义。

决定：多分配规则沿用既有语义：默认优先无修正；命中 `EX` 时显示 `EX`；分配切换只改标签，不影响模板、row product 或伤害。切换到实数值显示模式时，分配切换可以隐藏，因为最终实数值相同。

## 8. SP 标签 tooltip

问题：SP 标签是否需要在 hover 时补充隐藏信息。

决定：SP 标签 hover tooltip 展示最终实数值与该实数值的所有可达分配策略。