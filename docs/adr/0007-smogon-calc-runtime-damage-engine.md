# @smogon/calc as the runtime damage engine

Runtime damage rolls now come from @smogon/calc as a black box: the local calculateDamageRolls internally calls calc.calculate() and keeps the { low: { normal, critical?, defenderHp }, high? } output shape, so the probability layer (KO convolution, hit/crit probabilities, both Probability Modes) is untouched. This overturns ADR 0001 (local product-scoped damage kernel). Critical-hit selection and accuracy stay local; calc only consumes the isCrit boolean.

## Considered Options

- Local damage kernel (ADR 0001). Required replicating every ability/item/weather/terrain/screen modifier in product code, left 239 generated abilities unsupported, could not express dynamic-power or override moves, and drifted from calc so that oracle tests compared two independently-maintained engines.
- Deep-import calc mechanics helpers. Depends on package-internal file layout outside the public API.
- Black-box calc.calculate() at runtime (chosen). The formula surface, ability/item/weather/terrain semantics, dynamic-power moves, and spread/terrain interactions all move into the calc engine; product code maps PokeAPI identities and UI state to calc names and exact stat values.

## Consequences

- The single seam is calculateDamageRolls(CompiledDamageInput): DamageKernelResult; its contract is unchanged, and downstream evaluate (summarizeDamage, fixedKOProbabilities) is preserved as-is.
- Abilities are supported when calc knows them (gen.abilities.get(name)), so 239 previously-unsupported abilities auto-unlock. The four abilities calc 0.11.0 lacks (Mega Sol, Dragonize, Eelevate, Fire Mane) stay explicitly unsupported through the calc-missing mechanism; no local patch overrides calc.
- Weather and terrain modifiers are derived by calc. The local weather/terrain/screen/ability modifier tables are deleted.
- Dynamic-power moves (Low Kick, Grass Knot) compute power from calc; the local reviewedVariablePowerDefault hand-filled initialPower mechanism is retired. Override moves (Body Press, Foul Play, Psyshock) and multi-hit expansion remain unsupported, unchanged.
- The spread toggle maps to move.target (normal when off; calc handles terrain makesSpread); the local spread modifier is deleted. gameType stays Doubles.
- The oracle tests that compared the local kernel against calc are deleted ("test the implementation with the implementation"). Regression coverage moves to the external calculateDamageRolls behavior contract plus calc-name resolution tests; equivalence was proven once with a throwaway old-vs-new script.
- Future rule changes only require bumping the calc dependency.

