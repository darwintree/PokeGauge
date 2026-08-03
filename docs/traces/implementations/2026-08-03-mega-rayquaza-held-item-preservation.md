# Implementation Trace: Mega 烈空坐道具保留

Date: 2026-08-03
Source: `.issues/archive/20260731_closed_implement-frozen-85-item-held-item-effects.md`
Language: 中文

## Entries

### 1. 上一身份的锁定道具不保留

Type: interpretation

Context:
来源要求切换 identity 时重建默认配置，同时保留 Mega 烈空坐的当前道具；但未说明当前道具是上一 identity 专属、且不在 Mega 烈空坐静态候选池中时如何处理。

Decision:
仅当原选择全部存在于目标候选池时应用 Mega 烈空坐保留例外；否则执行普通 identity reset。

Reason:
这样保留生命宝珠等普通选择，同时不会产生无法由目标 Track 表示或恢复的面具、Mega 石状态。

Follow-up:
None.
