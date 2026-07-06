---
# This section is managed by the CLI. Do not edit manually.
id: "ad3f36f9-6c1c-4cb7-aec1-c68e2078257d"
title: "Cache localized Pokemon option lists per locale"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:22:00Z"
updated_at: "2026-07-06T09:19:00Z"
---
## Parent map

[[20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

Can attacker and defender option generation share a locale-level cached list so first render does not map and sort the full Pokémon set twice, and what tests or measurements prove the behavior remains locale-correct?

## Starting evidence

See [[20260706_closed_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]], finding 5.

## Resolution

Implemented a locale-level Pokemon option cache in `src/lib/catalog/registry.ts`.

- `listAttackers(locale)` and `listDefenders(locale)` now both delegate to the same `listPokemonOptions(locale)` cache.
- The cache stores the in-flight Promise immediately, so concurrent first-render calls share one map/sort pass.
- Cached options, their `types` arrays, and the returned list are frozen to avoid accidental mutation of the shared catalog option list.

## Verification

- `pnpm exec tsc -b --pretty false` passed.
- `pnpm test src/lib/scenario-pipeline/pipeline.test.ts` passed: 21 tests, including coverage that attacker/defender lists share the same locale list and localized labels remain correct across `zh-hans` and `en`.
- `pnpm test` passed: 11 files, 67 tests.
- `pnpm lint` passed with existing warnings only.
- `pnpm perf:scenario-explorer` reported catalog initialization at 4ms with 1350 attackers and 1350 defenders. It still fails only the initial JS raw/gzip budgets, which remains covered by [[20260706_closed_split-generated-resources-out-of-the-initial-chunk|Split generated resources out of the initial chunk]].
