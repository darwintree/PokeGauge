---
# This section is managed by the CLI. Do not edit manually.
id: "b21ae5d5-fb72-4c2c-9097-a01b1d7e6ae1"
title: "Split useScenarioState god hook and narrow component props"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:59:00Z"
---
## Context
useScenarioState (src/features/scenario-explorer/state/use-scenario-state.ts, ~626 lines) mixes persistence (debounced snapshot save + pagehide flush), catalog transition/default sync (several refs), stat-preset CRUD, and result pipeline memoization into one hook returning ~50 fields.

## Proposed change
- Extract snapshot persistence into a small hook (debounce + pagehide flush).
- Extract catalog transition and default move/ability sync effects into a separate hook.
- Pass narrow props instead of the whole ScenarioState to StatTrack, ScenarioSetSummary, and ScenarioSetupPanel where practical.

## Scope
- src/features/scenario-explorer/state/use-scenario-state.ts
- src/features/scenario-explorer/tracks/stats/stat-track.tsx
- src/features/scenario-explorer/scenario-set-summary.tsx
- src/features/scenario-explorer/scenario-setup-panel.tsx

## Notes
Keep the preset CRUD functions as-is; they are straightforward delegates and do not need another abstraction layer.

## Resolution
- Extracted `useScenarioSnapshotPersistence` (debounced save + pagehide flush, `state/use-scenario-snapshot-persistence.ts`) and `useCatalogTransitionSync` (catalog transition + default move/ability sync effects and their refs, `state/use-catalog-transition-sync.ts`); the main hook shrank from 626 to 463 lines.
- Extracted logic was moved verbatim; only React setters were added to effect deps (stable identities, no behavior change).
- Narrowed `ResultSetSummary` props to `trackState` + `rowCount`, and removed the now-unused `selectionSummary` from `useScenarioState` (it also carried hardcoded Chinese strings).
- `StatTrack` / `ScenarioSetupPanel` keep the whole `ScenarioState` prop: both consume most of its surface (~24 fields + 18 callbacks in StatTrack), and per-field interfaces would duplicate the state shape without reducing coupling. See `docs/traces/implementations/2026-08-04-picker-dialog-and-scenario-state-splits.md`.
- Preset CRUD functions left as-is per the issue note.
- Verified: `tsc -b` clean; oxlint no new warnings; full vitest suite 334/334 pass; two-axis code review (standards + spec) found no findings.
