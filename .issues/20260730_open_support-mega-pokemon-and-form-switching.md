---
# This section is managed by the CLI. Do not edit manually.
id: "19742c17-e2c4-4d1c-bcb0-a519a19be0e2"
title: "Support Mega Pokémon and form switching"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-30T09:53:00Z"
updated_at: "2026-07-31T03:35:00Z"
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

## Blocked by

- [[20260730_open_add-defender-held-item-track|Add defender held-item track]]

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
  persistent same-species-form and Mega priority options.
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
  priority; do not open a separate form-only popover.
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

## Deferred interaction decision

- [ ] Current prototype work must choose every visual aspect of the badge,
  including styling, labels, whether it displays a number, and any count
  semantics.

## Acceptance criteria

- [ ] Attacker and defender both use the unified Pokémon selector.
- [ ] From any selected identity, every eligible identity in the same species
  can be selected directly through same-species-form priority.
- [ ] Pokémon with multiple Mega forms can select the intended form explicitly.
- [ ] Same-species-form priority does not add otherwise ineligible battle-only
  non-Mega identities.
- [ ] The selector exposes persistent same-species-form and Mega priority
  options.
- [ ] Search and type filters run before priority sorting.
- [ ] With both priorities enabled, same-species identities precede other
  species and Mega identities lead within each group.
- [ ] The badge opens the unified selector with same-species-form priority
  enabled.
- [ ] Mega priority moves Mega identities forward without hiding non-Mega
  candidates.
- [ ] Selecting a Mega form applies and locks the correct Mega Stone.
- [ ] The locked Mega Stone cannot be cleared or replaced.
- [ ] Rayquaza follows its no-Mega-Stone exception.
- [ ] Selecting a Mega form applies and locks the correct ability.
- [ ] A Mega with missing upstream ability data locks Unknown ability.
- [ ] A Mega with a missing stone resource locks Unknown Mega Stone.
- [ ] Form switching uses the ordinary identity-change reset behavior and does
  not restore prior item or ability choices.
- [ ] Mega Stones and unknown placeholders merge as no-effect inputs and are
  omitted from result conditions.
- [ ] Damage calculation receives the selected form's stats, typing, item, and
  ability.
- [ ] Tests cover form switching, Mega X/Y selection, locked values, and
  Rayquaza's exception.
- [ ] Tests cover one Mega with missing ability data and one with a missing
  stone resource.
- [ ] Before resolution, audit every decision in the discussion trace
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
