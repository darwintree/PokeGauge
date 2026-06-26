---
# This section is managed by the CLI. Do not edit manually.
id: "42c448ab-2dcf-4a97-84ba-184266855e30"
title: "Scenario Explorer — matchup damage comparison UI"
status: "closed"
priority: "high"
labels: ["READY-FOR-HUMAN", "FEATURE-REQUEST"]
created_at: "2026-06-26T00:45:00Z"
updated_at: "2026-06-26T13:06:00Z"
---
## Problem Statement

VGC 双打玩家在评估「某宝可梦打某宝可梦」时，需要快速看到多种常见配置下的伤害区间与 OHKO 可能性。传统计算器要求用户逐项填写招式、性格、努力、道具等，输入成本高，难以一次性对比「标准输出 vs 极限坦度」「无道具 vs 生命宝珠」等常见 scenario。

用户希望以**最小输入**（仅选择进攻方与防守方）即可获得充分的伤害对比信息，并能在同一页通过调整配置维度逐步**收紧**结果，而不切换模式或进入分步向导。

## Solution

提供 **Scenario Explorer** 主界面：用户选定一个 **matchup**（进攻方 → 防守方）后，系统按 **Pokémon Champions · VGC 双打** 规则自动展开 **move pick**（使用率 top-N 招式）与默认 **track** 选中集，生成多行 **scenario** 箱形图对比。左栏 sticky 参数区（desktop）或结果上方参数块（mobile）承载各 **track** 控件；用户减少 track 选中即进入 **detailed view** 语义（行数下降或 envelope 变窄），无需模式切换。

每行 scenario 以水平箱形图展示：**damage range**（箱体）、**crit range**（须须）、平均伤害竖线；X 轴为伤害占防守方 HP 百分比，≥100% 强调并标注 OHKO。

## User Stories

1. As a VGC 双打玩家, I want to pick only an attacker and defender Pokémon, so that I can see damage outcomes without configuring every battle parameter upfront.

2. As a VGC 双打玩家, I want the system to automatically include the most commonly used moves for the attacker, so that I do not have to know the meta move pool before calculating.

3. As a VGC 双打玩家, I want each selected move to produce its own scenario rows, so that I can compare Earthquake vs Dragon Claw at a glance.

4. As a VGC 双打玩家, I want default results to include common offensive spreads, items, and defensive bulk presets, so that the first screen answers typical team-building questions.

5. As a VGC 双打玩家, I want to see how many scenario rows are shown based on my current track selections, so that I understand the combinatorial scope of my comparison.

6. As a VGC 双打玩家, I want to deselect moves I am not interested in, so that I can narrow the comparison without leaving the page.

7. As a VGC 双打玩家, I want to select multiple offensive stat presets at once, so that I can compare neutral-zero, standard, and extreme offense in one view.

8. As a VGC 双打玩家, I want to switch the offense stat track to a numeric range selector, so that I can explore a continuous band of attack stats instead of fixed presets.

9. As a VGC 双打玩家, I want offense stat range and preset multi-select to be mutually exclusive, so that row counts are not double-counted.

10. As a VGC 双打玩家, I want stat range sliders to snap to neutral-zero, neutral-max, and positive-nature max EV anchors, so that I can quickly hit community-standard benchmarks.

11. As a VGC 双打玩家, I want to adjust only the relevant offense stat for the attacker and only HP plus the relevant bulk stat for the defender, so that controls match how I think about spreads.

12. As a VGC 双打玩家, I want to multi-select attacker items such as no item, Life Orb, and Choice Band, so that I can compare item tradeoffs in one pass.

13. As a VGC 双打玩家, I want to multi-select defender bulk presets such as standard bulk and minimum bulk, so that I can bracket realistic and worst-case durability.

14. As a VGC 双打玩家, I want each scenario row to show a horizontal box plot of damage as a percentage of defender HP, so that OHKO thresholds are immediately visible.

15. As a VGC 双打玩家, I want the box to span the full normal 16-roll damage range, so that I see minimum-to-maximum non-crit outcomes.

16. As a VGC 双打玩家, I want whiskers to show the crit damage range, so that I can assess crit OHKO lines separately from normal rolls.

17. As a VGC 双打玩家, I want a bold vertical line at average normal-roll damage, so that I can reason about expected damage quickly.

18. As a VGC 双打玩家, I want damage at or above 100% HP to be visually emphasized in red with an OHKO label, so that lethal scenarios stand out.

