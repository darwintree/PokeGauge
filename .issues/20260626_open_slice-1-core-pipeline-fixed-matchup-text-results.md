---
# This section is managed by the CLI. Do not edit manually.
id: "c2a0834a-f915-419b-925e-c3bb62c9a03e"
title: "Slice 1: Core pipeline + fixed matchup text results"
status: "open"
priority: "high"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-06-26T00:47:00Z"
updated_at: "2026-06-26T00:51:00Z"
---
## Parent

[[20260626_open_scenario-explorer-matchup-damage-comparison-ui|Scenario Explorer — matchup damage comparison UI]]

## What to build

Establish the production **matchup scenario pipeline** end-to-end for a single fixed **matchup** (Garchomp → Incineroar, Champions · VGC 双打).

When the user opens the app, they see scenario rows generated from hardcoded **move pick** and default **track** selections — no manual parameter entry yet. Each row shows build-configuration labels plus text damage stats (min–max % of defender HP, average, OHKO probability).

This slice includes:

- **Vitest** as the first test runner in the repo
- **Calc adapter** over `@smogon/calc` with **Level 50** VGC semantics (prototype used Level 100; production must not)
- **Catalog registry** for one fixture: full move pick (top-N), all offense stat presets, all items, all defender bulk presets — catalog is complete even when defaults select a subset
- **Matchup scenario pipeline**: accepts arbitrary `TrackState` (preset offense mode only for now); applies **row product rule**; stable sort (move → stat → item → defender)
- Minimal production page replacing the scaffold landing experience (prototype query flag may remain for dev)

**Catalog** (all available options for fixture):

- Moves: top-3 usage moves (earthquake, dragon-claw, stone-edge)
- Offense stat presets: neutral-zero, neutral-max, standard, extreme
- Items: none, life-orb, choice-band
- Defender bulk: standard-bulk, min-bulk

**Default selected set** (first load — multi-move default view per decision map #1):

- Moves: **all 3** in catalog (multi-move parallel comparison)
- Offense stat: `standard` preset
- Items: `none` + `life-orb`
- Defender bulk: `standard-bulk`

Expected first-load row count: 3 × 1 × 2 × 1 = **6 rows**.

Pipeline type shape (from prototype):

```typescript
type TrackState = {
  moveIds: string[]
  statMode: "preset"
  attackerStatIds: string[]
  attackerItemIds: string[]
  defenderIds: string[]
}
```

## Acceptance criteria

- [ ] Vitest runs via `pnpm test` (or equivalent script added to package.json)
- [ ] Calc adapter computes min/max/avg damage, crit bounds, and OHKO probability from 16 normal rolls at **Level 50**
- [ ] Catalog registry exposes all track options listed above (not only defaults)
- [ ] Pipeline accepts arbitrary `TrackState` input and filters correctly — not hardcoded to defaults only
- [ ] Pipeline output row count equals moveCount × statCount × itemCount × defenderCount for default selections (6 rows for fixture defaults)
- [ ] Pipeline tests include at least one non-default `TrackState` case (e.g. deselecting a move reduces row count)
- [ ] Golden values for Garchomp / Earthquake / Incineroar computed at Level 50 — verified against `@smogon/calc` directly, not copied from prototype
- [ ] Calc adapter documents Champions ruleset → calc generation mapping
- [ ] Production app default route shows fixed Garchomp → Incineroar scenario list with 6 rows and real computed numbers (text, not box plots)
- [ ] Catalog and calc logic live in production modules under `src/`, not imported from prototype path

## Blocked by

None — can start immediately