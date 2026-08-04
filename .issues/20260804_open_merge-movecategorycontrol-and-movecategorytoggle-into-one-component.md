---
# This section is managed by the CLI. Do not edit manually.
id: "98be84a6-aa40-4c14-b9a3-5d08dff88642"
title: "Merge MoveCategoryControl and MoveCategoryToggle into one component"
status: "open"
priority: "low"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:43:00Z"
---
## Context
move-track.tsx defines two near-identical segmented controls for the physical/special category switch: MoveCategoryControl (expanded state) and MoveCategoryToggle (collapsed state).

## Proposed change
Merge into a single component with a size/variant prop, reusing the existing ToggleGroup primitive where it fits.

## Scope
- src/features/scenario-explorer/tracks/move/move-track.tsx