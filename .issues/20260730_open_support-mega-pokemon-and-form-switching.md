---
# This section is managed by the CLI. Do not edit manually.
id: "19742c17-e2c4-4d1c-bcb0-a519a19be0e2"
title: "Support Mega Pokémon and form switching"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-30T09:53:00Z"
updated_at: "2026-07-30T09:54:00Z"
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

## Scope

- Add a shortcut after Pokémon selection for switching between supported forms,
  at minimum the base form and its Mega form(s).
- Add a quick filter in the Pokémon selector for Pokémon with a Mega form.
- When a Mega form is selected:
  - lock its held item to the corresponding Mega Stone and do not allow an empty
    or different item;
  - except Rayquaza, which does not require a Mega Stone;
  - lock its ability to the Mega form's ability.
- Use the same form-switching path for the subset of other forms that can be
  selected directly without simulating an in-battle transformation.

## Interaction decisions

- [ ] Decide the concrete form-switch shortcut (for example, a compact form
  control adjacent to the selected Pokémon).
- [ ] Decide which non-Mega forms belong in the first implementation.
- [ ] Decide how prior item and ability selections are restored when switching
  back from a locked Mega form.

## Acceptance criteria

- [ ] A selected Mega-capable Pokémon exposes a direct way to switch to each of
  its Mega forms and back.
- [ ] Pokémon with multiple Mega forms can select the intended form explicitly.
- [ ] Selecting a Mega form applies and locks the correct Mega Stone.
- [ ] The locked Mega Stone cannot be cleared or replaced.
- [ ] Rayquaza follows its no-Mega-Stone exception.
- [ ] Selecting a Mega form applies and locks the correct ability.
- [ ] The Pokémon selector can quickly filter to Mega-capable Pokémon.
- [ ] The agreed subset of other directly selectable forms uses the same form
  switching interaction.
- [ ] Damage calculation receives the selected form's stats, typing, item, and
  ability.
- [ ] Tests cover form switching, Mega X/Y selection, locked values, and
  Rayquaza's exception.

## Progress Log

- 2026-07-30: Issue created; interaction form and non-Mega form subset remain to
  be decided during implementation design.
