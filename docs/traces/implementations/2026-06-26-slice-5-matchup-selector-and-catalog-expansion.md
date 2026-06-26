# Implementation Trace: Slice 5 — Matchup selector and catalog expansion

Date: 2026-06-26
Source: `.issues/20260626_open_slice-5-matchup-selector-and-catalog-expansion.md`
Language: 中文

## Entries

### 1. Move category 路由策略

Type: unresolved-implementation-decision

Context:
Issue 允许「按招式类别切换 offense/bulk stat track」或「v1 仅支持物攻攻击者并在代码中注明限制」。混合物特招式的攻击者会使 track 语义模糊。

Decision:
采用 **matchup 级 category-aware catalog**：每个攻击者物种在注册表中声明单一 `moveCategory`（physical | special），其 move pick 全部为该类；offense stat preset、defender bulk preset、数轴 bounds、Choice 道具（头带/眼镜）均随 category 切换。v1 不服务混合类别攻击者。

Reason:
满足 acceptance「offense/defense track 使用正确 stat」且可展示 Flutter Mane（特攻）与 Garchomp（物攻）对比；比全局 physical-only 更贴近 PRD，又比 per-move stat track 简单。

Follow-up:
None.

### 2. 物种选择器 UX

Type: unresolved-implementation-decision

Context:
Issue 允许 searchable select 或等价控件；仓库仅有 shadcn button，未安装 Combobox/Command。

Decision:
自研轻量 `SpeciesSelect`：button 触发 popover，内含 filter input + 过滤列表；选项规模为小集合（≤6 物种），不引入新 shadcn 组件。

Reason:
满足「searchable select or equivalent」；避免为 3–6 项安装 Command 依赖；样式与现有 pill/button 面板一致。

Follow-up:
None.
