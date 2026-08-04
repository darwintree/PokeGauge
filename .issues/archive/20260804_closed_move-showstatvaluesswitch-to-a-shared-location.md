---
# This section is managed by the CLI. Do not edit manually.
id: "471884db-efdc-4f4a-a07f-523949348ba3"
title: "Move ShowStatValuesSwitch to a shared location"
status: "closed"
priority: "low"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:49:00Z"
---
## Context
damage-results.tsx imports ShowStatValuesSwitch from ../tracks/stats/stat-preset-choices.tsx, so the results surface depends on a setup-track file. The switch is shared by StatTrack and DamageResults.

## Proposed change
Move the component to a neutral shared location (tracks/common/ or components/) and update both importers.

## Scope
- src/features/scenario-explorer/results/damage-results.tsx
- src/features/scenario-explorer/tracks/stats/stat-preset-choices.tsx
- src/features/scenario-explorer/tracks/stats/stat-track.tsx

## Resolution
- Moved `ShowStatValuesSwitch` to `src/features/scenario-explorer/tracks/common/show-stat-values-switch.tsx` (component moved verbatim).
- Removed the definition and now-unused `useId`/`Switch` imports from `stat-preset-choices.tsx`.
- Updated both importers: `stat-track.tsx` and `damage-results.tsx`.
- Verified: `tsc -b` clean; oxlint no new warnings; full vitest suite 334/334 pass; two-axis code review (standards + spec) found no findings.
