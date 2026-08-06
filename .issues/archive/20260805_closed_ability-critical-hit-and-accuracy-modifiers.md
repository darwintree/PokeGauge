---
# This section is managed by the CLI. Do not edit manually.
id: "addef56e-abc2-4b47-9b6e-217fc64643f2"
title: "Ability critical-hit and accuracy modifiers"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-06T09:46:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现普通命中的特性暴击与命中修正，并保持 Classic／Battle Odds 与结果展示语义一致。

## Scope

- 阻止暴击：Shell Armor、Battle Armor
- 暴击等级／伤害：Super Luck、Sniper
- 必中与命中率：No Guard、Sand Veil、Snow Cloak、Compound Eyes
- 复合效果：Hustle 的 Physical Atk 与命中修正
- Hit Fact 在 Scenario Merge 中的聚合与展示

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- 本 issue Scope 内特性须从 `unsupported` 转为可审计的 `active`／`inactive`；Keen Eye 与 Illuminate 保持 `unsupported`。
- 由 Scenario compiler 派生效果；不回写 Move Snapshot，不新增 Track，不改变 damage kernel 或 Atomic Damage Distribution 接口。
- 复用既有命中率道具、暴击道具、Probability Mode、Scenario Merge 与 provenance 契约。

## Critical-hit contract

- Super Luck 贡献一级暴击等级；与 Move Snapshot 和暴击道具贡献相加后封顶为三级，不回写 Snapshot。
- Shell Armor／Battle Armor 在最终暴击等级派生后阻止所有暴击，包括 guaranteed-critical Snapshot。
- 暴击被阻止时生成 ordinary-only 分支：暴击概率为零，`criticalOnly` 为 false，普通分支重新应用应有的 Stage 与 Screen，不展示暴击 whisker 或 CT 等效威力。
- Shell Armor／Battle Armor 在两种 Probability Mode 中均为 `active`。它们阻止暴击时，Super Luck、暴击道具与 Sniper 为 `inactive`。
- Sniper 仅向 critical branch 的 Final phase 贡献 `6144`；只要该分支存在且被改变，Sniper 在两种 Probability Mode 中均为 `active`。
- Super Luck 在 Battle Odds Mode 中仅在改变最终暴击概率时为 `active`；在 Classic Mode 中仅在将结果推到必定暴击时为 `active`。

## Accuracy contract

- Numeric Accuracy 修正只作用于已配置的数值命中；不修改 Always-hit Fact，不将 accuracy `0` 补全为可计算。
- Compound Eyes 对攻击方的 Numeric Accuracy 贡献 `5325`。
- Sand Veil 在 sand 中、Snow Cloak 在 snow 中对攻击方 Numeric Accuracy 贡献 `3277`；天气不匹配时为 `inactive`。
- Hustle 仅对 Physical Move 的 Numeric Accuracy 贡献 `3277`。
- 同一 ModifyAccuracy 阶段固定按 `attacker ability → defender ability → attacker item → defender item` 进行 4096 chain，并只对 Numeric Accuracy 应用一次。
- 既有天气 accuracy override 在 Numeric Accuracy chain 之后结算；No Guard 在更后的 Accuracy override 中将持有方发出或承受的 Move 解析为 Always-hit Fact。
- Battle Odds Mode 中，Numeric Accuracy 来源仅在改变最终命中概率时为 `active`；No Guard 将 Numeric Accuracy 转为 Always-hit Fact 时为 `active`，即使有效概率同为 `100%`。
- 多个来源都可独立产生 Always-hit Fact 时全部为 `active`。Move Snapshot 本来已是 Always-hit Fact 时 No Guard 为 `inactive`。
- Classic Mode 中纯命中概率效果与 No Guard 为 `inactive`。

## Hustle and modifier order

- Hustle 对 Physical Attack 贡献 `6144`，使用既有 `attacker ability → defender ability → attacker item` Attack chain；它不是 Stat Stage，不改写 Stat Value。
- Hustle 的攻击或命中 facet 任一改变当前结果时，Ability Selection 整体为 `active`。因此 Physical Move 下的 Hustle 在 Classic Mode 中仍为 `active`。
- Final chain 固定按 `screen → attacker ability → defender ability → attacker item → defender item` 组合；critical branch 先移除 screen，Sniper 只进入 critical branch。

## Hit Fact merge and display

