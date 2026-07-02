---
# This section is managed by the CLI. Do not edit manually.
id: "90b002f9-94ca-410b-b115-d0bc2aff4eb3"
title: "Wayfinder: PokeAPI and Champions data integration route"
status: "open"
priority: "medium"
labels: ["WAYFINDER:MAP", "FEATURE-REQUEST"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-02T09:41:00Z"
---
## Notes
This map charts the route for integrating PokeAPI data and Champions Battle move usage data into Scenario Explorer. Every session should consult `CONTEXT.md` first, especially **Matchup**, **Ruleset**, **Battle format**, **Move pick**, **Battle Pokemon identity**, **Upstream resource identity**, **Supported locale**, and **Type**. Use `/grilling` and `/domain-modeling` for product/domain decisions; use research tickets for third-party API shape and update-path questions.

Related existing issues:
- [[20260701_open_integrate-pokeapi-pokemon-move-and-base-stat-data|Integrate PokeAPI Pokemon, move, and base stat data]] (`b667bbec-bebf-4959-b0cd-66542a018c7a`)
- [[20260701_open_integrate-champions-battle-move-usage-rate-data|Integrate Champions Battle move usage-rate data]] (`2e6ef737-e571-4cd3-8b98-2edd2b38a686`)

Standing product inputs from the kickoff:
- Pokemon can be added/searched, including type filtering and name keyword search.
- Default move display is driven by Champions Battle usage data: show the top 6 usage-rate damaging moves.
- Move add/search uses one global damaging-move pool, not Pokemon-specific learnsets.
- Move information display includes at least power and accuracy.

## Decisions so far

## Fog
- After upstream data boundaries are known, decide the implementation slices that replace the current hardcoded catalog without regressing the Scenario Explorer.
- After search contracts are settled, decide whether UI needs a prototype for dense Pokemon/move search and selection states.
- After Champions data shape is known, revisit missing-data policy for Pokemon or moves absent from usage data.
- Later implementation may need an explicit ADR if the project chooses a generated local dataset over runtime fetching or a hybrid update model.
