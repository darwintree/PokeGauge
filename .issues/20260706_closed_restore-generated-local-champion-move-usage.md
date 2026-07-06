---
# This section is managed by the CLI. Do not edit manually.
id: "9598b062-f3c0-4e4f-b8f9-711729e4449b"
title: "Restore generated local Champion move usage"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK", "TECH-DEBT"]
created_at: "2026-07-06T08:22:00Z"
updated_at: "2026-07-06T08:30:00Z"
---
## Parent map

[[archive/20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

How should Champion move usage be restored to a generated/local runtime boundary so Scenario Explorer never waits on `https://championsbattledata.com` during initial render, while preserving current Move pick behavior for the default Garchomp matchup and other supported attackers?

## Starting evidence

See [[archive/20260706_closed_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]], especially findings 1 and 3.

## Resolution

Do not restore Champion move usage by adding automatic Champion API fetches to `generate:pokeapi`.

That route would remove the browser-runtime network wait, but it moves the third-party dependency and freshness behavior into the resource generation command. The side effect is too large for this project boundary: generation would become network-sensitive, externally mutable, and coupled to a service that is not part of the local PokeAPI CSV source.

The next route should keep first render independent from Champion API latency without making normal resource generation depend on Champion API availability. Candidate directions:

- Render without blocking on Champion usage, using a deterministic local fallback for initial Move pick.
- Treat live Champion usage as optional background enrichment after first paint.
- Consider an explicit, separately owned snapshot/update workflow only if product still needs Champion-ranked Move pick parity.
