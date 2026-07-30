---
# This section is managed by the CLI. Do not edit manually.
id: "f6d19ca8-edd7-48fc-b89d-8d05fbd7897f"
title: "Map Scenario Explorer frontend performance recovery"
status: "closed"
priority: "high"
labels: ["WAYFINDER:MAP", "TECH-DEBT"]
created_at: "2026-07-06T08:22:00Z"
updated_at: "2026-07-06T09:33:00Z"
---
## Destination

Restore Scenario Explorer to a fast, deterministic first-load path after the Champion API / generated resource integration, with the major frontend performance regressions either fixed or converted into scoped follow-up implementation tickets with measurable verification.

## Notes

- Use `diagnosing-bugs` when measuring regressions and reproductions.
- Use `vercel-react-best-practices` for React data-loading, render, and bundle decisions.
- Use `implementation-with-traces` when completing any READY-FOR-AGENT issue or this map's implementation tickets.
- Domain boundary: Pokémon Champions move usage drives Move pick only; it is not ruleset legality or full build data. Runtime damage calculation should continue to use generated/local resources per `docs/adr/0001-local-damage-kernel-for-generated-resources.md`.
- Current evidence source: [[20260706_closed_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]].
- Local tracker fallback: child tickets identify this map with a `Parent map` link; blocking is represented with a `Blocked by` section in ticket bodies.

## Child tickets

- Archived — [[20260706_closed_decouple-default-move-pick-from-first-render|Decouple default Move pick from first render]] (`WAYFINDER:TASK`, high)
- Archived — [[20260706_closed_cache-localized-pokemon-option-lists-per-locale|Cache localized Pokemon option lists per locale]] (`WAYFINDER:TASK`, medium)
- Archived — [[20260706_closed_split-generated-resources-out-of-the-initial-chunk|Split generated resources out of the initial chunk]] (`WAYFINDER:TASK`, medium)
- Archived — [[20260706_closed_fix-pnpm-build-verification-friction|Fix pnpm build verification friction]] (`WAYFINDER:TASK`, medium)
- Closed — [[20260706_closed_restore-generated-local-champion-move-usage|Restore generated local Champion move usage]] (`WAYFINDER:TASK`, high)
- Closed — [[20260706_closed_choose-move-pick-strategy-without-generation-time-champion-fetch|Choose Move pick strategy without generation-time Champion fetch]] (`WAYFINDER:GRILLING`, high)
- Archived — [[20260706_closed_add-repeatable-scenario-explorer-performance-verification|Add repeatable Scenario Explorer performance verification]] (`WAYFINDER:TASK`, high)

## Decisions so far

- [[20260706_closed_restore-generated-local-champion-move-usage|Restore generated local Champion move usage]] — Do not fix the regression by making `generate:pokeapi` automatically fetch Champion API data; the side effect is too large for the resource-generation boundary.
- [[20260706_closed_choose-move-pick-strategy-without-generation-time-champion-fetch|Choose Move pick strategy without generation-time Champion fetch]] — Keep online Champion API usage, but split it from the page-wide blocking path: startup-prefetch/cache the index, fetch battle rows once per selected attacker, show a Move-pick-local loading state, and fail after 5s into manual move selection.
- [[20260706_closed_add-repeatable-scenario-explorer-performance-verification|Add repeatable Scenario Explorer performance verification]] — Use `pnpm perf:scenario-explorer` as the red-capable recovery gate for catalog initialization and production initial-JS budgets.
- [[20260706_closed_decouple-default-move-pick-from-first-render|Decouple default Move pick from first render]] — Split first-load catalog shell from online Champion Move pick so shell catalog initializes in single-digit milliseconds, then applies Move pick asynchronously or leaves manual move selection available.
- [[20260706_closed_cache-localized-pokemon-option-lists-per-locale|Cache localized Pokemon option lists per locale]] — Share one frozen locale-level Pokemon option list between attacker and defender selectors, including concurrent first-render calls, while preserving localized labels per locale.
- [[20260706_closed_split-generated-resources-out-of-the-initial-chunk|Split generated resources out of the initial chunk]] — Move generated Pokemon, move, and diagnostics modules behind lazy resource imports so production initial JS drops under budget while local generated data remains the damage source.
- [[20260706_closed_fix-pnpm-build-verification-friction|Fix pnpm build verification friction]] — Commit the pnpm esbuild build-script approval so `CI=true pnpm install --frozen-lockfile` and normal `pnpm build` are reliable verification paths.

## Not yet specified

None. The route to the destination is complete.

## Resolution

Scenario Explorer frontend performance recovery is complete.

- `pnpm perf:scenario-explorer` is the repeatable performance gate for catalog initialization and production initial-JS budgets.
- The first render no longer waits on Champion Move usage; the catalog shell renders immediately with Move pick resolving asynchronously.
- Localized attacker/defender Pokemon options share a locale-level cache.
- Generated Pokemon, move, and diagnostics modules remain local generated TypeScript resources, but load as lazy chunks instead of initial JS.
- `pnpm build` verification is reliable after committing the workspace esbuild build-script approval.

Final measured recovery on 2026-07-06:

- Catalog initialization: 50ms, budget 500ms.
- Initial JS: 511,465 bytes raw / 158,368 bytes gzip.
- Initial JS budget: 921,600 bytes raw / 256,000 bytes gzip.
- `CI=true pnpm install --frozen-lockfile`, a temporary empty-modules `CI=true pnpm install --frozen-lockfile --modules-dir <tmp>`, `pnpm build`, `pnpm test`, `pnpm lint`, and `pnpm perf:scenario-explorer` passed.

## Out of scope

- Full battle simulation and mechanics outside the current Scenario Explorer contract, matching `docs/adr/0001-local-damage-kernel-for-generated-resources.md`.
- Expanding Champion data beyond move usage into ability, item, teammate, or spread recommendation systems.
