---
# This section is managed by the CLI. Do not edit manually.
id: "84651ec1-fd18-49ec-ab60-b29f4ff8034b"
title: "Add attacker and defender Stat stage tracks"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Let users compare attacker and defender Stat stages as independent multi-select Tracks, with critical-hit stage suppression compiled into each resulting Scenario.

## Acceptance criteria

- [ ] Both Tracks offer every integer from -6 through +6, default to only 0, require at least one selection, and reset or clear back to 0.
- [ ] The attacker Track modifies the current Move side offense stat and the defender Track modifies the matching bulk defense stat.
- [ ] Critical branches ignore negative attacker stages and positive defender stages while retaining positive attacker and negative defender stages.
- [ ] Critical stage +3 produces only the critical outcome; lower critical stages preserve both branches and their probability behaviour.
- [ ] Stage choices participate in row-product, calculation identity, effect-equivalent merging, and provenance; stage 0 remains only in folded source details.
- [ ] Representative physical and special stage/critical cases match @smogon/calc for every roll.

## Blocked by

- [[archive/20260717_closed_merge-effect-equivalent-scenarios-with-provenance|Merge effect-equivalent Scenarios with provenance]]
