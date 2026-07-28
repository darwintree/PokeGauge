---
version: alpha
name: PokeLens Game HUD
description: PokeLens game HUD design system, Light theme, the product's only theme. Direction decision: docs/adr/0002-game-hud-design-direction.md. Dark mode is dropped — the HUD language is light-only by product decision.
colors:
  ink: "#1f2430"
  paper: "#ffffff"
  bg-app: "#e8ecfa"
  bg-page: "#d9dfee"
  bg-sidebar: "#eef1fb"
  muted: "#8a90a5"
  hairline: "#e3e6f2"
  card-border: "#c9cede"
  signal-yellow: "#ffd23f"
  crit-violet: "#8b5cf6"
---

# PokeLens Game HUD (Light)

A game HUD / retro battle UI: chunky ink frames, hard offset shadows, rounded type, and toy-like controls wrapped around a dense, quiet data surface. This document is the design baseline for all product UI. It replaces the vendored Geist specification (see `docs/adr/0002-game-hud-design-direction.md`).

## Principles

1. **Frames outside, play inside (框在外，戏在里).** Visual weight — thick ink borders, hard shadows — belongs to outer containers (app frame, sidebar panels, the results board) and to interactive affordances (chips, toggles, hot badges). Dense result rows and their inner content stay flat. Never turn every row of a dense list into its own chunky card.
2. **Badge as signal (徽章即信号).** The yellow badge treatment exists to say "this row can one-shot". It appears only where there is information to flag. Decoration that repeats on every row becomes noise; signals must stay rare to stay legible.
3. **Shadow discipline.** Hard offset shadows mark containers and things you can press. Static content casts nothing. If everything has a shadow, nothing does.
4. **Toy language lives in the data ink.** The playful treatment (ink borders, pill shapes, gradients) is allowed on the elements that carry data: the damage box, crit whiskers, item sprites, type badges, KO chips. Structure around them (baselines, separators, alignment) stays hairline-quiet.
5. **The information hierarchy is an invariant.** What is shown, collapsed, or hidden on the results surface is a product decision recorded below. Restyling must not add, remove, merge, or reorder information; changing the hierarchy requires an explicit product request.

## Color

### Core palette

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#1f2430` | Frames, borders, primary text, average marker |
| `paper` | `#ffffff` | Cards, chips, board surface |
| `bg-app` | `#e8ecfa` | App frame background |
| `bg-page` | `#d9dfee` | Page background behind the app frame |
| `bg-sidebar` | `#eef1fb` | Sidebar column |
| `muted` | `#8a90a5` | Axis ticks, auxiliary labels, zero-state KO values |
| `hairline` | `#e3e6f2` | Row separators, quiet dividers |
| `card-border` | `#c9cede` | Quiet inner-card borders (conditions card) |
| `token-bg` | `#e8ebf6` | Condition token background |
| `signal-yellow` | `#ffd23f` | Hot KO badge, selected chips/toggles, notice accents |
| `crit-violet` | `#8b5cf6` | Critical-range whisker and endpoint dots |
| `notice-bg` | `#fff8e0` | Unavailable/amber notice background |
| `appbar` | `#3b4a7a → #2b3a63` | App bar gradient (vertical) |

### Lethality tones (damage box)

The box color encodes how close a row is to a KO, by **peak percent including the critical maximum**:

| Tone | Threshold | Gradient |
| --- | --- | --- |
| Amber | peak < 75% | `#ffd98a → #f5b73f` |
| Orange | 75% ≤ peak < 100% | `#ffb066 → #f58023` |
| Red | peak ≥ 100% | `#ff7a6e → #e0352f` |

### Domain colors

Pokémon type colors, effectiveness colors, and stat-tier colors are domain tokens owned by `src/index.css`. They are referenced by the HUD (type badges, chips) but never redefined by it, and they are not part of the chrome palette.

## Typography

- Stack: `ui-rounded, "SF Rounded", "Hiragino Maru Gothic ProN", "Yuanti SC", "PingFang SC", sans-serif`. Rounded faces are part of the toy language; do not substitute a grotesque.
- All numerals use `font-variant-numeric: tabular-nums`.
- Weights: 700 for quiet labels, 800 for chips/tokens/values, 900 for move names, effective power, hot badges, and titles.

| Size | Use |
| --- | --- |
| 8.5px | Identity-line side labels (攻击/防御) |
| 9px | Axis ticks, condition tokens, type badges |
| 9.5px | Range labels under the plot |
| 10.5px | Identity values, summary badges, switch label, legend |
| 11px | Chips, segmented toggle, KO column headers, notices |
| 12px | Move name, KO values |
| 13px | Effective power in the card header |
| 15px | App logo |
| 19px | Matchup title (attacker → defender) |

