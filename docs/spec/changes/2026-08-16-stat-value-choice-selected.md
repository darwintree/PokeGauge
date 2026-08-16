---
status: accepted
date: 2026-08-16
---

# Stat Value Choice Selected State Spec Change

## Discussion Trace

- docs/traces/discussion/2026-08-16-stat-value-choice-selected.md

## Target Specs

- docs/spec/stat-value-display.md
- design.md

## Problem

Choice 上 Stat Value 的选中态把 inclusion 和投资档叠在同一层填色上：选中只是同色描边变填充。0 投资灰底几乎贴着纸色，未选中的高投资档反而更抢眼。契约已写明结果行不用选中黄，但未写清选中 Choice 如何同时表达 inclusion 与投资档。

## Contract Delta

### Added

- 选中 Choice TrackOption 用 `signal-yellow` 底、ink 框和 hard chip shadow 表达 inclusion。投资档不再用整面填色，而用左侧色带（档位前景色）。
- 未选中 Choice 保持纸色底，档位色走边框和文字。

### Changed

- 投资档的填色编码只约束结果行 chip 和未选中 Choice；选中 Choice 的填色是 HUD 选中黄，不是档位底。

### Removed

None.

## Non-Goals

- 结果行 chip、折叠 Stat Track 摘要、Range 轴标记的选中态
- 其它 Track（招式、道具、天气等）的选中样式
- Choice 选项的布局或信息层级（不把已选拆到单独一轨）

## Compatibility

Fail fast. 无历史兼容。

## Acceptance Criteria

- 选中 Choice 一眼是 HUD 黄，而不是档位填色。
- 选中 Choice 仍能读出投资档（左侧色带），包括 0 投资灰档。
- 未选中 Choice 仍用档位描边和字色，不用选中黄。
- 结果行 chip 仍是数据标记，不用选中黄。
- 临时 Stat Value 选中后边框仍是虚线。

## Resolution

Accepted. The final contract is reflected in `docs/spec/stat-value-display.md` and `design.md`.
