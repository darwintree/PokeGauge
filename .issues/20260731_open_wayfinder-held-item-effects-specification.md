---
# This section is managed by the CLI. Do not edit manually.
id: "0ecb8833-fcda-45c1-9c82-d185a35380a9"
title: "Wayfinder: Held-item effects specification"
status: "open"
priority: "high"
labels: ["WAYFINDER:MAP"]
created_at: "2026-07-31T09:26:00Z"
updated_at: "2026-07-31T09:41:00Z"
---
## Destination

Reach a decision-complete handoff for a held-item effects spec covering the frozen 88-item scope. The route is complete when the spec can be authored without unresolved product, mechanics, probability, provenance, or support-boundary decisions; implementing the items or completing the long-term held-item issue is not required.

## Notes

- Parent effort: [[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]].
- Domain: current Pokémon Champions Regulation M-B matchup model, plus explicitly approved same-path items outside M-B.
- Standing skills: use `wayfinder`, `dot-issues`, `grilling`, and `domain-modeling`; use `research` for facts outside the repository.
- The frozen 88-item inventory is an input, not a question. Its exact names are enumerated in [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]].
- Spec scope includes activation inputs, attacker/defender effects, modifier/probability semantics, partial-support warnings, and Scenario provenance/merging.
- Champions usage-driven defaults/ranking and a Held item Track visual redesign remain separate efforts. The required red-dot tooltip for known unsupported behavior is part of this map.
- Resistance Berries retain the current static-item N-hit result; consumption is unsupported and must be disclosed by the red-dot tooltip.

## Tickets

- [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[archive/20260731_closed_verify-held-item-modifier-phases-and-rounding|Verify held-item modifier phases and rounding]]
- [[archive/20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]
- [[20260731_open_decide-held-item-resource-identity-and-eligibility|Decide held-item resource identity and eligibility]]
- [[20260731_open_decide-supported-effect-and-warning-semantics|Decide supported-effect and warning semantics]]
- [[20260731_open_decide-damage-and-stat-modifier-compilation|Decide damage and stat modifier compilation]]
- [[20260731_open_decide-accuracy-and-critical-hit-item-semantics|Decide accuracy and critical-hit item semantics]]
- [[20260731_open_decide-form-locked-and-identity-gated-item-behavior|Decide form-locked and identity-gated item behavior]]
- [[20260731_open_decide-held-item-provenance-and-scenario-merging|Decide held-item provenance and scenario merging]]
- [[20260731_open_decide-held-item-spec-acceptance-contract|Decide held-item spec acceptance contract]]

## Decisions so far

- [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]] — The frozen set is 88 canonical identities; its 44/44 M-B split is a pinned Showdown proxy, and all activation gates, exact effects, and unsupported adjacent behaviors are documented in the cited matrix.
- [[archive/20260731_closed_verify-held-item-modifier-phases-and-rounding|Verify held-item modifier phases and rounding]] — Preserve Gen 9's phase-specific 4096 integer chains, additive critical stages, numeric-accuracy semantics, static Berry approximation, and holder-scoped Utility Umbrella behavior.
- [[archive/20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]] — Reuse the existing scenario compiler, integer modifier phases, probability inputs, merge identity, provenance, locked-item shape, and tooltip primitive; decide generalized item metadata, defender compilation, partial-support warnings, probability composition, and identity gating before authoring the spec.

## Not yet specified

- None. The research and implementation audit exposed no additional fog beyond the existing decision tickets.

## Out of scope

- Implementing held-item effects or completing [[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]].
- Authoring the final `docs/spec` document inside Wayfinder; that is the post-map `spec-change` handoff.
- Champions usage-driven default selection or ordering.
- General Held item Track visual redesign.
- Items outside the frozen inventory, future ruleset refreshes, historical aliases, and CAP expansion.
- Full battle-history simulation, lethal-survival items, speed/order mechanics, move-specific item mechanics, and grounding/immunity-changing items.
