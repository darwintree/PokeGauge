---
# This section is managed by the CLI. Do not edit manually.
id: "0154c832-e946-40c6-81d1-d53feb27dee2"
title: "Decide whether stat allocation internals should use native SP"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "NEEDS-TRIAGE"]
created_at: "2026-08-03T07:33:00Z"
updated_at: "2026-08-20T08:30:00Z"
---
## Context

CONTEXT.md now defines Stat Allocation as Nature plus Pokémon Champions Stat Points (SP). The current implementation enumerates EV-shaped setups and derives SP labels from them. This may be an equivalent internal representation rather than a behavioral defect, so a rewrite is not assumed.

> Triage note (2026-08-11): removed `READY-FOR-AGENT`. Acceptance asks the agent to *decide* retain vs migrate without a decision rule or deliverable boundary (analysis-only vs rename/docs). Needs triage to pin those before AFK work.

Relevant paths:

- src/lib/stat-preset/stat-value-labels.ts
- src/lib/calc-adapter/local-stats.ts
- src/lib/calc-adapter/stat-bounds.ts
- docs/domain/stat-value-template-display-labels.md
- src/lib/i18n/messages.ts

## Decision to make

Determine whether the implementation should model SP directly or retain the existing EV-compatible intermediary with clearer internal naming and documentation.

## Acceptance criteria

- [x] Compare native SP and current EV-compatible results for every supported SP value and Nature modifier at level 50.
- [x] Cover offense values, HP and defense pairs, boundary values 0 and 32, rounding, multiple labels for one Stat Value, and Stat Values with no label.
- [x] Confirm whether the two representations are behaviorally equivalent and document any exceptions.
- [x] Record a decision to retain or migrate the implementation, with the smallest required follow-up scope.
- [x] If the intermediary is retained, identify terminology that must remain internal and update-facing wording that should use SP.

## Decision

保留 EV-compatible intermediary，不迁移为第二套 native-SP 计算模型。

Champions SP 与当前内部网格通过 `SP = floor((EV + 4) / 8)` 机械映射；最终 Scenario 与 calc adapter 均消费 Stat Value，而不是 EV 或 SP。现有枚举覆盖 level 50 的支持网格与 Nature modifier，展示层统一输出 SP；无可达 Allocation 的 Stat Value 回退到实数值。

## Resolution

2026-08-20：行为已由 `src/lib/stat-preset/stat-value-labels.ts`、`src/lib/stat-calculation/local-stats.ts`、对应测试及 `docs/domain/stat-value-template-display-labels.md` 固定。新增 native-SP 内部模型只会制造双重表示，没有当前收益。
