# Local damage kernel for generated resources

We will replace runtime use of `@smogon/calc` with a local, product-scoped damage kernel that accepts compiled formula inputs rather than Pokemon or move names. The kernel covers the current Scenario Explorer contract: level 50, fixed-power physical/special moves, normal and critical 16-roll ranges, STAB, type effectiveness, spread move modifier, and the held item modifiers currently exposed by the UI. `@smogon/calc` remains a test oracle for supported cases, while PokeAPI-generated resources become the source for Pokemon stats/types and move metadata so full PokeAPI coverage is not blocked by Smogon species or move name mappings.

## Considered Options

- Continue using `@smogon/calc` at runtime. This preserves broad battle-mechanic coverage but keeps full PokeAPI integration coupled to Smogon data-table names and supported forms.
- Deep-import Smogon mechanics helpers. This avoids rewriting formulas but depends on package-internal file layout that is not part of the public API.
- Build a local product-scoped kernel. This narrows the formula surface to what the UI can express and lets resource adapters compile PokeAPI and UI state into pure formula inputs.

## Consequences

- The kernel must not perform resource lookup or know UI item ids; adapters compile resource data and UI selections into formula inputs and modifier chains.
- Full battle simulation remains out of scope. Additional mechanics such as abilities, weather, terrain, burn, variable-power moves, and explicit spread toggles should be added only when the product exposes them.
- Tests must compare supported cases against `@smogon/calc` and cross-check the local type chart against PokeAPI `type_efficacy.csv`.
