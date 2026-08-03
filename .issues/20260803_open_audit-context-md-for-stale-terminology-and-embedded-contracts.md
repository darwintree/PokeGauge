---
# This section is managed by the CLI. Do not edit manually.
id: "4aa84ab3-29a8-4528-94ae-2068cb7f9955"
title: "Audit CONTEXT.md for stale terminology and embedded contracts"
status: "open"
priority: "medium"
labels: ["TECH-DEBT"]
created_at: "2026-08-03T03:37:00Z"
updated_at: "2026-08-03T03:37:00Z"
---
## Goal

审计 `CONTEXT.md`，确保它只维护当前领域的 ubiquitous language：移除或修正过时术语，并把混入其中的产品行为、验收规则和实现约束迁回对应 spec、ADR 或设计文档。

## Evidence

- Held-item glossary 已定义 frozen-85 的静态攻守分池，但 `Type boost item` 和 `Added type boost` 仍描述旧的“本系至多两项 + 按 `+` 添加”模型，两个定义互相冲突。
- [[archive/20260731_closed_implement-frozen-85-item-held-item-effects|Implement frozen 85-item Held-item effects]] 已成为该范围的 authoritative contract；`CONTEXT.md` 不应重复保存易漂移的 UI、持久化、数值矩阵或验收细节。

## Scope

- 逐项核对 `CONTEXT.md` 中的术语是否仍被当前产品语言、spec、ADR 或代码使用。
- 删除、合并或重写已经退役、重名、含义冲突的术语。
- 逐句识别混入 glossary 的行为契约、UI 流程、持久化规则、数值常量、验收条件和实现细节。
- 将仍有效的契约迁移到其 authoritative 文档；必要时在 glossary 中保留简短链接，但不得丢失契约。
- 保持每个术语为紧凑的领域定义，并继续明确推荐词与 `_Avoid_` 用词。

## Acceptance criteria

- [ ] `CONTEXT.md` 中不存在已退役或与当前 authoritative 文档冲突的术语。
- [ ] 每个保留条目定义领域概念，而不是规定 UI、算法、存储、测试或交付验收。
- [ ] 从 `CONTEXT.md` 移出的有效契约均有明确的新归属，且没有静默删除产品要求。
- [ ] Held-item 相关术语与 frozen-85 静态池模型一致，不再把旧的 Added type boost 当作当前产品概念。
- [ ] 相关 spec、ADR、设计文档与 glossary 之间没有重复且互相矛盾的 normative text。
- [ ] 文档链接和 wiki references 均有效。

## Out of scope

- 改变现有产品行为或运行时代码。
- 借审计之名重写所有 spec、ADR 或设计文档。
- 把一般编程术语加入领域 glossary。
