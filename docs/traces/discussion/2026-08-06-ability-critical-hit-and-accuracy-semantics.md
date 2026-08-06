# 特性暴击与命中语义讨论记录

对应 spec change: None.

## 1. 防暴击后的结果形状

问题：Shell Armor 或 Battle Armor 阻止暴击时，是否仍保留参考暴击伤害分支。

决定：生成 ordinary-only 结果，暴击概率为零，不展示暴击 whisker 或 CT 等效威力。Shell Armor 或 Battle Armor 在 Classic Mode 与 Battle Odds Mode 中均为 `active`。

## 2. Sniper 在 Classic Mode 中的 activation

问题：Classic Mode 不将随机暴击纳入 KO Probability，但 Sniper 仍会改变可见暴击 whisker 时，Sniper 是否为 `active`。

决定：只要暴击伤害分支存在且 Sniper 改变该分支，Sniper 在两种 Probability Mode 中均为 `active`；暴击被阻止时为 `inactive`。

## 3. Super Luck 的等级与 activation

问题：Super Luck 如何与 Move Snapshot 及现有暴击道具语义组合。

决定：Super Luck 贡献一级暴击等级，与其他贡献相加后封顶为三级且不回写 Move Snapshot。Battle Odds Mode 中仅在改变最终暴击概率时为 `active`；Classic Mode 中仅在将结果推到必定暴击时为 `active`。

## 4. 命中事实与重复必中来源

问题：如何区分数值 `100%` 与定性必中，以及多个来源都可独立产生必中时如何记录 activation。

决定：使用 Hit Fact 表示一个 Scenario 的最终命中语义，并区分 Numeric Accuracy 与 Always-hit Fact。Battle Odds Mode 中，多个独立产生 Always-hit Fact 的来源全部为 `active`；Move Snapshot 原本已是 Always-hit Fact 时 No Guard 为 `inactive`。Classic Mode 中 No Guard 为 `inactive`。

## 5. Keen Eye 与 Illuminate 的支持边界

问题：当前没有 accuracy/evasion Stage 输入时，Keen Eye 与 Illuminate 应记为已支持但未生效，还是继续暂未支持。

决定：Keen Eye 与 Illuminate 保持 `unsupported`，移出当前子 issue 的交付范围，不新增 accuracy/evasion Stage Track，父 issue checklist 对应项保持未完成。

## 6. 跨 Probability Mode 的 activation 一致性

问题：尽量保持 Classic Mode 与 Battle Odds Mode 的 activation 一致，是否应覆盖 Classic Mode 明确忽略的纯概率效果。

决定：仅对 Classic Mode 中仍改变可见结果的效果保持 activation 一致。Classic Mode 中的纯命中概率与未达必定暴击的等级效果为 `inactive`；Hustle 在修改物理攻击时仍可为 `active`。

## 7. Numeric Accuracy `100%` 与 Always-hit Fact 的 Scenario Merge

问题：伤害分布相同但 Hit Fact 不同的 Scenario 是否合并，以及合并后如何展示命中语义。

决定：计算等价的 Scenario 继续合并并聚合 Hit Fact。全部来源均为 Always-hit Fact 时显示“必中”；全部为 Numeric Accuracy 时显示数值；Numeric Accuracy `100%` 与 Always-hit Fact 混合时显示共同的有效命中概率 `100%`，并保留各来源 provenance。

## 8. 编译责任与接口边界

问题：特性暴击与命中效果是否需要修改 Move Snapshot、新增 Track，或改变 damage kernel 与 Atomic Damage Distribution 接口。

决定：由 Scenario compiler 从当前 Scenario 派生最终暴击分支、Hit Fact 与概率，复用现有 4096 modifier chain、damage kernel 与 Atomic Damage Distribution 接口；不回写 Move Snapshot，不新增 Track。

## 9. Numeric Accuracy 同阶段顺序

问题：固定规则源在同优先级内依赖速度排序，但当前产品没有 Speed 输入时，多个 Numeric Accuracy modifier 如何确定性组合。

决定：Numeric Accuracy 的同阶段 4096 chain 固定按 `attacker ability → defender ability → attacker item → defender item` 组合，不新增 Speed Track。

## 10. Sniper 在 Final chain 中的位置

问题：攻击方 Ability 的 critical-only final modifier 如何加入已有 Final chain。

决定：Final chain 固定按 `screen → attacker ability → defender ability → attacker item → defender item` 组合。Sniper 仅进入 critical branch，critical branch 仍先移除 screen。
