---
# This section is managed by the CLI. Do not edit manually.
id: "ff9064bf-7e6e-4bd7-9df3-4c5bac5f17da"
title: "Decide global damaging move search and display contract"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING", "WAYFINDER:CLAIMED"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-03T06:13:00Z"
---
## Parent Map
[[20260702_closed_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
What is the product contract for adding/searching moves from one global damaging-move pool, including exclusion rules for non-damaging moves, keyword/filter behavior, and the exact move information shown in results and selected move controls?

## Context
Use `/grilling` and `/domain-modeling`. The kickoff states that the app does not store Pokemon-specific move pools and that move information includes at least power and accuracy.

This ticket should decide behavior, not data-fetch implementation.

## Resolution
The global move add/search contract is single-side in v1. Add a physical/special **move side** switch near the move track; the matchup only searches and displays one side at a time. Switching side clears the previous side's visible and selected moves, then restores the new side's default top-6 **Move pick**. Mixed physical/special comparison is intentionally out of scope because it increases result-row information density and would make the current interface harder to scan.

The searchable global move pool includes only **fixed-power damaging moves**: physical or special moves with positive numeric power. Exclude status moves, `power = null`, OHKO moves, fixed-damage moves, and variable-power moves such as level-, weight-, HP-, or condition-derived power. These can return later only with an explicit product/calculation policy.

Search is a dedicated module boundary whose long-term goal is broad recall, including aliases, common names, slang, and other community language. The v1 contract is deliberately smaller: type filter plus name matching. Search results are scoped to the active move side, optionally narrowed by type filter, and sorted by power descending; ties do not need special handling. Empty search lists all fixed-power damaging moves for the active side, sorted the same way.

Move display does not show Champions usage rate. Usage rate affects default top-6 **Move pick** resolution only, not search result text or selected move controls. Search results and selected move controls show localized move name, type, power, and accuracy. Numeric accuracy displays as a percentage; `accuracy = null` displays as always-hit.
