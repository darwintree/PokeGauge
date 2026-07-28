---
version: alpha
name: PokeLens Game HUD
description: PokeLens game HUD design system, Light theme, the product's only theme. Direction decision: docs/adr/0002-game-hud-design-direction.md. Dark mode is dropped — the HUD language is light-only by product decision.
colors:
  ink: "#1f2430"
  paper: "#ffffff"
  bg-app: "#e8ecfa"
  bg-sidebar: "#eef1fb"
  hud-muted: "#606776"
  hairline: "#e3e6f2"
  card-border: "#c9cede"
  token-bg: "#e8ebf6"
  signal-yellow: "#ffd23f"
  crit-violet: "#8b5cf6"
  notice-bg: "#fff8e0"
  appbar: "#3b4a7a → #2b3a63"
  destructive: "#e0352f"
---

# PokeLens Game HUD (Light)

A game HUD / retro battle UI: chunky ink frames, hard offset shadows, rounded type, and toy-like controls wrapped around a dense, quiet data surface. Prioritize readability and information density; color, weight, and shadow signal state and hierarchy, never decoration.

This document is the design baseline for all product UI: it records principles, systems, and product contracts. Per-element sizes, weights, and pixel assignments are implementation details — the code (`src/index.css` tokens and component classes) is the source of truth for them. It replaces the vendored Geist specification (see `docs/adr/0002-game-hud-design-direction.md`); universal guidance from that framework that still fits the HUD direction has been folded into this document.

## Principles

1. **Frames outside, play inside (框在外，戏在里).** Visual weight — thick ink borders, hard shadows — belongs to outer containers (sidebar panels, the results board) and to interactive affordances (chips, toggles, hot badges). Dense result rows and their inner content stay flat. Never turn every row of a dense list into its own chunky card.
2. **Badge as signal (徽章即信号).** The yellow badge treatment exists to say "this row can one-shot". It appears only where there is information to flag. Decoration that repeats on every row becomes noise; signals must stay rare to stay legible.
3. **Shadow discipline.** Hard offset shadows mark containers and things you can press. Static content casts nothing. If everything has a shadow, nothing does.
4. **Toy language lives in the data ink.** The playful treatment (ink borders, pill shapes, gradients) is allowed on the elements that carry data: the damage box, crit whiskers, item sprites, type badges, KO chips. Structure around them (baselines, separators, alignment) stays hairline-quiet.
5. **The information hierarchy is an invariant.** What is shown, collapsed, or hidden on the results surface is a product decision recorded below. Restyling must not add, remove, merge, or reorder information; changing the hierarchy requires an explicit product request.

## Color

Tokens are role-based: color signals state or hierarchy, never decoration.

