---
# This section is managed by the CLI. Do not edit manually.
id: "505ea59d-b483-4c57-a67a-4ec72eab835e"
title: "Integrate full PokeAPI and Champions move usage with local damage kernel"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-07-03T08:11:00Z"
updated_at: "2026-07-03T08:11:00Z"
---
## Problem

The current data integration is a scoped slice: generated PokeAPI resources cover only 6 Pokemon and 26 moves, Champions usage is imported only for the scoped Pokemon, and runtime damage calculation still depends on `@smogon/calc` species/move name mappings. The project now needs full PokeAPI Pokemon/move resource generation, full Champions Doubles move usage defaults, and a local product-scoped damage kernel so full PokeAPI coverage is not blocked by Smogon data-table names.

## Decision Inputs

- Discussion trace: [[../docs/traces/2026-07-03-full-pokeapi-champions-local-damage-kernel-grill|Full PokeAPI + Champions local damage kernel 讨论记录]]
- ADR: [[../docs/adr/0001-local-damage-kernel-for-generated-resources|Local damage kernel for generated resources]]
- Related PokeAPI umbrella: [[20260701_open_integrate-pokeapi-pokemon-move-and-base-stat-data|Integrate PokeAPI Pokemon, move, and base stat data]] (`b667bbec-bebf-4959-b0cd-66542a018c7a`)
- Related Champions umbrella: [[20260701_open_integrate-champions-battle-move-usage-rate-data|Integrate Champions Battle move usage-rate data]] (`2e6ef737-e571-4cd3-8b98-2edd2b38a686`)

## Scope

- Add `PokeAPI/pokeapi` as a submodule and generate local resources from `data/v2/csv` instead of PokeAPI REST.
- Generate all PokeAPI Pokemon rows and all move rows, preserving all forms and numeric upstream identities.
- Split generated resources into multiple TS constant files.
- Import Champions Doubles move usage for all joinable Champions Pokemon from the online Champions API at generation time.
- Replace runtime `@smogon/calc` damage calculation with a local product-scoped damage kernel.
- Keep `@smogon/calc` as a test oracle for supported cases.
- Add spread move metadata from PokeAPI move targets, default spread modifier on for VGC doubles, and show the spread marker on move labels wherever selected/displayed.

## Acceptance Criteria

- [ ] `pnpm generate:pokeapi` generates full Pokemon and move resources from the PokeAPI submodule without calling PokeAPI REST.
- [ ] Runtime resource access keeps raw PokeAPI CSV shapes out of UI, catalog, scenario pipeline, and kernel code.
- [ ] Champions Doubles move usage is generated for all joinable Champions Pokemon, joined to normalized local Pokemon and move ids, with diagnostics for gaps.
- [ ] Runtime damage calculation uses the local kernel and no longer constructs `@smogon/calc` Pokemon or Move objects.
- [ ] The local kernel accepts pure formula inputs: attack/defense values, attacker/defender types, move type/power, and compiled modifiers.
- [ ] Current UI item effects are implemented at the correct game-formula stage and verified against `@smogon/calc` oracle tests.
- [ ] Local type chart is cross-checked against PokeAPI `type_efficacy.csv` in tests.
- [ ] Spread moves are derived from PokeAPI move target data, default to spread modifier enabled in VGC doubles, and are marked on move labels in picker/selected/results contexts.
- [ ] Existing scenario tests pass or are intentionally updated for spread modifier behavior.
- [ ] Line-by-line audit every decision in `docs/traces/2026-07-03-full-pokeapi-champions-local-damage-kernel-grill.md` has been implemented or explicitly deferred in a follow-up issue.
- [ ] `pnpm test`, `pnpm lint`, and `pnpm build` pass.
- [ ] If fully satisfied, update and archive the two related umbrella issues before commit.

## Notes

Do not broaden this task to full battle simulation, legal ruleset data, Champions held item/ability/stat usage, weather, terrain, abilities, or variable-power move support unless a separate issue explicitly adds that scope.