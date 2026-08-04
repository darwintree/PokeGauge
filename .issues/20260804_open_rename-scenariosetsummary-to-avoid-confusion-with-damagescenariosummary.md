---
# This section is managed by the CLI. Do not edit manually.
id: "15110e31-dc41-4442-8dbd-6d974ac07c06"
title: "Rename ScenarioSetSummary to avoid confusion with DamageScenarioSummary"
status: "open"
priority: "low"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:43:00Z"
---
## Context
scenario-set-summary.tsx (workspace header badges) and results/damage-scenario-summary.tsx (per-row move/scenario summary) have near-identical names, making the files easy to confuse.

## Proposed change
Rename scenario-set-summary.tsx and its exported component to something distinct, e.g. ResultSetSummary / results-summary.tsx.

## Scope
- src/features/scenario-explorer/scenario-set-summary.tsx
- src/features/scenario-explorer/scenario-workspace.tsx (importer)