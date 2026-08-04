---
# This section is managed by the CLI. Do not edit manually.
id: "0cdeaefa-05ea-4f43-8b83-17d08d69548e"
title: "Extract shared PickerDialog wrapper for pokemon and move pickers"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:56:00Z"
---
## Context
BattlePokemonPicker (matchup/battle-pokemon-picker.tsx) and MovePickerDialog (tracks/move/move-picker-dialog.tsx) duplicate the same bottom-sheet DialogContent className string and the search + scrollable-list layout.

## Proposed change
Extract a shared PickerDialog wrapper (Dialog + bottom-sheet styling + search header + scrollable list) and converge both pickers onto it.

## Execution steps
1. Split BattlePokemonPicker into BattlePokemonPicker (trigger + selection state) and BattlePokemonPickerDialog (search, type filters, same-species and compact rows), mirroring the existing MoveTrack / MovePickerDialog pattern.
2. Extract the shared PickerDialog wrapper (Dialog + bottom-sheet styling + search header + scrollable list) and converge BattlePokemonPickerDialog and MovePickerDialog onto it.

## Scope
- src/features/scenario-explorer/matchup/battle-pokemon-picker.tsx
- src/features/scenario-explorer/tracks/move/move-picker-dialog.tsx
- new src/features/scenario-explorer/matchup/battle-pokemon-picker-dialog.tsx (from split step)
- new shared file (e.g. src/features/scenario-explorer/pickers/picker-dialog.tsx)

## Resolution
- Step 1 (split): `BattlePokemonPicker` now keeps the trigger, selection state (open/query/typeFilters/priority toggles), and snapshot logic; the new `BattlePokemonPickerDialog` owns search, type filters, same-species compact row, and the scrollable list, mirroring the MoveTrack / MovePickerDialog pattern.
- Step 2 (extract): new shared `PickerDialog` in `pickers/picker-dialog.tsx` owns Dialog + bottom-sheet DialogContent + title header + search input (`useId`) + optional before-list slot + scrollable body with shared empty state. Both `BattlePokemonPickerDialog` and `MovePickerDialog` now converge on it; the duplicated bottom-sheet className string is gone.
- Verified: `tsc -b` clean; oxlint no new warnings; full vitest suite 334/334 pass (including the existing pokemon picker interaction test); two-axis code review (standards + spec) found no findings.
