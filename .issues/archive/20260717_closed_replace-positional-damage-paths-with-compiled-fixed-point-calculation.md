---
# This section is managed by the CLI. Do not edit manually.
id: "bfcc5a44-70fa-4050-a0b5-4083dcc61310"
title: "Replace positional damage paths with compiled fixed-point calculation"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T05:21:00Z"
---
## Parent

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Route every existing Scenario through a single Scenario compiler and local damage kernel while preserving the current user-visible preset, Range, held-item, probability, and result behaviour. The compiler resolves resources and normalizes formula inputs; the kernel owns only Gen 9 phase order, fixed-point modifier chains, rounding, immunity, and normal/critical rolls.

## Acceptance criteria

- [x] The Scenario compiler and local damage kernel are the only calculation seams used by the scenario pipeline; the four positional damage entry points and any compatibility adapter are removed.
- [x] The kernel applies the specified Gen 9 phase order with 4096-based modifiers, exact half-down rounding, one rounding step per modifier chain, and zero damage for type immunity.
- [x] Every present normal or critical branch returns all 16 rolls, and supported baseline item, spread, STAB, type-effectiveness, and critical cases match @smogon/calc roll by roll.
- [x] Existing preset and Range scenarios remain green, including low-attack/high-bulk and high-attack/low-bulk endpoints using their own defender HP.
- [x] UI and scenario pipeline code do not perform resource lookup or assemble mechanism-specific damage modifiers.

## Blocked by

- None — can start immediately.

## Resolution

Implemented `compileScenario` as the numeric-resource and formula-input seam and replaced the four positional `computeDamage*` paths with one compiled pipeline path. The local kernel now accepts fixed-point compiled branches and ordered Range endpoints, applies the specified phases with exact modifiers, returns all present 16-roll branches, and preserves immunity as zero. ADD/CDD remain the probability seam and now support critical-only calculations. Oracle, Range endpoint/HP, resource, distribution, full test, lint, and build checks pass.
