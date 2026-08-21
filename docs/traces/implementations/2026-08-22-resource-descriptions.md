# Implementation Trace: 道具与特性说明

Date: 2026-08-22
Source: 用户确认的“为道具与特性增加说明”实现计划
Language: 中文

## Entries

### 1. 支持 flavor text 中的多行 CSV 字段

Type: unresolved-implementation-decision

Context:
现有资源生成器按物理行解析 CSV，只读取名称等单行字段。新接入的官方 flavor text 包含带引号的真实换行，沿用旧解析方式会产生伪记录并导致生成失败；计划没有规定如何处理这一既有解析限制。

Decision:
在生成器现有 CSV 入口中补齐 RFC 风格的引号、转义引号和多行字段解析，并继续让所有资源表共用该入口。不添加 CSV 依赖，也不为 flavor text 建立第二套预处理路径。

Reason:
修复共享根因是最小且可复现的方案，同时保持原有表格读取行为并避免新增依赖。

Follow-up:
None.
