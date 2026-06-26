---
# This section is managed by the CLI. Do not edit manually.
id: "00959cba-0787-4ff6-946e-f08065b59b1a"
title: "Domain color tokens for damage visualization"
status: "open"
priority: "medium"
labels: ["TECH-DEBT", "FEATURE-REQUEST"]
created_at: "2026-06-26T13:42:00Z"
updated_at: "2026-06-26T13:42:00Z"
---
## Context

Geist/shadcn semantic tokens in `src/index.css` are now mapped from `design.md` / `design.dark.md`. Domain visualization colors remain separate per [[AGENTS.md]].

`DamageBoxPlot` still uses Tailwind default palette classes (`amber-300`, `orange-400`, `red-500/600`, `violet-600/700`) instead of Geist accent scales or centralized domain tokens.

## What to build

- Add Pokémon / damage domain color CSS variables (e.g. `--damage-cool`, `--damage-warm`, `--damage-lethal`, `--damage-crit`) sourced from Geist `amber-*`, `red-*`, `purple-*` in `design.md` / `design.dark.md`
- Expose them in `@theme inline` if Tailwind utilities are needed
- Replace hardcoded Tailwind palette classes in `src/components/scenario-explorer/damage-box-plot.tsx` (and prototype mirror if still maintained)
- Keep domain tokens separate from shadcn semantics; do not fold into `--primary` / `--destructive`

## Out of scope

- Pokémon type / effectiveness / HP colors (future, same pattern)
- Dark-mode theme toggle wiring

## Acceptance criteria

- [ ] Domain damage colors live in one token block, not scattered Tailwind palette classes
- [ ] Values match Geist accent scales for light and dark
- [ ] `DamageBoxPlot` legend, box tones, crit whiskers, and OHKO labels use domain tokens
- [ ] No regression in box plot semantics (cool / warm / lethal thresholds unchanged)