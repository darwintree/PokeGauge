---
# This section is managed by the CLI. Do not edit manually.
id: "b667bbec-bebf-4959-b0cd-66542a018c7a"
title: "Integrate PokeAPI Pokemon, move, and base stat data"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-01T12:22:00Z"
updated_at: "2026-07-01T12:22:00Z"
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

- Pokemon, move, and base stat data can be loaded by the app from a local or generated source derived from PokeAPI.
- Remote response shapes are normalized before use by UI and calculation modules.
- The data update process is documented and runnable by a developer.
- Build passes after the integration.

## Notes

Source: https://github.com/PokeAPI/pokeapi