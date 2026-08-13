# Implementation Trace: Collapsed Stat Track mode switch

Date: 2026-08-13
Source: `.issues/20260813_working_style-collapsed-stat-track-mode-switch.md`；用户选定 well + tick，Choice 表示宽度与 track 一致
Language: zh-Hans

## Entries

### 1. Choice 全宽用离散垫点串在发丝上

Type: unresolved-implementation-decision

Context:
用户要求 Choice 的表示尽量和 track 同宽。Range 已是两端圆点加连续轴。Choice 可以是四枚方点 `justify-between`，也可以把方点串在一条发丝上占满同一 `flex-1` 槽。源只说宽度一致，没说几何。

Decision:
Choice = 四枚方点 + 三段发丝，和 Range 共用 well 底栏里「标记 `flex-1` + 右端 `选项`/`区间`」的槽。Range 仍是圆点 + 连续 2px 轴。

Reason:
同一槽宽才能对照两种模式；发丝让 Choice 也读成一条轨，而不是靠左挤在一起的装饰点。

Follow-up:
None.

### 2. 整井可点：铺满按钮在 chip 底下

Type: unresolved-implementation-decision

Context:
用户要求点浅井切模式，但点 chip 不切。井不能做成包住 chip 的真 `<button>`。Chip 列表若 `w-full`，空隙也会被列表盒子吃掉。

Decision:
浅井底层 `absolute inset-0` 按钮接切换。Chip 层 `pointer-events-none`，仅内部 `button` 恢复 `pointer-events-auto`。井底轨 `pointer-events-none`，点空隙和轨落到铺满按钮。

Reason:
只有 chip 自己接事件，tooltip 仍在；其余浅井都是模式热区。

Follow-up:
None.
