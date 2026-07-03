---
# This section is managed by the CLI. Do not edit manually.
id: "d36f73d9-c5dc-42f3-9fb3-4c356bffa83d"
title: "Implement generated PokeAPI resource boundary"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "WAYFINDER:CLAIMED"]
created_at: "2026-07-03T06:15:00Z"
updated_at: "2026-07-03T06:26:00Z"
---
## Parent Map
[[20260702_closed_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Related Issue
[[20260701_closed_integrate-pokeapi-pokemon-move-and-base-stat-data|Integrate PokeAPI Pokemon, move, and base stat data]] (`b667bbec-bebf-4959-b0cd-66542a018c7a`)

## Task
Replace the mock/hardcoded Pokemon and move resource boundary with generated local data derived from PokeAPI. Preserve the normalized contract decided by the research ticket: numeric `pokemon.id` / `move.id`, localized names for supported locales, battle-relevant Pokemon types/base stats, move type/category/power/accuracy/damageKind, and separate calc names for `@smogon/calc`.

## Acceptance Notes
- UI and scenario code do not consume raw PokeAPI response shapes.
- Generated data includes diagnostics for missing supported-locale names and unsupported battle identities.
- The existing Scenario Explorer continues to build catalogs from local data.

## Resolution
Implemented a generated normalized PokeAPI boundary for the current Scenario Explorer resource scope.

- Added `scripts/generate-pokeapi-resources.ts` and `generate:pokeapi` to fetch PokeAPI Pokemon/species/form/move records and emit `src/lib/resources/generated/pokeapi.ts`.
- Replaced mock resource lookup with generated normalized Pokemon and move records keyed by numeric upstream ids.
- Moved battle-relevant Pokemon types/base stats and move type/category/power/accuracy/damageKind/calc names into the resource boundary.
- Updated catalog construction to consume generated resource fields instead of hardcoded species names, Pokemon types, move calc names, and move types.
- Added resource diagnostics access and test coverage for supported-locale names and unsupported battle identities.
- Removed status move `Protect` from current addable move pools so Scenario Explorer remains scoped to damaging moves.

Verification:
- `./node_modules/.bin/tsc -b`
- `./node_modules/.bin/vitest run`
- `./node_modules/.bin/oxlint` (passes with existing fast-refresh warnings)
- `./node_modules/.bin/vite build` (passes with existing chunk-size warning)
