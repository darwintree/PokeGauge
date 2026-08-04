# Move Pick Spec

## Scope

This contract defines how Champions move usage initializes the Move track for an attacker, defender, and active Move side.

## Contract

Champions usage is resolved per Battle Pokémon Identity against the Champions index default season. Each usage row records its Champions season, source path, and upstream data version.

A Mega Battle Pokémon Identity inherits the usage rows of its base Pokémon species. A Mega identity whose species has no upstream Champions entry has no usage rows. Inherited rows follow the same ordering, pool boundary, and selection rules as native rows.

Champions usage rows are ordered by rank, usage percentage descending, Champions move name, and numeric Move id. Duplicate Move ids are removed while preserving that order.

The first 10 ordered Champions usage rows define the initial pool boundary. Within that boundary, every row whose Move is snapshot-capable and belongs to the active Move side creates one initial Move snapshot. Rows after the first 10 do not enter the initial Move track and do not backfill an ineligible row within the boundary.

An initial Move snapshot is selected when either condition holds:

- its Champions usage percentage is strictly greater than 50%;
- its resolved Move type has effectiveness greater than 1 against the current defender's combined types.

The selected set is the union of both conditions. Remaining initial snapshots are retained as unselected alternatives. Only selected snapshots participate in scenario generation.

## State Rules

- Champions usage rank determines the initial snapshot order.
- A late Champions response may initialize an untouched Move track but must not replace a user-maintained Move track.
- Changing attacker or Move side rebuilds the Move track from the applicable Champions usage data.
- Changing only the defender preserves snapshots and user edits. An untouched Move track may update its default selection for the new defender.
- A manually added Move snapshot is selected immediately.
- Deselecting a snapshot retains it in the Move track.

## Error Rules

Missing, empty, failed, or timed-out Champions usage data produces no initial Move snapshots. The global Move search remains available.

A Mega identity without an upstream base species entry is missing usage data and produces no initial Move snapshots.

## Acceptance Criteria

- Only eligible damaging moves within the first 10 Champions usage rows enter the initial Move track.
- A move at exactly 50% usage is selected only when it is super effective.
- Super effectiveness uses the same type chart and combined-defender-type calculation as damage compilation.
- Default selection never introduces a Move absent from the initial Champions Move snapshots.
- A Mega Battle Pokémon Identity with an upstream base species entry exposes the same usage rows as that species; without one, it produces no usage rows.
