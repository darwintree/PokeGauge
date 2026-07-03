# Implementation Trace: Generated PokeAPI Resource Boundary

Date: 2026-07-03
Source: `.issues/20260703_open_implement-generated-pokeapi-resource-boundary.md`
Language: English

## Entries

### 1. Generated Scope for Current Catalog

Type: unresolved-implementation-decision

Context:
The ticket requires generated local data derived from PokeAPI, but it does not state whether this implementation slice must import every PokeAPI Pokemon and move immediately or only the resources reachable from the current Scenario Explorer catalog.

Decision:
Generate the normalized boundary for the current catalog's reachable battle Pokemon and moves, with the generator scope declared in the script and diagnostics emitted in the generated module.

Reason:
This replaces the existing mock/hardcoded resource boundary without expanding the product surface beyond the current UI. The generator can be widened later for full search/import work while preserving the same normalized contract.

Follow-up:
None.

### 2. Explicit Calc Name Overrides

Type: unresolved-implementation-decision

Context:
PokeAPI display names and slugs do not exactly define the `@smogon/calc` names the app must pass to the calculation engine, especially for formatted forms such as Landorus-Therian.

Decision:
Keep `calcSpeciesName` and `calcMoveName` as explicit generated fields, seeded by a small override map in the generator for the resources currently in scope.

Reason:
This honors the normalized boundary's requirement to keep display names separate from calculation names and avoids brittle runtime string conversion from localized labels or upstream slugs.

Follow-up:
None.
