---
# This section is managed by the CLI. Do not edit manually.
id: "057c7130-b0d9-45d0-965e-2b03e1dff0db"
title: "Decide held-item provenance and scenario merging"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T12:36:00Z"
---
## Question

How do effective, inactive, neutral, and unsupported Held item choices participate in the complete calculation identity, effect-equivalent Scenario merge, result ordering, and Damage Conditions Card?

The answer must cover separate attacker and defender item Tracks, merged source sets, and hidden neutral choices without changing the established information-hierarchy contract. Partially supported item warnings are static Held item Track metadata only: they do not participate in provenance, calculation identity, merging, ordering, or result-card display.

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_decide-held-item-resource-identity-and-eligibility|Decide held-item resource identity and eligibility]]
- [[20260731_closed_decide-supported-effect-and-warning-semantics|Decide supported-effect and warning semantics]]
- [[20260731_closed_decide-damage-and-stat-modifier-compilation|Decide damage and stat modifier compilation]]
- [[20260731_closed_decide-accuracy-and-critical-hit-item-semantics|Decide accuracy and critical-hit item semantics]]
- [[20260731_closed_decide-form-locked-and-identity-gated-item-behavior|Decide form-locked and identity-gated item behavior]]

## Resolution

Reuse the existing effect-equivalent Scenario merge without adding an item-specific merge model. Calculation identity remains the serialized Move snapshot id plus the complete compiled damage, probability, and KO inputs. Raw attacker or defender item ids, provenance, support warnings, `moveMechanics`, and final display numbers remain outside the key. Item choices therefore merge exactly when their complete compiled inputs are equal, while distinct compiled inputs remain separate even when their rounded damage displays happen to match.

Keep the existing separate provenance tracks: `held-item` for the attacker and `defender-held-item` for the defender. Each merged row aggregates deduplicated option ids under the existing `effective | inactive | unsupported | neutral` sets in first-encountered order. Do not retain raw Scenario tuples or introduce a counterfactual remove-and-recompile pass. Each frozen item's already-decided activation semantics owns its source state: unmet supported conditions are `inactive`, explicit no-item and defined neutral locked identities are `neutral`, and no supported core effect becomes `unsupported`. Partial-support warnings remain static Held item Track metadata and do not enter calculation identity, provenance, merging, ordering, or result display.

Preserve current result ordering. Rows remain grouped by Move snapshot creation order; internal order remains implementation-flexible and follows the pipeline's first encounter of each calculation identity. Do not add item ranking, label sorting, damage sorting, or another ordering contract. Provenance arrays preserve their Track enumeration order through first-seen deduplication.

Preserve the Damage Conditions Card information hierarchy. Effective attacker and defender items appear on their corresponding identity lines. Inactive and unsupported item sources use the existing folded other-conditions entry. Explicit no-item, Unknown Mega Stone, and other defined neutral held-item identities remain hidden from results. The red-dot partial-support warning remains exclusive to the Held item Track.

Constrain the formula tooltip's Held item row to the attacker's Base Power item contribution. It lists only effective attacker-held items that participate in the Base Power phase and displays that phase's chained modifier. Attack-stat, final-damage, accuracy, and critical-stage items do not appear in this row; defender-held items do not appear because they do not modify the Move's Base Power. The current implementation's `moveMechanics.modifiers.item` value, which chains attacker Base Power, Attack, and final-damage contributions into one scalar, is not the target contract and must be narrowed during implementation. Other item effects remain visible through the corresponding identity-line token and the calculation result, without adding a new result surface.

Supporting record:

- [[../../docs/traces/discussion/2026-07-31-held-item-provenance-and-scenario-merging|Held-item provenance and Scenario merging discussion trace]]

## Acceptance handoff

- [ ] Before implementation is considered complete, audit every decision in the linked discussion trace line by line against the delivered behavior.
