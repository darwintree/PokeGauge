# Implementation Trace: Probability Mode Compare Panel

Date: 2026-08-16
Source: 用户选定原型 Variant B（Compare panel）
Language: 中文

## Entries

### 1. 对照是 disclosure，不是 tooltip

Type: decision

Context:
原型 A 是每项 hover tooltip，B 是点 `i` 展开对照，C 是常驻一句。用户选定 B。

Decision:
结果区模式开关旁放 HUD 芯片 `i`，点击展开/收起左右对照面板。默认收起。展开状态只活在当前页会话，不写入快照或 URL。

Reason:
B 的对照一次看清两种口径；点按同时覆盖键盘和触控。持久化会把「说明开着」变成设定的一部分，用户没要这个。

Follow-up:
None.

### 2. 对照卡可切换模式

Type: decision

Context:
原型 B 里点某一侧说明也会切到该模式。正式实现可以收成只读说明。

Decision:
保留点卡切换。当前侧用 `notice-bg` + 「当前」徽章，不用单独靠颜色。

Reason:
用户看到并选定的就是带切换的 B。对照开着时改口径不必先关掉再去点 ToggleGroup。

Follow-up:
None.
