---
# This section is managed by the CLI. Do not edit manually.
id: "471884db-efdc-4f4a-a07f-523949348ba3"
title: "Move ShowStatValuesSwitch to a shared location"
status: "open"
priority: "low"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:43:00Z"
---
## Context
damage-results.tsx imports ShowStatValuesSwitch from ../tracks/stats/stat-preset-choices.tsx, so the results surface depends on a setup-track file. The switch is shared by StatTrack and DamageResults.

## Proposed change
Move the component to a neutral shared location (tracks/common/ or components/) and update both importers.

## Scope
- src/features/scenario-explorer/results/damage-results.tsx
- src/features/scenario-explorer/tracks/stats/stat-preset-choices.tsx
- src/features/scenario-explorer/tracks/stats/stat-track.tsx