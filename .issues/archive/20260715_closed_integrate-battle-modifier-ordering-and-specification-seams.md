---
# This section is managed by the CLI. Do not edit manually.
id: "2eae61ef-1cc0-4c76-8152-b807d8423d2a"
title: "Integrate battle modifier ordering and specification seams"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T07:34:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

在所有独立机制票关闭后，整合一套 decision-complete 的规格：明确 Move snapshot、能力阶级、天气、适应力、墙、既有道具与会心在公式中的顺序和相互作用；定义 adapter 编译输入、effect-equivalence identity、unsupported／unconfigured 传播、来源展示与跨机制验收矩阵。结果必须足以直接拆成后续实现 tickets，但本票不创建或执行实现。

## Blocked by

- [[20260629_closed_define-effect-equivalent-scenario-merging-and-provenance-display|Define effect-equivalent Scenario merging and provenance display]]
- [[20260715_closed_define-move-snapshot-creation-and-editing-contract|Define Move snapshot creation and editing contract]]
- [[20260715_closed_define-stat-stage-tracks-and-critical-hit-interactions|Define stat-stage tracks and critical-hit interactions]]
- [[20260715_closed_research-weather-power-and-accuracy-support-matrix|Research weather power and accuracy support matrix]]
- [[20260715_closed_define-ability-tracks-and-adaptability-only-support-contract|Define ability tracks and Adaptability-only support contract]]
- [[20260715_closed_define-screen-track-and-critical-hit-interactions|Define Screen track and critical-hit interactions]]

## Skills

使用 `grilling`、`domain-modeling` 与 `codebase-design`；保持现有 local damage kernel ADR 的资源／adapter／公式内核边界。

## Discussion trace

[[../../docs/traces/discussion/2026-07-17-battle-modifier-integration|战斗修正顺序与规格 seam 整合讨论记录]]

## Resolution

### 权威边界

- 本 Resolution 与所链接讨论记录是 core battle mechanics 的整合规格；各已关闭机制票继续作为其局部契约，除非本票明确覆盖。不开重复的 `docs/spec` 文档。
- 保持 [[../../docs/adr/0001-local-damage-kernel-for-generated-resources|Local damage kernel for generated resources]]：运行时不依赖 Smogon 名称或本地化效果文本，`@smogon/calc` 只作支持范围的测试 oracle。

### Deep seams 与 pipeline

- 外部只保留两个主要入口：Scenario compiler 编译一个原始 Scenario 组合；local damage kernel 计算一个 compiled calculation input。天气、道具、特性、墙等是内部规则，不建立逐机制公共 interface 或 adapter。
- Scenario compiler 负责资源查询、审核元数据、支持状态、来源状态、概率输入和公式输入；UI 与 scenario pipeline 不直接拼装修正。Kernel 只负责 Gen 9 phase 顺序、fixed-point chain、取整及普通／会心 16 rolls。
- Pipeline 顺序固定为：展开原始 Track 组合 → compileScenario → 按 calculation identity 合并 → 每个 identity 调用 kernel 一次 → 构建 ADD/KO → 生成结果行。`unavailable` 在编译阶段按 snapshot 汇总，不进入 kernel。
- 后续实现直接以这条路径替换现有四个 positional `computeDamage*` 入口，不保留兼容 adapter；现有 ADD/CDD 模块继续复用。

### Compiler outcome、来源与效果等价

- Compiler 返回 `calculable` 或 `unavailable`。`calculable` 含公式输入、概率输入与来源；`unavailable` 含稳定原因、Move snapshot identity 与相关选择来源。业务上的暂不可计算不使用异常或假造零伤害表达。
- 未配置 Move snapshot 阻断该快照全部组合，只在 Move Track 标记缺失字段。局部不支持只阻断对应组合并按 snapshot 汇总提示；气象球仅无天气组合可算。效果暂未支持的特性仍以中性公式输入计算并保留警告。
- Calculation identity 为 Move snapshot identity 加完整 compiled calculation input；包含存在的普通／会心分支、概率与 KO 输入、HP 及 Range 行实际端点，不包含原始选项 id、来源、标签或最终展示数字。不同 Move snapshot 永不合并。
- 每个 Track 来源保留生效、未生效、效果暂未支持与中性选择四种状态。合并后按 Track 保存各状态的选项集合，不保存完整原始组合。主行只显示生效来源；无天气、无道具、无墙省略，stage `0` 按既定契约保留在折叠来源。
- 结果先按 Move snapshot 创建顺序分组；同一快照内部排序不锁定。

