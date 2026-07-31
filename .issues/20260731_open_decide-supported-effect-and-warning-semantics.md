---
# This section is managed by the CLI. Do not edit manually.
id: "9c12d055-0e45-42c8-9453-9d1764ec88eb"
title: "Decide supported-effect and warning semantics"
status: "open"
priority: "high"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T09:28:00Z"
---
## Question

What does it mean for a frozen item to be partially supported, which omitted effects can alter a displayed result, and when must the UI expose the red-dot tooltip warning?

Preserve the already chosen Resistance Berry behavior: single-hit reduction is supported; consumption is unsupported; static-item N-hit results remain visible and carry a red-dot tooltip explaining that real post-consumption hits are not modeled. Decide the general warning/provenance rule without expanding into a full Held item Track redesign.

## Parent map

[[20260731_open_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[archive/20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[archive/20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]
