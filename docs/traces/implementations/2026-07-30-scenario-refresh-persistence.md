# Implementation Trace: Scenario Explorer 刷新恢复

Date: 2026-07-30
Source: [[../../../.issues/archive/20260730_closed_persist-scenario-explorer-state-across-refresh|Persist Scenario Explorer state across refresh]]
Language: 中文

## Entries

### 1. 合并连续交互写入

Type: unresolved-implementation-decision

Context:
已确认自动保存，并要求避开数值轴拖拽的同步存储热路径，但未指定合并窗口与刷新时的最终写入方式。数值轴会在连续 `pointermove` 中多次更新 TrackState，而 `localStorage.setItem` 是同步 API。

Decision:
运行时状态立即更新；持久化使用集中式短延迟合并，并在 `pagehide` 时同步写入最新待保存快照。

Reason:
一次拖拽通常只产生一次存储写入，同时刷新或关闭页面不会遗漏合并窗口内的最后一次有效状态。

Follow-up:
None.
