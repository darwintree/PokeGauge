---
# This section is managed by the CLI. Do not edit manually.
id: "c3e47d33-0fea-4e1a-a5a0-f3741c0723a1"
title: "Add reviewed Weather scenarios"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Add the Weather Track and compile its reviewed direct power, damage, and accuracy effects into otherwise ordinary Scenario calculations, including local unsupported outcomes.

## Acceptance criteria

- [ ] The Track provides no weather, sun, rain, sandstorm, and snow as multi-select choices with an explicit neutral default and at least one selection.
- [ ] Generic sun/rain damage plus every reviewed move-ID power or accuracy exception follows the weather support matrix and acts after snapshot edits.
- [ ] Weather Ball is calculable only with no weather; affected combinations become one snapshot-level unavailable notice while unaffected combinations still calculate.
- [ ] In rolls mode, accuracy-only weather is inactive and merges with no weather; in actual mode it changes hit probability and remains effective provenance even if another input produces the same final probability.
- [ ] No-weather provenance is omitted from result rows, and weather effects outside direct power, damage, and accuracy remain out of scope.
- [ ] Representative generic and exceptional cases compare all available normal and critical rolls with @smogon/calc.

## Blocked by

- [[20260717_open_support-reviewed-move-semantics-and-exclusions|Support reviewed move semantics and exclusions]]
- [[20260717_open_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]
