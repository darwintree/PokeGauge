# Implementation Trace: Stat Value Label chip

Date: 2026-08-13
Source: docs/spec/stat-value-display.md, docs/spec/changes/2026-08-13-stat-value-label-chip.md
Language: 中文

## Entries

### 1. 防守 Range 两端点取矩形的 min/min 与 max/max

Type: unresolved-implementation-decision

Context:
契约要求 Range 身份是两个完整 Defense Stat Value 的 Label chip，且明确不改 Range 存储、不写防守二维角点回写。当前防守 Range 仍是独立的 HP 轴与 Def 轴。spec 没有指定从 HP×Def 矩形取出哪两个角作为端点。

Decision:
展示用 `{hp.min, def.min}` 与 `{hp.max, def.max}`。两端点解析为同一 Stat Value 时显示一枚 chip。不改 `defenderRanges` 存储。

Reason:
这是不改数据模型时最保守的两点读取：沿矩形从最低完整防守值到最高完整防守值。另外两个角点（min/max 与 max/min）会暗示对角回写，超出本票 Non-Goal。

Follow-up:
None.

### 2. TrackPanel 摘要与展开按钮拆开

Type: unresolved-implementation-decision

Context:
折叠 Stat Track 摘要必须是可悬停/聚焦的 Label chip。既有 TrackPanel 把整行 header 做成一颗展开按钮。按钮内不能再放 chip 的 tooltip 触发器。spec 没有规定 header 结构。

Decision:
字符串摘要仍放在展开按钮内（其他 Track 不变）。chip 摘要放到按钮外，同一行右侧保留一颗仅作视觉的展开 chevron（`tabIndex={-1}`，`aria-hidden`）。点 chip 不展开 Track。

Reason:
最小改动让 chip 能独立聚焦并弹出 tooltip，同时保留其他 Track 的整行点击展开。

Follow-up:
None.