## Shape and depth

### Borders

- **2px `ink`**: app frame, results board, sidebar panels, chips, segmented toggle, switch, hot badge, notices, app-bar controls.
- **1.5px `ink`**: data ink — damage box, item sprites, type badges.
- **1.5px `card-border`**: quiet inner cards (conditions card). Inner cards never get ink borders or shadows.
- **1.5px `hairline`**: row separators and other quiet dividers.

### Radius

`5` type badge, token · `8` hot badge · `9` chips, inline toggles · `10` conditions card, segmented toggle, notice, species tile · `12` popovers · `14` sidebar panel · `16` results board · `20` app frame · `999` damage box and pill tracks.

### Shadows

Hard offsets only; blur shadows are not part of the language.

| Shadow | Use |
| --- | --- |
| `2px 2px 0` ink (or `rgba(31,36,48,.25)`) | Chips, hot badge, app-bar controls |
| `3px 3px 0 rgba(31,36,48,.18–.2)` | Sidebar panels, popovers |
| `4px 4px 0 rgba(31,36,48,.18)` | Results board |
| `6px 6px 0 ink` | App frame only |

## Layout

- The app is a single framed device: app bar on top, sidebar (300px) left, results column right.
- Sidebar tracks stack as panels; related pairs (offense/defense stats, stages, abilities; items/weather) sit in a 2-column grid, with the screens track paired against an empty cell.
- The results list lives on one **board** (the only chunky container in the results area). Rows inside the board are flat, separated by hairlines.
- Row grid: `236px` conditions card · `1fr` plot · `144px` KO columns.

### Damage axis (non-linear)

The horizontal damage axis maps HP percent to position non-linearly: 0–100% is linear across the first 72% of the width; 100–200% is square-root compressed into the remaining 28%; values cap at 200%.

```
f(p) = p/100 × 0.72                     for p ≤ 100
f(p) = 0.72 + sqrt((p−100)/100) × 0.28  for 100 < p ≤ 200
```

Ticks: `0, 25, 50, 75, 100, 200` → positions `0%, 18%, 36%, 54%, 72%, 100%`. A dashed vertical reference line sits at 100% (position 72%).

## Components

### App bar

Dark gradient bar (`appbar`) with ink bottom border: logo (white, yellow accent), locale selector, info, GitHub as pill controls (paper background, 2px ink border, `2px 2px 0` shadow). No theme toggle — the product is light-only.

### Sidebar panels and chips

Panels are paper cards (2px ink, radius 14, `3px 3px 0` shadow) with a small muted heading. Chips have three states: **on** (signal-yellow, ink border, `2px 2px 0` ink shadow), **alt/candidate** (dashed border, muted, no shadow), **add** (dashed ghost). An unsupported option carries a red dot. Species selects show the sprite tile, name, and type badges.

### Results header and toolbar

Matchup title (19px, 900) with a white text shadow. Below it the selection summary: secondary badges for moves / stats / items / defenders, and the rows-count badge in outline style pushed to the right edge. The toolbar holds the probability-mode segmented control (`16 roll | 实际概率`, selected segment in signal yellow) and the show-actual-values switch, right-aligned.

### Notice

Unavailable-move notices sit above the board: notice-bg, 2px ink border with an 8px yellow left bar, round yellow icon chip.

### Board and axis header

The board is paper (2px ink, radius 16, `4px 4px 0` shadow). Its top row is the sticky axis header: tick labels with tick marks over the plot column, the dashed 100% reference line, and the `OHKO` / `≤2HKO` column headers over the KO columns.

### Result row

Flat at rest; hairline separator below. A new move group is marked by a single 2px dashed divider (`rgba(31,36,48,.35)`) with extra spacing — there are no group headers and no per-row cards. On hover a row may lift into a card (border + shadow appear); at rest it must stay flat.

### Conditions card

Quiet inner card (1.5px `card-border`, radius 10, muted-tinted background, no shadow).

- **Header**: type badge, move name (12px/900), then right-aligned effective power (13px/900, tabular-nums) and an `ⓘ` formula-tip trigger. In 实际概率 mode the accuracy also appears next to the effective power.
- **Identity lines** (one per side): a 26px muted side label (`攻击` / `防御`), the stat-template label (700, truncated), the actual stat value (muted, only when the actual-values switch is on), then the side's active-condition tokens right-aligned.

### Condition tokens

