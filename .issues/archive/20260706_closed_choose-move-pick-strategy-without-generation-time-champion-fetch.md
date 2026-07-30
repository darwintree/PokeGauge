---
# This section is managed by the CLI. Do not edit manually.
id: "f02dc688-72ca-4a07-aff7-caaca10b7dbe"
title: "Choose Move pick strategy without generation-time Champion fetch"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING", "TECH-DEBT"]
created_at: "2026-07-06T08:30:00Z"
updated_at: "2026-07-30T03:30:00Z"
---
## Parent map

[[20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

Which Move pick strategy should replace the rejected automatic generation-time Champion API fetch, given that first render must not wait on Champion API and normal `generate:pokeapi` should remain free of third-party Champion network side effects?

Compare at least these routes:

- deterministic local fallback from generated move metadata, such as STAB / power / accuracy ordering;
- optional background Champion enrichment after first paint, with cache and failure handling;
- explicit manually invoked snapshot/update workflow separate from `generate:pokeapi`;
- removing Champion-ranked defaults from the critical path entirely.

## Blocked by

- [[20260706_closed_restore-generated-local-champion-move-usage|Restore generated local Champion move usage]]

## Starting evidence

The rejected route is recorded in [[20260706_closed_restore-generated-local-champion-move-usage|Restore generated local Champion move usage]]. The current runtime Champion fetch is measured in [[20260706_closed_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]].

## Current constraint

The product constraint is that the app should request Champion API online. The remaining decision is how to keep that online request from recreating the measured first-render blank/slow path.

The direction to explore is two-sided:

- Minimize the Champion API request duration and request shape.
- Optimize the interaction so the online fetch is as close to invisible to the user as possible.

## Owner input

- Interaction direction: render the Scenario Explorer page shell first; keep the default Move pick area in a lightweight loading state until the Champion API response resolves, then populate the move/results state from the online data.
- Request-shape direction: keep the Champions `/api` index request, but move it to global setup/startup so it can be prefetched and cached independently from the selected matchup's battle rows request.
- Battle rows lifecycle: request Champion battle rows only after the user selects a Pokemon; after that selection's rows have been read, do not repeatedly read them for defender changes, move side changes, rerenders, or returning to the same selected Pokemon during the session.
- Initial default matchup: the default attacker on page open counts as the selected Pokemon, so Scenario Explorer should automatically request its Champion battle rows after the page shell starts.
- Failure/timeout behavior: if Champion battle rows fail or time out, show that Champion usage is temporarily unavailable, do not show default Move pick results, and keep the manual move selection entry available.
- Timeout threshold: treat Champion battle rows as timed out after 5 seconds.

## Resolution

Keep online Champion API usage, but remove it from the page-wide blocking catalog path.

The chosen strategy is:

1. Run the Champions `/api` index request as global setup/startup work. Cache that index result for the session so individual matchup loads do not repeat the index round trip.
2. Render the Scenario Explorer page shell before Champion battle rows resolve. The Pokémon selectors, matchup shell, and manual move entry should be available without waiting for battle rows.
3. Treat the currently selected attacker as the only trigger for battle rows. The initial default Garchomp matchup counts as selected and should automatically request Garchomp rows after the shell starts.
4. Read Champion battle rows once per selected Pokémon per session. Reuse the result for defender changes, move side changes, rerenders, and returning to the same attacker.
5. Keep the default Move pick/results area in a lightweight loading state while the selected attacker's battle rows are pending.
6. On success, populate default Move pick from the online Champion rows, filtered to the active fixed-power damaging move side.
7. On failure or a 5 second timeout, show that Champion usage is temporarily unavailable, do not show default Move pick results, and keep manual move selection available.

This means the performance recovery should optimize both the request path and the interaction path: the online request remains product-required, but it no longer makes the whole page return `null` or wait on repeated Champion API reads.

## Withdrawn attempt

An earlier resolution selected deterministic local fallback as the critical-path default and ruled live/background Champion enrichment out of this recovery. That decision is withdrawn because it did not ask the map owner and conflicts with the current constraint that online Champion API requests are required.
