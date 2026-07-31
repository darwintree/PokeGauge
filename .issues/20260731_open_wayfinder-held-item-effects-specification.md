---
# This section is managed by the CLI. Do not edit manually.
id: "0ecb8833-fcda-45c1-9c82-d185a35380a9"
title: "Wayfinder: Held-item effects specification"
status: "open"
priority: "high"
labels: ["WAYFINDER:MAP"]
created_at: "2026-07-31T09:26:00Z"
updated_at: "2026-07-31T12:53:00Z"
---
## Destination

Reach a decision-complete handoff for a held-item effects spec covering the frozen 85-item scope. The route is complete when the spec can be authored without unresolved product, mechanics, probability, provenance, or support-boundary decisions; implementing the items or completing the long-term held-item issue is not required.

## Notes

- Parent effort: [[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]].
- Domain: current Pokémon Champions Regulation M-B matchup model, plus explicitly approved same-path items outside M-B.
- Standing skills: use `wayfinder`, `dot-issues`, `grilling`, and `domain-modeling`; use `research` for facts outside the repository.
- The current frozen inventory contains 85 items. The researched 88-item candidate set is enumerated in [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]; [[archive/20260731_closed_decide-held-item-resource-identity-and-eligibility|Decide held-item resource identity and eligibility]] removed Adamant Crystal, Lustrous Globe, and Griseous Core because their supported damage behavior duplicates the retained Orb counterparts while their distinct form behavior is out of scope.
- Spec scope includes activation inputs, attacker/defender effects, modifier/probability semantics, partial-support warnings, and Scenario provenance/merging.
- Champions usage-driven defaults/ranking and a Held item Track visual redesign remain separate efforts. The required red-dot tooltip for known unsupported behavior is part of this map.
- Resistance Berries retain the current static-item N-hit result; consumption is unsupported and must be disclosed by the red-dot tooltip.

## Tickets

- [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[archive/20260731_closed_verify-held-item-modifier-phases-and-rounding|Verify held-item modifier phases and rounding]]
- [[archive/20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]
- [[archive/20260731_closed_decide-held-item-resource-identity-and-eligibility|Decide held-item resource identity and eligibility]]
- [[archive/20260731_closed_decide-supported-effect-and-warning-semantics|Decide supported-effect and warning semantics]]
- [[archive/20260731_closed_decide-damage-and-stat-modifier-compilation|Decide damage and stat modifier compilation]]
- [[archive/20260731_closed_decide-accuracy-and-critical-hit-item-semantics|Decide accuracy and critical-hit item semantics]]
- [[archive/20260731_closed_decide-form-locked-and-identity-gated-item-behavior|Decide form-locked and identity-gated item behavior]]
- [[archive/20260731_closed_decide-held-item-provenance-and-scenario-merging|Decide held-item provenance and scenario merging]]
- [[archive/20260731_closed_decide-held-item-spec-acceptance-contract|Decide held-item spec acceptance contract]]

## Decisions so far

- [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]] — The researched candidate set contained 88 canonical identities with a 44/44 M-B split; the cited matrix preserves their activation gates, exact effects, and unsupported adjacent behaviors for the later 85-item scope decision.
- [[archive/20260731_closed_verify-held-item-modifier-phases-and-rounding|Verify held-item modifier phases and rounding]] — Preserve Gen 9's phase-specific 4096 integer chains, additive critical stages, numeric-accuracy semantics, static Berry approximation, and holder-scoped Utility Umbrella behavior.
- [[archive/20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]] — Reuse the existing scenario compiler, integer modifier phases, probability inputs, merge identity, provenance, locked-item shape, and tooltip primitive; decide generalized item metadata, defender compilation, partial-support warnings, probability composition, and identity gating before authoring the spec.
- [[archive/20260731_closed_decide-held-item-resource-identity-and-eligibility|Decide held-item resource identity and eligibility]] — Freeze 85 PokeAPI-numeric effect identities with PokeAPI labels and locally vendored sprites, static effect-direction pools, unchanged Mega locks, explicit `none`, and no migration for invalid legacy selections.
- [[archive/20260731_closed_decide-supported-effect-and-warning-semantics|Decide supported-effect and warning semantics]] — Keep partial-support warnings as static Held item Track metadata only: warn the 18 resistance Berries and Utility Umbrella by limitation category without changing calculations, provenance, merging, or result surfaces.
- [[archive/20260731_closed_decide-damage-and-stat-modifier-compilation|Decide damage and stat modifier compilation]] — Keep the item-agnostic damage kernel; compile current-Scenario item effects into the researched Base Power, stat, final-damage, Berry, and defender Utility Umbrella phases with exact Gen 9 integer semantics.
- [[archive/20260731_closed_decide-accuracy-and-critical-hit-item-semantics|Decide accuracy and critical-hit item semantics]] — Keep probability item effects in the Scenario compiler; compose numeric accuracy with the pinned Gen 9 integer chain, derive capped critical stage without mutating snapshots, and merge on normalized probability while retaining item provenance.
- [[archive/20260731_closed_decide-form-locked-and-identity-gated-item-behavior|Decide form-locked and identity-gated item behavior]] — Generate per-identity Eviolite eligibility from vendored evolution data, apply exact base-species gates, keep current identity-reset semantics, and make the three Ogerpon Masks lock-only without new item warnings.
- [[archive/20260731_closed_decide-held-item-provenance-and-scenario-merging|Decide held-item provenance and scenario merging]] — Reuse the existing calculation-identity merge, four-state side-specific provenance, and result ordering; limit the formula tooltip's item row to attacker Base Power contributions.
- [[archive/20260731_closed_decide-held-item-spec-acceptance-contract|Decide held-item spec acceptance contract]] — Require one ten-section normative spec with an exhaustive 85-item inventory matrix, representative behavior matrix, deterministic edge-case examples, explicit error/compatibility rules, and no unresolved product decisions.

## Not yet specified

- None. The research and implementation audit exposed no additional fog beyond the existing decision tickets.

## Out of scope

- Implementing held-item effects or completing [[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]].
- Authoring the final `docs/spec` document inside Wayfinder; that is the post-map `spec-change` handoff.
- Champions usage-driven default selection or ordering.
- General Held item Track visual redesign.
- Items outside the frozen inventory, future ruleset refreshes, historical aliases, and CAP expansion.
- Full battle-history simulation, lethal-survival items, speed/order mechanics, move-specific item mechanics, and grounding/immunity-changing items.
