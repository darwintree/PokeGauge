# Stat Value Label chip 讨论记录

对应 spec change: [`docs/spec/changes/2026-08-13-stat-value-label-chip.md`](../../spec/changes/2026-08-13-stat-value-label-chip.md)

## 1. 契约落点

问题：统一能力值展示是写进功能 spec、只改 `design.md`，还是两者一起改。

决定：新建 `docs/spec/stat-value-display.md` 规定何时何处用什么标识 Stat Value；`design.md` 把 Stat Value Label chip 收成 HUD 数据墨水规范。

## 2. Label 的对象

问题：Label 与 chip 是否只属于 Stat Preset。

决定：Stat Value Label 由 Stat Value 按既有规则映射，对象是任意 Stat Value，不只是 Preset。Range 端点是 Stat Value，因此也走同一套 Label。

## 3. Range 与 Choice、Preset 的对位

问题：Range 的对位是 Preset 还是 Choice。

决定：Stat Track 的两种取值方式是 Choice 与 Range。Stat Preset 是 Choice 里可复用的 Stat Value，不是与 Range 对位的模式名。Range 展开后看到的是 Choice，不是 Preset 模式。

## 4. Range 如何用 chip 标识

问题：Range 是一枚区间 chip，还是别的结构；实数值区间文案是否保留。

决定：Range 不是单枚 chip。用两个端点的 Stat Value Label chip 标识。放弃实数值区间文案（如 `152-204`、`HP a-b · Def c-d`）作为 Range 的身份。防守端点仍是完整 Defense Stat Value，因此仍是两枚 chip，不是 HP / Def 四枚。

## 5. Chip 出现的表面

问题：默认展示覆盖哪些表面；TrackOption 是否另一套外观。

决定：结果行进攻/防守身份、折叠 Stat Track 摘要、展开后的 Choice 选项共用同一枚 Stat Value Label chip。TrackOption 是这枚 chip 的可点形态。母行展开示能与折叠模式切换不进本契约。

## 6. 实数值开关与默认脸

问题：打开「显示实数值」后，chip 的主内容是否改成实数。

决定：主内容永远是 Stat Value Label。实数值只作次要附注，不替换 chip。Range 的身份仍是两端点 Label chip，不是实数值区间。

## 7. Chip hover 明细

问题：Label chip 的默认脸不含实数值、SP 分配和性格时，如何查看这些解释信息。

决定：悬停或聚焦一枚 Stat Value Label chip 时，展示该 Stat Value 的实数值、SP 分配与性格调整。性格调整为无修正 / `+` / `-`，不展示性格名。Range 两端点各自一份明细，不合成一段实数值区间。

## 8. Chip 颜色按相对 0 修正的加值分四档

问题：颜色是继续按系统档 0/中/ex 与用户中性分，还是按投入量分。

决定：按该 Stat Value **相对 0 修正的加值**分四档，系统/用户来源不再决定色相。临时只叠加虚线。加值用实数值，不是投入 SP。

加值 = 当前 Stat Value 实数值 − 该宝可梦 0 修正实数值（0 SP、无修正）。防守加值 = HP 加值 + 防御加值。

规则（先判 EX Allocation）：

1. 现有 EX Allocation（进攻 32 SP 且 `+`；防守 32 HP SP + 32 防御 SP 且 `+`）→ 紫。
2. 加值 ≤ 4（含低于 0 修正）→ 灰。
3. 加值 ≥ 32 且非 EX → 钴蓝。
4. 其余 → 青绿。

性格不单独决定档位。`32A-` 的加值若仍高于 0 修正超过 4，就是青绿，不是灰。无 `+` 的 `32A` 加值通常不到 32，也是青绿；`32H0B` 的 HP+防御加值和通常 ≥ 32，是钴蓝。

Fill（底 + 边 + 字同色相）是这套色的编码。

## 9. 四档套色

问题：中间档插在灰和蓝之间区别不够。灰和紫固定之后，中间两档怎么选。

决定：teal-cobalt。

- 相邻档换色相。不占用 HUD 选中黄、条件绿、破坏红，也不走伤害条的橙。
- 灰 `#4d4d4d` / `#f2f2f2`：加值 ≤ 4（含负）。
- 青绿 `#0a5c50` / `#c8e8e1`：加值 5-31。
- 钴蓝 `#1d4ed8` / `#c9d9ff`：加值 ≥ 32 且非 EX。不沿用现有蓝 token。
- 紫 `#9800ec` / `#faf0ff`：EX Allocation。

## 10. 加值按实数值，不按 SP，负性格不自动变灰

问题：提案曾把分档量写成投入 SP，后又把性格 `-` 一律视为负加值，导致 `32A-` 被写成灰。

决定：≤ 4 与 ≥ 32 是实数加值阈值。加值 = 当前实数 − 0 修正实数。性格通过改变实数进入加值，不另开一票否决。EX 仍先按现有 Allocation 定义拦截。
