---
# This section is managed by the CLI. Do not edit manually.
id: "b18dcf07-a680-47a5-a2da-8faea7a14159"
title: "Add Screen scenarios and breakers"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T07:07:00Z"
---
## Parent

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Add the defender Screen Track so users can compare no screen, Reflect, and Light Screen, including critical-hit suppression and moves that break screens before their own damage.

## Acceptance criteria

- [x] The Track has explicit no screen, Reflect, and Light Screen options, defaults to no screen, requires at least one selection, and resets or clears back to no screen.
- [x] Reflect affects physical damage and Light Screen affects special damage with the exact doubles final modifier 2732; the opposite screen is inactive.
- [x] Critical branches ignore screens, including critical stage +3, while ordinary branches retain the appropriate screen modifier.
- [x] Brick Break, Psychic Fangs, and Raging Bull break the applicable screen before their own damage and therefore compile without that screen modifier.
- [x] No-screen provenance is omitted from results; effective and inactive screen choices merge and display according to the shared provenance contract.
- [x] Physical, special, critical, inactive-screen, and screen-breaking cases compare all rolls with @smogon/calc where the oracle supports them.

## Blocked by

- [[20260717_closed_support-reviewed-move-semantics-and-exclusions|Support reviewed move semantics and exclusions]]
- [[20260717_closed_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]

## Resolution

- Added the fixed no-screen, Reflect, and Light Screen multi-select Track with no-screen fallback, reset behavior, and preservation across matchup, Move side, snapshot, and other Track changes.
- Compiled the matching screen into the Final modifier chain as exact `2732`; opposite screens, critical-only rows, and screens removed before damage remain neutral formula inputs with inactive provenance.
- Critical branches always omit the screen modifier while ordinary branches retain an applicable screen. Brick Break, Psychic Fangs, and Raging Bull use the reviewed pre-damage breaker flag.
- Added effect-equivalent expansion/merging, separate screen provenance, effective/inactive result display, and no-screen display filtering.
- Verified physical, special, critical, inactive, and all three breaker cases against complete normal/critical `@smogon/calc` roll arrays. The full suite has 221 passing tests; production build, lint, and whitespace checks pass with only existing warnings.
