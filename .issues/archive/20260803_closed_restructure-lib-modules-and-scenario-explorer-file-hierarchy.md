---
# This section is managed by the CLI. Do not edit manually.
id: "ee23e539-2e11-4120-a329-4d169fbde73f"
title: "Restructure lib modules and Scenario Explorer file hierarchy"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-03T10:19:00Z"
updated_at: "2026-08-03T11:13:00Z"
---
## Background

The current structure mixes domain logic, browser infrastructure, presentation styling, and React orchestration:

- `src/lib/calc-adapter/` owns damage formulas, battle mechanics, Scenario compilation, Stat calculation, and Stat-axis view data.
- `src/lib/scenario-pipeline/` combines Scenario evaluation, Track State defaults, stored Stat Preset lookup, row labels, and result formatting.
- Pure Scenario transitions live inside `use-scenario-state.ts`, while presentation mappings such as Stat tier CSS tokens leak into `lib` domain types.
- `src/components/scenario-explorer/` is a flat feature directory with several large handwritten files.
- Several shallow or misplaced modules make ownership unclear.

This is a structural refactor only. It must preserve existing product behavior and the information hierarchy required by `design.md` and [ADR-0002](../docs/adr/0002-game-hud-design-direction.md).

## Goal

Make module ownership and dependency direction explicit:

- Feature code owns React lifecycle, interaction, and presentation.
- `lib` owns domain models, pure calculations, pure state transitions, resource access, and persistence formats.
- Each `lib` module exposes a small public interface through its `index.ts`.
- Large handwritten files are split only at cohesive seams; no hard line-count rule.

## Target dependency direction

```text
Scenario Explorer feature
  ├── catalog
  └── scenario
        ├── damage-calculation
        ├── damage-distribution
        ├── stat-calculation
        └── stat-preset

damage-calculation
  ├── pokemon
  ├── move
  ├── held-item
  └── resources

catalog
  ├── resources
  ├── champions
  ├── move
  ├── held-item
  └── i18n
```

No `lib` module may depend on React, Feature files, or CSS class names.

## Required changes

### 1. Separate calculation responsibilities

- Replace `calc-adapter` with:
  - `damage-calculation/`: local damage kernel, battle mechanics, and Scenario Compiler.
  - `stat-calculation/`: Stat values, setups, bounds, ranges, and spread cache.
- Keep the product-scoped kernel and compiler contract from [ADR-0001](../docs/adr/0001-local-damage-kernel-for-generated-resources.md).
- Move type effectiveness out of the damage kernel into the Pokémon type module so Catalog does not depend on the damage engine.
- Stop re-exporting Move Snapshot functions through the calculation module.

### 2. Create a coherent Scenario module

Consolidate Scenario-owned logic under `src/lib/scenario/`:

- `types.ts`: Track State, Scenario results, provenance, and unavailable results.
- `state.ts`: default Track State, resolved Stat Presets, and expected row count.
- `transitions.ts`: Catalog transitions, Range/Preset reconciliation, and Track invariants.
- `evaluate.ts`: Scenario expansion, compilation, merge, and damage summary.
- `persistence/`: snapshot schema, migration, Catalog compatibility, and local storage operations.

Move pure functions such as `trackStateAfterCatalogTransition`, Range/Preset reconciliation, and Track normalization out of the React Hook.

Keep React effects, touched refs, debounce/pagehide orchestration, and async loading in the Scenario Explorer feature.

Move result-row label composition out of the Scenario evaluation module and into the Feature result presentation layer.

### 3. Remove presentation dependencies from domain types

- Remove `StatPreset.systemTier`.
- Remove CSS token types from Stat calculation results.
- Return semantic Preset/Snap identifiers from `lib`.
- Map semantic identifiers to labels and CSS classes inside the Scenario Explorer Stat Track feature.
- Move `stat-tier-colors.ts` and its tests into the Feature/style area.
- Move Pokémon CSS-variable helpers into the Pokémon UI implementation and delete the unused Chinese type-label table.

### 4. Consolidate small and misplaced modules

- Combine `move-snapshot.ts` and `move-semantics.ts` under `lib/move/`.
- Move Mega Stone identity and labels into `held-item/mega-stones.ts`; relocate the unknown Ability sentinel to Ability/Catalog ownership and remove duplicate unknown Mega Stone constants.
- Absorb the single-use `convolution` module into `damage-distribution`.
- Inline or colocate `ordered-pool-selection.ts` with its only production caller.
- Move Champions usage record types from `resources/types.ts` into `champions/types.ts`.
- Move `interaction-performance-monitor.ts` to `src/devtools/`.
- Move the domain color contrast test alongside the styles it verifies.