- Active sources render as small tokens (9px/800, `token-bg`, radius 5, no border).
- Held items render as **item sprites** (icon only, 14px tile with 1.5px ink border); every other source renders as a text token.
- Attack-side line carries: attacker stage, held item, attacker ability, weather. Defense-side line carries: defender stage, defender ability, screen.
- The **"+N" chip** (dashed border, muted) collapses sources that are inactive, unsupported, or neutral — never active ones. On range-envelope rows the count includes the range-envelope entry. Opening it shows a popover listing each entry as `state · label`.

### Damage plot

- Hairline baseline across the full width.
- **Damage box**: pill (radius 999, 1.5px ink border) filled with the lethality-tone gradient, spanning min–max percent.
- **Average marker**: 3px ink bar, taller than the box. Hidden on range-envelope rows.
- **Critical whisker**: 2px crit-violet line with violet-ringed paper dots at both endpoints. A dashed bridge connects box max to crit min when they do not touch.
- **Range label** below the box, left-aligned to the box start: `min% ~ max%` (9.5px/800, tabular-nums).

### KO columns

Two always-visible text columns (`OHKO`, `≤2HKO`), 12px/800 tabular-nums, centered under their axis headers.

- Default: plain ink text.
- **Hot** (OHKO probability > 0): the value becomes a yellow badge — signal-yellow background, 2px ink border, radius 8, `2px 2px 0` ink shadow. This is the only sanctioned use of the badge treatment in rows, and it never replaces or removes the ≤2HKO value.
- Zero: `0%` in muted, no badge.
- Unavailable: the localized `不可用` label in muted.

### Legend

Below the rows, one line of legend items (10.5px/800, muted): normal range (orange pill swatch), critical range (violet line + dot), average (ink bar). Copy comes from the localized strings (`通常伤害（16 roll 最低 ~ 最高）` / `暴击伤害范围` / `平均伤害`); the average item is hidden when every row is a range envelope.

### Hidden information layers

Three layers appear only on demand and must stay on demand:

1. **Formula tip** (ⓘ on the card header): base power, STAB, type effectiveness, item (name · modifier), weather (name · modifier), spread, and the effective power total (plus accuracy in 实际概率 mode).
2. **"+N" popover**: the collapsed non-effective sources as `state · label` lines, plus the range-envelope note on range rows.
3. **Plot tooltip** (hover/focus on the plot): normal range, average, and critical range values with their legend markers.

Popovers are paper cards (2px ink, radius 12, `3px 3px 0` shadow).

## Information hierarchy invariants

The following is a product contract, not a styling suggestion. Changing it requires an explicit product request.

1. Every result row carries a full conditions card: type badge, move name, **effective** power, and the formula-tip entry. Move identity is never collapsed into group headers.
2. Each card has exactly two identity lines (attack / defense), and condition tokens attach to their side.
3. Active sources are always visible as tokens; only inactive, unsupported, and neutral sources collapse into "+N".
4. KO probabilities are two always-visible text columns; hot/zero/unavailable are visual states of the same values, never replacements for them, and never derived labels (e.g. "确 2") in place of percentages.
5. The axis is non-linear as specified, with the dashed 100% reference line always present.
6. Lethality tone uses the peak percent including the critical maximum, with the 75% / 100% thresholds.
7. Same-move rows share hairline separation; a single dashed divider marks a new move group. No other grouping chrome.
8. The range label (`min% ~ max%`) is always visible below the box.
9. Toolbar composition is fixed: probability-mode segmented control + show-actual-values switch. Accuracy shows in card headers only in 实际概率 mode; actual stat values show on identity lines only when the switch is on.
10. The results header composition is fixed: matchup title, selection-summary badges, rows-count badge.

## Accessibility

- The hot badge is ink text on signal yellow — contrast is safe; do not invert it to yellow text on white.
- Muted 8.5–9.5px text is supplementary only; primary values (effective power, ranges, KO probabilities) are never set below 9.5px or in muted on quiet backgrounds.
- Hover-only layers must also open on focus; keep visible focus rings on `ⓘ`, "+N", and the plot region.
- Honor reduced motion: row lift and badge rotation (if ever animated) are dropped under `prefers-reduced-motion`.

## Pending decisions

- **Motion**: durations/easings for row lift, popovers, and mode switches are not specified yet.
- **Font bundling**: the rounded system stack is the baseline; bundling a rounded face for consistent rendering is a later call.
- **Mobile density**: the spec is desktop-first; the mobile setup/results split and board behavior below the sidebar breakpoint are unspecified.

## Out of scope

- **Dark mode is dropped.** The HUD language (ink frames on a light canvas, hard shadows, yellow signal badges) is designed and specified light-only; the theme toggle, dark tokens, and the vendored Geist dark document were removed with this decision. Do not reintroduce `.dark` token blocks or theme plumbing without a new product decision.
