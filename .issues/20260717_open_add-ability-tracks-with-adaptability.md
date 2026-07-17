---
# This section is managed by the CLI. Do not edit manually.
id: "f875766f-3aba-474c-831f-75006cfe5496"
title: "Add Ability tracks with Adaptability"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Add attacker and defender Ability Tracks using current legal PokeAPI abilities, Champions usage defaults, and the first supported effect: attacker Adaptability.

## Acceptance criteria

- [ ] Both Tracks list every current legal ability including hidden abilities, require at least one selection, and treat a selection as enabled without another toggle.
- [ ] Each side defaults to its most-used legal Champions ability; when usage is unavailable that side selects all legal abilities.
- [ ] Attacker Adaptability uses the exact 8192 STAB modifier when the resolved move type matches an original attacker type.
- [ ] Off-type attacker Adaptability and defender Adaptability are inactive; unsupported abilities remain calculable with neutral formula input and show only the unsupported warning.
- [ ] Supported abilities receive no explanatory badge, neutral selections receive no extra badge, and all states merge according to compiled input while preserving provenance.
- [ ] Adaptability, ordinary STAB, off-type, dynamic-type, and unsupported-ability scenarios are verified through the scenario pipeline and kernel oracle.

## Blocked by

- [[archive/20260717_closed_support-reviewed-move-semantics-and-exclusions|Support reviewed move semantics and exclusions]]
- [[archive/20260717_closed_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]
