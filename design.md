---
version: alpha
name: PokeLens Game HUD
description: "PokeLens light-only design system. Direction decision: docs/adr/0002-game-hud-design-direction.md."
colors:
  ink: "#1f2430"
  primary: "{colors.ink}"
  paper: "#ffffff"
  bg-app: "#e8ecfa"
  hud-muted: "#606776"
  hairline: "#e3e6f2"
  card-border: "#c9cede"
  token-bg: "#e8ebf6"
  signal-yellow: "#ffd23f"
  notice-bg: "#fff8e0"
  destructive: "#e0352f"
  appbar: "#33426e"
typography:
  data:
    fontFamily: &hud-stack '"Baloo 2 Variable", "Yuanti SC", "PingFang SC", "Hiragino Maru Gothic ProN", "Microsoft YaHei", sans-serif'
    fontWeight: 800
    fontFeature: '"tnum"'
  emphasis:
    fontFamily: *hud-stack
    fontWeight: 700
    fontFeature: '"tnum"'
  control:
    fontFamily: *hud-stack
    fontWeight: 500
    fontFeature: '"tnum"'
  note:
    fontFamily: *hud-stack
    fontWeight: 400
    fontFeature: '"tnum"'
---

# PokeLens Game HUD

## Purpose

This document defines the current product-wide visual system for PokeLens. It is for designers and frontend implementers making or reviewing product UI.

It records durable principles, semantic roles, reusable patterns, and accessibility requirements. Feature behavior, page composition, component fields, interaction details, algorithms, and implementation values belong with their feature specifications or code. Important design-direction decisions and their rationale belong in `docs/adr/`.

PokeLens uses one light theme. The design direction is recorded in [`docs/adr/0002-game-hud-design-direction.md`](docs/adr/0002-game-hud-design-direction.md), and runtime tokens live in `src/index.css`. ADRs preserve the context of past decisions; references in them do not expand the current scope of this document.

## Principles

1. **Frames outside, play inside.** Concentrate thick borders and hard shadows on major containers and pressable controls. Keep dense, repeated content flat and quiet.
2. **Signals stay rare.** Saturated color and badge treatments communicate meaningful state. Repetition turns a signal into decoration.
3. **Shadow communicates hierarchy.** Major containers and pressable controls may cast hard offset shadows. Inner and repeated content does not.
4. **Toy language lives in the data ink.** Rounded type, ink borders, pills, and controlled gradients may emphasize data-bearing marks. Supporting structure stays quiet.
5. **Data wins.** When identity, labels, decoration, and values compete for attention, primary data receives the strongest emphasis.

## Color

Colors are semantic. They communicate hierarchy or state, never decoration.

| Token | Value | Role |
| --- | --- | --- |
| `ink` | `#1f2430` | Frames, primary text, strong data marks, and derived HUD shadows |
| `paper` | `#ffffff` | Primary surfaces and light text shadows |
| `bg-app` | `#e8ecfa` | Application canvas |
| `token-bg` | `#e8ebf6` | Neutral grouped surfaces, tokens, and subtle interaction states |
| `hud-muted` | `#606776` | Supplementary text and derived muted decoration |
| `hairline` | `#e3e6f2` | Quiet, non-interactive separators |
| `card-border` | `#c9cede` | Perceptible interactive-control boundaries |
| `signal-yellow` | `#ffd23f` | Selected states and high-salience signals |
| `notice-bg` | `#fff8e0` | Notices |
| `destructive` | `#e0352f` | Destructive and invalid states |
| `appbar` | `#33426e` | Top application bar |

Pokémon types, effectiveness, stat tiers, HP, and damage use separate domain tokens. Domain colors must not be reused as general HUD chrome.

### Usage rules

- Primary information uses `ink`; supplementary information uses `hud-muted`.
- `signal-yellow` is reserved for selection and high-salience state.
- Destructive state uses `destructive` and an additional text or icon cue.
- Muted text must meet WCAG AA contrast on every surface where it appears.
- New colors require a reusable semantic role. Do not add colors for a single component.

## Typography

- Use the rounded HUD stack declared in the document metadata. Locale-specific fallback may refine the stack without changing its rounded character.
- Use tabular numerals for numeric data.
- Weight follows role: 800 for primary data and identity, 700 for emphasis, 500 for controls, and 400 for supplementary notes.
- Primary values must not be smaller or lighter than their labels.
- Do not introduce one-off font sizes or weights when an existing role is sufficient.

## Layout and spacing

- The application sits directly on the light canvas. Major regions provide structure; nested surfaces should not create frames within frames.
- Responsive layouts preserve task order and legibility without shrinking controls or data below usable sizes.
- Spacing follows a 4px scale with three levels: tight within a group, looser between groups, and loosest between sections.
- Dense repeated content uses alignment, whitespace, and quiet separators before cards.
- Responsive changes may reflow presentation, but must not hide required information or remove keyboard access.
- Concrete breakpoints, widths, grid assignments, and sticky behavior are implementation decisions.

## Elevation and depth

- Shadows are hard offsets only. Blur shadows are not part of the HUD language.
- Major containers may use the strongest elevation.
- Pressable controls may use a smaller elevation. Active feedback may reduce that elevation without shifting surrounding layout.
- Inner surfaces and static repeated content remain flat.
- Do not use elevation solely to decorate empty space.

## Shape

- Thick ink borders define major chrome and pressable affordances.
- Thin ink borders define data-bearing marks.
- Hairline and quiet borders separate supporting structure.
- Radius scales with surface size.
- Full pills are reserved for compact controls and data marks, not general containers.
- Reuse the shared radius and border styles in `src/index.css`; do not invent component-specific values.

## Motion

- Motion must explain feedback, hierarchy, or state change.
- Most HUD interactions should feel immediate.
- When motion helps, keep it short and physical.
- Animate transform and opacity rather than layout dimensions.
- Honor `prefers-reduced-motion` by removing nonessential movement.

## Interaction states

- Every interactive element has a visible hover state where hover is available.
- Every interactive element has a visible `:focus-visible` indicator.
- Hover and focus treatments must not shift surrounding layout.
- Pressable controls provide visible active feedback consistent with the elevation rules.
- Disabled controls remain legible, appear unavailable, and use a not-allowed cursor where appropriate.
- Information exposed on hover must also be available by keyboard and touch.

## Voice and content

- UI copy is precise, localized, and free of filler.
- Action labels use a verb plus a noun unless the surrounding context already names the object.
- Errors state what happened and what the user can do next.
- Empty states point to the first useful action.
- In-progress states use an active loading label.
- Use numerals for counts.
- English UI copy uses sentence case.

## Accessibility

- Meet WCAG AA contrast for text and interactive states.
- Never communicate state with color alone. Pair color with text, shape, or an icon.
- Primary values are not presented as muted supplementary text.
- Keep visible focus indicators on native and custom controls.
- Icon-only controls and data marks require accessible names.
- Touch targets meet the WCAG 2.2 minimum target-size requirement.
- Responsive layouts preserve reading order and focus order.

## Review checklist

- Does visual weight remain on major containers, controls, and data-bearing marks?
- Are dense repeated elements flat and quiet?
- Does every color have a semantic role?
- Does primary data win the hierarchy?
- Are spacing, type, border, radius, and elevation drawn from shared scales?
- Are hover, focus, active, disabled, keyboard, and touch states covered?
- Does the result meet contrast and non-color-cue requirements?
- Are feature-specific behavior and implementation details kept outside this document?
