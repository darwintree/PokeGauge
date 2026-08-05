---
status: accepted
date: 2026-08-05
---

# Held Item Picker Always Holder-Eligible Spec Change

## Discussion Trace

None.

## Target Specs

- docs/spec/held-item-pick.md

## Problem

Picker 契约暴露可选的 **holder-eligible** 过滤器（默认开）。产品确认没有需要关闭该过滤的场景；可选开关增加控件噪音，且与“只展示当前持有者可用道具”的默认意图重复。

## Contract Delta

### Added

None.

### Changed

- Held item Picker **始终**按当前持有者资格过滤可见行（含合法形态触发道具的可达性）。该过滤不可关闭、不提供 UI 开关。

### Removed

- Picker 上的 **holder-eligible** 可选过滤器（及其默认开/可关语义）。

## Non-Goals

- 不改变 tag 单选语义、搜索、目录边界（侧资格池 + 合法形态道具）、或形态道具 confirm-to-switch 流程。
- 不改变 `isHolderEligibleHeldItem` / holder gate 的资格判定规则本身。
- 不改变 Track 展示或默认池选择。

## Compatibility

Fail fast. No historical compatibility for a toggleable holder-eligible filter.

## Acceptance Criteria

- 最终 spec 的 Picker 段不再描述 holder-eligible 可选过滤器。
- 最终 spec 要求 Picker 可见列表始终受当前持有者资格约束。
- Tag、搜索、目录边界与形态切换契约保持不变。

## Resolution

Accepted. The final contract is reflected in `docs/spec/held-item-pick.md`.
