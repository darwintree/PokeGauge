---
# This section is managed by the CLI. Do not edit manually.
id: "c199bf43-a2e5-40e8-9d5a-8b8e7981645b"
title: "Slice 2: Damage box plot visualization"
status: "closed"
priority: "high"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-06-26T00:47:00Z"
updated_at: "2026-06-26T12:57:00Z"
---
## Parent

[[../20260626_open_scenario-explorer-matchup-damage-comparison-ui|Scenario Explorer — matchup damage comparison UI]]

## What to build

Replace the text-only scenario rows from slice #1 with production **damage box plots** per the PRD visualization contract.

Same fixed matchup and default track selections (6 rows: 3 moves × standard offense × 2 items × standard bulk). Each **scenario** row renders a horizontal box plot:

- **Box** = normal **damage range** (min–max of 16 rolls), X axis 0–150% defender HP with tick marks and 100% reference line
- **Whiskers** = **crit range** endpoints
- **Bold vertical line** = arithmetic mean of normal rolls
- **OHKO label** when peak percent ≥ 100%; **lethal** red (≥100%), **warm** orange (≥75%), **cool** otherwise
- **Dashed bridge** when crit range sits above normal range
- **OHKO probability** text when any normal roll KOs (e.g. `37.5% OHKO`)
- Row labels summarize move, spread, item, defender; **hide move label** when only one move is selected
- Shared **axis** and **legend** above/below result list (prototype parity)

Promote visualization from prototype reference; wire to production pipeline output types.

## Acceptance criteria

- [ ] Each scenario row renders a box plot matching PRD semantics (not a text-only fallback)
- [ ] Shared damage axis (0–150% ticks, 100% reference line) and legend render above/below the result list
- [ ] OHKO scenarios show lethal red emphasis; warm orange tone at ≥75% peak; OHKO label at ≥100% peak
- [ ] OHKO probability percentage displays when applicable (normal-roll KO fraction)
- [ ] Crit whiskers and dashed bridge render when crit range exceeds normal max
- [ ] Single-move selection hides redundant move label on rows; multi-move default (3 moves) shows move labels
- [ ] Row labels show spread, item, and defender configuration summaries
- [ ] Fixed Garchomp → Incineroar page remains the default app experience with 6 default rows

## Blocked by

[[20260626_closed_slice-1-core-pipeline-fixed-matchup-text-results|Slice 1: Core pipeline + fixed matchup text results]]