---
# This section is managed by the CLI. Do not edit manually.
id: "1077d356-7062-4d38-ae40-df62d352cd64"
title: "Add repeatable Scenario Explorer performance verification"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:23:00Z"
updated_at: "2026-07-06T08:57:00Z"
---
## Parent map

[[20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

What repeatable local verification command or test should this repo use to prove Scenario Explorer first-load performance improved, covering both the catalog initialization path and a browser-facing production build path?

## Starting evidence

The diagnosis used a `tsx` timing probe for `Promise.all([listAttackers, listDefenders, getCatalog])` and direct `vite build`; the repo does not yet have a durable performance check.

## Resolution

Added `pnpm perf:scenario-explorer` as the repeatable local verification command.

The command runs two checks:

- Catalog initialization: measures `Promise.all([listAttackers, listDefenders, getCatalog])` for the default zh-hans matchup and fails above `SCENARIO_EXPLORER_CATALOG_BUDGET_MS` (default `500`).
- Browser-facing production build path: runs a Vite production build into a temporary directory, reads the initial JavaScript referenced by `index.html`, and fails above `SCENARIO_EXPLORER_INITIAL_JS_BUDGET_BYTES` (default `900 KiB`) or `SCENARIO_EXPLORER_INITIAL_JS_GZIP_BUDGET_BYTES` (default `250 KiB`).

Current run on 2026-07-06 is red-capable and fails on the known regressions:

```text
catalog initialization took 2166ms, budget 500ms
initial production JS is 1342.8 KiB, budget 900.0 KiB
initial production JS gzip is 305.3 KiB, budget 250.0 KiB
```

The check is intentionally outside the default `pnpm test` suite so the known performance recovery work can proceed while unrelated tests remain usable. Follow-up implementation tickets should use this command as their recovery gate.

Implementation decision trace: `docs/traces/implementations/2026-07-06-scenario-explorer-performance-verification.md`.

## Verification

- `pnpm perf:scenario-explorer` fails as expected on the current regression path.
- `pnpm lint` passes with existing warnings only.
- `pnpm test` passes: 11 files, 64 tests.
