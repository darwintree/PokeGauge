# 进攻与防守特性伤害修正契约讨论记录

对应 spec change: None.

## 1. Move 行为语义来源

问题：Move 的 contact、punch、bite、pulse、slicing、recoil 与 secondary 等行为语义是否允许使用本地 fallback、Showdown 运行时数据或效果文本解析。

决定：PokeAPI 是运行时唯一 source of truth；不增加本地 fallback、Showdown／calc 生产依赖或效果文本解析。PokeAPI 数据缺口回推上游修正。

## 2. PokeAPI 数据缺口下的支持边界

问题：PokeAPI 当前不能完整表达所有 Move gate 时，各特性应如何划分支持状态。

决定：Technician、Tough Claws、Iron Fist、Strong Jaw 与 Mega Launcher 使用当前 PokeAPI 数据实现；缺失映射按未命中 gate 处理。Sharpness、Reckless 与 Sheer Force 保持 `unsupported`，直到 PokeAPI 提供完整结构化语义。

## 3. Track Selection Activation 术语

问题：具有默认 Neutral Selection 的 Choice Track 如何表述 Selection 是否参与最终结果。

决定：统一称为 Track Selection Activation；`active` 表示生效，`inactive` 表示最终效果等同于 neutral，`unsupported` 表示当前仅占位且按 neutral 计算，`neutral` 表示基线选择。不再使用领域术语 Source State 或 `effective`。

## 4. 术语变更与现有行为

问题：`effective` 改称 `active` 是否同时改变现有 activation 判定逻辑。

决定：不改变现有判定逻辑。代码字面量、provenance 字段与测试命名单独进行纯机械重命名；当前特性实现不顺带执行全局重命名，历史 trace 不修改，该重命名不阻塞本 issue。

## 5. Attack 与 STAB phase 能力矩阵

问题：进攻能力与针对攻击方数值的防守能力分别进入哪个 phase、使用何种 gate 与 4096 modifier。

决定：Adaptability 在有本系加成时使用 STAB `8192`；Huge Power／Pure Power 对物理招式使用 Attack `8192`；Fire Mane 对 Fire 招式使用 Attack `6144`；Water Bubble 进攻侧对 Water 招式使用 Attack `8192`；Solar Power 在 Sun 下对特殊招式使用 Attack `6144`；防守侧 Water Bubble 对 Fire、Thick Fat 对 Fire／Ice、Purifying Salt 对 Ghost、Heatproof 对 Fire，均向 Attack chain 追加 `2048`。

## 6. Base Power phase 能力矩阵

问题：Base Power 能力使用何种 gate 与 modifier。

决定：Technician 对已解析原始威力不高于 60 的招式使用 `6144`；Tough Claws 对 PokeAPI contact 使用 `5325`；Iron Fist 对 punch 使用 `4915`；Strong Jaw 对 bite 使用 `6144`；Mega Launcher 对 pulse 使用 `6144`；Sand Force 在 Sand 下对 Rock／Ground／Steel 招式使用 `5325`；Fairy Aura 对 Fairy 招式使用 `5448`。

## 7. Defense 与 Final phase 能力矩阵

问题：Fur Coat、Filter 与 Solid Rock 进入哪个 phase。

决定：Fur Coat 对物理招式向 Defense chain 追加 `8192`；Filter／Solid Rock 在最终属性相克倍率大于 1 时向 Final chain 追加 `3072`。

## 8. Fire Mane 身份

问题：PokeAPI 与固定 Showdown snapshot 的 Fire Mane numeric id 不一致时使用哪一个身份。

决定：运行时按 PokeAPI `fire-mane` 身份及当前 PokeAPI id 识别，不使用 Showdown 的 numeric id。

## 9. 已支持能力的 inactive 判定

问题：已支持能力未满足 gate 或 PokeAPI 缺少对应 flag 时如何标记。

决定：已支持能力未满足 gate 时标记 `inactive`；Tough Claws、Iron Fist、Strong Jaw 与 Mega Launcher 对 PokeAPI 未标记的 Move 同样标记 `inactive`，不将数据缺失解释为额外 fallback 或局部 `unsupported`。

## 10. Fairy Aura 双方组合

问题：双方都选择 Fairy Aura 时是否重复应用 modifier，以及来源 activation 如何记录与合并。

