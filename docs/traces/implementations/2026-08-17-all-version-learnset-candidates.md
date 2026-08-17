# Implementation Trace: 全版本 Learnset 招式候选

Date: 2026-08-17
Source: 用户请求「按照所有 version group 的历史并集实现」
Language: 中文

## Entries

### 1. 候选列表与模板注册表分离

Type: unresolved-implementation-decision

Context:
用户明确要求招式列表只展示 Learnset 内招式，但没有要求让旧书签、分享和持久化状态中的历史组合失效。现有 `catalog.moves` 同时承担 Picker 候选与 Move Template 恢复查询。

Decision:
保留完整 `catalog.moves` 作为模板注册表，新增按 Battle Pokémon Identity 过滤的 `moveCandidates`，仅供 Move Picker 使用。

用户随后明确确认 Learnset 只是默认应用的显示筛选，不是合法性集合。

Reason:
这精确落实展示范围，同时避免无请求依据地扩大为合法性迁移并使已有状态无法载入。

Follow-up:
None.
