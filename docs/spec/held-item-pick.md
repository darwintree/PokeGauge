# Held Item Pick Spec

## Scope

This contract defines how Champions item usage initializes each side's Held item Track, how the Held item Picker adds eligible items, and when a held item may switch the side's Battle Pokémon Identity.

## Concepts

- **Form-trigger item**: a held item listed in the explicit item→Identity map whose target Battle Pokémon Identity is selectable and legally reachable from the current Identity.
- **Side eligibility**: membership in that side's frozen held-item pool for ordinary items. Form-trigger items may appear without side-pool membership when the form-trigger rules hold.
- **Untouched Held item Track**: a track whose pool membership and selection have not been edited by the user since the last Identity-driven initialization.

## Contract

### Usage source and pool boundary

Champions item usage is resolved per Battle Pokémon Identity against the Champions index default season. Each usage row records its Champions season, source path, and upstream data version.

A Mega Battle Pokémon Identity inherits the usage rows of its base Pokémon species. A Mega identity whose species has no upstream Champions entry has no usage rows. Inherited rows follow the same ordering, pool boundary, and selection rules as native rows.

Champions usage rows are ordered by rank, usage percentage descending, Champions item name, and numeric item id. Duplicate item ids are removed while preserving that order.

The first 10 ordered Champions usage rows define the initial high-usage boundary. Within that boundary:

- `nothing` rows are skipped and do not enter the pool or default selection.
- Rows that cannot be mapped to a known held-item identity are skipped.
- Ordinary items that lack side eligibility are skipped.
- Form-trigger items enter the pool only when the target Identity is selectable and the transition from the current Identity is legal.
- Skipped rows do not backfill later rows into the boundary.

Rows after the first 10 do not enter the initial Held item Track.

### Default selection

On an unlocked Identity, the initial pool always includes `none` ahead of usage-sourced items. Every non-form-trigger item that entered the initial pool from the high-usage boundary is selected by default, and `none` is selected with them.

`none` is not produced by Champions usage rows; it is a floor entry in the initial pool and default selection. When usage is missing, empty, failed, or timed out, or when no ordinary usage-sourced items enter the pool, selection is `["none"]` and the pool still includes `none` (plus any legal form-trigger items that entered). An Identity that locks a form item is unchanged: it exposes only the locked item.

Only selected held-item ids participate in scenario generation.

### Form-trigger items

An explicit item→Identity map defines form-trigger items. The initial map includes Mega Stones to their Mega identities and Ogerpon Masks to their masked identities. Additional entries may be added only when the target Identity is selectable.

On an unlocked Identity, a legal form-trigger item may appear in the Held item Track and Picker even when it is outside the attacker or defender frozen pool. Form-trigger items are never usage-selected by default.

Activating a form-trigger item is navigation, not multi-select: the UI confirms the target Identity; on confirm, the side performs the same catalog transition as re-selecting that Battle Pokémon Identity in the Pokémon picker; the item is not added to the current Identity's selected ids. Cancel leaves state unchanged. There is no "equip without switching" path.

After the transition, the target Identity exposes its locked held item when the lock rules apply. Leaving a locked form Identity is possible only through the Pokémon Selector. Removing or deselecting a locked item to revert Identity is not offered.

Illegal or non-selectable form targets never enter the pool and never trigger a switch.

### Locked Identities

An Identity that locks a Mega Stone, unknown Mega Stone, or Ogerpon Mask exposes only that locked item. It does not build a usage-driven pool or form-trigger navigation on that side.

### Track presentation and selection

Each side's Held item Track follows the Move Track information architecture: a collapsed summary of selected items, and an expanded pool with multi-select plus an add affordance. Effect-family partitions are not required.

`none` and ordinary items may be selected together. Deselecting every selected id coerces selection to `["none"]`, adding `none` to the displayed pool if absent. Existing partial-support warnings remain on applicable selected items.

Form-trigger items in the pool present as unselected switch affordances, not as selected chips.

### Picker

The Held item Picker lists that side's frozen-eligible items, plus form-trigger items that are legal for the current Identity. It does not offer a full Mega Stone catalog and does not offer `none`.

The Picker provides localized name search; an optional single-select tag among **exclusive**, **power**, **stat**, and **berry**; and a **holder-eligible** filter that defaults to on. With no tag selected, tag filtering is inactive. Selecting another tag replaces the previous one; selecting the active tag again clears it. Critical-hit, accuracy, and Utility Umbrella items have no tags and appear when tag filtering is inactive or when name search matches.

Tag membership:

- **exclusive**: form-trigger map membership, or holder-species / holder-identity / eviolite-eligible gates.
- **power**: `base-power`, or outgoing `final-damage`.
- **stat**: `battle-stat`.
- **berry**: resistance berries (`persistent-berry` / resistance-berry set).

Picker list order follows that side's frozen inventory order; filters only hide rows.

Selecting an ordinary item adds it to the track pool if absent and selects it immediately. Activating a form-trigger item in the Picker uses the same confirm-and-switch navigation as the track.

### Default refresh

A late Champions response may initialize an untouched Held item Track but must not replace a user-maintained track.

Changing the side's Battle Pokémon Identity, including a confirmed form-trigger switch, re-initializes that side's Held item Track from the applicable rules for the new Identity.

Restoring a saved Matchup restores saved held-item state and is not overwritten by usage defaults.

## State Rules

- Usage rank determines initial pool order among usage-sourced items.
- Manually added ordinary items are selected immediately.
- Deselecting an ordinary item retains it in the track pool. Deselecting every selected id coerces selection to `["none"]`.
- Attacker and defender sides use the same contract, each against their own Identity and side eligibility.

## Error Rules

Missing, empty, failed, or timed-out Champions item usage produces no usage-sourced pool entries and falls back as defined under default selection. The Picker remains available for side-eligible ordinary items and legal form-trigger items.

A Mega identity without an upstream base species entry is missing usage data.

No stable state may pair a Battle Pokémon Identity with a held-item selection that contradicts that Identity's lock or form-trigger rules.

## Out of Scope

- Sprite loading paths.
- Frozen-85 damage compilation, result-panel information hierarchy, and ordinary eligibility whitelist contents, except where form-trigger exposure and Identity transition are defined above.
- In-battle mid-turn forme changes, item consumption, or history.
- Smogon chaos as an item-usage source.
- Later revisions to untouched / default-recompute granularity.

## Acceptance Criteria

- Only boundary-eligible ordinary items and legal form-trigger items from the first 10 Champions usage rows enter the initial usage-sourced pool; skipped rows do not backfill.
- Default selection on an unlocked Identity includes `none` plus every non-form-trigger usage-sourced pool item; form-trigger items are never default-selected.
- Missing usage data yields the defined fallback without blocking the Picker.
- A Mega Identity with an upstream base species entry exposes the same ordered item usage rows as that species; without one, it produces no usage rows.
- Confirming a form-trigger item switches Identity via the Pokémon re-select transition; cancel leaves state unchanged; locked forms leave only via the Pokémon Selector.
- Picker single-select tags, holder-eligible default, ordering, ordinary add-and-select, and form-trigger navigation behave as specified.
- Untouched usage initialization, Identity change re-initialization, and saved Matchup restore behave as specified.
