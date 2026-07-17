---
# This section is managed by the CLI. Do not edit manually.
id: "6704365b-ebab-402f-816b-98e5d63b45e8"
title: "Complete cross-mechanism integration and acceptance matrix"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T07:25:00Z"
---
## Parent

[[20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Finish the feature as one coherent Scenario Explorer flow by verifying mechanism ordering, cross-Track products, merged results, Range outcomes, probability displays, and the complete oracle matrix.

## Acceptance criteria

- [x] Move snapshots, held items, Stat stages, Weather, Abilities, Screens, preset stats, and Range stats can coexist in one raw Scenario product and compile in the specified phase order.
- [x] The agreed cross-mechanism product cases cover the 12-to-6 merge, critical stage +3 ignoring suppressed inputs, accuracy weather in both probability modes, Weather Ball local unavailability, unconfigured snapshots, unsupported abilities, and usage-order fallback.
- [x] Range rows use only low attack plus high bulk and high attack plus low bulk, with each endpoint's own HP driving damage percent and KO probability; Range displays no averaged damage marker.
- [x] Kernel oracle coverage compares every supported normal and critical 16-roll array for the complete physical, special, weather, item, Adaptability, dynamic-type, screen-breaker, immunity, and half-down rounding matrix.
- [x] Result rows remain grouped by Move snapshot creation order and expose concise effective provenance without displaying neutral no-weather, no-item, or no-screen labels.
- [x] The implementation passes the repository test, lint, build, and Scenario Explorer performance checks without retaining the former positional calculation path.

## Blocked by

- [[20260717_closed_add-attacker-and-defender-stat-stage-tracks|Add attacker and defender Stat stage tracks]]
- [[20260717_closed_add-reviewed-weather-scenarios|Add reviewed Weather scenarios]]
- [[20260717_closed_add-ability-tracks-with-adaptability|Add Ability tracks with Adaptability]]
- [[20260717_closed_add-screen-scenarios-and-breakers|Add Screen scenarios and breakers]]

## Resolution

- Added a combined pipeline matrix in which Choice Band, Adaptability, Rain, both Stat stages, Reflect, preset stats, and Range endpoints share the same Scenario product and match the full Smogon normal/critical roll oracle.
- Verified a 192-choice critical-only product merges to one kernel call while preserving inactive, unsupported, and neutral provenance across every Track.
- Removed the synthetic average marker, tooltip row, and Range-only legend entry while retaining endpoint-specific percentages and KO probabilities.
- Completed the oracle matrix with Solar Blade, type immunity, and exact `.5`-down normal/critical comparisons; the existing matrix covers the remaining physical, special, weather, item, dynamic-type, and screen-breaker cases.
- Confirmed snapshot ordering and neutral no-weather/no-item/no-screen filtering, and found no production reference to the former positional calculation path.
- Verification: 24 test files / 228 tests passed; lint passed with existing warnings; production build passed; Scenario Explorer performance passed at 57 ms catalog load and 553,405 B / 168,450 B gzip initial JS.
