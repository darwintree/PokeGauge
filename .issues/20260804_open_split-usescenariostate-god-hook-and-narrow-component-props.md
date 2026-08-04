---
# This section is managed by the CLI. Do not edit manually.
id: "b21ae5d5-fb72-4c2c-9097-a01b1d7e6ae1"
title: "Split useScenarioState god hook and narrow component props"
status: "open"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:43:00Z"
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