# Implementation Trace: 反馈自动附带场景链接

Date: 2026-08-20
Source: 用户请求“让反馈能让 issue 中自动填入当前页面的分享链接”
Language: 中文

## Entries

### 1. 分享链接生成失败时保留反馈入口

Type: unresolved-implementation-decision

Context:
请求未规定当前场景无法编码为可移植分享链接时如何处理。

Decision:
分享链接生成失败时打开普通 GitHub Issue 页面，不预填场景链接。

Reason:
反馈入口不应因场景过长或无效而失效。

Follow-up:
None.
