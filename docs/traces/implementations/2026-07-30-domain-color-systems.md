# Implementation Trace: 领域颜色系统

Date: 2026-07-30
Source: [[../../../.issues/archive/20260626_closed_audit-and-align-domain-color-systems|Audit and align domain color systems]]
Language: 中文

## Entries

### 1. 前景配对与校准值的归属

Type: unresolved-implementation-decision

Context:
Issue 要求属性颜色只有一个权威来源、前景色采用明确配对，并要求重新校准能力值层级颜色，但没有规定前景配对的数据结构或具体替换色值。

Decision:
每种属性的背景与前景都由 `src/index.css` 的同名 CSS token 持有，TypeScript 只拼接 token 名。能力值层级保留主文字与辅助文字两个角色，在不改变原有灰、蓝、紫色相的前提下加深到 WCAG AA。校验直接读取 CSS token，避免在测试中再维护一份色值。

Reason:
这消除了 CSS 与 TypeScript 的 hex 重复和运行时亮度猜测，同时保留现有领域语义及辅助信息层级。

Follow-up:
None.
