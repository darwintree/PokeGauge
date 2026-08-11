---
# This section is managed by the CLI. Do not edit manually.
id: "f806d623-07e0-4f83-9b08-5f6ec5881c69"
title: "Ability immunities and type exceptions"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-11T15:01:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现免疫／属性例外类特性：按规则结算本击无效或等价免疫结果；**不加绿点、不加充能开关**。

## Scope

- Ground immunity／离地：Levitate、Eelevate
- 属性吸收免疫：Flash Fire、Volt Absorb、Water Absorb、Lightning Rod、Motor Drive、Sap Sipper、Earth Eater
- Move flag immunity：Soundproof、Bulletproof
- 属性例外：Scrappy
- Dry Skin：Water 免疫与 Fire 招式 `1.25×` 伤害分支整体实现，不拆成部分支持

范围固定为以上 13 个 Ability，不从调研分桶动态扩张。

## Frozen contract

- Ability 令本击无效时保留可计算的 Scenario；普通与会心伤害分布、KO 概率和等效威力均为零，同时保留 Hit Fact、命中率与 provenance，不标为 Unavailable Scenario。
- compiler 使用不含 Ability 身份的通用 `damageNegated` 输入；kernel 不识别 Ability。公式详情保留真实属性倍率，不新增免疫专用结果信息。
- immunity gate 只有在实际改变结果时才令 Ability `active`；本击原本已因属性免疫而为零时 Ability 为 `inactive`。
- Scrappy 只解除 Ghost 对 Normal／Fighting 的属性免疫，不绕过 Ability immunity；其 Scenario Move Type 例外必须在依赖 effectiveness 的 Held item gate 之前解析。
- Levitate 与 Eelevate 都令对应 Pokémon `grounded = false`，同时参与 Ground 免疫与 Terrain grounded gate；未进入当前输入契约的接地变化不作推断。
- Dry Skin 的 Water 分支令伤害无效；Fire 分支在 Base Power 阶段使用 `5120/4096`。
- 以上 Ability 移除红色 unsupported 提示，不新增绿点、充能开关、partial-support 状态或文字披露。
- 本票只保证以上 13 个 Ability 的 activation，不顺带清理其他来源在零伤害结果下的跨机制 provenance。

## References

- [[../docs/traces/discussion/2026-08-11-ability-immunities-and-type-exceptions|Ability immunities and type exceptions 讨论记录]]
- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §9
- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]] §7–§8
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Out of scope

- Flash Fire 等充能加攻状态
- 吸收回血、能力提升与 Eelevate 的 KO 后效果
- Mold Breaker 忽略防守方特性
- Water Bubble 的 Water 进攻与 Fire 防守减伤，见 [[archive/20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]
- Iron Ball、Gravity 等当前 Scenario 没有输入契约的接地变化
- 为可计算的零伤害 Scenario 新增领域术语或修改 `CONTEXT.md`

## Acceptance criteria

- [ ] 匹配属性／招式旗标时按免疫或约定例外结算。
- [ ] 免疫结果保持 calculable，`damageNegated`、真实属性倍率、零伤害／零等效威力及 Hit Fact 均符合冻结契约。
- [ ] Scrappy 在 Held item effectiveness gate 前解析，且不绕过 Ability immunity。
- [ ] Levitate／Eelevate 的 Ground immunity、grounded 与 Terrain provenance 行为一致。
- [ ] Dry Skin 的 Water 免疫与 Fire 增伤同批完成，不出现部分支持状态。
- [ ] 13 个 Ability 去除红色 unsupported 提示；无充能 UI、绿点或 partial-support 披露。
- [ ] 逐条审计讨论记录中的每项决定均已实现并由代表性 active／inactive 与组合测试覆盖。
- [ ] 父 issue checklist 对应项可勾选。