### 5. Reduce the Catalog interface

Remove unused `MatchupCatalog` fields and their builders:

- `attackerStats`
- `defenderBulks`
- `defaultAttackerStatIds`
- `defaultDefenderIds`

Split Catalog implementation into cohesive internal files for resource options, Champions defaults, and Catalog composition while retaining one public module interface.

### 6. Reorganize the Scenario Explorer feature

Move the feature from `src/components/scenario-explorer/` to `src/features/scenario-explorer/` with these main groups:

- `matchup/`
- `state/`
- `tracks/`, including focused `move/`, `stats/`, and `held-item/` groups
- `results/`
- page/workspace composition at the feature root

Split the largest UI files at existing seams:

- `scenario-explorer-page.tsx`: extract Scenario Workspace.
- `move-track.tsx`: extract Move picker dialog and Move Snapshot row/editor.
- `use-scenario-state.ts`: retain React orchestration after pure transitions and persistence implementation move to `lib`.

Shared shadcn primitives and Pokémon UI remain under `src/components/`.

### 7. Split data and global styles

- Split locale messages by locale while checking every locale against one canonical message-key set.
- Keep `src/index.css` as the CSS entry and split HUD theme, domain tokens, and Track Option rules without changing cascade order.

## Interface rules

- External callers import from `@/lib/<module>`, not implementation files.
- Files within a module use relative imports.
- Internal implementation files are not re-exported for test convenience.
- Tests exercise observable behavior through the module interface.
- Do not introduce ports, factories, or interfaces when only one implementation exists.
- Do not add dependencies or an architectural lint framework for this refactor.

## Acceptance criteria

- [x] Existing Scenario generation, calculation, persistence, Catalog loading, and UI behavior are unchanged.
- [x] The result-surface information hierarchy defined by `design.md` is unchanged.
- [x] `lib` has no dependency on React, Feature files, or CSS class names.
- [x] Pure Scenario state transitions are implemented and tested in `lib/scenario`.
- [x] Scenario Explorer imports only public `lib` module interfaces.
- [x] Dead Catalog fields and shallow single-use modules listed above are removed.
- [x] Generated resources under `src/lib/resources/generated/` are not manually split or rewritten.
- [x] No new runtime or development dependency is added.
- [x] `pnpm test` passes.
- [x] `pnpm build` passes.
- [x] `pnpm lint` passes.
- [x] `pnpm perf:scenario-explorer` passes after calculation/state restructuring.
- [x] The repository-required `design-taste-frontend` review confirms no visual or interaction regression.

## Resolution

- Replaced the flat `calc-adapter` and `scenario-pipeline` ownership with public `damage-calculation`, `stat-calculation`, `scenario`, `move`, `ability`, `pokemon`, and `held-item` modules.
- Moved Scenario Explorer to `src/features/scenario-explorer/`, split workspace/state, move, stats, held-item, matchup, common-track, and result seams, and kept React orchestration in the feature.
- Moved CSS ownership into `src/styles/hud.css`, `domain.css`, `track-options.css`, and `motion.css`; stat bounds now return semantic snap data while labels/classes stay in the Stat Track feature.
- Split locale messages and Catalog internals, removed dead Catalog fields, colocated persistence and single-use helpers, and moved dev tooling out of `lib`.
- Verification: `pnpm test` (35 files, 334 tests), `pnpm build`, `pnpm lint`, `pnpm perf:scenario-explorer`, and `git diff --cached --check` all pass. No generated resources or dependencies changed.

## Implementation order

1. Establish a green test/build/lint/performance baseline.
2. Delete dead Catalog fields and remove presentation dependencies from domain types.
3. Consolidate shallow/root modules.
4. Split `calc-adapter` into damage and Stat calculation modules.
5. Create `lib/scenario` and move pure transitions into it.
6. Clean Catalog, Resources, and Champions ownership.
7. Move and split the Scenario Explorer feature.
8. Split locale data and global styles.
9. Run the full verification and frontend review.

Keep mechanical moves and behavior-preserving code extraction separate enough that rename detection and review remain useful.

## Out of scope

- New Pokémon mechanics or broader battle simulation.
- UI redesign or result information changes.
- Splitting generated resources by size or alphabet.
- Changing native SP versus internal EV representation.
- Adding a general state-management framework.
- Adding speculative adapters or replaceable storage abstractions.
