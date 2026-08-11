# 绿点条件触发特性讨论记录

对应 spec change: None.

## 1. 绿点与 Track Selection Activation

问题：绿点是新的 Activation 值、UI-only 披露，还是与 Activation 正交的独立领域概念。

决定：绿点是 Track 上的 UI 披露，不扩展 Track Selection Activation。Activation 仍只用 `active`／`inactive`／`unsupported`／`neutral`。领域术语为 Assumed-Satisfied Ability Selection（假设条件已满足的特性选择）：选中即表示缺失的战斗条件输入在本 Scenario 中已满足。

## 2. 假设条件与机械 gate

问题：选中 Overgrow 等特性后，招式类型等既有 gate 未命中时，绿点与 Activation 如何共存。

决定：二者正交。绿点表示条件假设仍成立；机械 gate 未命中时 Activation 为 `inactive`。

## 3. 绿点挂载时机

问题：绿点仅在当前 Selection 时显示、作为选项静态标记，或两者都要。

决定：在名单内特性选项上使用静态绿点（对齐红点静态披露），选前即可看到「选中即假设条件」。

## 4. Merciless 的会心路径

问题：Merciless「条件满足」是强制会心、写入既有会心路径，还是剔出本票。

决定：写入既有会心路径（`criticalStage = 3`），并仍受 Battle Armor／Shell Armor 的 `preventsCritical` 抑制。

## 5. 效果矩阵

问题：本票八个特性的侧别、假设条件、修正与额外 gate。

决定：

| Ability | 侧 | 假设条件 | 效果 | 额外 gate |
| --- | --- | --- | --- | --- |
| Multiscale | 防守 | 满 HP | `finalModifier` `2048` | 无 |
| Overgrow／Blaze／Torrent／Swarm | 进攻 | HP≤⅓ | `basePower` `6144` | 招式属性 = 草／火／水／虫 |
| Guts | 进攻 | 攻击方有异常状态 | `attackerAttack` `6144` | `physical` |
| Marvel Scale | 防守 | 防守方有异常状态 | `defenseModifier` `6144` | `physical` |
| Merciless | 进攻 | 防守方中毒／剧毒 | `criticalStage = 3` | 见 §6 |

倍率均为现有 4096 整数表示。

## 6. Merciless 遇防暴时的 Activation

问题：`preventsCritical` 时 Merciless 为 `active` 还是 `inactive`。

决定：遇防暴时 Merciless 为 `inactive`，复用现有会心 stage Ability 的 provenance 规则。

## 7. Guts 与灼伤降攻

问题：本票是否实现灼伤物攻减半及 Guts 忽略灼伤。

决定：不实现。当前无异常状态／灼伤模型；选中只提供物理 `6144` 攻击修正；hover 只陈述「按已陷入异常状态结算」。

## 8. 结果侧披露

问题：结果 provenance 是否也显示绿点或「条件已假设」脚注。

决定：仅 Track 披露绿点与 hover；结果侧沿用普通 `active`／`inactive` 来源名，不出现绿点。

## 9. Hover 文案粒度

问题：绿点 hover 用通用一句、按族分写，还是每特性长说明。

决定：按族分写：Multiscale「按满 HP 结算」；猛火族「按 HP≤⅓ 结算」；Guts／Marvel Scale「按已陷入异常状态结算」；Merciless「按对手中毒／剧毒结算」。

## 10. 无机械钩子一侧

问题：进攻方选中 Multiscale 等「该侧无效果」时如何处理绿点与 Activation。

决定：静态绿点仍在；编译为 `inactive`。不按有效侧过滤绿点，不从错误侧目录移除该类特性。

## 11. Multiscale 与多段伤害

问题：主系列仅满 HP 第一击减半，本计算器尚无多段契约时如何处理。

决定：本票按单次结算击处理，每个 Scenario 该击均按满 HP ×0.5；多段语义留给多段相关 issue。

## 12. 绿点与红点

问题：本票纳入支持后绿点与红点可否并存。

决定：互斥。进入支持集后去掉红点、加上绿点；同一选项不同时出现两者。
