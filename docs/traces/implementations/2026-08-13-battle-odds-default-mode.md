# Implementation Trace: Battle Odds as default Probability Mode

Date: 2026-08-13
Source: 用户请求（实战模式作为默认；调整与经典模式的位置关系）
Language: 中文

## Entries

### 1. 默认只改新 Track State，不迁移已保存快照

Type: decision

Context:
`probabilityMode` 存在 `defaultTrackState` 与 localStorage 快照两处。仓库默认 fail fast、不做历史兼容，除非明确要求。

Decision:
新对阵 / 无快照时 `defaultTrackState.probabilityMode = "battle-odds"`。已保存快照仍按存下的模式恢复。换 Identity 走 `trackStateAfterCatalogTransition`，本来就不保留 `probabilityMode`，会落到新默认。

Reason:
用户要的是默认选项，不是把旧会话改写成实战模式。存储校验仍要求显式合法值，不必升 version。

Follow-up:
None.

### 2. 开关顺序：实战在左、经典在右

Type: decision

Context:
结果区 ToggleGroup 原先经典在左、实战在右，和「经典是默认」一致。

Decision:
对调两项，实战模式在左。样式不变。

Reason:
LTR 下默认项放左侧，和默认值对齐。不改信息层级，只改两项相对位置。

Follow-up:
None.
