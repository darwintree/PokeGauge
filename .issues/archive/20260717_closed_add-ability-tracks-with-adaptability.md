---
# This section is managed by the CLI. Do not edit manually.
id: "f875766f-3aba-474c-831f-75006cfe5496"
title: "Add Ability tracks with Adaptability"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T06:57:00Z"
---
## Parent

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Add attacker and defender Ability Tracks using current legal PokeAPI abilities, Champions usage defaults, and the first supported effect: attacker Adaptability.

## Acceptance criteria

- [x] Both Tracks list every current legal ability including hidden abilities, require at least one selection, and treat a selection as enabled without another toggle.
- [x] Each side defaults to its most-used legal Champions ability; when usage is unavailable that side selects all legal abilities.
- [x] Attacker Adaptability uses the exact 8192 STAB modifier when the resolved move type matches an original attacker type.
- [x] Off-type attacker Adaptability and defender Adaptability are inactive; unsupported abilities remain calculable with neutral formula input and show only the unsupported warning.
- [x] Supported abilities receive no explanatory badge, neutral selections receive no extra badge, and all states merge according to compiled input while preserving provenance.
- [x] Adaptability, ordinary STAB, off-type, dynamic-type, and unsupported-ability scenarios are verified through the scenario pipeline and kernel oracle.

## Blocked by

- [[20260717_closed_support-reviewed-move-semantics-and-exclusions|Support reviewed move semantics and exclusions]]
- [[20260717_closed_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]

## Resolution

- Generated first-class localized Ability resources and current slot-ordered PokeAPI relations, including hidden abilities and excluding historical relations. Identities without any current relation are diagnosed and omitted so every Track keeps a real selection.
- Added independent attacker/defender Ability Tracks, Champions usage defaults with legal filtering and timeout/error fallback, at-least-one selection, reset behavior, and side-specific lifecycle preservation.
- Compiled attacker Adaptability as exact `8192` STAB against the resolved move type and original attacker types. Defender/off-type Adaptability is inactive; every other Ability remains calculable as unsupported neutral input.
- Added separate attacker/defender provenance, effect-equivalent merging, inline/folded result presentation, localized unsupported labels, and pipeline plus full-roll `@smogon/calc` oracle coverage.
- Verified with 199 tests, production build, lint, and whitespace checks. Existing lint and Vite chunk-size warnings remain unchanged.
