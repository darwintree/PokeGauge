---
# This section is managed by the CLI. Do not edit manually.
id: "187a3879-be1d-473c-815f-cf2d08356dea"
title: "Verify held-item modifier phases and rounding"
status: "closed"
priority: "high"
labels: ["WAYFINDER:RESEARCH"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T09:41:00Z"
---
## Question

Using primary simulator/source references, determine the exact calculation phase, chaining order, integer modifier value, rounding behavior, and stacking behavior for every mechanics family in the frozen inventory: Base Power, Attack, Defense, final damage, type effectiveness, accuracy, critical stage, and weather suppression.

The result must distinguish facts owned by Gen 9 mechanics from choices the product still needs to make, and identify where Pokémon Showdown and the current @smogon/calc oracle expose equivalent or different seams.

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Resolution

Research artifact: [Held-item modifier phases and rounding](../../docs/research/2026-07-31-held-item-modifier-phases-and-rounding.md).

- Verified the exact Gen 9 phase for every frozen family against pinned Pokémon Showdown and `@smogon/calc 0.11.0`: Base Power, Attack, Defense, final damage, numeric accuracy, additive critical stage, or holder-scoped weather visibility.
- Preserve integer modifiers such as `4505`, `4915`, `5324`, `6144`, `8192`, `2048`, and `3686`; do not replace them with floating-point multipliers or move them between phases.
- Within a phase, modifiers chain with `floor((current * next + 2048) / 4096)`; the chained modifier applies with `floor((value * modifier + 2047) / 4096)`. Exact halves therefore differ between chaining and application.
- Resistance Berries join the final-damage chain at `2048`; Chilan is the no-super-effective-predicate exception. Persistent N-hit treatment is explicitly a product approximation.
- Accuracy items modify only numeric accuracy and can chain across the two holders; always-hit semantics remain unchanged. Critical items add stages and saturate at product stage `+3`.
- Utility Umbrella does not globally disable weather. Its direct consequences depend on which holder's effective weather a mechanic consults.
- `@smogon/calc` remains the roll oracle for damage phases, while Showdown event semantics are required for accuracy and critical probability compilation.

Research complete. Remaining questions are already represented by the map's identity, support-warning, compilation, probability, form-gating, provenance, and acceptance tickets.
