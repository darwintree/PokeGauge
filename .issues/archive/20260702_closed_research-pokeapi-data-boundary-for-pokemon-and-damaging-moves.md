---
# This section is managed by the CLI. Do not edit manually.
id: "2fcd5d8a-4ec7-42ed-9a9c-d522f1ed4709"
title: "Research PokeAPI data boundary for Pokemon and damaging moves"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:RESEARCH"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-03T05:12:00Z"
---
## Parent Map
[[../20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
What normalized local data boundary should the app derive from PokeAPI for Pokemon search/filtering, battle Pokemon identity, base stats, and the global damaging-move pool, without exposing remote response shapes to UI or calculation code?

## Context
Existing issue: [[../20260701_open_integrate-pokeapi-pokemon-move-and-base-stat-data|Integrate PokeAPI Pokemon, move, and base stat data]] (`b667bbec-bebf-4959-b0cd-66542a018c7a`).

The answer should inspect PokeAPI resource shape and the current `src/lib/resources`, `src/lib/catalog`, and scenario pipeline contracts. Produce a linked markdown research summary rather than implementing the integration.

## Resolution
Research summary: [PokeAPI Data Boundary for Pokemon and Damaging Moves](../../docs/research/2026-07-03-pokeapi-data-boundary.md).

Answer: generate a local normalized data boundary whose battle Pokemon identity is PokeAPI `pokemon.id`, whose move identity is PokeAPI `move.id`, and whose UI/calculation consumers never read raw PokeAPI response shapes. Pokemon records should normalize species/form display names, battle-relevant types, base stats, and a separate `calcSpeciesName`. Move records should normalize localized names, type, physical/special/status category, power, accuracy, PokeAPI meta category, and a separate `calcMoveName`. The global damaging-move pool should be derived from normalized moves, not Pokemon learnsets; null-power/OHKO/variable-power inclusion remains a product/calculation policy decision for the existing move-search and top-6 tickets.
