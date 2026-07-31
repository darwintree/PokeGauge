# 形态锁定与身份门控携带道具讨论记录

对应 spec change: None.

## 1. Eviolite 资格

问题：Eviolite 的可进化资格应按 species 统一推导，还是按每个 Battle Pokémon identity 精确表达。

决定：按每个 Battle Pokémon identity 生成资格；使用本地 PokeAPI 进化记录中的默认形态与 `base_form_id` 关系，并为 Pumpkaboo-Small、Pumpkaboo-Large、Pumpkaboo-Super 与 Gimmighoul-Roaming 设置审核通过的正向例外；runtime 不查询 evolution chain。

## 2. 其他身份门槛

问题：Light Ball、Thick Club、Deep Sea items、保留的三颗 Orb 与 Soul Dew 如何绑定持有者身份和招式属性。

决定：按稳定的 base-species identity 精确判断；Light Ball 支持全部 Pikachu 形态，Thick Club 支持 Cubone 与 Marowak（含 Alolan），Deep Sea items 只支持 Clamperl；三颗 Orb 与 Soul Dew 同时检查对应持有者身份和招式属性；不合资格时保留普通候选但记为 `inactive`。

## 3. Battle Pokémon identity 切换

问题：更换 Battle Pokémon identity 时是否保留或恢复上一形态的携带道具。

决定：重建目标 identity 的默认配置；需要锁定道具的 identity 使用锁定项；不保存或恢复上一形态的道具；保留现有 Mega Rayquaza 道具保留例外。

## 4. Ogerpon Mask 绑定

问题：Wellspring Mask、Hearthflame Mask 与 Cornerstone Mask 是普通候选、选择后自动切形态，还是像 Mega Stone 一样由 identity 锁定。

决定：三件 Mask 完全采用 Mega Stone 模式；仅在对应 masked Ogerpon identity 上显示并锁定，不进入其他 identity 的普通候选池；选择道具不自动切换 Battle Pokémon identity。

## 5. Ogerpon Mask 警告

问题：三个 Mask 是否需要在 Held item Track 增加静态部分支持警告。

决定：不增加额外 Held item 警告；Ogerpon 特性效果的支持状态继续由 Ability Track 披露。

## 6. 范围外形态道具

问题：Adamant Crystal、Lustrous Globe 与 Griseous Core 是否因本次身份／形态决策重新进入白名单或获得警告。

决定：三件道具继续位于 85 项白名单外，不新增效果、兼容或警告语义。
