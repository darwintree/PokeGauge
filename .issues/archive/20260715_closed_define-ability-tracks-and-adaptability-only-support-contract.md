---
# This section is managed by the CLI. Do not edit manually.
id: "257a6b6e-ce20-4b1f-ac9a-c23445d021a9"
title: "Define ability tracks and Adaptability-only support contract"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T02:35:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义攻击方与防御方 Ability Track 的候选来源、默认选择、未生效／暂未支持状态、结果标注与效果等价合并契约，并把适应力规格化为本轮唯一具有计算效果的特性。明确换宝可梦、隐藏特性、双方同名特性与 unsupported 分组的边界案例。

## Confirmed constraints

- 双方各有一个 Ability Track，候选包含当前宝可梦形态的全部合法特性，包括隐藏特性。
- 特性选择后默认生效，不提供额外启用开关。
- 本轮仅适应力产生已支持计算效果。
- 其他真实特性仍可选择，但标记“效果暂未支持”，计算上使用中性修正并参与效果等价合并。
- “暂未支持”不得显示为“已判断对当前 Scenario 无效”。

## Skills

使用 `grilling` 与 `domain-modeling`；核对 PokeAPI 特性归属和当前 ruleset 的适应力语义。

## Discussion trace

[[../../docs/traces/discussion/2026-07-17-ability-tracks-and-adaptability|Ability Track 与适应力契约讨论记录]]

## Resolution

### Track 与候选

- 攻击方与防御方各有一个 Ability Track；均为 multi-select track，选中特性即视为启用，不设额外开关。
- 每个 Track 始终至少选择一项；最后一项不能取消。
- 候选按当前 Battle Pokémon identity 从 PokeAPI 当前特性关系取得，以 ability numeric id 标识，包含隐藏特性、排除历史特性；隐藏特性不额外标注。
- 默认按当前 Champions 双打赛季的特性使用率顺序，只选首个仍属于候选池的特性。该语义是“最常用”而非“官方推荐”，界面无需额外标注。
- 无匹配 identity、无特性使用数据或数据中没有合法特性时，全选全部合法候选；“重置”执行同一默认规则。
- Champions 特性使用数据只决定默认选择，PokeAPI 当前特性关系才决定合法候选；它与 Champions move usage data 是不同的领域数据。
- 除默认项规则外，不在本轮固定完整候选排序，实现可保留可调整的排序逻辑。

### 生命周期

- 更换攻击方或防御方时，只按默认规则重建被更换一方的 Ability Track；另一方保留。
- Move side、Move snapshot 以及天气、能力阶级等其他 Track 变化不重置双方特性选择。

### 适应力与支持状态

- 本轮只有适应力产生特性计算效果；其他真实特性以中性修正参与计算，并标记“效果暂未支持”。
- 攻击方持有适应力且 `move.type` 属于攻击方原始属性时，STAB 从普通 `1.5×` 改为 `2×`；它替换 STAB 修正，不是额外的威力或最终伤害乘区。
- 攻击方使用非本系招式或防御方持有适应力时，适应力不改变本次伤害，归入“未生效”。界面不显示“已支持”。
- 太晶化不在本轮范围，适应力只基于 Battle Pokémon identity 的原始属性判断。

### 结果标注与效果等价

- 生效的攻击方适应力在结果行内显示为“适应力”。
- 已判断未生效的适应力默认折叠为“未生效”；其他特性在 Track 选项和默认折叠的结果来源中标记“效果暂未支持”。两种状态不得互换。
- 效果等价键只包含实际送入公式的特性输入。未生效的适应力、未支持特性与其他中性选择可以合并；生效的适应力因 `2× STAB` 形成不同结果。
- 合并来源按攻击方／防御方分别保留；双方选择同名特性时也不跨 Track 合并来源身份。合并行分别保留“未生效”和“效果暂未支持”的原始选择集合。

### 验收案例

1. 当前形态有普通特性 A 与隐藏特性 B，Champions 数据中 B 是最常用且仍合法：初始只选 B，不显示隐藏标记。
2. 当前形态没有可用 Champions 特性数据：初始全选全部合法特性，且至少保留一项。
3. 只更换防御方：防御方 Ability Track 按新 identity 重建，攻击方选择保持不变。
4. 攻击方适应力使用本系招式：结果使用 `2× STAB`，行内显示“适应力”。
5. 攻击方适应力使用非本系招式，或防御方持有适应力：结果使用中性特性输入，来源折叠为“未生效”。
6. 多个未支持特性与未生效适应力编译为相同输入：结果可以合并，但来源状态分别保留；双方同名来源仍按攻击方／防御方分组。

## Acceptance criteria

- [ ] 后续实现完成前，逐条审计讨论记录中的每项决定均已落实。
