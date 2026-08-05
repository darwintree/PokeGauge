---
status: accepted
date: 2026-08-05
---

# Held Item Sprite Loading Path Spec Change

## Discussion Trace

- docs/traces/discussion/2026-08-05-held-item-sprite-loading-path.md

## Target Specs

- docs/spec/held-item-pick.md

## Problem

Held-item pick left sprite loading out of scope. Frozen items were locally vendored while Mega Stone icons were missing, and the long-term delivery contract (authority, pin, failure behavior, self-host migration) was unset.

## Contract Delta

### Added

- Phase 1 sprite delivery: Held-item UI loads item icons by runtime hotlink to the PokeAPI/sprites repository at a fixed commit, using each item's recorded repository-relative sprite source path (including generation-specific `gen8/` / `gen9/` paths where required).
- Coverage in Phase 1: frozen held-item pool items and Mega Stones that have a sprite source path. Synthetic `unknown-mega-stone` has no upstream sprite.
- Failure presentation: when no sprite URL exists or the image fails to load, Held-item UI uses one shared placeholder affordance for all such items.
- Phase 2 intent: replace Phase 1 GitHub hotlink with first-party hosting of the same pinned sprite bytes; Phase 2 is a separate delivery change.

### Changed

- Sprite loading paths move from out of scope into this contract for Held-item Track, Picker, locked Identity chips, and result provenance item icons that use the same helper.

### Removed

- Out-of-scope exclusion of sprite loading paths.
- Phase 1 reliance on application-local vendored item PNGs as the runtime source of truth.

## Non-Goals

- Pokémon species sprite hosting strategy.
- Changing form-trigger confirm-to-switch semantics or locked Identity rules.
- Changing frozen-85 effect whitelist or damage compilation.
- Implementing Phase 2 self-hosting in this change.

## Compatibility

Fail fast. No requirement to keep local `/items/` URLs or dual-read fallbacks after Phase 1.

## Acceptance Criteria

- Held-item UI item icons for path-backed frozen items and Mega Stones resolve through the pinned sprites commit and recorded source paths.
- Missing path or load failure shows the shared placeholder, including `unknown-mega-stone`.
- Final spec states Phase 1 hotlink and Phase 2 self-host intent without leaving sprite loading unmarked as out of scope.

## Resolution

Accepted. The final contract is reflected in `docs/spec/held-item-pick.md`.
