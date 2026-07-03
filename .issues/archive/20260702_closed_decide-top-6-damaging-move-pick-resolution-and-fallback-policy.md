---
# This section is managed by the CLI. Do not edit manually.
id: "3f3e1a18-8915-45f6-bd7f-2388be1999d7"
title: "Decide top-6 damaging Move pick resolution and fallback policy"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING", "WAYFINDER:CLAIMED"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-03T06:16:00Z"
---
## Parent Map
[[20260702_closed_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Blocked By
- [[20260702_closed_research-champions-move-usage-data-and-join-keys|Research Champions move usage data and join keys]] (`ddeb1f63-6177-4196-9fc1-caf630852bc8`)
- [[20260702_closed_research-pokeapi-data-boundary-for-pokemon-and-damaging-moves|Research PokeAPI data boundary for Pokemon and damaging moves]] (`2fcd5d8a-4ec7-42ed-9a9c-d522f1ed4709`)

## Question
Given normalized move data and Champions usage records, what exact rule resolves the default **Move pick**: top 6 usage-rate damaging moves, tie handling, treatment of zero-power or variable-power damage moves, missing usage data, unmatched records, and user-added move overrides?

## Context
Use `/grilling` and `/domain-modeling` after the blocking research tickets answer what the upstream data can actually provide. The kickoff already sets the default count to 6 and limits defaults to damaging moves.

## Resolution

Default **Move pick** resolution is data-driven but deterministic:

1. Use generated Champions `Doubles` move usage rows for the selected attacker and source season.
2. Join each row to a normalized PokeAPI `move.id` during generation, not in UI/runtime code.
3. Keep only fixed-power damaging moves: `category` is `physical` or `special`, `power` is a positive fixed number, and `damageKind` is not an excluded special-case damage kind such as `ohko`, fixed-damage, or variable-power. This matches the global move search contract.
4. Resolve the active **move side** first. A physical matchup uses physical eligible rows; a special matchup uses special eligible rows. Mixed physical/special defaults stay out of scope for v1.
5. Preserve Champions rank order and select the first 6 eligible rows.

Tie handling: Champions exposes rank order. Preserve that source order as canonical; if generated records ever contain duplicate ranks, sort by rank, then usage percentage descending when present, then localized English move name, then numeric `move.id`. This keeps output stable without inventing product meaning for ties.

Excluded move policy: status moves, zero-power moves, `power = null`, OHKO moves, fixed-damage moves, and variable-power moves do not enter default **Move pick**, even when Champions usage ranks them highly. They can be reconsidered only through a later explicit product/calculation decision.

Missing-data policy:

- If a Champions Pokemon row cannot be joined to a normalized `BattlePokemonId`, generation reports the mismatch; the app does not silently synthesize usage for that Pokemon.
- If a Champions move row cannot be joined to exactly one normalized `move.id`, generation reports the mismatch and skips that row for default selection.
- If an attacker has no Champions move rows, no joined move rows, or fewer than 6 eligible moves for the active **move side**, fill the remaining slots from the global fixed-power damaging move pool for the same **move side**. Fallback ordering is power descending, then accuracy descending with `accuracy = null` treated as always-hit, then localized English move name, then numeric `move.id`.
- A fallback move already selected from Champions rows must not be duplicated.

User-added move overrides are separate from generated defaults. They can expand the visible/selected move track for the current user/session, but they do not alter the generated **Move pick**, Champions usage records, rank order, or fallback pool. Switching **move side** clears the previous side's visible and selected user-added moves, then restores the new side's resolved default **Move pick**.

The UI should not show Champions usage percentage in move search results or selected move controls for v1. Store rank and usage percentage on generated records for diagnostics and future display, but usage only orders default **Move pick** resolution now.

New implementation tickets surfaced by this decision:

- [[20260703_closed_implement-generated-pokeapi-resource-boundary|Implement generated PokeAPI resource boundary]] (`d36f73d9-c5dc-42f3-9fb3-4c356bffa83d`)
- [[20260703_closed_implement-champions-move-pick-usage-import-and-fallback-resolver|Implement Champions Move pick usage import and fallback resolver]] (`5e8060a4-774c-4ecc-bee1-60137ced7031`)
