---
# This section is managed by the CLI. Do not edit manually.
id: "c3e47d33-0fea-4e1a-a5a0-f3741c0723a1"
title: "Add reviewed Weather scenarios"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T06:35:00Z"
---
## Parent

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Add the Weather Track and compile its reviewed direct power, damage, and accuracy effects into otherwise ordinary Scenario calculations, including local unsupported outcomes.

## Acceptance criteria

- [x] The Track provides no weather, sun, rain, sandstorm, and snow as multi-select choices with an explicit neutral default and at least one selection.
- [x] Generic sun/rain damage plus every reviewed move-ID power or accuracy exception follows the weather support matrix and acts after snapshot edits.
- [x] Weather Ball is calculable only with no weather; affected combinations become one snapshot-level unavailable notice while unaffected combinations still calculate.
- [x] In rolls mode, accuracy-only weather is inactive and merges with no weather; in actual mode it changes hit probability and remains effective provenance even if another input produces the same final probability.
- [x] No-weather provenance is omitted from result rows, and weather effects outside direct power, damage, and accuracy remain out of scope.
- [x] Representative generic and exceptional cases compare all available normal and critical rolls with @smogon/calc.

## Blocked by

- [[20260717_closed_support-reviewed-move-semantics-and-exclusions|Support reviewed move semantics and exclusions]]
- [[20260717_closed_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]

## Resolution

Added a non-empty Weather multi-select Track for no weather, sun, rain, sandstorm, and snow, with neutral no-weather as the default and reset state. The Scenario compiler now applies generic sun/rain damage plus the reviewed numeric-ID rules for Blizzard, Solar Beam, Thunder, Hurricane, Solar Blade, the three rain-accurate Storm moves, and Hydro Steam after snapshot edits and in their specified formula phases. Accuracy-only effects remain inactive and merge with no weather in rolls mode; actual mode applies the override and preserves effective provenance even when the resulting probability already equals another choice. Weather Ball remains calculable under no weather while all four type-changing weather combinations aggregate into one visible snapshot-level unavailable notice. Internal neutral provenance is retained for merging but no-weather is filtered from result display. Forty-one focused cases cover the complete matrix, product/default behavior, local unavailability, provenance, rendered omission, and four normal/critical roll-for-roll Smogon oracles; the full 184-test suite, lint, and production build pass.
