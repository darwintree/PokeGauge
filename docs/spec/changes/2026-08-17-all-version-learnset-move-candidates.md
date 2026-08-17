---
status: accepted
date: 2026-08-17
---

# All-version Learnset Move Candidates

## Target Specs

- `docs/spec/move-pick.md`

## Contract Delta

### Added

- The Move Picker's default displayed candidates are the intersection of the current Snapshot-capable Move pool and the selected Battle Pokémon Identity's Learnset.
- The Learnset is the union of that identity's PokeAPI `pokemon_moves` relations across every version group.
- The Learnset display filter is enabled whenever the Picker opens and can be disabled to show the global Snapshot-capable pool.

### Changed

- The Move Picker defaults to the historical-Learnset subset instead of the global Snapshot-capable pool.

## Compatibility

The full Move Template catalog remains available for stored and shared state restoration, and remains reachable by disabling the display filter.

## Acceptance Criteria

- A Move learned in any version group is a candidate when it is Snapshot-capable and belongs to the active Move side.
- A Move never learned by the selected Battle Pokémon Identity is absent while the filter is enabled.
- Disabling the Learnset display filter reveals the full Snapshot-capable pool without changing legality or stored state.
- Duplicate relations across version groups produce one candidate.
- An identity with no Snapshot-capable historical Move relations has an empty picker while the filter is enabled.
