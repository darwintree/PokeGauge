# Stat value template display labels

Derived card labels for **stat value templates**. Templates store final actual values only; labels are computed mechanically.

## Stat points (SP)

Champions SP = `floor((EV + 4) / 8)`. Nature modifier on the relevant stat appends `+` or `-` (HP never gets a suffix).

## Stat name strategies

Global read preference (`localStorage`, not in matchup or pipeline state). Three strategies:

| Strategy | HP | Atk | Def | Sp.A | Sp.D | Spe |
| --- | --- | --- | --- | --- | --- | --- |
| `habcds` | H | A | B | C | D | S |
| `english` | HP | Atk | Def | Sp.A | Sp.D | Spd |
| `chinese` | HP | 攻击 | 防御 | 特攻 | 特防 | 速度 |

## Offense label

`{sp}{statName}{mod?}` — e.g. `32A+`, `0C+`, `0A-`.

When SP is `32` on the offense stat with `+` modifier → fixed label **`EX`**.

## Defense label

`{hpSp}{hpStat}{defSp}{defStat}{mod?}` — e.g. `32H20B+`. HP segment has no modifier; only the defense stat gets `+/-`.

When HP SP is `32`, defense SP is `32`, and defense stat has `+` → **`EX`**.

`32HP` is not used as a display label; HP-only bulk is `32H0B` (physical) etc.

## Display modes

| Mode | Preset card | Result row |
| --- | --- | --- |
| SP (default) | SP label | SP label |
| Actual (track / result switch) | SP label + actual value summary | SP label + actual value summary |

Track preset switches (`showOffenseActual`, `showDefenseActual`) and the results switch (`showResultActual`) are independent and session-only.

## Multi-allocation

Enumerate all spreads that yield the stored actual value(s). Merge groups with identical SP labels. Default order: neutral nature first, then label lexicographic. Minus-nature allocations are excluded from display.

Allocation cycle changes only the visible SP label, not damage or persisted template data.

## Tooltip (SP mode)

Hover shows:

1. Final actual value(s) for the template
2. All reachable SP labels for that value, separated by ` · `
