---
# This section is managed by the CLI. Do not edit manually.
id: "784191a5-6096-46ba-8e96-dc1978de0ab1"
title: "Split generated resources out of the initial chunk"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:22:00Z"
updated_at: "2026-07-06T09:27:00Z"
---
## Parent map

[[20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

After Champion runtime fetch is removed from the critical path, which generated resource imports still dominate the production main chunk, and what lazy-loading or asset split should be used without weakening the local generated-resource boundary from the ADR?

## Blocked by

- [[../20260706_closed_restore-generated-local-champion-move-usage|Restore generated local Champion move usage]]

## Starting evidence

The current Vite build emits one large JS chunk around 1,375 kB raw / 316 kB gzip, with generated `pokemon.ts`, `moves.ts`, and `diagnostics.ts` contributing about 1.46 MB of source.

## Resolution

Split generated PokeAPI resource modules out of the application entry chunk by replacing static imports in `src/lib/resources/access.ts` with dynamic imports and warmed module-level caches.

- `getResource` / `listResources` now await the relevant generated resource chunk (`pokemon`, `moves`, or `diagnostics`) on demand.
- Synchronous damage/stat helpers continue to read local generated resources through the same resource module after catalog loading has warmed the caches.
- The local generated-resource ADR boundary is preserved: damage calculation still uses generated PokeAPI data locally, not remote runtime fetches or third-party runtime tables.
- The production build now emits separate lazy chunks for `pokemon` and `moves`; the app entry no longer carries those generated modules.

## Verification

- `pnpm exec tsc -b --pretty false` passed.
- `pnpm test src/lib/resources/access.test.ts src/lib/calc-adapter/compute-damage.test.ts src/lib/scenario-pipeline/pipeline.test.ts` passed: 34 tests.
- `pnpm test` passed: 11 files, 67 tests.
- `pnpm lint` passed with existing warnings only.
- `pnpm perf:scenario-explorer` passed:
  - catalog initialization: 50ms, budget 500ms
  - initial JS: 511,465 bytes raw / 158,368 bytes gzip
  - budgets: 921,600 bytes raw / 256,000 bytes gzip
- A direct temporary Vite build emitted lazy generated chunks:
  - `pokemon-*.js`: about 597.65 kB raw / 105.57 kB gzip
  - `moves-*.js`: about 270.27 kB raw / 51.04 kB gzip
  - entry `index-*.js`: about 511.46 kB raw / 160.14 kB gzip

Vite still warns that the lazy `pokemon` chunk exceeds 500 kB after minification. That warning no longer blocks the measured initial-JS recovery gate; further generated-resource sub-splitting would be a separate follow-up if product loading behavior needs it.
