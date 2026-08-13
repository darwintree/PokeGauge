---
status: accepted
date: 2026-08-13
---

# Stat Value Label Chip Spec Change

## Discussion Trace

- docs/traces/discussion/2026-08-13-stat-value-label-chip.md

## Target Specs

- docs/spec/stat-value-display.md
- design.md

## Problem

产品没有一份契约规定 Stat Value 的默认身份如何展示。结果行身份卡与折叠 Stat Track 用纯文本或实数值区间；Choice 选项已用 Stat Value Label chip。Range 被写成一段实数值区间，与 Choice 的 Label chip 不是同一套标记。Stat Track 的模式对位在文案里常被写成 Preset ↔ Range，与 Choice Track / Range Track 的领域语言不一致。

既有 Stat Value Label chip 已在 Choice 选项上使用，但颜色曾按系统档 0/中/ex 与用户中性来分，未被收成最终展示契约，也未被写进 HUD 视觉规范。较早讨论曾把 tinted chip 标为临时方案。

## Contract Delta

### Added

- 新增 `docs/spec/stat-value-display.md`：Stat Value 的默认身份是其 Stat Value Label chip。Label 由既有规则从 Stat Value 映射，适用于任意 Stat Value，不只是 Stat Preset。
- Stat Track 的两种取值方式是 Choice 与 Range。Stat Preset 是 Choice 中可复用的 Stat Value，不是与 Range 对位的模式名。Range 展开后展示的是对应 Choice，不改变 Track 的 Range 模式。
- Stat Range 的身份是两个端点各自的 Stat Value Label chip。防守端点是完整 Defense Stat Value，因此仍是两枚 chip。两端点为同一 Stat Value 时显示一枚 chip。
- 该 chip 是结果行进攻/防守身份、折叠 Stat Track 摘要、以及 Stat Track Choice 选项上 Stat Value 的默认展示。TrackOption 是同一枚 chip 的可点形态（未选 / 已选）。
- 可选的实数值附注不替换 chip，也不把 Range 的身份改回实数值区间。
- 悬停或聚焦一枚 Stat Value Label chip 时，展示该 Stat Value 的实数值、SP 分配与性格调整。性格调整取无修正 / `+` / `-`，不展示性格名。Range 的两枚端点 chip 各自展示对应端点的这三项。
- Label 色按该 Stat Value **相对 0 修正的加值**分四档，不按系统/用户来源分色。加值用实数值：当前 Stat Value 减去该宝可梦 0 修正 Stat Value（0 SP、无修正）。防守加值是 HP 加值与防御加值之和。现有 EX Allocation（进攻 32 SP 且 `+`；防守 32 HP SP + 32 防御 SP 且 `+`）为紫 `#9800ec`。其余：加值 ≤ 4（含负）为灰 `#4d4d4d`，加值 ≥ 32 为钴蓝 `#1d4ed8`，其余为青绿 `#0a5c50`。性格不单独决定档位；`32A-` 是否为灰取决于其实数加值。编码为填色（底、边、字同色相）。临时只叠加虚线边框。
- `design.md`：Stat Value Label chip 是领域数据墨水（compact pill）。颜色按该 Stat Value 相对 0 修正的实数加值分四档，不按系统/用户/临时来源分色。现有 EX Allocation 为紫 `#9800ec` / `#faf0ff`。加值 ≤ 4（含负）为灰 `#4d4d4d` / `#f2f2f2`；加值 5-31 为青绿 `#0a5c50` / `#c8e8e1`；加值 ≥ 32 且非 EX 为钴蓝 `#1d4ed8` / `#c9d9ff`。编码为填色（底、边、字同色相）。临时仅叠加虚线边框。结果行上的 chip 是数据标记，不用 Choice 选中黄。Range 身份是两端点 chip，不是单枚区间块，也不给 envelope 行上单一档位色。Hover 边框变为 ink；明细用 tooltip，且同样可通过键盘聚焦获得。

### Changed

- 结果行身份与 Stat Track 摘要不再用纯文本或实数值区间作为 Stat Value / Stat Range 的身份。
- Stat Track 产品语言的模式对位改为 Choice ↔ Range，不再把 Preset 当作 Range 的对位模式。

### Removed

- 实数值区间文案（如 `152-204`、`HP a–b · Def c–d`）作为 Stat Range 在结果行身份、折叠摘要、以及其他本契约覆盖表面上的身份。

## Non-Goals

- 母行可展开入口的展开/收起示能。
- 折叠 Stat Track 模式切换控件。
- Range 端点身份、Scenario Merge、防守二维角点回写。
- 数轴滑杆刻度与选中区间高亮。
- Stat Allocation 内部表示、无对应 Allocation 时的 Label 缺省规则。
- 结果面信息层级的增删或重排；本 change 只改身份槽里的标记编码。

## Compatibility

Fail fast。展示与模式对位以本 change 及目标 spec 为准。不保留实数值区间身份的历史展示。

## Acceptance Criteria

- 任意作为身份展示的 Stat Value 使用 Stat Value Label chip，而不是实数值或无名纯文本作为默认脸。
- Choice 选项、结果行身份、折叠 Stat Track 摘要共用同一套 chip 语言；TrackOption 仅为可点态。
- Stat Range 显示为两端点 Label chip；表面上不出现实数值区间身份。
- 打开「显示实数值」后，chip 主内容仍是 Label；实数只作附注。
- 悬停或聚焦 chip 可见该 Stat Value 的实数值、SP 分配、性格调整；Range 两端点各自一份。
- `design.md` 将 Stat Value Label chip 规定为领域数据墨水，并写明按相对 0 修正的实数加值分四档（灰 / 青绿 / 钴蓝 / 紫）、填色编码、临时虚线、以及结果行非选中黄约束。
- Stat Track 模式对位在契约中是 Choice 与 Range。

## Resolution

Accepted. The final contract is reflected in `docs/spec/stat-value-display.md` and `design.md`.
