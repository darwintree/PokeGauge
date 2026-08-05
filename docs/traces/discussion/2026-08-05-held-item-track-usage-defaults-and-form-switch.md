# Held item Track：使用率默认、形态切换与 Picker 讨论记录

对应 spec change: [`docs/spec/changes/2026-08-05-held-item-pick-and-form-switch.md`](../../spec/changes/2026-08-05-held-item-pick-and-form-switch.md)

## 1. 总体路径

问题：Held item Track 是否采用与 Move Track 类似的使用率候选池 + 默认多选模型。

决定：采用。高使用率道具进入候选池；默认选中其中全部非形态触发道具；形态触发道具点击后经确认切换 Battle Pokémon Identity。

## 2. 使用率数据源

问题：道具使用率以何为 source of truth。

决定：与 Move Pick 对齐——Champions index 默认赛季，按 Battle Pokémon Identity 解析；Mega Identity 继承其 base species 的道具使用率。不使用 Smogon chaos 作为临时源。

## 3. 「高使用率」量化

问题：候选池与默认选中如何定义「高使用率」。

决定：按使用率排序后取 top 10 行作为高使用率集合。默认选中 = 该集合中全部非形态触发道具。不套用招式的 >50% 或克制规则。

## 4. 使用率与 frozen 资格

问题：使用率是否扩大道具候选资格。

决定：普通道具不扩大资格——不在该侧 frozen 资格内的道具即使有使用率也不进池。形态触发道具见第 7 节例外。

## 5. 显式无道具与缺数据

问题：`none` 是否参与默认；使用率缺失或尚无 Items 字段时如何处理。

决定：`none` 不参与使用率默认。高使用率集合为空、全为形态触发、或使用率不可用时，回退为 `["none"]`（若 Identity 已锁定形态道具则保持锁定唯一项）。`nothing` 与无法映射/无资格的行跳过，且不在 top 10 边界内 backfill。

## 6. 攻防范围与锁定态

问题：攻击方与防守方规则是否相同；已是 Mega/Mask Identity 时是否仍建使用率池。

决定：攻防同一契约，各自用自己的 Identity。已锁定形态道具的 Identity 只展示锁定项，不渲染使用率池与形态导航。

## 7. 形态触发资格例外与白名单

问题：哪些道具可触发形态切换；目标 Identity 不可选时如何处理；形态道具如何进入未锁定 Identity 的池。

决定：维护显式 item→Identity 映射表。表内且目标 Identity 可选、且「当前 Identity → 目标」合法时：可进未锁定 Identity 的候选池（即使不在 attacker/defender frozen 池），默认不选中，点击走确认切换。目标不可选则不进池、不触发。初表包含 Mega Stone→对应 Mega、Ogerpon Mask→对应面具形态；其它有可选目标的形态道具写入映射后同样触发。Plate/Orb 等在写入映射前只作普通效果道具。

## 8. 形态点击与切换语义

问题：形态道具在当前 Identity 上是多选还是导航；确认后状态如何变化；如何离开形态。

决定：纯导航——点击只弹确认；确认后走与 Battle Pokémon Picker 重选相同的 catalog transition（含 tracks 重建与目标形态的道具锁定）；不把该道具加入当前 Identity 的 selectedIds。取消则无变化。无「只装备不换形」。锁定后只能通过 Pokémon Selector 离开形态，不提供卸下道具回退。多形态石（如 Charizardite X/Y）可同时在池中，点哪个切哪个。

## 9. 默认重算时机

问题：何时允许使用率重写池与默认选中。

决定：对齐 Move/Ability——仅该侧 Held item Track 仍为 untouched 时，异步使用率可写入；用户改过选中或池后不得覆盖。切换 Battle Pokémon Identity（含形态确认切换）后在新 Identity 上重走默认。恢复已保存 Matchup 以保存状态为准。该策略的后续迭代另立 issue，不阻塞本基线。

## 10. Track 展示与选择

问题：Held item Track 的信息架构与多选地板。

决定：同构 Move Track——折叠显示已选 chip，展开为池内多选 + 添加入口；不做效果族分区铺陈。空选中强制 `["none"]`。部分支持警告（persistent-berry、utility-umbrella）保留。形态道具在池中以「将切换形态」提示区分，不呈现为已选中态。锁定 Identity 只读展示锁定道具。

## 11. Picker 范围与选中行为

问题：池外添加的目录范围；选中行为；是否提供 `none`。

决定：提供 Picker；目录为该侧 frozen 资格池，外加当前 Identity 合法且目标可选的形态道具（非全表 Mega 图鉴）。从 Picker 选中普通道具：若尚不在池则加入并立即选中。Picker 不提供 `none`。形态道具在 Picker 中点击仍走确认切换导航，不作为当前 Identity 的多选加入。

## 12. Picker 筛选标签

问题：Picker 需要哪些基本筛选分类及组合语义。

决定：本地化名称搜索；可叠加标签，多选为 AND；标签为「专属」「威力」「能力」「树果」。无选中标签时不按标签过滤。另保留「当前持有者可用」开关，默认开启。列表默认按该侧 frozen 规范序，筛选只过滤不重排。会心、命中、Utility Umbrella 不设标签，仅在无标签过滤或名称搜索时可见。

## 13. 标签归属

问题：四个标签如何机读归属。

决定：专属 = 形态映射表 ∪ holder-species / holder-identity / eviolite-eligible。威力 = base-power 或进攻向 final-damage。能力 = battle-stat。树果 = 抗性树果（persistent-berry / resistance berry 集合）。同一道具可带多标签。

## 14. Spec 落地顺序

问题：实现前是否必须先改契约。

决定：必须先经 spec-change 接受并更新最终 spec，再实现；本讨论记录的产品决策以该 change 与最终 spec 为验收依据。
