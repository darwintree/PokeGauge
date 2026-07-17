# 战斗修正顺序与规格 seam 整合讨论记录

对应 spec change: None.

## 1. 最终规格载体

问题：整合规格是否另建一份 `docs/spec` 文档。

决定：完整结论写入当前票的 Resolution 并链接本讨论记录；Wayfinder map 只保留一行索引，不创建重复 spec 文档。

## 2. 核心 seam

问题：Track、资源语义、公式规则与 UI 应在哪个 seam 分离。

决定：Scenario compiler 接收一个原始 Scenario 组合，负责资源查询、审核元数据、支持状态、来源状态与公式输入编译；local damage kernel 只接收已解析的公式输入，负责 Gen 9 phase 顺序、取整与普通／会心 rolls。UI 与 scenario pipeline 不直接拼装修正。

## 3. 最小 interface

问题：是否为每种天气、道具、特性或墙建立公共 interface。

决定：外部只保留“编译一个 Scenario”和“计算一个已编译 Scenario”两个主要入口；各机制是 compiler/kernel 的内部规则，不建立逐机制公共 interface 或 adapter。

## 4. 三类不可用传播

问题：未配置、局部不支持与效果暂未支持是否使用同一种阻断状态。

决定：未配置 Move snapshot 阻断该快照全部组合；局部不支持只阻断对应组合；效果暂未支持的特性继续以中性公式输入计算并保留警告。

## 5. Compiler 输出

问题：业务上的暂不可计算如何穿过 compiler seam。

决定：compiler 只返回 `calculable` 或 `unavailable` 两类结果；前者包含公式输入、概率输入与来源，后者包含稳定原因、Move snapshot identity 与相关选择来源。不用异常或零伤害表达暂不可计算。

## 6. 暂不可计算展示

问题：未配置快照与局部不支持组合如何提示。

决定：未配置快照只在 Move Track 标记缺失字段；局部不支持组合按 Move snapshot 汇总成一条简短提示，不创建空白结果行。气象球在无天气下可算，非无天气组合汇总为暂不计算。

## 7. 效果等价 identity

问题：哪些信息决定结果行效果等价。

决定：identity 为 Move snapshot identity 加完整 compiled calculation input；包含存在的普通／会心分支、概率与 KO 输入、HP 以及 Range 行的实际计算端点，不包含原始选项 id、来源、标签或最终展示数字。不同 Move snapshot 永不合并。

## 8. 来源状态

问题：如何统一表达不同 Track 的来源状态。

决定：每个 Track 来源保留生效、未生效、效果暂未支持与中性选择四种状态。中性只作内部区分，不新增“中性”标签；无天气、无道具、无墙在结果中省略，stage `0` 继续保留在折叠来源。

## 9. 特殊 stat-source 招式

问题：当前范围是否支持不遵循普通攻防 stat 来源的固定威力招式。

决定：精神冲击、精神击破、神秘之剑、欺诈与扑击暂不支持，不进入 Move 搜索且不能创建 Move snapshot。此前 Screen 票中的精神冲击 oracle 验收被本票替代，光墙使用普通特殊招式验收。

## 10. 身份决定招式属性

问题：已需支持怒牛时，其他由攻击方 identity 决定属性的招式如何处理。

决定：使用同一个 `(move id, attacker identity)` 审核规则支持 Revelation Dance、Aura Wheel、Raging Bull 与 Ivy Cudgel，不建立通用招式效果系统。解析后的属性统一用于 STAB／适应力、属性克制、属性强化道具、通用天气修正和结果展示。

## 11. 动态伤害分类

问题：当前单 Move side、单攻防 stat 模型是否支持运行时改变分类的招式。

决定：Photon Geyser、Light That Burns the Sky 与 Shell Side Arm 暂不支持并排除出 Move 搜索；太晶爆发与晶光星群在太晶化不进入范围时按静态特殊招式计算。

## 12. 命中型天气与概率模式

问题：只改变命中的天气在两种概率模式下如何生效与合并。

决定：`16 roll` 模式不消费命中概率，命中型天气来源标记“未生效”并与无天气合并；Actual probability 模式应用天气命中覆盖并显示为生效。若最终概率相同仍可合并，但保留生效来源。

## 13. 精确公式顺序

问题：local damage kernel 采用何种 phase 顺序与修正表示。

决定：采用 4096 整数修正与 Gen 9 `.5` 向下规则，顺序为：snapshot power → Base Power chain → base stat → stage → Attack/Defense chain → base formula → spread → weather damage → critical damage → random → STAB/Adaptability → type effectiveness → burn phase → Final chain。当前范围的 burn 固定中性；属性免疫返回 `0`。

## 14. 精确 modifier

问题：既有机制是否允许继续使用浮点近似。

决定：不允许。Choice Band／Specs 为 Attack `6144`，属性强化道具为 Base Power `4915`，Life Orb 为 Final `5324`，spread 为 `3072`，普通 STAB 与会心伤害为 `6144`，适应力 STAB 为 `8192`，中性为 `4096`，墙为 Final `2732`。同 phase 来源先 chain，再对数值取整一次；不能逐项乘算取整。

## 15. Burn interface

问题：是否为尚未存在的灼伤 Track 在 public kernel interface 预留字段。

决定：不预留；当前支持范围固定为未灼伤。未来加入状态机制时再在 type effectiveness 与 Final chain 之间接入。

## 16. Move snapshot 威力上限

问题：手动威力继续无上限还是设定可执行范围。

决定：合法范围为整数 `0～1000`；空值与 `0` 为未配置，负数截断为 `0`，小数截断为整数，超过 `1000` 截断为 `1000`。该决定替代 Move snapshot 票中的“正数不设人为上限”。

