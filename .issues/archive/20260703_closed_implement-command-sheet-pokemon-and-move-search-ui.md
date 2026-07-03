---
# This section is managed by the CLI. Do not edit manually.
id: "cf3bc58f-0d46-40c2-9e43-ed18c5d0f919"
title: "Implement command sheet Pokemon and move search UI"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "WAYFINDER:CLAIMED"]
created_at: "2026-07-03T06:29:00Z"
updated_at: "2026-07-03T06:43:00Z"
---
## Parent Map
[[../20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Task
Replace the mock/small-pool selectors with the **command sheet** pattern decided in the prototype grilling ticket: compact sidebar summary for matchup + move track, sheet overlay for Pokemon and move search at full generated-pool density.

## Acceptance Notes
- Attacker/defender rows in the sidebar open a Pokemon search sheet with keyword input, multi-select type filters (AND semantics), and scrollable identity rows (name + type badges).
- Move add opens a move search sheet scoped to the active **move side**; sheet includes keyword input, single type filter, and rows sorted by power descending showing name, type, power, and accuracy.
- Phys/special **move side** switch stays in the compact sidebar; switching side clears the previous side's visible/selected moves and restores that side's default **Move pick**.
- Do not use the inline flex-wrap `TrackOption` chip picker for the global move pool at full size.
- Sheet is mobile-friendly (bottom sheet on narrow viewports; centered panel on desktop is acceptable).

## Resolution
Implemented the command sheet search pattern in Scenario Explorer:

- Attacker and defender summary rows now open Pokemon search sheets over all generated Battle Pokemon identities, with keyword matching and AND type filters.
- Move add now opens a move search sheet scoped to the active physical/special side, with keyword search, a single type filter, disabled current visible moves, and rows showing type, name, calc move name, power, and accuracy in power-descending order.
- The compact sidebar now includes the move side switch; switching side rebuilds the active catalog and resets visible/selected moves to that side's default Move pick.
- The catalog/resource boundary now exposes localized generated resource lists so UI components do not import raw generated PokeAPI records.

Implementation trace: [[../docs/traces/implementations/2026-07-03-command-sheet-search-ui|2026-07-03 command sheet search UI]].

Verification:
- `./node_modules/.bin/tsc -b`
- `./node_modules/.bin/vitest run`
- `./node_modules/.bin/vite build`
- Browser smoke test at `http://127.0.0.1:5173/`: verified main sidebar render, move sheet rows/disabled current moves, and physical -> special side reset.
