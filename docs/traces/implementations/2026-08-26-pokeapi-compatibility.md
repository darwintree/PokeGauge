# PokeAPI compatibility after updating master

## Decision

Keep the PokeAPI submodule at current `master`, but omit resources that the current
runtime cannot use: Pokémon without an `@smogon/calc` 0.11.0 species mapping and
Mega Stones without an English PokeAPI name. Preserve Floette's reviewed Eviolite
eligibility because the new upstream evolution relation no longer represents its
normal evolution correctly for the generator's form-aware rule.

## Why this decision was required

The dependency-update request did not define how to handle newer PokeAPI records
that postdate Smogon's current release. Importing them unchanged produced blank
item labels and an unresolvable battle identity, breaking existing resource
contracts and runtime calculation.
