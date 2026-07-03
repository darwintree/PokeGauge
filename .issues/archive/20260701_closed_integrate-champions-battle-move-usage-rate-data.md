---
# This section is managed by the CLI. Do not edit manually.
id: "2e6ef737-e571-4cd3-8b98-2edd2b38a686"
title: "Integrate Champions Battle move usage-rate data"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-01T12:22:00Z"
updated_at: "2026-07-03T08:34:00Z"
---
## Problem

Move usage-rate data should be available after the calculator has canonical Pokemon and move identities. This depends on the PokeAPI data integration so usage records can be joined to normalized Pokemon and move identifiers instead of UI labels or ad hoc strings.

## Dependency

Depends on [[20260701_closed_integrate-pokeapi-pokemon-move-and-base-stat-data|Integrate PokeAPI Pokemon, move, and base stat data]] (`b667bbec-bebf-4959-b0cd-66542a018c7a`).

## Scope

- Investigate and integrate move usage-rate data from https://championsbattledata.com/api-rules/.
- Map usage data onto the normalized Pokemon/move data boundary introduced by the PokeAPI issue.
- Decide where usage-rate data belongs in the app: generated local dataset, runtime fetch, or a documented hybrid.
- Expose the data through a small domain-facing API suitable for scenario defaults or analysis UI.

## Acceptance Criteria

- [x] Move usage-rate data can be loaded and joined to known Pokemon/move identifiers.
- [x] The integration handles missing or unmatched usage records explicitly.
- [x] The update/fetch process is documented.
- [x] Build passes after the integration.

## Resolution

Resolved by [[20260703_closed_integrate-full-pokeapi-and-champions-move-usage-with-local-damage-kernel|Integrate full PokeAPI and Champions move usage with local damage kernel]]. `pnpm generate:pokeapi` now imports Champions Doubles move usage from the online Champions API at generation time, joins rows to normalized local Pokemon and move ids, writes generated usage constants, and records unmatched Pokemon/move diagnostics. `pnpm build` passes.

## Notes

Source: https://championsbattledata.com/api-rules/
