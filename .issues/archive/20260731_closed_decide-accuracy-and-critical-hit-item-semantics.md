---
# This section is managed by the CLI. Do not edit manually.
id: "86104d9a-74e2-40ed-9f83-044a651c001d"
title: "Decide accuracy and critical-hit item semantics"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T11:28:00Z"
---
## Question

How should Bright Powder, Lax Incense, Wide Lens, Scope Lens, Razor Claw, Leek, and Lucky Punch modify the current hit/critical probability model?

Decide attacker-versus-defender direction, identity gates, stacking and caps, interaction with always-hit and unconfigured accuracy semantics, critical-stage sources, Atomic Damage Distribution, and provenance. Zoom Lens and order-dependent behavior remain out of scope.

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[20260731_closed_verify-held-item-modifier-phases-and-rounding|Verify held-item modifier phases and rounding]]
- [[20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]

## Resolution

Keep probability effects in `compileScenario`. The compiler derives resolved numeric accuracy and total critical stage from the current Scenario; it does not mutate the Move snapshot. The Atomic Damage Distribution remains item-agnostic and continues to receive only `hitProbability`, conditional `criticalHitProbability`, and the normal/critical rolls.

Use holder direction from the frozen mechanics matrix:

- Attacker-held Wide Lens modifies numeric move accuracy by `4505/4096`.
- Defender-held Bright Powder and Lax Incense modify incoming numeric accuracy by `3686/4096`.
- Attacker-held Scope Lens and Razor Claw add one critical stage.
- Attacker-held Leek and Lucky Punch add two critical stages when the holder passes the identity gate.

Compile accuracy with the pinned Pokémon Showdown Gen 9 integer semantics. Chain every active accuracy-item factor in the single `ModifyAccuracy` phase with `floor((M * next + 2048) / 4096)`, then apply the chained modifier once with `floor((accuracy * M + 2047) / 4096)`. A later reviewed accuracy override can replace that result. Semantic always-hit accuracy bypasses the numeric item chain, and unconfigured accuracy `0` remains unavailable rather than being completed by an item. Convert the final numeric accuracy to ADD input with `min(1, accuracy / 100)`; do not expose probability above `1`.

The official Champions sources reviewed do not publish these coefficients, fixed-point operations, rounding rules, or hit RNG. Treat the algorithm as an explicit pinned Pokémon Showdown Gen 9 alignment, not independent confirmation of the Champions executable. A later official specification or reproducible counterexample may update the ruleset adapter.

Derive total critical stage as `min(3, snapshot critical stage + eligible item contribution)`. Leek is eligible only for ordinary or Galar Farfetch’d and Sirfetch’d; Lucky Punch is eligible only for Chansey. An ineligible identity leaves the selection available but compiles no stage contribution. The derived total stage, not the snapshot field alone, owns critical probability, guaranteed-critical branch selection, critical stage-ignore behavior, and Screen interaction.

Preserve the existing probability modes. `Actual probability` compiles final hit probability and the `0 => 1/24`, `1 => 1/8`, `2 => 1/2`, `3 => 1` conditional critical table. `16 roll` compiles hit probability `1` and random critical probability `0`, except derived stage `3` still produces the guaranteed-critical branch with critical probability `1`.

Classify an item source as `effective` only when removing its contribution would change the final hit probability, derived critical stage, or damage branch. Otherwise classify it as `inactive`, including an accuracy effect hidden by `16 roll`, a non-guaranteeing critical effect hidden by `16 roll`, a capped redundant effect, a later accuracy override that erases the item contribution, or an identity-gated item on an ineligible holder. Explicit no-item remains `neutral`; none of these seven supported core effects uses `unsupported`.

Keep calculation identity item-agnostic: final compiled probability and damage branches remain in the key, while raw item ids and provenance do not. Probability-equivalent Scenario combinations therefore merge and aggregate attacker and defender item sources. In Actual mode, result surfaces display normalized effective hit probability; the Move Track continues to display the snapshot's original accuracy, so a merged `100` and item-modified `110` result deterministically displays `100%` rather than a first-encountered internal value.

Supporting records:

- [[../../docs/traces/discussion/2026-07-31-accuracy-and-critical-hit-item-semantics|Accuracy and critical-hit item semantics discussion trace]]
- [[../../docs/research/2026-07-31-held-item-modifier-phases-and-rounding|Held-item modifier phases and rounding]]
- [[../../docs/research/2026-07-31-frozen-held-item-mechanics-matrix|Frozen held-item mechanics matrix]]

## Acceptance handoff

- [ ] Before implementation is considered complete, audit every decision in the linked discussion trace line by line against the delivered behavior.
