# Held-item provenance and Scenario merging 讨论记录

对应 spec change: None.

## 1. Calculation identity 与合并来源

问题：道具选择本身是否应参与 calculation identity，以及效果等价的攻守道具选择如何合并。

决定：沿用现有 Effect-equivalent scenario merge；calculation identity 只包含 Move snapshot 与完整的伤害、概率、KO 计算输入，不包含原始道具 id、provenance 或 warning。等价 Scenario 合并为一行，并分别聚合攻击方与防守方 Held item Track 的来源集合。

## 2. 道具来源状态

问题：生效、未生效、中性与未支持的道具选择如何进入 provenance。

决定：沿用现有四态来源模型与各已确认道具效果的 activation 规则；不增加移除道具后再次编译的通用反事实判定。未满足支持条件的道具为 inactive，显式无道具及已定义的中性锁定项为 neutral；partial-support warning 仍为 Track 静态元数据，不进入 provenance。

## 3. 结果与来源顺序

问题：新增道具是否需要改变结果行或合并来源的排序。

决定：沿用现有顺序；结果按 Move snapshot 分组，组内保持 implementation-flexible，合并来源按首次遇到顺序去重。不增加道具专属排序。

## 4. Damage Conditions Card 的道具来源

问题：合并后的攻守道具来源在结果卡中如何显示。

决定：沿用现有信息层级；effective 道具显示在对应攻击方或防守方 identity line，inactive 与 unsupported 来源进入现有折叠入口，已定义的 neutral 道具选择保持隐藏。

## 5. 公式 tooltip 的道具项

问题：公式 tooltip 是否应把不同阶段及双方的道具效果压成一个统一倍率。

决定：道具项只显示影响 Base Power 的攻击方道具及其 Base Power 阶段倍率。攻击能力值、最终伤害、命中、会心类道具不进入该项；防守方道具也不进入。现有把攻击方 Base Power、Attack 与 final-damage 倍率合并为一个道具倍率的行为不作为后续契约保留。
