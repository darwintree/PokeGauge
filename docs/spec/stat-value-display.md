# Stat Value Display Spec

## Scope

This contract defines how a Stat Value and a Stat Range identify themselves on result rows, the collapsed Stat Track summary, and Stat Track Choice options.

## Concepts

- **Stat Value**: a concrete offense stat, or a complete defense pair `{HP, Def}`.
- **Stat Value Label**: the display string produced by mapping a Stat Value to a Stat Allocation (for example `0A`, `32A`, `EX`, `0H0B`, `32H0B`). The Label applies to any Stat Value, not only a Stat Preset.
- **Stat Value Label chip**: the default identity of a Stat Value. The chip face is the Label.
- **Stat Preset**: a reusable Stat Value inside Choice. It is not the counterpart of Range.
- **Choice** and **Range**: the two Stat Track modes for taking values. Expanding a Range parent row shows the corresponding Choice for that row and axis; it does not change the Track's Range mode.
- **Stat Range**: two endpoint Stat Values. A defense endpoint is a complete Defense Stat Value.

## Contract

### Identity

The default identity of a Stat Value is its Stat Value Label chip.

A Stat Range's identity is the two endpoint Label chips. Endpoints that resolve to the same Stat Value display as one chip.

The same chip language is used for:

- result-row offense and defense identity
- the collapsed Stat Track summary
- Stat Track Choice options

TrackOption is the clickable form of the same chip (unselected / selected). Selected Choice uses `signal-yellow` fill, an ink frame, and a left tab in the investment-band foreground. Unselected Choice keeps paper fill with band border and text. Result-row chips are data marks and do not use Choice selected yellow.

Optional “show actual values” is an annotation beside the chip. It does not replace the chip and does not restore a numeric interval as Range identity.

Numeric intervals such as `152-204` or `HP a-b · Def c-d` are not Stat Value or Stat Range identity on the surfaces in Scope.

### Tooltip

Hover or keyboard focus on a Stat Value Label chip reveals that Stat Value's actual stat, SP allocation, and nature adjustment. Nature adjustment is none / `+` / `-`, not a nature name. Each Range endpoint chip has its own tooltip.

### Color

Chip color encodes the Stat Value's actual-stat bonus relative to that Pokémon's 0-investment Stat Value (0 SP, no nature modifier). It does not encode system / user / temporary origin, and it does not encode SP alone. Defense bonus is HP bonus plus Defense bonus.

Band order:

1. Existing EX Allocation (offense: 32 SP and `+`; defense: 32 HP SP + 32 Defense SP and `+`) is purple `#9800ec` / `#faf0ff`.
2. Bonus ≤ 4, including negative, is gray `#4d4d4d` / `#f2f2f2`.
3. Bonus ≥ 32 and not EX is cobalt `#1d4ed8` / `#c9d9ff`.
4. Otherwise (bonus 5–31) is teal `#0a5c50` / `#c8e8e1`.

Nature does not choose the band by itself. Encoding is fill: background, border, and text share the band hue. Temporary Stat Values add a dashed border only.

Selected Choice is inclusion chrome, not a fifth band: `signal-yellow` fill with a left tab in the band foreground. Unselected Choice and result-row chips keep fill encoding.

HUD yellow, green, red, and damage orange are not used for these bands.

Missing Stat Allocation keeps the existing Label fallback. This spec does not redefine Allocation internals.

## Out of Scope

- Parent-row expand/collapse affordance
- Collapsed Stat Track mode switch
- Range endpoint identity data model, Scenario Merge, and defense 2D corner writeback
- Axis snap ticks and selected-range highlight
- Stat Allocation internals
- Result-surface information hierarchy (add, remove, merge, or reorder)

## Acceptance Criteria

- Every Stat Value shown as identity uses a Stat Value Label chip, not a raw actual or unnamed plain text as its default face.
- Choice options, result-row identity, and the collapsed Stat Track summary share the same chip language; TrackOption is only the clickable state.
- A Stat Range displays as two endpoint Label chips, or one chip when the endpoints are the same Stat Value. Numeric interval identity does not appear on the surfaces in Scope.
- With “show actual values” on, the chip face remains the Label; the actual is annotation only.
- Hover or focus on a chip shows actual stat, SP allocation, and nature adjustment; each Range endpoint has its own tooltip.
- Color follows the four bonus bands, fill encoding on unselected Choice and result-row chips, selected Choice yellow with a band tab, dashed temporary overlay, and non-selected result chips.
- Stat Track mode pairing in this contract is Choice and Range.
