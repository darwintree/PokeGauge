---
# This section is managed by the CLI. Do not edit manually.
id: "00eca667-01a3-45da-9475-f97ef52f615f"
title: "Self-host held-item sprites (Phase 2)"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-05T06:33:00Z"
updated_at: "2026-08-05T06:33:00Z"
---
## Goal

Replace Phase 1 GitHub pin-hotlink for Held-item UI icons with first-party hosting of the same pinned PokeAPI/sprites bytes.

## Context

Phase 1 (grill 2026-08-05) loads icons from:

`https://raw.githubusercontent.com/PokeAPI/sprites/8dfa3d97e953caaafaafd4963eff7621811af08e/<spriteSourcePath>`

Contract: [[../docs/spec/held-item-pick.md]] · change: [[../docs/spec/changes/2026-08-05-held-item-sprite-loading-path.md]] · discussion: [[../docs/traces/discussion/2026-08-05-held-item-sprite-loading-path.md]]

Closed by this Phase 1 work: [[archive/20260803_closed_decide-held-item-sprite-loading-path]] · [[archive/20260805_closed_complete-mega-stone-held-item-icons]]

## Work to cover

- Choose hosting (static bucket / CDN / deploy artifact) that serves the same paths or an equivalent mapped URL
- Keep pin `8dfa3d97e953caaafaafd4963eff7621811af08e` (or explicitly re-pin with audit) and `spriteSourcePath` identity
- Point `itemSpriteUrl` / `HELD_ITEM_SPRITES_COMMIT` origin at first-party host; preserve shared `Gem` failure placeholder
- Spec-change if the origin contract changes beyond “same bytes, new host”

## Non-goals

- Pokémon species sprite strategy
- Form-trigger / frozen-85 effect semantics

## Acceptance ideas

- [ ] Held-item Track, Picker, locked chips, and result provenance icons load without `raw.githubusercontent.com`
- [ ] Pin + path provenance still recorded
- [ ] Failure placeholder unchanged