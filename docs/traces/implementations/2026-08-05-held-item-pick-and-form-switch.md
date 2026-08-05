# Implementation Trace: Held Item Pick and Form Switch

Date: 2026-08-05
Source: docs/spec/held-item-pick.md
Language: 中文

## Entries

### 1. Champions held_item category key

Type: unresolved-implementation-decision

Context:
Spec 写的是 Champions item usage，未写死 API `category` 字段名。线上 battle rows 使用 `held_item`（不是 `item`）。

Decision:
`listChampionsItemUsageRecords` 过滤 `category === "held_item"`。

Reason:
与 Champions battle API 实测一致；沿用 move/ability 的同端 battle-rows 缓存。

Follow-up:
None.

### 2. Top-10 边界内保留不可映射行

Type: interpretation

Context:
Spec 要求 nothing / 不可映射 / 无资格行 skip 且不 backfill。若在 fetch 时丢弃未映射行再 slice(0,10)，会让边界外行补进前 10，违反 no-backfill。

Decision:
`ChampionsItemUsageRecord.itemId` 可为 `null`（nothing 与未映射）；排序去重后先取前 10，再在 `resolveDefaultHeldItemPick` 内 skip。

Reason:
边界占位与 Move 实现（先丢未映射再 slice）不同，但符合本 spec 的 no-backfill 字面要求。

Follow-up:
None.

### 3. 「合法转换」= 同 species 且目标可选

Type: unresolved-implementation-decision

Context:
Spec 要求目标可选且「从当前 Identity 合法可达」，未定义合法可达判定。

Decision:
`isLegalFormTriggerTransition`：目标在 selectable 集合内、目标 ≠ 当前、且当前与目标的 `speciesId` 相同。

Reason:
覆盖 base→Mega 与 Ogerpon base→Mask；锁定 Identity 不走形态导航，不会出现 Mask→Mask。

Follow-up:
若后续要禁止「已是同种其他非锁定形态」互切，再收紧规则。

### 4. Mega Rayquaza item preserve vs Identity re-init

Type: CONFLICT

Context:
新 spec 要求 Identity 变更（含形态确认）重走 Held item 默认；既有 `attackerPreservesItem`（Mega Rayquaza）在 catalog transition 时保留道具选择。

Decision:
保留既有 Rayquaza preserve 路径（含 pool ids），不在本实现拆除。

Reason:
该例外来自已合入的 Rayquaza 专项行为；表单触发几乎不会从 Rayquaza 出发。与新 spec 的张力记入此处，避免无请求地扩大 Rayquaza 行为变更。

Follow-up:
若产品要严格「一切 Identity 变更都重算道具」，另开 issue 删除 preserve。
