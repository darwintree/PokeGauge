---
# This section is managed by the CLI. Do not edit manually.
id: "b14815db-011e-40a2-bc68-141930312d9a"
title: "Ability Track none"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:59:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

为攻击方与防御方 Ability Track 提供显式 `none`，用于比较本侧有特性与无特性效果的 Scenario；普通形态与所有 Mega 形态都适用。

## Contract

### Candidate and selection model

- `none`、真实特性与 `Unknown ability` 是三个不同身份；不得复用 `UNKNOWN_ABILITY_ID` 表示 `none`。
- `none` 在双方 Ability Track 中始终位于绝对首位，不受已选项置顶排序影响。
- 普通形态的候选是 `none` 加当前 Battle Pokémon identity 的全部合法真实特性；上游特性关系缺失时是 `none` 加 `Unknown ability`。
- Mega 的候选是 `none` 加固定真实特性；关系缺失时是 `none` 加 `Unknown ability`。Track 允许编辑这两个候选，但不得选择其他真实特性；Held item 与形态锁定契约不变。
- Ability Track 继续是多选 Track，且始终至少选择一项。允许只选真实／固定特性、只选 `none`，或同时选择两者形成对比分支。

### Default, reset, and lifecycle

- `none` 永远不由默认规则或 Reset 自动选中。
- 默认与 Reset 延续既有规则：优先选择 Champions 使用率第一的合法真实特性；使用率不可用时选择全部合法真实特性；关系缺失时选择 `Unknown ability`；Mega 选择固定特性或 `Unknown ability`。
- 更换 Battle Pokémon identity 时只按默认规则重建被更换一方；另一方保留。
- 异步默认结果不得覆盖用户已经修改的 Ability Track。

### Display and calculation

- `none` 的可见内容仅为 `—`，Track 收起摘要同样显示 `—`；不提供 tooltip，但必须有本地化可访问名称（简中“无特性”、英文“No ability”，其他 locale 对应翻译）。
- `none` 不显示红点或绿点，编译为 `neutral`，不贡献任何特性效果。
- 选择或取消 `none` 不清除或回退 Weather、Terrain、Stage；这些 Track 的当前值继续独立参与计算。
- `none` 不在结果主行、其他条件、不可计算结果或其他结果来源展示中出现，也不强制生成独立结果行；伤害等价时按现有规则合并。
- `none` 选择可保存与恢复；旧存档行为保持不变。

## References

- [[../../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §2
- [[../../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Out of scope

- 绿点指示灯与条件触发特性效果
- 各特性伤害编译、Track 初始化投射、Mold Breaker、Parental Bond
- 红点「效果暂未支持」与结果侧「未生效」：延续现有契约，本 issue 不改语义

## Acceptance criteria

- [x] 攻防双方的普通形态与所有 Mega 都可选择绝对首位的 `—`，且 Track 仍满足至少一项选择。
- [x] Mega 只允许 `none` 与其固定特性／`Unknown ability`，可单选或并选；其他锁定契约不变。
- [x] 默认、Reset、身份切换与异步默认刷新均不会自动选择 `none` 或覆盖用户选择。
- [x] `none` 与 `Unknown ability` 保持不同身份，可保存和恢复；旧存档仍可读取。
- [x] `none` 编译为 `neutral`，不贡献特性效果、不显示状态点，并从全部结果展示中隐藏。
- [x] `none` 不修改 Weather、Terrain、Stage，且效果等价分支继续按既有规则合并。
- [x] 讨论记录 §2 可逐条审计。

## Resolution

- 新增独立 `NO_ABILITY_ID`，由 catalog 向普通形态和 Mega 双方候选绝对首位注入本地化 `—`，默认与 Reset 只使用合法真实／固定／Unknown 特性。
- Mega Ability Track 改为可编辑，但候选仍限制为 `none` 与固定特性／`Unknown ability`；Held item 与形态锁定保持不变。
- Scenario compiler 将 `none` 作为 neutral provenance 输入，沿用 calculation identity 合并等价分支；结果摘要统一隐藏该来源。
- Scenario persistence 接受普通形态与 Mega 的 `none` 单选／并选，旧数值存档无需迁移。
- 已通过 62 个相关测试、`pnpm lint`、`pnpm build`，并完成桌面与 390px 窄屏 UI review/correct；实际验证 Mega 选择、Reset 与刷新恢复。
