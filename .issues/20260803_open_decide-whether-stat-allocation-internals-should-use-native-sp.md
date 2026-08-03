---
# This section is managed by the CLI. Do not edit manually.
id: "0154c832-e946-40c6-81d1-d53feb27dee2"
title: "Decide whether stat allocation internals should use native SP"
status: "open"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-03T07:33:00Z"
updated_at: "2026-08-03T07:33:00Z"
---
## Context

CONTEXT.md now defines Stat Allocation as Nature plus Pokémon Champions Stat Points (SP). The current implementation enumerates EV-shaped setups and derives SP labels from them. This may be an equivalent internal representation rather than a behavioral defect, so a rewrite is not assumed.

Relevant paths:

- src/lib/stat-value-template/ability-points.ts
- src/lib/calc-adapter/local-stats.ts
- src/lib/calc-adapter/stat-bounds.ts
- docs/domain/stat-value-template-display-labels.md
- src/lib/i18n/messages.ts

## Decision to make

Determine whether the implementation should model SP directly or retain the existing EV-compatible intermediary with clearer internal naming and documentation.

## Acceptance criteria

- Compare native SP and current EV-compatible results for every supported SP value and Nature modifier at level 50.
- Cover offense values, HP and defense pairs, boundary values 0 and 32, rounding, multiple labels for one Stat Value, and Stat Values with no label.
- Confirm whether the two representations are behaviorally equivalent and document any exceptions.
- Record a decision to retain or migrate the implementation, with the smallest required follow-up scope.
- If the intermediary is retained, identify terminology that must remain internal and update-facing wording that should use SP.