- Hit Fact 取值为 Numeric Accuracy 或 Always-hit Fact；Numeric Accuracy `100%` 不等于 Always-hit Fact。
- 伤害与概率计算等价的 Scenario 继续合并，不仅因 Hit Fact 不同而拆行；合并时聚合 Hit Fact 与 provenance。
- 合并结果全部为 Always-hit Fact 时显示“必中”，全部为 Numeric Accuracy 时显示数值，Numeric Accuracy `100%` 与 Always-hit Fact 混合时显示共同有效概率 `100%`。
- 合并后的命中展示不得依赖 Scenario 遍历顺序。

## Out of scope

- 普通伤害与防御特性、Unaware、Infiltrator
- Keen Eye、Illuminate 及新增 accuracy／evasion Stage Track；两个特性在父 issue checklist 中保持未完成
- No Guard 对 semi-invulnerable 状态的绕过
- 绿点条件族、Mold Breaker
- 通用 event priority framework 或 Speed Track

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/traces/discussion/2026-08-06-ability-critical-hit-and-accuracy-semantics|特性暴击与命中语义讨论记录]]
- [[../docs/traces/discussion/2026-07-31-accuracy-and-critical-hit-item-semantics|携带道具命中率与暴击语义讨论记录]]
- [[../docs/traces/discussion/2026-08-06-offensive-defensive-ability-modifiers-contract|进攻与防守特性 modifier 契约讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Acceptance criteria

- [x] Shell Armor／Battle Armor 在普通与 guaranteed-critical Snapshot、两种 Probability Mode 下均产生 ordinary-only 结果，恢复普通 Stage／Screen 语义并隐藏暴击 whisker。
- [x] Super Luck 覆盖 Snapshot／Item 等级叠加、三级封顶、两种 Probability Mode activation 及防暴击组合。
- [x] Sniper 仅修改 critical Final phase，覆盖两种 Probability Mode 的 active 及被防暴击时的 inactive。
- [x] Compound Eyes、Sand Veil、Snow Cloak、No Guard 均覆盖 active／inactive、天气门槛、Classic／Battle Odds、Numeric Accuracy／Always-hit Fact 与道具组合。
- [x] 双方 No Guard、No Guard＋天气必中、Numeric Accuracy `100%`／Already-always-hit 的 activation 均按契约验证。
- [x] Numeric Accuracy 顺序至少以 Compound Eyes＋Sand Veil＋Wide Lens＋Bright Powder、基础命中 `85` 的确定向量验证：chained modifier `4216`，最终 Numeric Accuracy `87`。
- [x] Hustle 覆盖 Physical／Special、Attack／Accuracy 两个 facet 及两种 Probability Mode 的聚合 activation。
- [x] 统一 Always-hit、统一 Numeric Accuracy 与 `100%` 混合合并结果的文案与 provenance 经验证，展示不依赖遍历顺序。
- [x] Scope 内特性移除红色 unsupported 提示；Keen Eye 与 Illuminate 保留该提示。
- [x] 不改变 Move Snapshot、damage kernel、Atomic Damage Distribution 接口或结果信息层级。
- [x] 完整测试、lint、build 通过，受影响结果 UI 完成 design-taste-frontend review-and-correct。
- [x] [[../docs/traces/discussion/2026-08-06-ability-critical-hit-and-accuracy-semantics|特性暴击与命中语义讨论记录]] 中每条决定均已逐条实现并审计。

## Resolution

已在 Scenario compiler 与既有 Ability compiler seam 中实现 Shell Armor、Battle Armor、Super Luck、Sniper、No Guard、Sand Veil、Snow Cloak、Compound Eyes 与 Hustle，并保持 Move Snapshot、damage kernel、Atomic Damage Distribution 及结果信息层级不变。

新增集中验收覆盖暴击阻止、等级封顶、critical-only Final modifier、固定 Numeric Accuracy chain、No Guard override、Hustle 双 facet、Hit Fact 合并与 deterministic 展示；代表性 Hustle／Sniper 伤害以 `@smogon/calc` 校验。完整测试、lint、build 通过，desktop／mobile design-taste-frontend review-and-correct 完成。

Keen Eye 与 Illuminate 仍为 `unsupported`，父 issue checklist 保持未完成。实现未遇到源契约未决事项，因此未创建 implementation trace。
