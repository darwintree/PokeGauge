---
# This section is managed by the CLI. Do not edit manually.
id: "3f3e1a18-8915-45f6-bd7f-2388be1999d7"
title: "Decide top-6 damaging Move pick resolution and fallback policy"
status: "open"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-02T09:41:00Z"
---
## Parent Map
[[20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Blocked By
- [[20260702_open_research-champions-move-usage-data-and-join-keys|Research Champions move usage data and join keys]] (`ddeb1f63-6177-4196-9fc1-caf630852bc8`)
- [[20260702_open_research-pokeapi-data-boundary-for-pokemon-and-damaging-moves|Research PokeAPI data boundary for Pokemon and damaging moves]] (`2fcd5d8a-4ec7-42ed-9a9c-d522f1ed4709`)

## Question
Given normalized move data and Champions usage records, what exact rule resolves the default **Move pick**: top 6 usage-rate damaging moves, tie handling, treatment of zero-power or variable-power damage moves, missing usage data, unmatched records, and user-added move overrides?

## Context
Use `/grilling` and `/domain-modeling` after the blocking research tickets answer what the upstream data can actually provide. The kickoff already sets the default count to 6 and limits defaults to damaging moves.