## 17. 普通与会心分支

问题：Critical stage 如何编译为 kernel 分支。

决定：`+0～+2` 编译普通与会心两个分支；`+3` 只编译会心分支。Kernel 为每个存在的分支返回完整 16 rolls，ADD 使用独立概率输入组合。

## 18. Range 计算端点

问题：Range 行使用哪些攻防与 HP 组合。

决定：统一为有序的 `lowOutcome = 最低攻击 + 最高耐久` 与 `highOutcome = 最高攻击 + 最低耐久`；单边 Range 固定另一侧，每个端点使用自己的 HP。Damage range、百分比与 KO probability range 都由这两个端点产生，不再使用对角四组合。

## 19. Range 平均值

问题：是否继续展示两个端点平均出的单一平均伤害。

决定：Range 不是随机变量，因此 Range 结果不显示单一平均伤害标记，只显示 envelope 与 KO 概率范围；固定模板仍保留平均值。

## 20. Range identity 延后

问题：不同滑块选段吸附到相同实际端点后是否效果等价。

决定：该问题不在本轮决定，建立独立 follow-up issue。当前同一次结果只有一个 Range 选段，不阻塞本轮规格。

## 21. 审核数据 seam

问题：运行时如何取得招式例外语义。

决定：运行时只使用 PokeAPI numeric id、静态字段、Battle Pokémon identity 与应用维护的结构化审核元数据；不解析本地化效果文本，也不运行时依赖 Smogon 名称。Smogon 只作为测试 oracle。

## 22. Snapshot 编辑与规则优先级

问题：用户编辑值与天气等审核规则谁先应用。

决定：编辑后的威力／命中先替代模板标量，再应用天气等审核规则。天气威力规则作用于编辑后的威力，天气命中覆盖作用于编辑后的命中；用户修改移除模板自带的必中语义，但天气仍可重新产生必中。

## 23. 概率编译

问题：两种概率模式如何编译 hit 与 critical probability。

决定：`16 roll` 下 `+0～+2` 为 `hit=1, crit=0`，`+3` 为 `hit=1, crit=1`。Actual probability 使用天气覆盖后的命中与 `1/24、1/8、1/2、1` 会心概率。必中与数字 `100%` 在当前范围都编译为 `hit=1` 并可效果等价合并。

## 24. Phase 规范化

问题：来源修正如何进入 kernel 与效果等价 key。

决定：compiler 按 Gen 9 chain 规则把每个 phase 的来源规范化为一个 4096 整数值，无修正统一为 `4096`；kernel 只按固定 phase 应用规范化值，identity 不保留 modifier 来源顺序或 UI id。

## 25. 合并来源与排序

问题：合并后保留何种来源粒度，以及结果如何排序。

决定：按 Track 保存四种状态的选项集合，不保存完整原始组合；主行只显示生效来源，其他按既定规则折叠或省略。结果先按 Move snapshot 创建顺序分组，同一快照内部排序不锁定。

## 26. Move candidate pool

问题：Move 搜索是否在本轮校验 Champions 合法性与当前宝可梦 learnset。

决定：不校验合法性，继续使用全局 PokeAPI Snapshot-capable move pool。当前攻击方的 Champions usage 招式在当前 Move side 内按使用率置顶，其余候选保持现有顺序；无 usage 时展示原全局顺序。Usage 只影响 Move pick 与排序，不影响候选资格。

## 27. 支持过滤与候选命名

问题：不校验合法性是否意味着保留公式无法正确表达的候选。

决定：仍排除已确认的 stat-source、动态分类、Hidden Power、Max Move 与 Z-Move 等当前公式不支持的招式；普通旧世代固定威力招式可保留。领域统一称 Move candidate pool，不称 Champions move pool 或合法招式池；第三方 learnable move 数据不作为运行时来源。

## 28. Pipeline 顺序

问题：效果等价合并发生在 kernel 计算之前还是之后。

决定：顺序固定为展开原始 Track 组合 → compileScenario → 按 calculation identity 合并 → 每个 identity 调用 kernel 一次 → 构建 ADD/KO → 生成结果行。`unavailable` 在编译阶段按 snapshot 汇总，不进入 kernel。

## 29. 替换现有计算路径

问题：后续实现是否保留现有四个 positional `computeDamage*` 作为兼容层。

决定：直接用 `compileScenario → kernel` 替换，不保留兼容 adapter；现有 ADD/CDD 模块继续复用。测试穿过 compiler、kernel 与最终 pipeline interface。

## 30. 公式验收

问题：如何验证 kernel 与 Gen 9 公式一致。

决定：支持公式 case 必须逐项比较本地 kernel 与 `@smogon/calc` 的普通／会心全部 16 rolls，不只比较 min/max。最小覆盖物理 stage／Choice／spread／反射壁／会心，特殊天气／属性强化或 Life Orb／光墙，适应力 STAB，日光束／日光刃 Base Power chain，水蒸气，身份决定属性，怒牛破墙，属性免疫与 `.5` 向下边界。

## 31. Product 与 compiler 验收

问题：哪些跨机制行为必须作为产品级验收。

决定：覆盖既有 `12 → 6` 效果等价矩阵，`+3` 忽略 stage／墙，命中型天气在两种概率模式下的差异，气象球局部阻断，未配置 snapshot，unsupported ability，Range 正确端点／HP／无平均标记，以及全局候选按 Champions usage 置顶与无 usage 回退。

## 32. Follow-up issues

问题：哪些已发现问题明确不阻塞本轮 map。

决定：另建 Ruleset-aware Move candidate pool 与 learnset 校验，以及不同 Range 选段吸附到相同端点后的 identity／合并语义两张独立票；均不作为当前 map 子票。
