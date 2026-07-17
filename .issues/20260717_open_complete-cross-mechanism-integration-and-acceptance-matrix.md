---
# This section is managed by the CLI. Do not edit manually.
id: "6704365b-ebab-402f-816b-98e5d63b45e8"
title: "Complete cross-mechanism integration and acceptance matrix"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Finish the feature as one coherent Scenario Explorer flow by verifying mechanism ordering, cross-Track products, merged results, Range outcomes, probability displays, and the complete oracle matrix.

## Acceptance criteria

- [ ] Move snapshots, held items, Stat stages, Weather, Abilities, Screens, preset stats, and Range stats can coexist in one raw Scenario product and compile in the specified phase order.
- [ ] The agreed cross-mechanism product cases cover the 12-to-6 merge, critical stage +3 ignoring suppressed inputs, accuracy weather in both probability modes, Weather Ball local unavailability, unconfigured snapshots, unsupported abilities, and usage-order fallback.
- [ ] Range rows use only low attack plus high bulk and high attack plus low bulk, with each endpoint's own HP driving damage percent and KO probability; Range displays no averaged damage marker.
- [ ] Kernel oracle coverage compares every supported normal and critical 16-roll array for the complete physical, special, weather, item, Adaptability, dynamic-type, screen-breaker, immunity, and half-down rounding matrix.
- [ ] Result rows remain grouped by Move snapshot creation order and expose concise effective provenance without displaying neutral no-weather, no-item, or no-screen labels.
- [ ] The implementation passes the repository test, lint, build, and Scenario Explorer performance checks without retaining the former positional calculation path.

## Blocked by

- [[archive/20260717_closed_add-attacker-and-defender-stat-stage-tracks|Add attacker and defender Stat stage tracks]]
- [[archive/20260717_closed_add-reviewed-weather-scenarios|Add reviewed Weather scenarios]]
- [[archive/20260717_closed_add-ability-tracks-with-adaptability|Add Ability tracks with Adaptability]]
- [[20260717_open_add-screen-scenarios-and-breakers|Add Screen scenarios and breakers]]
