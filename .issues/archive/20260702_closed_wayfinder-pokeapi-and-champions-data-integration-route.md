---
# This section is managed by the CLI. Do not edit manually.
id: "90b002f9-94ca-410b-b115-d0bc2aff4eb3"
title: "Wayfinder: PokeAPI and Champions data integration route"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:MAP", "FEATURE-REQUEST"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-03T06:53:00Z"
---
## Notes
This map charts the route for integrating PokeAPI data and Champions Battle move usage data into Scenario Explorer. Every session should consult `CONTEXT.md` first, especially **Matchup**, **Ruleset**, **Battle format**, **Move pick**, **Battle Pokemon identity**, **Upstream resource identity**, **Supported locale**, and **Type**. Use `/grilling` and `/domain-modeling` for product/domain decisions; use research tickets for third-party API shape and update-path questions.

Related existing issues:
- [[../20260701_open_integrate-pokeapi-pokemon-move-and-base-stat-data|Integrate PokeAPI Pokemon, move, and base stat data]] (`b667bbec-bebf-4959-b0cd-66542a018c7a`)
- [[../20260701_open_integrate-champions-battle-move-usage-rate-data|Integrate Champions Battle move usage-rate data]] (`2e6ef737-e571-4cd3-8b98-2edd2b38a686`)

Standing product inputs from the kickoff:
- Pokemon can be added/searched, including type filtering and name keyword search.
- Default move display is driven by Champions Battle usage data: show the top 6 usage-rate damaging moves.
- Move add/search uses one global damaging-move pool, not Pokemon-specific learnsets.
- Move information display includes at least power and accuracy.

## Decisions so far
- [[20260702_closed_research-pokeapi-data-boundary-for-pokemon-and-damaging-moves|Research PokeAPI data boundary for Pokemon and damaging moves]] — Normalize PokeAPI into local Pokemon and move records keyed by numeric `pokemon.id` / `move.id`; keep raw API shapes out of UI and calc code, and leave null-power special-case move policy to the move/top-6 tickets.
- [[20260702_closed_research-champions-move-usage-data-and-join-keys|Research Champions move usage data and join keys]] — Import Champions usage rows into generated records joined to normalized numeric Pokemon/move ids; top-6 damaging defaults use Doubles rank order filtered to positive-power physical/special moves.
- [[20260702_closed_decide-pokemon-add-and-search-product-contract|Decide Pokemon add and search product contract]] — Pokemon search selects localized, ruleset-filtered Battle Pokemon identities directly; type filters and broad keyword search combine with AND semantics.
- [[20260702_closed_decide-global-damaging-move-search-and-display-contract|Decide global damaging move search and display contract]] — Move search is scoped by a physical/special move side switch and only includes fixed-power damaging moves; results use type filter plus name matching, sort by power descending, and show name/type/power/accuracy without usage rate.
- [[20260702_closed_decide-top-6-damaging-move-pick-resolution-and-fallback-policy|Decide top-6 damaging Move pick resolution and fallback policy]] — Resolve **Move pick** from Champions Doubles rank order filtered to fixed-power damaging moves on the active move side; fill missing slots from the same-side global fixed-power pool.
- [[20260703_closed_implement-generated-pokeapi-resource-boundary|Implement generated PokeAPI resource boundary]] — Scenario Explorer now consumes generated normalized PokeAPI records for localized names, battle types/base stats, move metadata, calc names, and diagnostics without raw PokeAPI shapes leaking into UI/catalog code.
- [[20260703_closed_decide-whether-dense-pokemon-and-move-search-needs-a-ui-prototype|Decide whether dense Pokemon and move search needs a UI prototype]] — Prototype validated the need; adopt **command sheet** search (compact sidebar summary, sheet for keyword + type filter + dense rows) for both Pokemon and move add/search.
- [[20260703_closed_implement-command-sheet-pokemon-and-move-search-ui|Implement command sheet Pokemon and move search UI]] — Scenario Explorer now uses command sheets for generated-pool Pokemon and fixed-power move search, with compact sidebar summaries and move side reset behavior.
- [[20260703_closed_implement-champions-move-pick-usage-import-and-fallback-resolver|Implement Champions Move pick usage import and fallback resolver]] — Scenario Explorer now resolves default **Move pick** from generated Champions Doubles usage rows joined to PokeAPI move ids, with fixed-power same-side filtering, deterministic fallback, and generation diagnostics.

## Fog
- None.
