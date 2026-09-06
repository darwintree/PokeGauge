# Compose calc hit matrices with conditional Berry state

PR #6 proposed moving beyond a single damage distribution per move. We retain ADR 0007's public `@smogon/calc` damage engine, but read each hit's rolls and compose execution probabilities locally. This supersedes ADR 0007's unchanged downstream probability seam and deferred multi-hit expansion; it does not reintroduce a local damage formula.

A reviewed move profile defines hit powers, random counts and shared/per-hit accuracy. calc supplies the normal and critical hit matrices, including Parental Bond's child. The local resolver composes independent rolls and critical events, merges equal damage/state outcomes at each hit, and carries resistance-Berry consumption into the second move use. The second-use KO query depends on that state; reusing the first distribution would incorrectly apply the Berry twice.

We chose this restricted sequential model over a general recursive execution graph or a local battle simulator. It covers the [confirmed contract](../traces/discussion/2026-09-06-hit-composition.md) while preserving calc's rounding. Other unsupported battle-state changes remain disclosed at the related selection. Damage references and equivalent power assume every accuracy check succeeds in both modes, retaining random counts and mixed-critical paths. The actual KO distribution still includes misses and early stopping in Battle Odds. Equivalent power remains a display projection, summed per hit; it is never used to produce damage.

Inputs keep the existing share format. Native multi-hit power overrides that conflict with the fixed power invalidate the whole setup/bookmark; compatible old inputs remain loadable. No migration silently changes an edited power.

Reviewed rule sources: Pokémon Showdown [move definitions](https://github.com/smogon/pokemon-showdown/blob/master/data/moves.ts), [abilities](https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts) and [execution rules](https://github.com/smogon/pokemon-showdown/blob/master/sim/battle-actions.ts). The runtime adapter is tested against pinned calc 0.11.0, including its Parental Bond Berry limitation.