19. As a VGC 双打玩家, I want a dashed bridge when crit range sits above normal range, so that the relationship between normal and crit envelopes is clear.

20. As a VGC 双打玩家, I want scenario row labels to summarize move, spread, item, and defender configuration, so that I can map each plot to its build configuration.

21. As a VGC 双打玩家, I want move names hidden on rows when only one move is selected, so that redundant labels do not clutter the view.

22. As a VGC 双打玩家, I want stat-range rows to indicate that the envelope combines stat endpoints with 16 rolls, so that I do not misread the band as a single fixed spread.

23. As a VGC 双打玩家, I want the parameter panel to stay visible while scrolling results on desktop, so that I can refine tracks without losing context.

24. As a VGC 双打玩家, I want parameters stacked above results on mobile, so that the layout remains usable on small screens.

25. As a VGC 双打玩家, I want the results area to have stronger visual priority than the parameter panel, so that damage charts remain the focal point.

26. As a VGC 双打玩家, I want calculations to follow Pokémon Champions rules and VGC doubles conventions, so that numbers match the format I actually play.

27. As a VGC 双打玩家, I want Level 50 VGC spreads reflected in default presets, so that defaults match tournament reality rather than Level 100 singles.

28. As a team builder, I want OHKO probability derived from the 16 normal rolls, so that I know what fraction of rolls KO at the defender's current HP.

29. As a team builder, I want scenario rows sorted consistently by move, offense config, item, and defender, so that comparisons remain stable as I toggle selections.

30. As a returning user, I want tightening results to mean reducing track selections on the same page, so that I never hunt for an "advanced mode" toggle.

31. As a returning user, I want the same row-product rule in default and detailed views, so that mental model stays consistent.

32. As a developer maintaining the app, I want hardcoded move usage and preset catalogs for the first release, so that we can ship before live usage APIs exist.

33. As a developer maintaining the app, I want the damage engine to use a proven calc library until Champions-native data is ready, so that formulas stay trustworthy during transition.

34. As a accessibility-conscious user, I want lethal/warm/cool color encoding supplemented in future work, so that OHKO emphasis is not color-only (deferred).

35. As a competitive player, I want type matchup tables and share links deferred, so that the first release stays focused on damage scenarios.

## Implementation Decisions

### Product scope

- Ship the **Scenario Explorer** as the primary calculator experience, replacing the current scaffold landing page for real usage (prototype query flag may remain for development).
- **Ruleset** fixed to **Pokémon Champions**; **battle format** fixed to **VGC 双打**. No ruleset or format selector in v1.
- **Matchup minimum input**: attacker species + defender species only. Moves come from **move pick** (usage-ranked top-N, hardcoded per species in v1).
- **Default view** vs **detailed view** is not a separate UI mode. **Detailed view** = user reduces track selections relative to default selected sets defined at implementation time.

### Architecture — single primary seam

All feature behavior funnels through one **matchup scenario pipeline** module:

**Input**: matchup identity (attacker, defender), track state (per-track selected option ids and optional stat range), ruleset/format constants.

**Output**: ordered list of **scenario rows**, each carrying build-configuration labels plus computed damage stats (`min/max/avg` damage and percent, crit min/max, optional OHKO probability).

Responsibilities inside the pipeline:
1. Resolve **move pick** for attacker under Champions/VGC context.
2. Resolve track option catalogs (presets, items, defender bulk) for the matchup's physical/special context.
3. Apply **row product rule**: display row count = ∏(selected count per track); range track always contributes 1.
4. For preset offense track: one row per selected spread × move × item × defender combination.
5. For range offense track: one row per move × item × defender; damage envelope merges stat-range endpoints with 16-roll min/max (prototype `computeDamageForStatRange` semantics).
6. Delegate per-row damage math to a thin **calc adapter** over `@smogon/calc`, mapping product ruleset to engine generation until Champions-native data lands.

UI layer (`useScenarioState` equivalent + layout components) becomes a thin consumer: track widgets update state → pipeline recomputes → results + box plots render.

### Track model (from prototype)

Tracks for v1 fixture generalization:

| Track | Type | Notes |
|-------|------|-------|
| Move | Multi-select | Options from move pick |
| Attacker offense stat | Multi-select **XOR** range | Toggle between preset pills and stat range axis; never both |
| Attacker item | Multi-select | Includes explicit "no item" |
| Defender bulk | Multi-select | HP + relevant bulk stat presets |

**Row product rule** (domain term from glossary):

