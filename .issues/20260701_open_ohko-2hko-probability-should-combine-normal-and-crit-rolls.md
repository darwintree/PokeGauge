---
# This section is managed by the CLI. Do not edit manually.
id: "3dc80d14-8027-445a-8f97-19495f152ecf"
title: "OHKO/2HKO probability should combine normal and crit rolls"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-01T02:47:00Z"
updated_at: "2026-07-01T02:47:00Z"
---
## Context

当前 \`ohkoChance\`（见 \`src/lib/calc-adapter/compute-damage.ts\`）只统计**普通 16 roll**中 ≥ 防守方 HP 的比例。当普通 roll 打不到 100% 但暴击 roll 能一击必杀时，现有指标无法表达这种「仅暴击 OHKO」的情况（[[archive/20260626_closed_damage-comparison-results-info-display-needs-refinement|Results info display]] 一期用「仅暴击 OHKO」文字标签作为过渡）。

## What to explore

- 综合命中率（暴击率）与普通/暴击伤害分布，给出一个统一的 OHKO 概率（以及 2HKO 概率）。
- 需要明确 VGC 双打语境下的暴击率假设（默认无提升暴击率道具/特性时的基础暴击率）。
- UI：单一百分比 vs 拆分展示（普通 OHKO% / 暴击 OHKO% / 综合%）。

## Related

- [[archive/20260626_closed_damage-comparison-results-info-display-needs-refinement|Results info display]]（当前的「仅暴击 OHKO」占位标签）