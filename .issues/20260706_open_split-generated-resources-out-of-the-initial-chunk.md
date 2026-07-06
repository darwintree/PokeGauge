---
# This section is managed by the CLI. Do not edit manually.
id: "784191a5-6096-46ba-8e96-dc1978de0ab1"
title: "Split generated resources out of the initial chunk"
status: "open"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:22:00Z"
updated_at: "2026-07-06T08:22:00Z"
---
## Parent map

[[20260706_open_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

After Champion runtime fetch is removed from the critical path, which generated resource imports still dominate the production main chunk, and what lazy-loading or asset split should be used without weakening the local generated-resource boundary from the ADR?

## Blocked by

- [[20260706_closed_restore-generated-local-champion-move-usage|Restore generated local Champion move usage]]

## Starting evidence

The current Vite build emits one large JS chunk around 1,375 kB raw / 316 kB gzip, with generated `pokemon.ts`, `moves.ts`, and `diagnostics.ts` contributing about 1.46 MB of source.