### Core palette

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#1f2430` | Frames, borders, primary text, average marker |
| `paper` | `#ffffff` | Cards, chips, board surface |
| `bg-app` | `#e8ecfa` | App canvas background (whole page; there is no outer frame) |
| `bg-sidebar` | `#eef1fb` | Sidebar column |
| `hud-muted` | `#606776` | Axis ticks, auxiliary labels, zero-state KO values. Calibrated to hold WCAG AA (≥ 4.5:1) on every surface muted text sits on — paper, card tints, token backgrounds. (Code token is `--hud-muted`; shadcn's semantic `--muted` instead aliases `bg-sidebar`.) |
| `hairline` | `#e3e6f2` | Row separators, quiet dividers |
| `card-border` | `#c9cede` | Quiet inner-card borders (conditions card) |
| `token-bg` | `#e8ebf6` | Condition token background |
| `signal-yellow` | `#ffd23f` | Hot KO badge, selected chips/toggles, notice accents |
| `crit-violet` | `#8b5cf6` | Critical-range whisker and endpoint dots |
| `notice-bg` | `#fff8e0` | Unavailable/amber notice background |
| `appbar` | `#3b4a7a → #2b3a63` | App bar gradient (vertical) |
| `destructive` | `#e0352f` | Remove-affordance hover, invalid rings, unsupported-option dot. Shared with the red lethality tone. |

### Lethality tones (damage box)

The box color encodes how close a row is to a KO, by **peak percent including the critical maximum**:

| Tone | Class | Threshold | Gradient |
| --- | --- | --- | --- |
| Amber | `damage-tone--cool` | peak < 75% | `#ffd98a → #f5b73f` |
| Orange | `damage-tone--warm` | 75% ≤ peak < 100% | `#ffb066 → #f58023` |
| Red | `damage-tone--lethal` | peak ≥ 100% | `#ff7a6e → #e0352f` |

### Domain colors

Pokémon type colors, effectiveness colors, and stat-tier colors are domain tokens owned by `src/index.css`. They are referenced by the HUD (type badges, chips) but never redefined by it, and they are not part of the chrome palette.

## Typography

- Stack: `"Baloo 2 Variable", "Yuanti SC", "PingFang SC", "Hiragino Maru Gothic ProN", "Microsoft YaHei", sans-serif`. Baloo 2 (OFL-1.1) is bundled via `@fontsource-variable/baloo-2` and carries Latin + digits on every platform; CJK falls back to system faces, SC forms first so Japanese kanji variants never leak into Chinese text. Rounded faces are part of the toy language; do not substitute a grotesque. The SC-first ordering only protects Chinese text — the reverse direction (zh-hant, ja) is a pending decision, below.
- All numerals use `font-variant-numeric: tabular-nums`. Baloo 2 ships real tabular figures, so this is effective everywhere, not just on macOS.
- Weight follows role, and 800 is the ceiling (Baloo 2 tops out there): **800** carries data and identity (values, chips, tokens, move and species names, badges, titles); **700** marks emphasis labels (summary badges, KO column headers, identity-line values); **500** is control and option text (shadcn primitives, picker lists); **400** is supplementary notes. One view should stay within three of these steps.
- The size scale is compact and dense-data-first: auxiliary metadata sits at the bottom of the scale, primary values and titles at the top. Primary data values are never set smaller than supplementary labels. Concrete size assignments live in the code.
- Text has three roles: titles identify, labels describe, data values carry the product. When emphasis competes, data wins (principle 4).

## Layout

- The app sits directly on the `bg-app` canvas with no outer frame: a full-width app bar on top, then a centered content column capped at `max-w-7xl`. On desktop the column splits into a fixed-width sidebar (left) and the results column (right); on mobile, setup and results become separate views. Every layout must work on both.
- Spacing follows a 4px scale with a three-step rhythm: tight inside a group, looser between groups, loosest between sections. Concrete values live in the code.
- Breakpoints are the Tailwind defaults (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280); the sidebar ↔ stacked split happens at `lg`.
- Sidebar tracks stack as panels; related pairs (offense/defense stats, stages, abilities; items/weather) sit side by side, with the screens track paired against an empty cell.
- The results list lives on one **board** (the only chunky container in the results area). Rows inside the board are flat, separated by hairlines; a new move group is marked by a single dashed divider. There are no group headers and no per-row cards.
- Each result row is three zones: the conditions card, the damage plot, and the KO columns.

### Damage axis (non-linear)

The horizontal damage axis maps HP percent to position non-linearly: 0–100% is linear; 100–200% is square-root compressed into the remainder; values cap at 200%. A dashed vertical reference line at 100% is always present. The exact mapping lives in `damage-box-plot.tsx`.

## Shape and depth

- **Borders carry three roles.** Thick (2px) `ink` for chrome and pressable affordances; thin (1px) `ink` for data ink — the elements that carry data; `hairline` / `card-border` for quiet separators and inner cards. Inner cards never get ink borders or shadows. (Thin ink was once spec'd as 1.5px, but Blink floors fractional border widths, so 1px is the deterministic render.)
- **Radius scales with surface size**, from small badges up to the results board; the full pill radius is reserved for data marks (damage box, pill tracks). Do not mix ad-hoc radii outside the scale.
- **Shadows are hard offsets only**, stepping up with elevation from chips to panels to the board. Blur shadows are not part of the language. What may cast one at all is principle 3.

## Motion

Motion is used only when it clarifies a change, never for decoration. Most HUD interactions should feel instant — a duration of `0ms` is often the snappiest and best choice. When motion genuinely helps, such as revealing or moving an element, keep it short and physical. Honor `prefers-reduced-motion` by dropping nonessential motion. Concrete durations and easings are implementation details.

## Components

Every interactive element shows a visible hover affordance and a `:focus-visible` ring; never remove a focus indicator without a visible replacement. Disabled states are muted with a not-allowed cursor.

### App bar

Dark gradient bar (`appbar`) with ink bottom border: logo (white, yellow accent), locale selector, info, GitHub as pill controls. No theme toggle — the product is light-only.

### Sidebar panels and chips

Panels are paper cards with a small muted heading. Chips have three states: **on** (signal-yellow), **alt/candidate** (dashed, muted), **add** (dashed ghost). An unsupported option carries a red dot — and the state is part of its accessible name too, never color alone. Species selects show the sprite tile, name, and type badges.

### Results header and toolbar

Matchup title (attacker → defender), then the selection summary: secondary badges for moves / stats / items / defenders, and the rows-count badge in outline style pushed to the right edge. The toolbar holds the probability-mode segmented control (`16 roll | 实际概率`, selected segment in signal yellow) and the show-actual-values switch, right-aligned.

### Notice

Unavailable-move notices sit above the board, tinted `notice-bg` with a yellow accent bar and icon.

### Board and axis header

The board is the results area's only chunky container. Its top row is the sticky axis header: tick labels over the plot column, the dashed 100% reference line, and the `OHKO` / `≤2HKO` column headers over the KO columns.

### Result row

Flat at rest; hairline separator below. On hover a row lifts into a card (ink frame + hard shadow appear, without layout shift); at rest it must stay flat.

### Conditions card

Quiet inner card — muted-tinted, thin quiet border, no shadow.

- **Header**: type badge, move name, then right-aligned effective power and an `ⓘ` formula-tip trigger. In 实际概率 mode the accuracy also appears next to the effective power.
- **Identity lines** (one per side): a muted side label (`攻击` / `防御`), the stat-template label, the actual stat value (only when the actual-values switch is on), then the side's active-condition tokens right-aligned.

### Condition tokens

- Active sources render as small tokens. Held items render as **item sprites** (icon only); every other source renders as a text token.
- Attack-side line carries: attacker stage, held item, attacker ability, weather. Defense-side line carries: defender stage, defender ability, screen.
- The **"+N" chip** collapses sources that are inactive, unsupported, or neutral — never active ones. It aggregates across both sides and renders once, at the end of the defense line. On range-envelope rows the count includes the range-envelope entry. Opening it shows a popover listing each entry as `state · label`.

### Damage plot

- Hairline baseline across the full width.
- **Damage box**: pill filled with the lethality-tone gradient, spanning min–max percent.
- **Average marker**: ink bar, taller than the box. Hidden on range-envelope rows.
- **Critical whisker**: crit-violet line with ringed dots at both endpoints. A dashed bridge connects box max to crit min when they do not touch.
- **Range label** below the box, left-aligned to the box start: `min% ~ max%`, always visible.

### KO columns

Two always-visible text columns (`OHKO`, `≤2HKO`), centered under their axis headers.

- Default: plain ink text.
- **Hot** (OHKO probability > 0): the value becomes a yellow badge. This is the only sanctioned use of the badge treatment in rows, and it never replaces or removes the ≤2HKO value.
- Zero: `0%` in muted, no badge.
- Unavailable: the localized `不可用` label in muted.

### Legend

Below the rows, one line of muted legend items: normal range (pill swatch), critical range (violet line + dot), average (ink bar). Copy comes from the localized strings; the average item is hidden when every row is a range envelope.

### Hidden information layers

Three layers appear only on demand and must stay on demand:

1. **Formula tip** (ⓘ on the card header): base power, STAB, type effectiveness, item (name · modifier), weather (name · modifier), spread, and the effective power total (plus accuracy in 实际概率 mode).
2. **"+N" popover**: the collapsed non-effective sources as `state · label` lines, plus the range-envelope note on range rows.
3. **Plot tooltip** (hover/focus on the plot): normal range, average, and critical range values with their legend markers.

## Voice & Content

Copy is part of the design; keep it precise and free of filler. UI copy is localized (zh-CN / zh-TW / en / ja); these rules apply in every locale.

- Action labels are a verb plus a noun (`添加招式`). A dialog's primary button may stay a bare `确认` / `Confirm` when the dialog itself already names the object.
- Errors say what happened plus what to do next.
- Empty states point to the first action — the home screen leads with choosing attacker and defender.
- In-progress states use the participle (`正在加载` / `Loading`).
- Use numerals for counts (`3 条结果`), never number words.
- English labels, buttons, titles, and body text all use sentence case (`Add move`, `Show actual values`). Casing rules apply to English copy only.

## Accessibility

- Hold WCAG AA contrast (4.5:1 for body text); `hud-muted` is calibrated to hold that on every surface muted text sits on (paper, card tints, token backgrounds), not just on paper.
- The hot badge is ink text on signal yellow — contrast is safe; do not invert it to yellow text on white.
- Muted small text is supplementary only; primary values (effective power, ranges, KO probabilities) are never set in muted on quiet backgrounds.
- Hover-only layers must also open on focus; keep visible focus rings on `ⓘ`, "+N", the plot region, and all custom chips.
- Don't signal state with color alone; pair it with a text label or icon (the hot badge carries its numeric value, chips carry their labels).

## Do's and Don'ts

- Rank information with `ink` vs `hud-muted`: primary values in ink, auxiliary in muted.
- `signal-yellow` is a signal color — KO chance, selected state — never decoration.
- Hold the weight ladder (800 cap); don't introduce one-off sizes or weights outside it.
- Radius comes from the surface-size scale; pill radius is reserved for data marks.
- Don't give inner cards ink borders or shadows, and don't turn dense rows into chunky cards.
- Apply the layout rhythm (tight inside a group, looser between groups) instead of ad-hoc margins.
- Don't restyle by adding, removing, merging, or reordering information — the hierarchy is an invariant (principle 5).

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

## Pending decisions

- **Mobile density**: the spec is desktop-first; the mobile setup/results split and board behavior below the sidebar breakpoint are unspecified.
- **Per-locale CJK font stacks**: the typography stack is SC-first, which serves zh-hans correctly but gives zh-hant and ja readers SC glyph forms. Splitting per-`lang` stacks (TC faces for zh-hant, a Japanese rounded face for ja) is unevaluated.

## Out of scope

- **Dark mode is dropped.** The HUD language (ink frames on a light canvas, hard shadows, yellow signal badges) is designed and specified light-only; the theme toggle, dark tokens, and the vendored Geist dark document were removed with this decision. Do not reintroduce `.dark` token blocks or theme plumbing without a new product decision.
