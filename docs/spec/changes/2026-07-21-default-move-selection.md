---
status: accepted
date: 2026-07-21
---

# Default Move Selection Spec Change

## Discussion Trace

None.

## Target Specs

- `docs/spec/move-pick.md`

## Problem

Selecting the first six Champions damaging moves omits relevant matchup options and does not use the current defender's type matchup.

## Contract Delta

### Added

- Every snapshot-capable damaging move among the attacker's top 10 Champions usage rows for the active Move side enters the initial Move track.
- A default Move snapshot is selected when its Champions usage percentage is strictly greater than 50%, its type is super effective against the current defender, or both.

### Changed

- The initial Move track is no longer capped at six Champions moves.
- Champions usage rank determines the top-10 boundary and Move track order, not default selection by itself.

### Removed

- The top-six default Move pick rule.

## Non-Goals

- Do not add moves outside the attacker's top 10 Champions usage rows to the initial Move track.
- Do not validate the global search pool against a Pokemon learnset.
- Do not display Champions usage percentages in the Move UI.

## Compatibility

Existing user interaction rules remain unchanged. Manual Move changes prevent a late Champions response from replacing the user-maintained Move track.

## Acceptance Criteria

- The initial Move track contains every eligible damaging move among the top 10 Champions usage rows for the active Move side in deterministic usage order.
- The initially selected set is the union of moves above 50% usage and moves with type effectiveness greater than 1 against the current defender.
- All other initial Move snapshots remain available but unselected.
- Missing or unavailable Champions data produces no initial Move snapshots.

## Resolution

Accepted. The final contract is reflected in `docs/spec/move-pick.md`.
