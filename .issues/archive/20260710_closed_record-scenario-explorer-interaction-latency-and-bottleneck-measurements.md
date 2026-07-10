---
# This section is managed by the CLI. Do not edit manually.
id: "03259fd1-8938-4d77-87b9-357245c1c79f"
title: "Record Scenario Explorer interaction latency and bottleneck measurements"
status: "closed"
priority: "high"
labels: ["TECH-DEBT"]
created_at: "2026-07-10T06:39:00Z"
updated_at: "2026-07-10T07:02:00Z"
---
# Summary

Scenario Explorer has reproducible, user-visible interaction latency after the page and default Move pick have loaded. The delay is independent of network latency and scales with the number of scenario rows.

This issue records the observed behavior, measurement conditions, and current bottleneck evidence. It does not prescribe a solution.

# Measurement context

- Vite production build served locally.
- Default Garchomp → Incineroar physical matchup.
- Default selection: 6 moves × 2 offense templates × 1 held item × 1 defense template = 12 rows.
- Measurements started only after the default Move pick and result rows had settled.
- Interaction latency is measured from the captured click to the first browser frame containing a DOM change.
- Pipeline time measures the synchronous `runScenarioPipeline` call within the same interaction.
- Repeated toggle samples were collected in both directions. Network wait time is excluded.

# Observed interaction latency

| Interaction | Samples | First visible frame | Pipeline work | Row-count context |
| --- | ---: | ---: | ---: | --- |
| Actual probability ↔ 16 roll | 6 | 1.10–1.18 s | 486–528 ms | 12 rows |
| Select / deselect one move | 6 | 0.94–1.11 s | 410–501 ms | 10 ↔ 12 rows |
| Toggle result actual-stat display | 6 | 1.07–1.15 s | 473–539 ms | 12 rows |
| Select / deselect the 0A offense template | 4 | 1.07–1.62 s | 475–747 ms | 12 ↔ 18 rows |
| Select / deselect Life Orb | 4 | 1.05–2.00 s | 469–960 ms | 12 ↔ 24 rows |
| Open the Pokémon selector | 3 | 113–219 ms | No pipeline run | Renders the selector option list |
| Open the move selector | 3 | 37–43 ms | No pipeline run | Renders the selector option list |
| Close either selector | 6 | 5–10 ms | No pipeline run | — |

The measured delay therefore applies most strongly to interactions that update scenario `trackState`: move selection, offense and defense templates, held items, range selection, probability mode, and actual-value display flags. Local selector open/close state is materially faster and does not run the scenario pipeline.

# Pipeline and label-generation decomposition

The following steady-state microbenchmarks use the same 12-row input. Their absolute times are from Node rather than the browser and should be treated as a relative decomposition, not as browser latency.

| Work | Median |
| --- | ---: |
| Complete 12-row `runScenarioPipeline` | 115.587 ms |
| Resolve 12 offense setups from final stat values | 111.156 ms |
| Resolve 12 defense setups from final stat values | 3.244 ms |
| Calculate 12 normal and critical damage-roll sets | 0.028 ms |
| Calculate 12 two-hit KO convolutions | 0.196 ms |
| Run 12 complete `computeDamage` calls with setups already resolved | 1.544 ms |
| Generate labels for 12 result rows | 112.146 ms |
| Perform 72 direct generated-resource lookups | 1.365 ms |

Current code-path observations:

- `defaultOffenseSetup` calls `enumerateOffenseAllocations` for every preset scenario row.
- One offense allocation resolution enumerates 9 natures × 64 EV values = 576 candidate spreads.
- Candidate evaluation calls `getOffenseStat`, which resolves the Pokémon through `getBattlePokemonByCalcName`; that resource lookup currently uses `Object.values(...).find(...)`.
- `rowLabels` resolves the same template display information again for every rendered row, including repeated rows that share an offense or defense template.
- `useScenarioState` keys the rows memo on the entire `trackState`, so display-only state changes such as actual-value visibility also run the pipeline.

Under the measured 12-row input, offense setup resolution accounts for approximately 96% of the Node pipeline measurement. Damage-roll arithmetic and the newly added two-hit probability convolution are each below 1% in this decomposition. Browser result rendering and label generation account for additional time after the pipeline completes.

# Differential observation around KO probability integration

The same production-browser interaction was also measured at commit `db23152`, before scenario KO probability integration:

| Interaction | Before KO probability integration | Current |
| --- | ---: | ---: |
| Select / deselect one move | 0.88–1.04 s | 0.94–1.11 s |
| Toggle result actual-stat display | 1.04–1.07 s | 1.07–1.15 s |
| Warm 12-row pipeline median in the Node comparison | 121.2 ms | 123.0 ms |

The current probability work adds measurable cost, but the approximately one-second interaction delay already existed before that integration and is not primarily explained by convolution.

# Out of scope

- Selecting or approving a remediation.
- Cache, memoization, data-shape, rendering, or state-partitioning design.
- Implementing or validating a performance fix.
- Defining the product latency budget or acceptance threshold.
- Turning these findings into an agent-ready implementation contract.

Any remediation should be proposed and scoped in a separate follow-up issue using this measurement record as evidence.

# Follow-up

The remediation was scoped and measured in [[20260710_closed_reduce-scenario-explorer-synchronous-interaction-latency]]. The follow-up reduced the measured first-visible-frame latency from 0.94–2.00 seconds to 5.1–13.0 milliseconds across the recorded 10–24 row interactions without changing damage or label behavior.
