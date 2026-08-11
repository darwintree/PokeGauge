# Ability immunities and type exceptions 讨论记录

对应 spec change: None.

## 1. 实现范围

问题：本票是否继续用“其他首批冻结中的 tryHit／typeMod 免疫例外”保留开放范围。

决定：范围固定为 Levitate、Eelevate、Flash Fire、Volt Absorb、Water Absorb、Lightning Rod、Motor Drive、Sap Sipper、Earth Eater、Soundproof、Bulletproof、Scrappy 与 Dry Skin，共 13 个 Ability；不保留兜底范围。

## 2. 免疫结果

问题：Ability 令本击无效时，应保留零伤害结果、标记为 Unavailable Scenario，还是不生成该 Scenario。

决定：保留可计算的 Scenario；普通与会心伤害分布、KO 概率和等效威力均为零，同时保留 Hit Fact、命中率与 provenance。该结果不是 Unavailable Scenario。

## 3. 框架外效果与支持披露

问题：吸收类 Ability 的回血、充能、能力提升或 KO 后效果不在当前计算器框架内时，Ability Track 如何披露支持状态。

决定：13 个 Ability 均移除红色 unsupported 提示；不新增绿点、充能开关、partial-support 状态或文字披露。当前计算器框架外的效果不属于本票的支持声明。

## 4. 零伤害编译契约

问题：非属性类免疫是否复用 `typeEffectivenessModifier = 0`，从而把 Soundproof／Bulletproof 等显示为属性相克零倍。

决定：compiler 产生不含 Ability 身份的通用 `damageNegated` 输入；kernel 据此输出全零伤害。公式详情保留真实属性倍率，不新增结果信息；等效威力为零，现有 active Ability 来源说明无效原因。

## 5. Ability activation

问题：免疫 gate 匹配但本击原本已因属性免疫而为零时，Ability 是否仍为 `active`。

决定：按贡献判定。没有该 Ability 时会造成伤害、选中后归零，则 Ability 为 `active`；本来已经归零则为 `inactive`。Scrappy 仅在移除 Ghost 对 Normal／Fighting 的免疫并实际改变结果时为 `active`。

## 6. Provenance 清理范围

问题：本票是否同时清理所有上游倍率来源在最终零伤害时的跨机制 activation。

决定：本票只保证这 13 个 Ability 的 activation；不顺带清理其他 Ability、Held item、Weather、Terrain、Stage 或 Screen 来源的跨机制 provenance。

## 7. Scrappy 边界

问题：Scrappy 改写哪些免疫，以及何时参与 effectiveness gate。

决定：Scrappy 只解除 Ghost 对 Normal／Fighting 的属性免疫，不绕过 Ability immunity；Scenario Move Type 的例外结果必须在依赖 effectiveness 的 Held item gate 之前解析。

## 8. Ground immunity 与离地

问题：Levitate／Eelevate 是否只令 Ground 招式无效，还是同时拥有离地语义。

决定：Levitate 与 Eelevate 都使对应 Pokémon `grounded = false`，并同时参与 Ground 免疫和 Terrain grounded gate；只有实际改变结果时 Ability 才为 `active`。Iron Ball、Gravity 等未进入当前输入契约的接地变化不在本票中推断。

## 9. Dry Skin 完整性

问题：Dry Skin 的 Water 免疫与 Fire 增伤是否允许拆分支持。

决定：两部分原子交付；Water 分支令伤害无效，Fire 分支在 Base Power 阶段使用 `5120/4096`。

## 10. 明确排除项

问题：本票是否纳入回血、充能、能力提升、KO 后效果、Mold Breaker、Water Bubble 或额外接地输入。

决定：全部排除；本票只实现已确认的当前 Scenario 伤害、属性例外与 grounded 语义。

## 11. 领域词表

问题：是否为可计算的零伤害 Scenario 新增专用领域术语。

决定：不新增术语，不修改 `CONTEXT.md`；直接把行为写入实现契约。
