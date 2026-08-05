---
status: accepted
date: 2026-08-05
---

# Held Item Default `none` Spec Change

## Discussion Trace

None. Confirmed during acceptance of held-item pick against `docs/spec/held-item-pick.md`.

## Target Specs

- docs/spec/held-item-pick.md

## Problem

最终 spec 只写了「`none` 不进入使用率默认选中」与「空选中回落 `["none"]`」，未规定未锁定 Identity 的初始池与默认选中是否常驻 `none`。验收要求：默认池包含 `none`，且 `none` 与使用率普通道具一并默认选中，以便对照「不带道具」。

## Contract Delta

### Added

None.

### Changed

- 未锁定 Identity：初始候选池始终包含 `none`（置于使用率来源项之前）；默认选中集合始终包含 `none`，并与边界内全部默认选中的非形态普通道具共存。
- `none` 与真实普通道具可同时多选；选中真实道具不再隐含取消 `none`。
- 空选中仍强制回落为 `["none"]`（必要时把 `none` 补回池中展示）。
- 锁定形态 Identity 仍只暴露锁定项；Picker 仍不提供 `none`。

### Removed

- 「`none` never enters usage-driven default selection」中与上条冲突的部分：`none` 虽不由 Champions 使用率行产生，但作为地板项进入初始池与默认选中。

## Non-Goals

- 不改变 top-10 边界、形态道具导航、Picker 目录/筛选、或 untouched 重算策略。
- 不改变锁定 Identity 规则。

## Compatibility

Fail fast. Saved Matchups keep restored held-item state; only untouched Identity initialization and new defaults follow this contract.

## Acceptance Criteria

- 未锁定 Identity 在有使用率普通道具时：池含 `none` + 那些道具（及合法形态道具若进池）；默认选中含 `none` 与全部默认普通道具。
- 使用率不可用或无可选普通道具时：池至少含 `none`（及合法形态道具若进池）；默认选中为 `["none"]`。
- Track 上可同时选中 `none` 与真实道具；清空全部选中后回落 `["none"]`。
- 锁定 Identity 仍仅锁定项。

## Resolution

Accepted. The final contract is reflected in `docs/spec/held-item-pick.md`.