```
displayRows = moveCount × offenseTrackCount × itemCount × defenderCount
where offenseTrackCount = presetSelections OR 1 (range mode)
```

Type shape from prototype (trimmed):

```typescript
type StatSelectMode = "preset" | "range"

type TrackState = {
  moveIds: string[]
  statMode: StatSelectMode
  attackerStatIds: string[]      // preset mode
  statRange: { min: number; max: number }  // range mode
  attackerItemIds: string[]
  defenderIds: string[]
}

type ScenarioRow = {
  moveId: string
  attackerStatId: string
  attackerItemId: string
  defenderId: string
  statRange?: { min: number; max: number }
  // damage stats: min/max/avg damage & percent, crit min/max, ohkoChance?
}
```

Filtering/sorting: subset selected ids per track, stable sort by catalog order (move → stat → item → defender).

### Damage visualization contract

- X axis: 0–150% of defender HP.
- **Box** = normal **damage range** (min–max of 16 rolls).
- **Whiskers** = **crit range** endpoints.
- **Bold vertical line** = arithmetic mean of normal rolls.
- **OHKO label** when peak (normal or crit max percent) ≥ 100%.
- **Lethal / warm / cool** tone from peak percent thresholds (≥100%, ≥75%, else); a11y alternatives deferred.

### Stat range axis

- Bounds derived per attacker species and relevant offense stat (prototype enumerates legal nature/EV spreads).
- **Snap points**: neutral-zero EV, neutral-max EV, positive-nature max EV (non-HP stats).
- Range row damage: min normal roll at low stat endpoint, max normal roll at high stat endpoint; crit whiskers likewise; average = mean of low/high endpoint averages; OHKO from high endpoint rolls.

### Page layout (Variant B — Sidebar refine)

- Single page: left sticky parameter sidebar (desktop ~18rem) + main results column.
- Mobile: parameter block stacked above results; no separate steps or drawers.
- Matchup selector at top of parameter panel; track controls below; results header shows selection summary and row count.

### Data & catalogs (v1)

- Hardcode move usage lists per species (Champions/VGC doubles context); N per species TBD at implementation (prototype uses 3 for Garchomp).
- Hardcode attacker stat presets, item list, defender bulk presets aligned with VGC Level 50 conventions.
- Single fixture matchup validated in prototype (Garchomp → Incineroar); v1 must generalize species selection while keeping catalog approach.

### Module boundaries

| Module | Role |
|--------|------|
| Matchup scenario pipeline | Pure orchestration + row product + sorting |
| Calc adapter | `@smogon/calc` wrapper, StatSetup types, GEN mapping |
| Catalog registry | Move pick, presets, items, defenders per ruleset/format |
| Scenario explorer UI | Layout, track widgets, box plot, state hook |

Promote prototype logic from mock-data/damage-calc into production modules under `src/` (exact folder structure left to implementer; keep pipeline pure and UI thin).

### Catalog vs default selected sets

Two distinct concepts — do not conflate:

| Concept | Meaning | Example (Garchomp fixture) |
|---------|---------|----------------------------|
| **Catalog** | All options a track can offer | 3 moves in move pick; 4 offense presets; 3 items; 2 defender bulks |
| **Default selected set** | Which catalog options are pre-selected on first load (**default view**) | All 3 moves; `standard` offense; `none` + `life-orb` items; `standard-bulk` defender |

