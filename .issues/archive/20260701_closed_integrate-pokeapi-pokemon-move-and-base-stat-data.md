---
# This section is managed by the CLI. Do not edit manually.
id: "b667bbec-bebf-4959-b0cd-66542a018c7a"
title: "Integrate PokeAPI Pokemon, move, and base stat data"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-01T12:22:00Z"
updated_at: "2026-07-03T08:34:00Z"
---
## Problem

The calculator currently needs first-party Pokemon, move, and base stat data before it can support broader scenario setup and future data-driven features.

## Scope

- Integrate Pokemon species/name data from [PokeAPI/pokeapi](https://github.com/PokeAPI/pokeapi).
- Integrate move data needed by the calculator, including power, type, category, accuracy, and relevant battle metadata where available.
- Integrate Pokemon base stats for damage calculations and scenario defaults.
- Define a local data boundary for fetched/generated data so domain tokens and calculator logic do not depend directly on remote API response shapes.
- Add a repeatable update path for refreshing upstream data.

## Acceptance Criteria

- [x] Pokemon, move, and base stat data can be loaded by the app from a local or generated source derived from PokeAPI.
- [x] Remote response shapes are normalized before use by UI and calculation modules.
- [x] The data update process is documented and runnable by a developer.
- [x] Build passes after the integration.

## Resolution

Resolved by [[20260703_closed_integrate-full-pokeapi-and-champions-move-usage-with-local-damage-kernel|Integrate full PokeAPI and Champions move usage with local damage kernel]]. `pnpm generate:pokeapi` now reads normalized Pokemon, move, type, stat, name, target, and metadata records from the local `PokeAPI/pokeapi` submodule and emits app-facing generated TypeScript constants. `pnpm build` passes.

## Notes

Source: https://github.com/PokeAPI/pokeapi
