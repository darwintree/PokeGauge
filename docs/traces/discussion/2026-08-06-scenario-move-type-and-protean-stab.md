# Scenario Move Type 与 Protean STAB 讨论记录

对应 spec change: None.

## 1. 本子 issue 的 Ability 范围

问题：本子 issue 只实现首批点名的 Ability，还是一并实现复用相同机制的同族 Ability。

决定：一并实现 Normalize、Aerilate、Pixilate、Refrigerate、Galvanize、Dragonize、Liquid Voice、Protean 与 Libero。

## 2. 场景计算使用的招式属性术语

问题：如何命名并定义本次 Scenario 最终送入计算和结果展示的招式属性。

决定：统一称为 Scenario Move Type（场景招式属性）。它按 Move 原始属性、既有身份相关招式属性解析、Ability 重写的顺序派生，并统一驱动 STAB、属性克制、属性强化道具、天气／场地、其他 Ability 的属性 gate 与结果属性 badge；Move 列表与 Snapshot 不变。

## 3. Protean 家族的 STAB 倍率

问题：Protean／Libero 是否产生 Adaptability 的 `2×` STAB，或与 Adaptability 叠加。

决定：Protean／Libero 只产生普通 `1.5×` STAB。每侧 Scenario 只有一个 Ability Selection，不存在与 Adaptability 同时生效或叠加的场景。

## 4. Protean 家族的状态边界

问题：Protean／Libero 是否修改 Battle Pokémon Identity、原始属性、groundedness，或跨 Move snapshots 保存换场与触发历史。

决定：Protean／Libero 只让当前 Scenario 获得与 Scenario Move Type 相同的普通 STAB 资格；不修改 Battle Pokémon Identity、原始属性集合或 groundedness，也不保存跨 Move snapshots 的换场或一次触发历史。

## 5. Scenario Move Type 与结果分组

问题：伤害数值完全相同但 Scenario Move Type 不同的结果是否合并。

决定：不合并。Scenario Move Type 纳入 calculation identity；Scenario Move Type 相同且其他计算 identity 相同的结果仍可合并。

## 6. 类型改写 Ability 的 Track Selection Activation

问题：各类型改写 Ability 何时视为对最终结果有贡献。

决定：`-ate`／Dragonize／Galvanize 在符合 gate 并改写属性与 Base Power 时为 `active`；Liquid Voice 仅在 sound 招式从非 Water 改为 Water 时为 `active`；Normalize 在 Base Power boost 生效时为 `active`，即使招式本来就是 Normal；Protean／Libero 仅在为原本无 STAB 的招式增加 `1.5×` STAB 时为 `active`。原本已有 STAB 的 Protean／Libero 和原本就是 Water 的 Liquid Voice 为 `inactive`。即使伤害数值碰巧相同，只要 Scenario Move Type 或结果属性 badge 改变，类型改写 Ability 仍为 `active`。

## 7. Liquid Voice 与 PokeAPI 缺失 sound flag

问题：PokeAPI 缺少 recent move 的 `sound` flag 映射时，Liquid Voice 应整体保持 `unsupported`，还是按当前 PokeAPI snapshot 支持。

决定：Liquid Voice 转为 supported，只消费 PokeAPI `sound` flag；缺失映射按 gate 未命中并标记 `inactive`，不增加本地 fallback。现有 PokeAPI 上游数据缺口 issue 增加 sound mapping 范围，且本实现不得声称 PokeAPI 的 sound 数据已全量完整。
