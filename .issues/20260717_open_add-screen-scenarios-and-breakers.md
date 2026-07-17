---
# This section is managed by the CLI. Do not edit manually.
id: "b18dcf07-a680-47a5-a2da-8faea7a14159"
title: "Add Screen scenarios and breakers"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[archive/20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Add the defender Screen Track so users can compare no screen, Reflect, and Light Screen, including critical-hit suppression and moves that break screens before their own damage.

## Acceptance criteria

- [ ] The Track has explicit no screen, Reflect, and Light Screen options, defaults to no screen, requires at least one selection, and resets or clears back to no screen.
- [ ] Reflect affects physical damage and Light Screen affects special damage with the exact doubles final modifier 2732; the opposite screen is inactive.
- [ ] Critical branches ignore screens, including critical stage +3, while ordinary branches retain the appropriate screen modifier.
- [ ] Brick Break, Psychic Fangs, and Raging Bull break the applicable screen before their own damage and therefore compile without that screen modifier.
- [ ] No-screen provenance is omitted from results; effective and inactive screen choices merge and display according to the shared provenance contract.
- [ ] Physical, special, critical, inactive-screen, and screen-breaking cases compare all rolls with @smogon/calc where the oracle supports them.

## Blocked by

- [[20260717_open_support-reviewed-move-semantics-and-exclusions|Support reviewed move semantics and exclusions]]
- [[20260717_open_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]
