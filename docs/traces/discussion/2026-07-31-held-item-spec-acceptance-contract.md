# Held-item spec acceptance contract 讨论记录

对应 spec change: None.

## 1. Spec 章节结构

问题：后续 Held-item effects spec 必须包含哪些固定章节，才能在不再补做产品决策的前提下进入实现计划。

决定：Spec 固定包含 Scope and Non-goals、Sources and Held-item Identity、Frozen 85-item Inventory、Held item Track and State Rules、Damage and Stat Compilation、Accuracy, Critical, Weather, and N-hit Rules、Identity Gates and Locked Items、Scenario Merge, Provenance, and Result Display、Partial-support, Error, and Compatibility Rules、Normative Examples and Acceptance Matrices 十个章节。

## 2. 验收矩阵粒度

问题：85 项道具是否都需要重复一套完整数值案例。

决定：采用双层验收矩阵。Frozen inventory 对 85 个真实道具逐项记录完整规范字段；behavior acceptance matrix 按机制族与关键跨机制交互提供代表性案例，不为机制相同的 85 项重复完整数值向量。

## 3. 规范性案例范围

问题：哪些场景必须以确定输入、编译结果和可观察输出写成规范性案例。

决定：案例覆盖属性强化的生效与未生效、Choice Band／Assault Vest／Eviolite、Life Orb／Expert Belt／Resistance Berry 的阶段与定点数语义、Resistance Berry 的静态 N-hit 近似、Wide Lens 与 Bright Powder／Lax Incense 的双方命中链及必中和 `16 roll`、Leek／Lucky Punch 的身份门槛、封顶和墙交互、防守方 Utility Umbrella、signature Orb 的身份与招式属性双门槛、masked Ogerpon 的锁定与身份重建、合并后的 effective／inactive／neutral 与静态 warning，以及非法保存状态的整体恢复失败。Resistance Berry 案例必须显式覆盖 Chilan Berry 不要求效果绝佳的例外。

## 4. 规范来源与冲突

问题：最终 spec、已关闭决策、Showdown、PokeAPI 与研究材料之间如何确定规范优先级。

决定：批准后的最终 spec 是唯一规范契约；已关闭决策及讨论记录约束其编写并提供追溯；固定版本的 Showdown 与 PokeAPI 以及研究材料只提供机制、身份和资源证据。发现冲突时必须通过 spec-change 修改规范，不由实现自行选择。

## 5. 错误与兼容验收

问题：资源不完整及旧保存状态如何进入验收契约，同时避免提前规定实现工具。

决定：85 项完整性、PokeAPI／Showdown join、effect descriptor 或本地 sprite 破损都导致交付验收失败，但由生成器、构建或测试中的哪一层拦截留给实现计划。运行时 locale 缺失按既有英文回退与资源诊断处理；包含旧 synthetic id、白名单外 id 或错误攻守方向 id 的保存 Scenario 整体放弃恢复，旧 added-type-boost 可见性记录中的未知项直接过滤，不提供迁移。

## 6. 完整性与验证边界

问题：怎样判定 spec 已足以直接编写实现计划。

决定：Spec 不得保留需要产品判断的 TBD；必须逐项映射 85 个道具，逐行审计本次 Wayfinder 的关闭决策与讨论记录，并为每个代表案例固定 oracle、编译输入与可观察输出。`@smogon/calc`、固定版本 Showdown 语义与本地测试属于非规范验证策略；规范同时必须固定现有结果排序，以及公式 tooltip 的 Held item 行只显示攻击方 Base Power 道具贡献。
