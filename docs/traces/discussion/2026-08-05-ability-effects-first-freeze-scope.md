# 特性效果首批冻结范围讨论记录

对应 spec change: None.

## 1. 首批总体策略

问题：首批能力效果按何标准纳入，是否必须走 Wayfinder。

决定：不强制 Wayfinder。首批按机制族纳入：直接伤害钩子；选中时初始化投射到已有 Track 的状态类特性；选中即视为条件满足的绿点条件触发特性；按规则结算的免疫类；result 侧改招式属性的类型变化特性。Mold Breaker 族整批剔除。Parental Bond  defer，与多段伤害 issue 绑定。未支持特性仍标「效果暂未支持」，不得标成已判断无效。

## 2. Ability Track 的 `none`

问题：是否提供显式无特性选项。

决定：攻击方与防御方 Ability Track 都提供 `none`，用于本侧无特性／特性不参与计算的对比。

## 3. 状态投射与 Track 的关系

问题：选中 Drought 等特性后，Weather／Stage 等 Track 由谁做主，之后能否改。

决定：特性只负责初始化投射。初始化完成后，以各 Track 的当前选择为准；用户可再改 Track，特性不持续强制锁定。

## 4. 天气／场地初始化投射名单

问题：哪些特性在选中时初始化 Weather／Terrain Track。

决定：Drought → 大晴天；Drizzle → 下雨；Sand Stream／Sand Spit → 沙暴；Snow Warning → 下雪；Electric Surge → 电气场地。

## 5. Intimidate 初始化投射

问题：威吓如何进入首批。

决定：纳入。作为防御方选中时，初始化将攻击方 Atk 阶级降低（−1）。

## 6. Defiant／Competitive 初始化投射

问题：不服／好胜是否纳入，以及如何用阶级表达。

决定：纳入。选中时在初始化中新增对应 Stage：Defiant 新增 Atk `+1` 与 `+2`；Competitive 仅新增 SpA `+2`。

## 7. Cloud Nine／Air Lock

问题：选中后如何影响天气伤害。

决定：压制 Weather Track 对伤害计算的影响（对齐 Utility Umbrella 思路的天气可见性／伤害抑制）。

## 8. 绿点条件触发族

问题：Multiscale、猛火族、毅力等是否纳入，以及是否新增 HP%／状态 Track。

决定：一并纳入。不新增 HP%／状态 Track；选中即默认代表条件已满足并生效，Track 上用绿点表示；hover 说明该特性已按生效条件结算。覆盖至少：Multiscale；Overgrow／Blaze／Torrent／Swarm；Guts／Marvel Scale／Merciless。

## 9. 吸收类（Flash Fire 等）

问题：是否引入充能／abilityOn 开关或绿点。

决定：不引入充能开关，不加绿点。首批仅按规则结算为免疫（或该击等价的无效／吸收命中结果）。

## 10. `-ate`／Liquid Voice／Dragonize 的招式属性

问题：类型变化由谁拥有，是否改 Move 列表。

决定：只在 result 的计算与展示中使用变化后的招式属性；Move 列表与 snapshot 选型保持用户所选，不变。

## 11. Protean 类

问题：变身类是否支持，以及 STAB 如何处理。

决定：支持。Protean 类下所有招式都适用 STAB（按变化后与招式一致的属性结算）。

## 12. Unnerve 与抗性树果

问题：紧张感对抗性树果减伤如何处理。

决定：有 Unnerve 时，对方抗性树果减伤不生效。

## 13. Mega Sol 与天气

问题：Mega Sol 与 Weather Track 的关系。

决定：视为自带晴天伤害模（按晴天相关伤害修正结算）。

## 14. Mold Breaker 族

问题：破格等是否进入首批。

决定：全部剔除出首批。

## 15. Parental Bond

问题：亲子爱是否进入首批。

决定：当前 defer；与多段伤害相关 issue 一并处理。
