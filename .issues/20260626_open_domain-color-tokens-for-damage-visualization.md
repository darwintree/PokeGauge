---
# This section is managed by the CLI. Do not edit manually.
id: "00959cba-0787-4ff6-946e-f08065b59b1a"
title: "Domain color tokens for damage visualization"
status: "open"
priority: "medium"
labels: ["TECH-DEBT", "FEATURE-REQUEST"]
created_at: "2026-06-26T13:42:00Z"
updated_at: "2026-07-28T03:45:00Z"
---
## Context

The design direction is now the game HUD system in `design.md` (light-only; dark mode is dropped, see [[../docs/adr/0002-game-hud-design-direction]]). Domain visualization colors remain separate from chrome tokens per [[AGENTS.md]] and `design.md` § Domain colors.

`DamageBoxPlot` still uses Tailwind default palette classes (`amber-300`, `orange-400`, `red-500/600`, `violet-600/700`) instead of centralized domain tokens matching `design.md` § Lethality tones.

## What to build

- Add Pokémon / damage domain color CSS variables (e.g. `--damage-cool`, `--damage-warm`, `--damage-lethal`, `--damage-crit`) sourced from the lethality-tone gradients in `design.md` § Lethality tones (`#ffd98a→#f5b73f`, `#ffb066→#f58023`, `#ff7a6e→#e0352f`)
- Expose them in `@theme inline` if Tailwind utilities are needed
- Replace hardcoded Tailwind palette classes in `src/components/scenario-explorer/damage-box-plot.tsx` (and prototype mirror if still maintained)
- Keep domain tokens separate from shadcn semantics; do not fold into `--primary` / `--destructive`

## Out of scope

- Pokémon type / effectiveness / HP colors (future, same pattern)

## Acceptance criteria

- [ ] Domain damage colors live in one token block, not scattered Tailwind palette classes
- [ ] Values match the lethality tones in `design.md` (light-only)
- [ ] `DamageBoxPlot` legend, box tones, crit whiskers, and OHKO labels use domain tokens
- [ ] No regression in box plot semantics (cool / warm / lethal thresholds unchanged)