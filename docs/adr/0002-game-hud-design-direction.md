# Game HUD design direction

We will replace Geist minimalism as the product's visual direction with a game HUD / retro battle UI style: chunky ink frames, hard offset shadows, rounded type, and toy-like controls, while keeping the existing information hierarchy of the Scenario Explorer exactly as it is. The restyle changes how information looks, never what information is shown, hidden, merged, or reordered. Two iteration rules from the design review are part of the decision: visual weight concentrates on outer containers and interactive affordances while dense result rows stay flat ("frames outside, play inside"), and the yellow badge treatment is reserved as a signal for rows with a real OHKO chance instead of decorating every row ("badge as signal").

## Considered Options

- Precision instrument: restrained lab-device styling with fine hairlines and technical type. Reads as credible but generic for a data tool, and gives up the Pokémon personality the product can own.
- Pokédex device: full device-chrome styling (bezels, screws, screen-in-screen). Strong personality, but the chrome consumes layout budget that a dense comparison surface needs for data.
- Swiss editorial: grid discipline and typographic hierarchy in the spirit of print infographics. Excellent readability, but tonally distant from the game domain and hard to distinguish from generic dashboard output.
- Game HUD (chosen): toy-like ink frames and hard shadows on app chrome, sidebar controls, and the results board; flat, quiet result rows; the damage plot keeps chunky ink-bordered bars as its "data ink". Dense-card prototypes of this direction produced too much visual noise, which the two rules above resolved without giving up the personality.

## Consequences

- `design.md` becomes the PokeLens game HUD spec (light theme). Geist is no longer the design baseline.
- Dark mode is dropped: the HUD language is specified light-only, and the theme toggle, theme plumbing, `.dark` token block, and the vendored Geist dark document (`design.dark.md`) were removed rather than left half-supported. Reintroducing a dark theme requires a new product decision and a dedicated design pass.
- The information hierarchy of the results surface (per-row conditions card, attack/defense identity lines, side-assigned condition tokens, "+N" collapsing of non-effective sources, OHKO/≤2HKO columns, non-linear damage axis, lethality tone thresholds, move-group separators, legend copy) is recorded in `design.md` as an invariant. Changing it requires an explicit product request; restyling work must not alter it.
- `src/index.css` shadcn/Tailwind tokens and the scenario-explorer component styling need a follow-up reskin pass to implement this spec. shadcn remains the primitive layer; the HUD language is applied through variants, `className`, and token mapping rather than parallel markup.
- Pokémon domain tokens (type colors, effectiveness, stat tiers, HP/damage visuals) remain separate from the HUD chrome semantics, as before.
- The confirmed reference mockups were brainstorming-session artifacts and are not vendored; `design.md` is the source of truth and must stay implementable on its own.
