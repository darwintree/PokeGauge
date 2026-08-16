# Implementation Trace: Swap Range handles on cross

Date: 2026-08-16
Source: `.issues/archive/20260815_closed_swap-range-handles-on-cross-without-moving-the-other-endpoint.md`
Language: 中文

## Entries

### 1. 交叉换角色改在 drag hook，不再靠事后排序

Type: CONFLICT

Context:
`2026-08-13-unify-stat-track-selected-set` 第 5 条把交叉交给 `orderedStatRange`：hook 可写 `min > max`，transition 再排序。本票指出这正是缺陷：排序后仍按旧柄身份写值，下一帧会把未拖的那一端一起拽走。

Decision:
`useDualHandleDrag` 在 pointerdown 钉住未拖端点为 anchor；每帧写出有序区间 `{min(pointer, anchor), max(pointer, anchor)}`，指针侧身份随大小切换。`orderedStatRange` 留作写入安全网。Fine-tune nudge 仍不交叉。

Reason:
「指针下的柄继续跟手、另一端留在原地」只能在手势层用固定 anchor 保证；事后排序改的是值的标签，不是正在拖的那一端。

Follow-up:
None.

### 2. Fine-tune 身份跟着换角色走

Type: decision

Context:
Fine-tune 按 `min` / `max` 记当前柄。交叉后这两个名字对调，不改的话高亮和 +/- 会落到另一端。

Decision:
hook 在身份切换时回调 `onRolesSwapped`，`StatRangeInput` 把已打开的 fineTune 对调。

Reason:
两端角色对调时，按角色寻址的 UI 必须一起换。未打开 fine-tune 则回调是空操作。

Follow-up:
None.
