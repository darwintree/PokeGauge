---
# This section is managed by the CLI. Do not edit manually.
id: "9c12d055-0e45-42c8-9453-9d1764ec88eb"
title: "Decide supported-effect and warning semantics"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T10:31:00Z"
---
## Question

What does it mean for a frozen item to be partially supported, which omitted effects can alter a displayed result, and when must the UI expose the red-dot tooltip warning?

Preserve the already chosen Resistance Berry behavior: single-hit reduction is supported; consumption is unsupported; static-item N-hit results remain visible and carry a red-dot tooltip explaining that real post-consumption hits are not modeled. Decide the general warning/provenance rule without expanding into a full Held item Track redesign.

## Parent map

[[../20260731_open_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]

## Resolution

Held-item support is scoped to the calculator outputs this effort promises: damage, hit probability, critical probability, and N-hit results. An omitted battle rule that cannot change those outputs does not make an item partially supported. Life Orb recoil, Choice-item move locking, Knock Off, Fling, and the other already excluded move/history behaviors therefore receive no warning.

Partial support is orthogonal to whether the supported item effect is effective or inactive. It is static item-option metadata, not a Scenario-dependent state: calculations and results remain available, and the Held item Track alone shows the red-dot tooltip. The warning does not change source state, calculation identity, ordering, effect-equivalent merge, provenance, or the Damage Conditions Card; no `partial` provenance state is introduced.

The initial static-warning set contains all 18 resistance Berries and Utility Umbrella. The Berry tooltip states that consumption is not modeled and N-hit treats the Berry as persistently held. The Utility Umbrella tooltip states that only ordinary weather damage modification is supported, while move-specific and accuracy weather interactions are not. Copy is shared by limitation category rather than generated per item, move, or Scenario.

The later form/identity decision must apply the same static warning rule to any item whose remaining unsupported form behavior can change calculator inputs or outputs. Items outside the frozen whitelist receive no warning handling.

Supporting record:

- [[../../docs/traces/discussion/2026-07-31-held-item-supported-effect-and-warning-semantics|Held-item supported-effect and warning semantics discussion trace]]

## Acceptance handoff

- [ ] Before implementation is considered complete, audit every decision in the linked discussion trace line by line against the delivered behavior.
