---
# This section is managed by the CLI. Do not edit manually.
id: "90d9db84-9cb7-4ac0-bb15-5b3001812e1d"
title: "Slice 4: Offense stat range track"
status: "open"
priority: "high"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-06-26T00:47:00Z"
updated_at: "2026-06-26T00:47:00Z"
---
## Parent

[[20260626_open_scenario-explorer-matchup-damage-comparison-ui|Scenario Explorer — matchup damage comparison UI]]

## What to build

Add the **offense stat range track** with preset XOR range mode for the fixed matchup page.

User can toggle the attacker offense track between:

- **Preset multi-select** (existing pills from slice #3)
- **Stat range axis** with snap points: neutral-zero EV, neutral-max EV, positive-nature max EV

Modes are **mutually exclusive** — never both active; range mode contributes **1** to row product (not preset selection count).

Range mode pipeline semantics (from prototype):

- One row per move × item × defender combination
- Damage **envelope** = min normal roll at low stat endpoint through max normal roll at high stat endpoint
- Crit whiskers use same stat endpoints
- Row label indicates interval × 16 roll envelope

Extend pipeline tests for range mode row count and envelope golden values.

## Acceptance criteria

- [ ] UI toggle switches offense track between preset pills and stat range axis (XOR)
- [ ] Stat range slider snaps to three anchor points
- [ ] Range mode: row count = moves × items × defenders (offense track counts as 1)
- [ ] Range rows show widened box plot envelope and interval labeling
- [ ] Switching back to preset mode restores preset rows; preset selections not double-counted with range
- [ ] Pipeline unit tests cover range mode row product and envelope semantics

## Blocked by

[[20260626_open_slice-3-sidebar-layout-and-multi-select-tracks|Slice 3: Sidebar layout and multi-select tracks]]