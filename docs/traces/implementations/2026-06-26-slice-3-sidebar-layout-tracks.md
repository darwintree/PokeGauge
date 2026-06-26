# Implementation Trace: Slice 3 — Sidebar layout and multi-select tracks

Date: 2026-06-26
Source: `.issues/20260626_open_slice-3-sidebar-layout-and-multi-select-tracks.md`
Language: 中文

## Entries

### 1. Matchup header 为只读文本而非可点击控件

Type: unresolved-implementation-decision

Context:
Slice #3 要求参数区展示只读 matchup header（物种选择器在 slice #5）；原型 `MatchupBar` 使用 button 样式暗示可点击，与当前 slice 的只读语义冲突。

Decision:
生产 UI 使用纯文本 + 分隔符展示「烈咬陆鲨 → 咆哮虎」，不渲染 button 或 hover 态；副标题保留 Champions · VGC 双打 · Level 50。

Reason:
避免在 slice #5 之前给用户错误的可交互预期；与 issue 中「read-only matchup header」一致。

Follow-up:
Slice #5 将替换为可搜索物种选择器。

### 2. 结果区与参数区的视觉权重

Type: tradeoff

Context:
Issue 要求结果区视觉优先级高于参数面板；原型 Variant B 用 sidebar `card` + main 无包裹实现层次，但未写死具体 class。

Decision:
参数区：`rounded-xl border bg-card p-4` 置于 `lg:w-72` sticky aside；结果区：`flex-1 min-w-0` 无 card 包裹，标题与箱形图直接占主栏宽度。

Reason:
与原型 Variant B 一致，sidebar 的边框/背景弱化参数区，主栏全宽展示伤害图。

Follow-up:
None.
