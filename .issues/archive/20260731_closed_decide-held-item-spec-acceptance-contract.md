---
# This section is managed by the CLI. Do not edit manually.
id: "7357863d-c68d-47c2-8d56-42e37ca12dae"
title: "Decide held-item spec acceptance contract"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T14:01:00Z"
---
## Question

What exact sections, normative rule tables, examples, error/unsupported rules, and acceptance matrix must the post-map held-item effects spec contain so an implementation plan can be written without another product-decision round?

This ticket defines the spec handoff contract; it does not author the spec or implementation.

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_decide-held-item-provenance-and-scenario-merging|Decide held-item provenance and scenario merging]]

## Resolution

The post-map `spec-change` handoff must produce one authoritative `docs/spec/held-item-effects.md`. The approved final spec is the normative contract; this map's closed decisions and discussion traces constrain and trace its authorship, while pinned Showdown, PokeAPI, research artifacts, and test oracles remain evidence. Any conflict discovered after acceptance requires another spec change rather than an implementation-local choice.

The spec must contain these ten sections and obligations:

1. **Scope and Non-goals** — fix the 85-item whitelist, promised calculator outputs, ruleset/format context, and excluded battle-history, move-specific, ordering/speed, survival, grounding, and broader item behavior.
2. **Sources and Held-item Identity** — fix PokeAPI numeric identity, Showdown mechanics joins, `none`, the Leek mapping, locale fallback/diagnostics, vendored sprite provenance, pinned source versions, and the M-B proxy disclaimer.
3. **Frozen 85-item Inventory** — enumerate exactly 85 unique real items and their complete normative metadata.
4. **Held item Track and State Rules** — specify static attacker/defender pools, explicit no-item, multi-select behavior, identity locks, identity-change reset behavior, restored-state validation, and the unchanged Mega exceptions.
5. **Damage and Stat Compilation** — specify activation ownership, exact fixed-point values, formula phases and order, chaining/application rounding, current-Scenario inputs, critical-branch interaction, inactive/neutral classification, and the item-agnostic kernel boundary.
6. **Accuracy, Critical, Weather, and N-hit Rules** — specify numeric-accuracy chaining, always-hit and unconfigured accuracy, probability modes, derived/capped critical stage, defender-held Utility Umbrella, Resistance Berry activation including Chilan, and the persistent-Berry N-hit approximation.
7. **Identity Gates and Locked Items** — specify every base-species/form gate, Eviolite generation rules and overrides, signature Orb type gates, masked Ogerpon locks, identity rebuilding, and the Mega Rayquaza exception.
8. **Scenario Merge, Provenance, and Result Display** — specify calculation identity, excluded source metadata, the four existing source states, side-specific provenance, first-seen aggregation, result ordering, Damage Conditions Card placement, hidden neutral identities, and the formula tooltip's attacker-Base-Power-only item row.
9. **Partial-support, Error, and Compatibility Rules** — specify the static warning set and category copy, warning orthogonality, whitelist boundary, saved-state rejection/filtering, locale fallback, and resource completeness failures without prescribing which implementation tool performs each check.
10. **Normative Examples and Acceptance Matrices** — provide deterministic examples and the two matrices below. A screenshot or prose-only example is not an acceptance oracle.

### Frozen inventory matrix

The inventory matrix has exactly one row per whitelist item. Each row records PokeAPI numeric id, Showdown mechanics slug, M-B proxy classification, candidate side/pool or lock-only status, mechanics family, every activation gate, affected phase/value or stage contribution, partial-support warning category, resource/source pointers, and any item-specific exception. This matrix proves identity coverage; it does not repeat a full numeric test vector for every mechanically identical item.

### Behavior acceptance matrix

Each behavior row records a stable case name, covered inventory rows and contract rule, deterministic Scenario inputs and probability mode, expected compiled phase values/probabilities/branches, expected damage or KO output when relevant, expected source state/merge/order/display/warning behavior, and the pinned oracle or local contract used to verify it. The matrix must cover positive and negative activation, identity/type/category/effectiveness gates, fixed-point chaining and half-down application boundaries, `Actual probability` and `16 roll`, critical-stage saturation, effect-equivalent merging, locked/reset state, and invalid restoration.

The required normative examples are:

- a type booster that is effective for one resolved Move type and inactive for another;
- Choice Band, Assault Vest, and Eviolite across their applicable stat/category/identity boundaries;
- Life Orb, Expert Belt, and a Resistance Berry at their exact phases, including a same-Scenario final-modifier chain;
- persistent Resistance Berry N-hit output and its static warning, with Chilan's no-super-effective exception represented;
- attacker Wide Lens chained with defender Bright Powder or Lax Incense, plus always-hit, unconfigured accuracy, `Actual probability`, and `16 roll` boundaries;
- Leek or Lucky Punch on eligible and ineligible holders, critical-stage saturation, guaranteed-critical branch selection, and Screen interaction;
- defender-held Utility Umbrella under sun/rain for affected and unaffected Move types;
- a retained signature Orb with both holder-identity and Move-type positive/negative gates;
- masked Ogerpon's lock-only item and Battle Pokémon identity rebuild behavior;
- effect-equivalent merging across effective, inactive, and neutral item sources while a partial-support warning remains Track-only, including existing ordering and formula-tooltip behavior;
- whole-Scenario restoration failure for a legacy synthetic id, whitelist-external id, or wrong-side id, plus filtering of unknown legacy added-visibility entries.

`@smogon/calc` is the supported damage-roll oracle, pinned Showdown semantics are the probability/mechanics evidence, and repository-local contract checks verify state, merge, provenance, ordering, and UI observables. These are validation strategies, not alternate normative contracts.

The spec is acceptance-ready only when all 85 inventory rows are present and unique, every closed child decision and linked discussion trace has been audited line by line, all required example/matrix cells have deterministic expectations, and no product-behavior `TBD` remains. Deliberately implementation-flexible behavior must be named as such rather than left ambiguous.

Supporting record:

- [[../../docs/traces/discussion/2026-07-31-held-item-spec-acceptance-contract|Held-item spec acceptance contract discussion trace]]

## Acceptance handoff

- [x] Before the post-map spec is accepted, audit every decision in the linked discussion trace line by line against the authored contract.