### 精确 Gen 9 公式

- 顺序固定为：snapshot power → Base Power chain → base stat → stage → Attack/Defense chain → base formula → spread → weather damage → critical damage → random → STAB/Adaptability → type effectiveness → burn phase → Final chain。Burn 当前固定中性且不进入 public kernel interface；属性免疫返回 `0`。
- 所有修正使用 4096 整数表示与 Gen 9 `.5` 向下规则。同一 phase 的来源先 chain，再对数值取整一次；不能逐项乘算取整，也不能使用浮点 `1.2`／`1.3` 近似。
- 精确值：Choice Band／Specs 的 Attack mod `6144`；属性强化道具的 Base Power mod `4915`；Life Orb 的 Final mod `5324`；spread `3072`；普通 STAB 与会心伤害 `6144`；适应力 STAB `8192`；墙的 Final mod `2732`；中性 `4096`。
- Compiler 把每个 phase 的来源规范化为一个 4096 整数值；kernel 只按固定 phase 应用规范化值，calculation identity 使用同一规范化值。
- Critical stage `+0～+2` 编译普通与会心两个分支，`+3` 只编译会心分支。Kernel 为每个存在的分支返回完整 16 rolls，ADD 使用独立概率输入组合。

### Move snapshot、概率与天气

- Move snapshot 威力合法范围改为整数 `0～1000`：空值与 `0` 为未配置，负数截断为 `0`，小数截断为整数，超过 `1000` 截断为 `1000`。该决定覆盖 Move snapshot 票中的“正数不设人为上限”。
- 编辑后的威力／命中先替代模板标量，再应用审核规则。天气 Base Power 规则作用于编辑后威力，天气命中覆盖作用于编辑后命中；用户修改会移除模板自带的必中语义，但天气仍可重新产生必中。
- `16 roll` 下 `+0～+2` 编译为 `hit=1, crit=0`，`+3` 为 `hit=1, crit=1`。Actual probability 使用天气覆盖后的命中与 `1/24、1/8、1/2、1` 会心概率。必中与数字 `100%` 在当前范围都编译为 `hit=1`。
- `16 roll` 不消费命中概率，因此只改变命中的天气来源标记“未生效”并与无天气合并；Actual probability 下该来源生效。若最终概率相同仍可合并，但保留生效来源。
- 天气通用修正、9 个 move-id 例外、气象球阻断及精确顺序以 [[../../docs/research/2026-07-17-champions-gen9-weather-power-and-accuracy-support-matrix|Weather support matrix]] 为准。

### 招式支持与候选池

- Runtime 只使用 PokeAPI numeric id、静态字段、Battle Pokémon identity 与应用维护的结构化审核元数据。
- 使用同一个 `(move id, attacker identity)` 审核规则支持 Revelation Dance、Aura Wheel、Raging Bull 与 Ivy Cudgel。解析后的 move type 统一用于 STAB／适应力、属性克制、属性强化道具、通用天气修正和结果展示。
- Raging Bull 继续遵循 Screen 票的 `breaksScreensBeforeDamage` 语义；劈瓦、精神之牙与怒牛在本次伤害前不应用墙。
- 精神冲击、精神击破、神秘之剑、欺诈、扑击、Photon Geyser、Light That Burns the Sky 与 Shell Side Arm 暂不支持，不进入 Move 搜索且不能创建 snapshot。此前 Screen 票中的精神冲击 oracle 验收被本票替代。太晶爆发与晶光星群在太晶化不进入范围时按静态特殊招式计算。
- Move candidate pool 继续是全局 PokeAPI Snapshot-capable move pool，不校验 Champions ruleset 合法性或当前宝可梦 learnset。当前 Move side 内，当前攻击方的 Champions usage 招式按使用率置顶，其余候选保持现有顺序；无 usage 时使用原全局顺序。Usage 只影响 Move pick 与排序，不影响候选资格。
- 不校验合法性不等于放行当前公式无法表达的招式；stat-source／动态分类例外、Hidden Power、Max Move 与 Z-Move 等仍排除。普通旧世代固定威力招式可保留。该集合不得称为 Champions move pool 或合法招式池。

