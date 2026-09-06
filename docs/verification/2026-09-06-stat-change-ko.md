# Stat-change KO verification

Branch: `codex/stat-change-ko`, created from synchronized main `7b29f9c` after PR #33 merged.
Contract: [discussion](../traces/discussion/2026-09-06-stat-change-ko.md), including revisions 4 and 5.
Implementation boundaries: [trace](../traces/implementations/2026-09-06-stat-change-ko.md), with entry 4 superseding the initial deferral.

- 83 test files, 835 tests pass. Build, lint and diff checks pass; existing lint and bundle-size warnings remain.
- Single-hit Crunch with 50% accuracy and a resistance Berry matches independent enumeration of miss/hit paths and 20% Defense-drop outcomes over multiple HP thresholds.
- Parental Bond Crunch, Metal Claw, Acid Spray and Torch Song match independent per-hit enumeration of damage rolls, critical hits and stat-change events, including Berry consumption. A four-hit/two-use Crunch enumeration verifies cumulative stage carry-over and correlation between damage and the number of drops.
- Parental Bond Power-Up Punch matches a second-use calc matrix starting at +2 Attack without double-applying the existing intra-use boost.
- Synthetic two- and three-hit compositions verify the shared resolver has no Parental Bond probability special case: it retains distinct damage/state outcomes, independent critical hits and miss/immune semantics.
- Classic excludes chance-based intra-use and cross-use changes, retaining guaranteed changes. Stage caps, Sheer Force, immunity and ordinary first-use references remain covered.
- Supported stat-change moves no longer display the old limitation warning; the deferral-specific UI props and messages were removed.
- design-taste-frontend review: checked the existing HUD at desktop 1280px and mobile 390px using Parental Bond Crunch. Its Battle Odds first-use range includes the first-hit Defense-drop branch (33.6–43.8% in the checked setup). The move editor has no obsolete warning, the mobile result is readable, and there is no horizontal overflow or Vite error overlay.

Move data reviewed against [Pokémon Showdown move definitions](https://github.com/smogon/pokemon-showdown/blob/master/data/moves.ts) and local PokeAPI CSVs. The reviewed set contains 23 target Defense/Special Defense drops and six simple Attack/Special Attack boosts, supported for ordinary execution and Parental Bond. Unsupported ability/item interactions and composite/self-lowering effects retain their existing scope. Equivalent power retains its existing separation from attack/defense stat factors.
