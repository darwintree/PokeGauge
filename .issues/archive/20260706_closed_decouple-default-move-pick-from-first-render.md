---
# This section is managed by the CLI. Do not edit manually.
id: "d8c88560-4ba4-4cf9-9c0e-4bd75bbedfb9"
title: "Decouple default Move pick from first render"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:22:00Z"
updated_at: "2026-07-06T09:07:00Z"
---
## Parent map

[[20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

What is the smallest UI/data-loading change that lets Scenario Explorer render a useful shell and deterministic local fallback when default Move pick data is absent, slow, or still loading, instead of returning `null` for the whole page?

## Starting evidence

See [[20260706_closed_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]], especially finding 2.

## Decision input

[[20260706_closed_choose-move-pick-strategy-without-generation-time-champion-fetch|Choose Move pick strategy without generation-time Champion fetch]] keeps online Champion API usage, but removes it from the page-wide blocking catalog path:

- Champions `/api` index should be startup/global setup work and cached for the session.
- Champion battle rows should be requested only after an attacker is selected; the initial default attacker counts as selected.
- Battle rows should be read once per selected Pokemon per session and reused across defender changes, move side changes, rerenders, and returning to that attacker.
- The page shell should render while battle rows load; only the default Move pick/results area should show lightweight loading.
- On failure or a 5s timeout, show Champion usage temporarily unavailable, do not show default Move pick results, and keep manual move selection available.

## Resolution

Implemented the smallest shell-first loading split:

- Added `getCatalogShell`, which builds matchup labels, fixed-power move options, stat tracks, item tracks, and manual move search data without waiting for Champion usage.
- Added `resolveCatalogDefaultMovePick`, which resolves online Champion Move pick separately, applies a 5s timeout, and reports `ready` or `unavailable`.
- Updated `ScenarioExplorerPage` so localized Pokemon lists, shell catalog, and Champion Move pick load independently. The page can render once local catalog resources are ready instead of waiting for Champion battle rows.
- Updated `useScenarioState` so Champion default moves are applied when they arrive only if the user has not already changed the move selection.
- Added lightweight UI copy for loading/unavailable Champion Move pick while preserving manual move selection.
- Updated `pnpm perf:scenario-explorer` to measure the shell catalog path for first-load catalog initialization.

The ticket question mentions deterministic local fallback, but the linked wayfinder decision requires online Champion usage and no default Move pick results on failure/timeout. The implementation follows that newer, more specific decision. Trace: `docs/traces/implementations/2026-07-06-decouple-default-move-pick-from-first-render.md`.

## Verification

- `pnpm exec tsc -b --pretty false` passes.
- `pnpm test` passes: 11 files, 66 tests.
- `pnpm lint` passes with existing warnings only.
- `pnpm perf:scenario-explorer` now reports single-digit catalog initialization, most recently 9ms, with `defaultMovePickStatus: "loading"` and `defaultMoveIds: []`; it still fails the initial JS size budgets, which is covered by [[20260706_closed_split-generated-resources-out-of-the-initial-chunk|Split generated resources out of the initial chunk]].
