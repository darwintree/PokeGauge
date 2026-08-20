---
status: accepted
date: 2026-08-20
---

# Attacker Held Item Default Selection Cap Spec Change

## Discussion Trace

None.

## Target Specs

- docs/spec/held-item-pick.md

## Problem

未锁定 Identity 的攻击方 Held item Track 默认选中 `none` 与全部进池普通道具，选中数量随使用率合格件数增长，Scenario 笛卡尔积过大。需要把攻击方默认选中上限收紧，同时保持初始候选池不变。

## Contract Delta

### Added

- 未锁定攻击方 Identity：默认选中集合为 `none` 加上使用率顺序下最先进入初始池的至多 2 件非形态普通道具。当 `none` 可选（未锁定）且至少有 2 件此类普通道具时，默认选中恰好 3 个 value。普通道具不足 2 件时，选中 `none` 与全部已进池的普通道具。
- 进池但未进入该默认选中上限的普通道具保留在候选池中，默认不选中。

### Changed

- 默认选中规则按侧别分叉：攻击方受上述上限约束；防守方仍默认选中 `none` 与全部进池的非形态普通道具。
- 「Attacker and defender sides use the same contract」收窄为：两侧共用候选池边界、形态触发、锁定 Identity、Picker 与 untouched 重算规则；默认选中件数仅攻击方设上限。

### Removed

- 攻击方「每一个进入初始池的非形态普通道具都默认选中」在件数超过 2 时不再成立。

## Non-Goals

- 不改变 top-10 使用率边界、跳过不回填、形态道具进池但不默认选中、锁定 Identity、Picker 加选即选中、或用户可手动选中超过默认件数。
- 不改变防守方默认选中规则。
- 不把 3 设为硬上限：用户仍可从池或 Picker 追加选中。

## Compatibility

Fail fast. Saved Matchups keep restored held-item state; only untouched Identity initialization and new defaults follow this contract.

## Acceptance Criteria

- 未锁定攻击方且至少 2 件普通道具进池：默认选中为 `none` 加使用率顺序前 2 件普通道具，共 3 个 value；其余进池普通道具与形态道具保持未选中。
- 未锁定攻击方普通道具不足 2 件：默认选中为 `none` 加全部已进池普通道具。
- 攻击方初始候选池仍按既有 top-10 边界与资格规则构建，不因选中上限缩小。
- 未锁定防守方默认选中仍为 `none` 加全部进池普通道具。
- 锁定 Identity 仍仅暴露锁定项。
- 用户手动加选普通道具仍立即选中，不受默认上限限制。

## Resolution

Accepted. The final contract is reflected in `docs/spec/held-item-pick.md`.
