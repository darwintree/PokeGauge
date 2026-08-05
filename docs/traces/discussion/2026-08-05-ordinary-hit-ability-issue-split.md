# 普通命中特性 issue 拆分讨论记录

对应 spec change: None.

## 1. 实现票粒度

问题：原 ordinary-hit issue 是否继续一次实现跨越伤害、暴击、命中、Stage、Screen、接触和道具的全部特性。

决定：拆为四个按计算机制归组的同级子 issue，不再作为单个实现任务。

## 2. 原 issue 与父子关系

问题：拆分后是否保留原 issue 作为中间 umbrella。

决定：原 issue 记录拆分结果后关闭归档；四个新 issue 直接挂到 `Implement Pokémon ability effects`，父 issue 中的原链接替换为四个新链接。

## 3. 进攻与防守伤害修正分组

问题：哪些特性归入进攻与防守伤害修正 issue。

决定：纳入 Huge Power、Pure Power、Fire Mane、Water Bubble 的 Water 进攻与 Fire 防守减伤、Tough Claws、Technician、Sharpness、Mega Launcher、Sheer Force、Iron Fist、Reckless、Strong Jaw、Fairy Aura、Thick Fat、Filter、Solid Rock、Purifying Salt、Heatproof、Fur Coat、Sand Force、Solar Power；Adaptability 仅作已实现基线和回归检查。

## 4. 暴击与命中分组

问题：哪些特性归入暴击与命中修正 issue。

决定：纳入 Shell Armor、Battle Armor、Super Luck、Sniper、No Guard、Sand Veil、Snow Cloak、Compound Eyes、Keen Eye、Illuminate；Hustle 的 Atk 与命中两个部分整体归入该 issue。

## 5. Stage 与 Screen 绕过分组

问题：Unaware 与 Infiltrator 如何归组。

决定：二者归入独立的 Stage 与 Screen 绕过 issue。

## 6. 接触与道具组合分组

问题：Fluffy、Long Reach 与 Klutz 如何归组。

决定：三者归入独立的接触与道具组合 issue；Fluffy 的接触减伤与 Fire 弱点完整归入该 issue。

## 7. Dry Skin 的完整性

问题：Dry Skin 是否将 Fire 增伤与 Water 免疫拆到不同 issue 分阶段支持。

决定：不拆分。Dry Skin 的 Water 免疫与 Fire 增伤全部归入 `Ability immunities and type exceptions`，避免仅实现部分效果后误报支持状态。

## 8. 与 sibling issue 的边界

问题：Water Bubble、Sand Force 与 Solar Power 是否继续保留 sibling issue 的兜底归属。

决定：Water Bubble 的普通命中相关效果只由进攻与防守伤害修正 issue 负责；Sand Force 与 Solar Power 同样只由该 issue 负责。immunity issue 不再兜底 Water Bubble，weather/item composition issue 不再兜底 Sand Force 或 Solar Power。

## 9. 规则依据与计算方式

问题：四个 issue 的倍率、阶段与 oracle 以什么为准。

决定：以固定 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override 为规则依据；运行时使用本地 kernel、4096 整数修正和既有阶段顺序，`@smogon/calc` 仅作支持范围内的测试 oracle。

## 10. 优先级与就绪状态

问题：新 issue 创建时使用何种优先级与标签。

决定：进攻／防守伤害修正和暴击／命中为 `high`；Stage／Screen 绕过和接触／道具组合为 `medium`。四个 issue 初始仅标 `FEATURE-REQUEST`，分别完成后续契约讨论后才可添加 `READY-FOR-AGENT`。
