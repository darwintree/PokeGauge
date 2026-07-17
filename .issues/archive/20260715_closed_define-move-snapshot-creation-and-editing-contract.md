---
# This section is managed by the CLI. Do not edit manually.
id: "f19779aa-27c4-48be-8dca-afe78da62272"
title: "Define Move snapshot creation and editing contract"
status: "closed"
priority: "high"
labels: ["WAYFINDER:PROTOTYPE", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T03:43:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义从 Move template 创建、复制、编辑与移除 Move snapshot 的完整产品契约和交互原型，包括重复快照的识别、未配置字段的阻断与提示、变量威力常见档位如何与上游标量及手动输入共存，以及编辑后结果如何稳定对应到快照。

## Confirmed constraints

- Move track 位于现有约 `18rem` 的侧栏；编辑不能借用结果主区域。
- 采用“列表 → 单项编辑页”的窄栏结构：默认展示快照列表，选择一项后在原位钻入编辑，并提供返回列表。
- 首版按 YAGNI 只提供添加、编辑与移除。再次添加同一 Move template 即创建另一个独立快照；不提供独立复制操作。
- “添加招式”沿用现有招式搜索弹窗；选择 Move template 后立即以模板默认值创建快照并返回列表，不新增另一套选择交互。
- 搜索弹窗允许再次选择已经存在于 Move track 的同一 Move template；每次选择都直接创建新的独立快照，不显示重复警告。
- 威力、命中、会心等级与 Spread move modifier 的编辑即时生效并更新结果；不提供保存或取消操作。
- 移除快照需要原地二次确认：首次点击后，原按钮位置切换为“确认移除／取消”，不使用弹窗；离开编辑页即放弃待确认状态。
- 威力或命中为 `0` 的未配置快照继续保留在 Move track，列表原地标记具体缺失字段，但完全不生成结果行；填写为合法值后立即恢复结果。
- Move snapshot 的生命周期归属当前进攻方与 Move side：更换进攻方或切换物理／特殊侧时，清空当前快照并按新的 Move pick 重建；只更换防守方时保留全部快照及编辑值，仅重新计算结果。
- 异步 Move pick 只初始化仍处于自动初始状态的 Move track；用户一旦编辑、添加或移除任意快照，该 Track 即转为用户维护状态，后续加载完成的 Move pick 不得覆盖用户状态。
- 威力只接受非负整数：空值与 `0` 统一为未配置，正数可计算，不设人为上限。命中只接受 `0`～`100` 的整数：空值与 `0` 为未配置，`1`～`100` 可计算。负数截断为 `0`，小数截断为整数，超过 `100` 的命中截断为 `100`。
- 已审核为必中的 Move template 创建快照时初始化为 `100%` 并保留必中语义；用户一旦手动修改命中值，该快照即转为普通数字命中，不再保留隐藏的必中语义，也不提供必中开关。
- 招式搜索纳入经审核、可由一个具体威力值表达的变量威力物理／特殊招式。上游 `power: null` 初始化为未配置 `0`；上游有数值则复制为初始值，用户均可手动修改。固定伤害、一击必杀与纯状态招式继续排除。是否属于该集合由结构化审核元数据决定，不能仅凭 `power` 是否为 `null` 推断。
- 快照始终按创建顺序排列；编辑不触发重排，新快照追加到底部，不提供手动排序。
- 首版只提供手动威力输入；不提供变量威力常见档位。只有实际使用证明重复输入形成明显摩擦时再增加受审核档位。
- 快照使用内部稳定 identity 对应结果，但 UI 不显示 `S1`／`S2` 或 `·1`／`·2` 等技术编号；同模版多个快照都只显示招式名称，由完整摘要区分。
- 列表在进入编辑前完整展示当前威力、命中、物理／特殊、Spread move modifier 状态和会心倾向；详情页只负责修改。
- 列表不显示精确会心等级：`+0` 显示“普通会心”，`+1/+2` 显示“容易会心”，`+3` 显示“必定会心”；精确 `+0`～`+3` 只在编辑控件中展示。
- 当前原型只确认窄栏中的信息架构与交互路径，不锁定视觉样式；徽章、颜色、间距与卡片形态留给后续设计迭代。
- Move template 不可变；选择招式会创建可编辑 Move snapshot，不修改共享资源。
- 同一模版允许创建多个独立快照；快照是刻意比较单位，彼此永不做效果等价合并。
- 可编辑字段为威力、命中、会心等级与 Spread move modifier 开关。
- 会心等级为 `0`～`+3`，不另设“必定会心”类型；`+3` 即必定会心。
- 只有支持多目标的模版显示 Spread 开关，VGC 默认开启；单体招式不能强制开启。
- 威力复制上游标量，`null` 映射为 `0`；`0` 表示未配置，不生成伤害结果。
- 数字命中直接复制；已审核必中初始化为 `100%` 并保留必中语义；其他 `null` 映射为未配置的 `0`，不生成实际概率结果。
- PokeAPI 没有统一的变量威力档位模型；调查资产为 [[../../docs/research/2026-07-15-pokeapi-variable-power-move-data|PokeAPI Variable-power Move Data]]。本票需要在保留“常见档位可选”产品目标的同时明确其受审核来源与无来源时的降级。

## Skills

使用 `prototype`、`grilling` 与 `domain-modeling`。

## Discussion trace

[[../../docs/traces/discussion/2026-07-16-move-snapshot-contract|Move snapshot 契约讨论记录]]

## Acceptance criteria

- [ ] 后续实现完成前，逐行审计讨论记录中的每项决定均已实现或由明确的新决策替代。

## Resolution

Move snapshot 采用现有 `18rem` 侧栏内的“列表 → 单项编辑页”结构，列表先完整展示计算相关摘要，编辑即时生效。首版只保留添加、编辑与原地确认移除；重复模板直接创建独立快照，不显示技术编号，不提供复制、威力预设或排序。未配置快照保留但不产出结果；快照归属当前进攻方与 Move side，用户状态不被异步 Move pick 覆盖。搜索支持经审核、可归结为具体威力的变量威力招式，排除固定伤害、一击必杀与状态招式。

完整逐项决定见 [[../../docs/traces/discussion/2026-07-16-move-snapshot-contract|Move snapshot 契约讨论记录]]；交互证据见 [`move-snapshot-prototype.tsx`](../../src/components/scenario-explorer/move-snapshot-prototype.tsx)。当前原型不锁定最终视觉样式。

## Superseded by integration

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]] 将手动威力从“正数无上限”改为整数 `1～1000`；`0` 仍表示未配置，超过 `1000` 截断为 `1000`。