### Range Track

- Range 行统一使用 `lowOutcome = 最低攻击 + 最高耐久` 与 `highOutcome = 最高攻击 + 最低耐久`；单边 Range 固定另一侧，每个端点使用自己的 HP。Damage range、百分比与 KO probability range 由同一对端点产生，不使用对角四组合。
- Range 不是随机变量，因此不显示由两端平均得到的单一平均伤害标记；固定模板仍保留平均值。
- 不同滑块选段吸附到相同端点后的 identity／合并语义由独立 follow-up 处理，不阻塞本轮。

### 验收

- Kernel oracle 测试逐项比较本地 kernel 与 `@smogon/calc` 的普通／会心全部 16 rolls，不只比较 min/max。
- 公式 case 至少覆盖：物理 stage／Choice／spread／反射壁／会心；特殊天气／属性强化或 Life Orb／光墙；适应力 STAB；日光束／日光刃 Base Power chain；水蒸气；身份决定属性；怒牛破墙；属性免疫；`.5` 向下边界。
- Product/compiler case 至少覆盖：既有 `12 → 6` 合并矩阵；`+3` 忽略 stage／墙；命中型天气在两种概率模式下的差异；气象球局部阻断；未配置 snapshot；unsupported ability；Range 正确端点／HP／无平均；usage 置顶与无 usage 回退。

## Acceptance criteria

- [x] 后续实现完成前，逐条审计讨论记录中的每项决定均已落实或由明确的新决策替代。
- [x] Scenario compiler 与 kernel 成为唯一主要计算 seam，旧 positional 计算路径被替换，UI/pipeline 不直接解释机制或拼装修正。
- [x] Kernel phase、fixed-point chain、modifier、取整、免疫和普通／会心分支符合本 Resolution，并通过完整 16-roll Smogon oracle 矩阵。
- [x] Compiler outcome、四态来源、效果等价 identity、局部 unavailable 与先合并后计算顺序符合本 Resolution。
- [x] Move candidate pool、审核例外、威力 `0～1000`、天气／概率、Range 端点与产品验收矩阵全部覆盖。

## Implementation outcome

- 已逐条审计讨论记录的 32 项决定；全部由当前实现、验收测试或本票明确列出的 follow-up 边界承接。实现中规格未决的选择记录于 [[../../docs/traces/implementations/2026-07-17-battle-modifier-integration|Battle Modifier Integration implementation trace]]。
- Scenario pipeline 现在只通过 `compileScenario` 与 `calculateDamageRolls` 完成资源语义编译、效果等价合并、fixed-point 公式、概率及 KO；生产代码不再包含旧 `computeDamage*` positional 路径，也不依赖 Smogon runtime 名称。
- Move snapshots、能力阶级、道具、天气、双方特性、墙、preset 与 Range 已在同一产品流中集成；未配置字段只在 Move Track 标记，局部不支持组合仍按 snapshot 在 Results 汇总。
- 完整 16-roll oracle 与产品矩阵覆盖本 Resolution 列出的物理、特殊、天气、道具、适应力、动态属性、破墙、免疫、`.5` 向下、合并、unavailable、来源、排序、Range 与 usage fallback case。
- 最终验证：25 个测试文件 / 230 项测试通过；lint 通过（仅既有 warning）；production build 通过；Scenario Explorer 性能门通过，catalog 55 ms，初始 JS 552,724 B / gzip 168,266 B。
