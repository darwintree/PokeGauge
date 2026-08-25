# Implementation Trace: Track 说明交互

Date: 2026-08-25
Source: 用户请求“按照 A 来做。‘显示说明’按钮需要放到各个 track 内部。”
Language: 中文

## Entries

### 1. “各个 Track”的覆盖范围

Type: interpretation

Context:
请求明确点名道具、特性和天气，并以“等 Track”表示还有同类范围，但没有逐项列出。

Decision:
为道具、特性、天气、场地和墙这五类已有离散选项且具备可解释效果的 Track 提供各自独立的“显示说明”开关。不扩展到招式、能力值和能力阶级 Track。

Reason:
前五类都能把一个离散选项稳定映射到一段效果说明；后三类包含编辑器、数值模式或无需逐项解释的短刻度，套用同一行式说明会改变其既有交互结构。

Follow-up:
None.
