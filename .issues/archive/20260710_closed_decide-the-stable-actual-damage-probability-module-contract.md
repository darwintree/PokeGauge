---
# This section is managed by the CLI. Do not edit manually.
id: "335d0ca4-635a-4190-8405-07a331af4e3b"
title: "Decide the stable actual-damage probability module contract"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T03:53:00Z"
---
## Parent map

[[../20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

What is the smallest stable public contract for constructing a single-use Actual damage distribution and deriving cumulative N-hit KO probabilities or endpoint probability intervals, while leaving internal distribution representation and algorithms replaceable? Resolve inputs, outputs, probability precision/invariants, invalid-input behavior, duplicate-damage aggregation, arbitrary positive N, and the boundary between the damage kernel, resource adapter, and probability module. Do not select or optimize multiple internal algorithms in this ticket.

## Resolution

Use one opaque `DamageDistribution` type for both **Atomic Damage Distribution** (ADD) and **Convolved Damage Distribution** (CDD). ADD is the unconditional damage distribution for one move use; CDD is the convolution of one or more damage distributions, and a single ADD is also a CDD. A **KO probability** is the probability mass in a fixed CDD whose damage is greater than or equal to a fixed HP value. A **KO probability range** is formed outside the core from the separately computed endpoint probabilities of a Range track. The canonical definitions live in [[../../CONTEXT|CONTEXT.md]].

The stable public surface is:

```ts
export type DamageDistribution // opaque; entries are not public

export type AtomicDamageDistributionInput = {
  hitProbability: number
  criticalHitProbability: number // conditional on a hit
  normalDamageRolls: readonly number[]
  criticalDamageRolls: readonly number[]
}

export function createAtomicDamageDistribution(
  input: AtomicDamageDistributionInput,
): DamageDistribution

export function convolveDamageDistributions(
  distributions: readonly DamageDistribution[],
): DamageDistribution

export function koProbability(
  distribution: DamageDistribution,
  hp: number,
): number
```

Contract and boundaries:

- Probabilities use JavaScript `number` values in `[0, 1]`; the core performs no percentage formatting, normalization, clamping, or rounding. Tests use floating-point tolerance.
- Each normal/critical roll list has 16 finite non-negative integer values. Duplicate damage values are aggregated; 0 is valid. `criticalDamageRolls` remains required because the damage kernel owns critical mechanics and rounding.
- Convolution accepts a non-empty distribution array; its length expresses arbitrary positive N and may contain ADDs or CDDs. HP is a positive integer.
- These are trusted internal preconditions. Runtime validation and defined behavior for invalid inputs are out of scope; failures should be debugged at the caller.
- `src/lib/convolution/` independently implements generic sparse `ReadonlyMap<number, number>[]` convolution with no Pokémon or damage-domain imports. `src/lib/damage-distribution/` owns the opaque type, ADD/CDD operations, and KO query, and delegates its math to the convolution module.
- The damage kernel produces normal and critical rolls. Resource/scenario adapters compile move metadata, base crit semantics, and the global switch into `hitProbability` and conditional `criticalHitProbability`; switch-off compiles to hit probability 1 and crit probability 0.
- The probability core never accepts resource identity, move metadata, UI state, Range tracks, or defender HP while constructing a distribution. Range adapters call `koProbability` for each endpoint and order the two results into a KO probability range.
- No third-party mathematics dependency is introduced. Library candidates and supply-chain/pinning options were investigated, then rejected in favor of the independent local convolution module. Research asset: [[../../docs/research/2026-07-10-discrete-damage-convolution-library|Discrete Damage Convolution Library]].
