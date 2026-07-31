# 携带道具命中率与要害语义讨论记录

对应 spec change: None.

## 1. 概率效果的所有权

问题：携带道具的命中率与要害效果应由 Scenario compiler、Move snapshot 还是 Atomic Damage Distribution 拥有。

决定：由 `compileScenario` 从当前 Scenario 派生命中率与要害等级；不修改 Move snapshot；Atomic Damage Distribution 继续只接收最终概率，不识别道具。

## 2. 概率模式

问题：命中率与要害道具如何参与 `16 roll` 和 `Actual probability` 两种模式。

决定：`Actual probability` 使用命中率与全部要害概率；`16 roll` 固定命中并忽略未达到 `+3` 的随机要害，但派生总要害等级达到 `+3` 时仍使用必定要害分支。

## 3. 命中语义边界

问题：命中率道具是否修正数值命中、必中语义与未配置命中。

决定：Wide Lens、Bright Powder 与 Lax Incense 只修正数值命中；`always-hit` 保持必中；未配置的 accuracy `0` 继续不可计算，不能由道具补全。

## 4. 要害等级合成

问题：要害道具如何与 Move snapshot 的要害等级合成。

决定：Scope Lens 与 Razor Claw 贡献 `+1`，Leek 与 Lucky Punch 贡献 `+2`；贡献与 snapshot 等级相加后封顶 `+3`，且不回写 snapshot。

## 5. Leek 与 Lucky Punch 的身份门槛

问题：Leek 与 Lucky Punch 是否按持有者身份限制生效。

决定：Leek 只对普通／Galar Farfetch’d 与 Sirfetch’d 生效；Lucky Punch 只对 Chansey 生效；不合资格的选择保留但记为 `inactive`。

## 6. 数值命中合成与精度

问题：命中率道具采用哪套系数、合成、舍入与封顶语义。

决定：采用钉住的 Pokémon Showdown Gen 9 语义。Wide Lens 使用 `4505`，Bright Powder 与 Lax Incense 使用 `3686`；同一 `ModifyAccuracy` 阶段以 4096 整数链合成并只应用一次；后续 accuracy override 可以覆盖该结果；最终 ADD 命中概率以 `min(1, accuracy / 100)` 封顶。

## 7. `16 roll` 的来源状态

问题：概率效果被 `16 roll` 模式忽略时，道具来源记为何种状态。

决定：命中率道具记为 `inactive`；要害道具只在把派生总等级推到 `+3` 时记为 `effective`，否则记为 `inactive`。

## 8. ADD、合并身份与来源聚合

问题：道具身份是否进入 Atomic Damage Distribution 或效果等价 Scenario 的 calculation identity。

决定：Atomic Damage Distribution 只接收派生后的命中与条件要害概率；calculation identity 包含最终概率但不包含道具身份；概率等价的 Scenario 合并，道具选择只聚合进 provenance。

## 9. Champions 实机证据边界

问题：在官方 Champions 资料未公开数值公式时，是否将钉住的 Showdown Gen 9 算法视为已由 Champions 实机独立证实。

决定：采用该算法作为明确的 pinned Pokémon Showdown Gen 9 alignment；不得描述为 Champions 实机已独立确认；后续官方资料或可重复实测反例可以触发 ruleset adapter 更新。

## 10. 未改变最终输入时的来源状态

问题：满足机械条件但因概率封顶、要害等级封顶或后置 override 而未改变最终编译输入时，道具记为何种状态。

决定：只有移除该道具贡献会改变最终命中概率、派生要害等级或伤害分支时才记为 `effective`；否则记为 `inactive`。

## 11. 合并结果的命中率显示

问题：内部整数 accuracy 不同、但最终命中概率相同的 Scenario 合并后显示哪个命中值。

决定：结果卡显示归一化后的有效命中概率；Move Track 继续显示 Move snapshot 的原始 accuracy。
