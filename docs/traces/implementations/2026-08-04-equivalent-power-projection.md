# Implementation Trace: 等效威力投影与统一命中语义

Date: 2026-08-04
Source: `.issues/20260803_open_unify-displayed-power-and-accuracy-with-compiled-kernel-semantics.md`
Language: zh-Hans

## Entries

### 1. tooltip 明细改为纯 phase 行，去掉“来源名称 · modifier”行

Type: unresolved-implementation-decision

Context:
讨论决定“tooltip 按 phase 展示明细”，但未说明是否保留旧 tooltip 中逐来源（道具／天气／场地名称 + modifier）的展示。投影函数只从 kernel branch 派生 phase，来源→modifier 的映射已随扁平 `modifiers` map 删除。

Decision:
tooltip 渲染 `basePower` 与每个 phase 的修正行（含中性 ×1.00）；会心分支存在时额外显示 ×1.5 行，最终行显示 `普通 ?? 会心` 或 `普通 / 会心`。来源名称仍由卡片内的 provenance token 展示，不再在公式明细里与 modifier 一一对应。

Reason:
React 不再重建来源→修正映射，符合“只渲染编译后的 presentation projection”的验收条件；来源语义由 provenance token 保留，信息层级不变。

Follow-up: None.
