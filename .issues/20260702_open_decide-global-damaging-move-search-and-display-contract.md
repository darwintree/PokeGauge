---
# This section is managed by the CLI. Do not edit manually.
id: "ff9064bf-7e6e-4bd7-9df3-4c5bac5f17da"
title: "Decide global damaging move search and display contract"
status: "open"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-02T09:41:00Z"
---
## Parent Map
[[20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
What is the product contract for adding/searching moves from one global damaging-move pool, including exclusion rules for non-damaging moves, keyword/filter behavior, and the exact move information shown in results and selected move controls?

## Context
Use `/grilling` and `/domain-modeling`. The kickoff states that the app does not store Pokemon-specific move pools and that move information includes at least power and accuracy.

This ticket should decide behavior, not data-fetch implementation.
