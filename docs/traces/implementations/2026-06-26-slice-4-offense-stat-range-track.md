# Implementation Trace: Slice 4 — Offense stat range track

Date: 2026-06-26
Source: `.issues/20260626_open_slice-4-offense-stat-range-track.md`
Language: 中文

## Entries

### 1. 数轴滑块吸附 snap points 的交互粒度

Type: unresolved-implementation-decision

Context:
Issue 要求滑块吸附三个锚点（无修正无努力、无修正满努力、+修正满努力），但未说明是离散档位还是连续区间上的吸附。原型 `StatRangeAxis` 使用连续 range input，仅以刻度线标注锚点。

Decision:
保留连续双滑块区间选择；当手柄值与任一 snap point 相差 ≤2 实数值时，自动吸附到该锚点。区间默认 `[无修正满努力, 物种物攻上限]`，与原型 `defaultStatRange` 一致。

Reason:
满足「快速命中社区基准」与「探索连续 band」两个 user story；纯离散三档会丧失 range track 的语义。

Follow-up:
None.

### 2. Range 行 attackerStatId 占位符

Type: unresolved-implementation-decision

Context:
Range 模式不产生 preset stat id，但 `ScenarioRow` 需携带 `attackerStatId` 以维持排序键与 catalog 查找回退。原型使用 `RANGE_STAT_ID = "__range__"`。

Decision:
生产 pipeline 沿用 `__range__` 占位 id，并在 `statRange` 字段存 `{ min, max }`；UI 层用区间数值渲染行标签，不写入 catalog。

Reason:
与原型 row-product 与排序约定一致，避免为 range 模式扩展 catalog 假选项。

Follow-up:
None.
