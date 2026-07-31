---
# This section is managed by the CLI. Do not edit manually.
id: "19742c17-e2c4-4d1c-bcb0-a519a19be0e2"
title: "Support Mega Pokémon and form switching"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-30T09:53:00Z"
updated_at: "2026-07-31T08:06:00Z"
---
<!--
This body is user-owned. Adjust the sections freely to fit the issue.
Use the CLI to update front matter fields such as title, status, priority, and labels.
-->

## Problem

The calculator treats Pokémon forms as separate selections and does not provide
an efficient Mega workflow. Users must be able to discover Mega-capable Pokémon,
switch to the relevant form, and receive the form's required battle setup
without manually reconstructing it.

## Discussion trace

[Mega Pokémon and form switching discussion](../docs/traces/discussion/2026-07-30-mega-pokemon-and-form-switching.md)

## Source of truth

This issue is the implementation source of truth. The discussion trace records
decision history, and the throwaway prototype is reference material only. When
either conflicts with this issue, implement this issue.

## Blocked by

- [[20260730_closed_add-defender-held-item-track|Add defender held-item track]]

## Identity rules

- PokeAPI is the source of truth for Pokémon and form classification.
- A default PokémonForm with `is_mega = true` is a Mega identity.
- A non-Mega identity with `is_battle_only = false` is a directly selectable
  non-Mega form.
- Every selectable form is a distinct Battle Pokémon identity. Switching forms
  is equivalent to selecting another Pokémon and uses the ordinary identity
  change behavior.
- Do not remove PokeAPI-classified identities or merge them by matching stats,
  typing, or abilities.

## Scope

- Add form switching for both attacker and defender.
- Evolve the Pokémon selection dialog into one Pokémon selector component with
  same-species-form and Mega priority options that are always visible and
  operable.
- Keep each selector's priority choices while that selector instance remains
  mounted, including across dialog close and reopen. Attacker and defender
  choices are independent; reset on remount or page refresh and do not use
  `localStorage`.
- The same-species-form option moves every identity in the current identity's
  species to the front, without a default/non-default/Mega reachability graph.
- The Mega option moves Mega identities to the front without hiding non-Mega
  candidates.
- Search and type filters reduce the candidate pool before priority sorting.
- When both priority options are enabled, same-species identities come first;
  Mega identities come first within that group and the remaining candidates.
- Keep the existing global candidate boundary. Form priority does not add
  otherwise ineligible battle-only non-Mega identities.
- Add a badge that opens the same selector and enables same-species-form
  priority without changing Mega priority; do not open a separate form-only
  popover. The ordinary Pokémon entry opens the same selector and preserves
  both current priority choices.
- Show the badge only when the selected identity's species has at least two
  identities in the global eligible candidate pool. Do not show it with no
  selected identity or only one eligible identity.
- Keep both priority controls visible and operable when the current species has
  only one eligible identity or the filtered candidates contain no Mega;
  temporarily having no sorting effect is valid.
- On selecting a Mega identity:
  - lock both sides' ability Track to the identity's real ability;
  - when PokeAPI lacks the ability relation, lock the shared Unknown ability;
  - lock both sides' held-item Track to the mapped Mega Stone;
  - when the stone resource is unavailable, lock the shared Unknown Mega Stone;
  - keep Rayquaza's held-item Track editable and preserve its current item.
- Maintain an explicit reviewed Mega identity to Mega Stone mapping because
  PokeAPI does not provide that relationship.
- Do not restore prior item or ability choices when switching back from Mega.
- Do not implement additional Mega ability effects in this issue.
- Treat Mega Stones, Unknown Mega Stone, and Unknown ability as no-effect inputs
  for effect-equivalent merging and omit them from result conditions. Real
  abilities with unimplemented effects remain explicitly unsupported.
- Do not provide a special persistence migration when an unknown placeholder is
  later replaced by upstream data.

## Prototype conclusions (2026-07-31)

The form-switching selector prototype (`prototypes/form-switching/`, dev-only,
gated behind `?axes=`) explored and settled the interaction form:

- **Entry badge**: a layers-icon circle pinned to the species card's top-right
  corner (paper disc, ink ring, hover to signal-yellow). It carries no number
  and no count semantics. Two icon redesign batches (ten candidates) and
  non-icon entry concepts (card-bottom forms strip, card frame signal, name
  caret, hover sprite preview) were explored and dropped.
- **Priority controls**: two labeled switches, "Same-species forms" and "Mega
  first", in a hairline-separated row inside the selector dialog. Chip and
  toolbar-icon-toggle variants were dropped; chips were rejected for conflating
  reorder semantics with the filter-row affordance.
- **Same-species grouping**: with form priority on, the current species'
  identities appear as a horizontally scrollable sprite strip above the list
  and leave the list so nothing is duplicated; strip tiles use short labels
  ("Mega X", "Base"). Flat-list-with-left-bar and group-header variants were
  dropped.
