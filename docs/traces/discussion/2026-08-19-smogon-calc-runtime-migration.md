# Smogon calc 运行时迁移讨论记录

对应 spec change: None.

## 1. 计算引擎方向

问题：运行时是否继续使用本地 damage kernel，还是改用 @smogon/calc。

决定：运行时改用 @smogon/calc 做伤害计算，推翻 ADR 0001（本地 kernel 决策）；会心与命中保留本地逻辑。

## 2. 集成方式

问题：迁移后是完整复制 Smogon 公式，还是以黑盒方式消费。

决定：黑盒直接消费 calc.calculate() 的 damage 数组，不复制公式；本地 calculateDamageRolls 内部替换为 calc 调用，输出形状保持 { low: { normal, critical?, defenderHp }, high? } 不变，概率层一行不改。

## 3. 会心与命中

问题：会心（crit）与命中（accuracy）由 calc 还是本地处理。

决定：保留本地逻辑。Snapshot 的 criticalStage/alwaysHits/accuracy 字段不变；compiler 产出 isCrit（含 preventsCritical、criticalOnly 推导）与命中概率喂给 calc 与现有概率层；calc 只消费 isCrit 布尔（Move.isCrit）。

## 4. 概率模式

问题：classic 与 battle-odds 两种概率模式在迁移后如何处理。

决定：两种模式都保留，概率层原样保留 ProbabilityMode，只有 roll 来源换成 calc。

## 5. 天气与场地

问题：天气（weather）与场地（terrain）修正由本地还是 calc 推导。

决定：交给 calc 推导，不再维护本地 weather/terrain 修正。

## 6. 动态招式

问题：Low Kick / Grass Knot 等动态威力招式，以及手填 initialPower 的处理。

决定：动态招式交 calc；本地 reviewedVariablePowerDefault 手填 initialPower 机制退役。

## 7. Override 招式

问题：Body Press / Foul Play / Psyshock 等 override 招式是否放行。

决定：不放行，继续 unsupported。

## 8. 多段攻击

问题：多段招式（Triple Axel、Population Bomb 等）如何计算。

决定：暂不支持多段展开，继续按单段计算（Move.hits 不参与伤害生成）；不新增多段逻辑。

## 9. Spread 修正

问题：spread move 的 0.75x 修正由谁推导，UI 开关是否保留。

决定：保留 UI spread 开关；gameType 固定 Doubles，calc 调用时把 spread 关 映射成 move.target = normal，其余（含 terrain.makesSpread）交给 calc；删除本地 spreadModifier 逻辑。

## 10. 能力支持边界

问题：能力"是否支持"的红点边界在迁移后是什么。

决定：只看 calc 是否认识（gen.abilities.get(name) 是否存在）；不认识才显示红点/unsupported。本地 DAMAGE_MODIFIER_ABILITY_IDS 白名单退役，239 个能力自动解封。行为不变：不支持的仍然显示不支持。

## 11. 版本缺失能力

问题：本地已实现但 calc 0.11.0 缺失的 4 个能力（MEGA_SOL / DRAGONIZE / EELEVATE / FIRE_MANE）如何处理。

决定：走显式拦截 + 红点，复用 Q10 的 missing 机制；记 upstream issue 候选；不写本地 patch 覆盖 calc（保持黑盒纯净）。

## 12. 道具映射

问题：道具映射中非战斗道具与两边都没有的 mega 石如何处理。

决定：非战斗道具忽略；两边都没有的私有 mega 石单独维护。

## 13. Species 归并

问题：PokeAPI 形态名到 calc 物种名的归并规则何时落地。

决定：先落地（独立提交），生成脚本 calcSpeciesName 增加归并规则（NFKD、去后缀、重复 token、特例表），约 15 个碰撞组战斗等价，风险可控。

## 14. 版本漂移策略

问题：calc 落后于 PokeAPI 的版本漂移如何处理。

决定：有问题的暂不支持（排除），需要时向上游贡献代码。

## 15. 旧实现与测试清理

问题：迁移后本地 damage kernel 代码与 calc oracle 测试的去向。

决定：删除本地 kernel（damage-kernel.ts、本地 ability/item/weather/terrain/screen 修正）与 calc oracle 测试；回归保障用一次性新旧对比验证脚本，跑完即弃。

## 16. 实施顺序与 ADR

问题：迁移的落地顺序与是否写新 ADR。

决定：先提交已改的 ability/item 映射重构；落地 species 归并规则；写 ADR 推翻 0001 记录"calc 黑盒 + 本地 crit/accuracy"；实施 calculateDamageRolls 内部替换；清理 oracle 测试。