决定：Fairy Aura modifier 最多应用一次。攻击方、守方四种有无组合合并为无 Aura 与有 Aura 两类计算；双方均选择且 Fairy Aura 生效时，双方 Ability Selection 都标记 `active`。

## 11. Weather Selection activation

问题：Sand Force 与 Solar Power 消费 Weather gate 时，Weather Selection 是否应视为参与最终结果。

决定：Sand Force 生效时 Sand Selection 为 `active`；Solar Power 生效时 Sun Selection 为 `active`。Weather 自身的普通伤害修正与能力 gate 共同决定现有 Weather Selection activation。

## 12. Compiler 与 kernel 边界

问题：能力 modifier 是否需要修改 damage kernel 或先改写 power、attack、defense 等 operand。

决定：kernel interface 不变。Compiler 解析资源、gate、activation、同 phase 顺序与 4096 chain，并向 kernel 传入原始 operand 加每个 phase 的单一最终 modifier；kernel 不识别 Ability、Move flag、来源、priority 或 label。

## 13. Modifier details 与 label

问题：当前能力 issue 是否增加带最终 modifier、contribution 数值与 label 的详细 compiler 输出。

决定：不增加 `modifierDetails` 或 `contributions`。没有 label 时 contribution 没有当前消费者；label 的真实用途是伤害条件卡展示，由独立 issue 从 UI 需求重新设计，当前 issue 只沿用既有 compiler 输出。

## 14. Base Power chain 顺序

问题：Ability 与既有 Item、Terrain、move/weather callback 在同一 Base Power phase 中如何排序。

决定：Compiler 显式按 `ability → attacker item → terrain → move/weather callback` 组装并一次 chain；修正现有不符合该顺序的组合路径，不建立通用 priority 框架。

## 15. 其他 phase 的 chain 顺序

问题：Attack、Defense 与 Final phase 中 Ability 与既有来源如何排序，critical 分支如何变化。

决定：Attack 为 `attacker ability → defender ability → attacker item`；Defense 为 `defender ability → defender item`；Final 为 `screen → defender ability → attacker item → defender item`。Critical 分支只移除 screen，其余顺序不变。

## 16. Ability compiler seam

问题：能力规则应继续内联到 Scenario compiler，还是建立通用 effect／priority 系统。

决定：在 damage-calculation 内新增与 weather、terrain、screen 同层的 Ability compiler，返回各 phase 所需的能力 modifier、双方 Ability activation 以及 Weather 是否因能力 gate 而 active；Scenario compiler 负责按已定顺序与其他来源组合。不建立通用 effect 或 priority framework。

## 17. PokeAPI Move flag 资源契约

问题：当前 generated Move resource 如何提供 contact、punch、bite 与 pulse gate。

决定：资源生成器读取 PokeAPI `move_flag_map.csv` 与 `move_flags.csv`，在 `NormalizedMove.flags` 中保留 PokeAPI 当前提供的全部 flag slug；能力 gate 使用 flag membership，不维护能力专用 Move id 集合。上游增加新 flag 后更新 PokeAPI pin并重新生成资源。

## 18. 支持状态的 UI 提示

问题：本 issue 完成后 Ability Track 的支持提示如何变化。

决定：本 issue 已支持的 Ability 移除红色 unsupported 提示；Sharpness、Reckless 与 Sheer Force 继续显示红色提示；不新增绿色提示。

## 19. 验证层级

问题：如何在不过度构造笛卡尔积的前提下验证全部规则、activation 与整数顺序。

决定：每个已支持 Ability 至少覆盖一个 active 与一个 inactive compiler 用例；单独覆盖 Water Bubble 双 facet、Fairy Aura 四种双方组合、Sand Force／Solar Power 的 Weather activation、PokeAPI flag 正反例及已知缺失。每个受影响 phase 至少覆盖一个跨来源顺序组合，normal／critical 均验证且 critical 只移除 screen。支持范围内使用 `@smogon/calc` 作代表性 oracle；Fire Mane 与 PokeAPI 数据差异使用明确数值断言；不测试全部 Ability × Item × Weather 笛卡尔积。

## 20. 架构文档载体

问题：本轮是否需要新增 ADR。

决定：不新增 ADR；既有 ADR 已覆盖 compiler → phase scalar → kernel 的边界。本讨论记录与 issue 保存本轮规则，术语写入 `CONTEXT.md`。