- **Row language**: sprite + text rows.
- **Mega mark**: a sprite corner badge — ink disc with a paper knockout of the
  official-style Mega gem (diamond with split legs), drawn as SVG. Mega marks
  must not reuse damage-domain colors.
- **Row/mega coupling**: the corner badge requires sprite rows (mega=C pins
  row=C); the pin is enforced by the config normalizer.
- **Sprites**: PokeAPI sprites are keyed by numeric id (e.g. `10034.png`), not
  by slug filenames.
- **Prototype status**: the artifact is reference material, not a behavioral
  contract. Its parallel mock dialog, default axis, count-bearing accessible
  label, module-level preference state, and badge behavior are known to differ
  from this issue. Do not copy those differences into the implementation.
  Retain the prototype until the formal implementation is complete, then remove
  it and its product-code mounts.

## Deferred interaction decision

- [x] Resolved by the 2026-07-31 prototype conclusions above: badge styling,
  labels, number and count semantics are settled (layers icon, no count).

## Acceptance criteria

- [x] Attacker and defender both use the unified Pokémon selector.
- [x] From any selected identity, every eligible identity in the same species
  can be selected directly through same-species-form priority.
- [x] Pokémon with multiple Mega forms can select the intended form explicitly.
- [x] Same-species-form priority does not add otherwise ineligible battle-only
  non-Mega identities.
- [x] The selector exposes persistent same-species-form and Mega priority
  options through both the ordinary Pokémon entry and the badge entry.
- [x] Priority choices are independent per attacker/defender selector, survive
  close and reopen, and reset on remount or page refresh.
- [x] Both priority controls remain visible and operable when their current
  candidate set gives them no sorting effect.
- [x] Search and type filters run before priority sorting.
- [x] With both priorities enabled, same-species identities precede other
  species and Mega identities lead within each group.
- [x] The badge opens the unified selector with same-species-form priority
  enabled and leaves Mega priority unchanged.
- [x] The badge appears only when the selected species has at least two
  identities in the global eligible candidate pool.
- [x] Mega priority moves Mega identities forward without hiding non-Mega
  candidates.
- [x] Selecting a Mega form applies and locks the correct Mega Stone.
- [x] The locked Mega Stone cannot be cleared or replaced.
- [x] Rayquaza follows its no-Mega-Stone exception.
- [x] Selecting a Mega form applies and locks the correct ability.
- [x] A Mega with missing upstream ability data locks Unknown ability.
- [x] A Mega with a missing stone resource locks Unknown Mega Stone.
- [x] Form switching uses the ordinary identity-change reset behavior and does
  not restore prior item or ability choices.
- [x] Mega Stones and unknown placeholders merge as no-effect inputs and are
  omitted from result conditions.
- [x] Damage calculation receives the selected form's stats, typing, item, and
  ability.
- [x] Tests cover form switching, Mega X/Y selection, locked values, and
  Rayquaza's exception.
- [x] Tests cover one Mega with missing ability data and one with a missing
  stone resource.
- [x] The throwaway form-switching prototype and its product-code mounts are
  removed after the formal implementation is complete.
- [x] Before resolution, audit every decision in the discussion trace
  line-by-line and verify that each one is implemented or explicitly deferred.

## Progress Log

- 2026-07-30: Issue created; interaction form and non-Mega form subset remain to
  be decided during implementation design.
- 2026-07-30: Batch grilling resolved identity, filtering, transition, lock,
  fallback, and result semantics. The concrete form control remains deferred.
- 2026-07-31: Replaced the separate form-switch reachability model and Mega
  filter with persistent priority options in the unified Pokémon selector.
  A badge opens that selector with form priority; every visual aspect of the
  badge remains in prototype work.
- 2026-07-31: Prototype settled the interaction form: layers-icon badge (no
  count), labeled-switch priority controls, sprite-strip same-species
  grouping, sprite rows, and an SVG Mega-gem corner badge. See the prototype
  conclusions section.
- 2026-07-31: Confirmed this issue as the implementation source of truth;
  clarified selector-local preference lifetime, unified entry behavior,
  always-present priority controls, and badge eligibility. The prototype will
  not be revised and remains reference-only until implementation removes it.
- 2026-07-31: Implemented the unified selector, PokeAPI-backed eligibility and
  classification, Mega locking/fallback semantics, defender held-item
  prerequisite, result merging, and regression coverage. Removed the completed
  prototype and its mounts. Audited all 41 discussion decisions; superseded
  decisions 7-10 and 23 were intentionally not implemented.
- 2026-07-31: Passed 267 Vitest tests, production build, desktop and 390px UI
  review, console-error review, and `git diff --check`.
- 2026-07-31: Addressed review findings by replacing Mega Stone slugs with
  localized PokeAPI numeric item resources, adding an explicit locked Track
  state, and covering selector persistence, both-side locks, identity reset,
  and Rayquaza item preservation. Passed 275 Vitest tests and production build.