**Default view move pick** (per decision map #1): pre-select **all top-N moves** in the catalog so the first screen shows multi-move parallel comparison — not a single-move deep dive. User tightens by deselecting moves in **detailed view**.

Document both catalog definitions and default selected sets as code constants.

### Default selected sets (v1 fixture)

- **Moves**: all top-N in catalog selected (N = 3 for Garchomp fixture)
- **Offense stat**: `standard` preset only (user expands to neutral-zero / extreme via tracks)
- **Items**: `none` + `life-orb`
- **Defender bulk**: `standard-bulk` only (user expands to `min-bulk` via tracks)

First-load row count for fixture: 3 × 1 × 2 × 1 = **6 rows** (text or box plot depending on slice).

### Row overflow presentation

When row product exceeds comfortable density, presentation may group or collapse rows without changing the row product contract. Specific UX deferred; pipeline still returns full row set.

## Testing Decisions

**Principle**: Test **external behavior** of the matchup scenario pipeline and calc adapter — not React component internals or CSS.

**Primary seam under test**: **Matchup scenario pipeline** (single integration surface).

**What to test**:

1. **Row product rule**: given track state, output row count equals product of track selection counts; range mode contributes 1 for offense track.
2. **Preset mode filtering**: deselecting a move/item/defender/stat preset excludes corresponding rows only.
3. **Range mode**: switching stat mode excludes preset rows; each surviving row includes statRange; offense preset selections ignored.
4. **Sorting stability**: row order matches catalog order for equal selections.
5. **Calc adapter — preset row**: known fixture (species, move, spreads, item, defender) produces expected min/max/avg damage, crit bounds, and OHKO count vs reference `@smogon/calc` output or golden values.
6. **Calc adapter — range row**: stat range envelope matches prototype semantics (low endpoint min roll, high endpoint max roll).
7. **Snap point helpers**: bounds include correct anchor values for fixture species.

**Modules not requiring unit tests in v1**: presentational components (box plot, layout) — covered by manual/visual QA and prototype parity check.

**Prior art**: No existing test suite in repo; establish first tests alongside pipeline module (e.g. Vitest). Golden values must be computed at **Level 50** — do not copy prototype numbers (prototype used Level 100). Verify against `@smogon/calc` directly for Garchomp/Earthquake/Incineroar fixture rows.

**Manual QA checklist**: desktop sticky sidebar, mobile stack, OHKO coloring, multi-move label hide, preset/range toggle, row count summary updates.

## Out of Scope

- Ruleset or battle format switching UI
- Singles OU or non-VGC formats as parallel defaults
- Live Smogon/official usage API integration (hardcode only in v1)
- Type effectiveness chart, stat table, copy/share links on results
- Accessibility beyond basic semantics (color-blind-safe lethal encoding deferred)
- Abilities, weather, terrain, stat stages beyond spread presets (unless already implied by preset catalog)
- Multi-target spread damage, ally adjacency, redirect mechanics
- User accounts, saved matchups, URL deep-linking
- Replacing `@smogon/calc` before Champions data exists (adapter must allow future swap)

## Further Notes

- **Decision map**: [`docs/decision-maps/ui-prototype.md`](../docs/decision-maps/ui-prototype.md) — tickets #1–#6 closed; this PRD captures the resolved frontier.
- **Domain glossary**: [`CONTEXT.md`](../CONTEXT.md) — use ubiquitous language in code and UI copy.
- **Prototype reference**: scenario explorer under prototype path; layout verdict = Variant B Sidebar refine. Use as interaction reference, not copy-paste production structure.
- **Open implementation choices** (agent discretion): exact N per species in catalog, row overflow UX, species picker UX (searchable select vs hardcoded demo list for v1).
- **Engine note**: prototype uses Gen 9 `@smogon/calc` at Level 100; production uses **Level 50** VGC. Document the Champions → calc-generation mapping in the calc adapter module.
- **UI language**: production UI copy in **中文** (match prototype); code identifiers in English.
- **Move category routing**: offense stat and bulk stat tracks depend on move category (physical → atk/def, special → spa/spd). Slice 5 implemented matchup-level category-aware catalogs (single-category attackers in v1).
- **Parent vs slices**: this PRD is planning-only. Implementation work lives in child slice issues marked `READY-FOR-AGENT`.

## v1 Delivery Status

**Status: v1 complete** (2026-06-26). All implementation slices closed:

| Slice | Issue |
|-------|-------|
| 1 — Core pipeline + fixed matchup | [[archive/20260626_closed_slice-1-core-pipeline-fixed-matchup-text-results\|Slice 1]] |
| 2 — Damage box plot | [[archive/20260626_closed_slice-2-damage-box-plot-visualization\|Slice 2]] |
| 3 — Sidebar layout + multi-select tracks | [[archive/20260626_closed_slice-3-sidebar-layout-and-multi-select-tracks\|Slice 3]] |
| 4 — Offense stat range track | [[archive/20260626_closed_slice-4-offense-stat-range-track\|Slice 4]] |
| 5 — Matchup selector + catalog expansion | [[archive/20260626_closed_slice-5-matchup-selector-and-catalog-expansion\|Slice 5]] |

Production entry: `src/components/scenario-explorer/` + `src/lib/scenario-pipeline/` + `src/lib/catalog/registry.ts`.

**Resolved at implementation time** (agent discretion): N=3 moves per species; searchable species select; category-aware catalogs (physical/special).

**Still deferred** (per Out of Scope / user stories #34–35): row overflow UX, color-blind lethal encoding, type chart, share links, live usage API, URL deep-linking, abilities/weather beyond preset spreads.