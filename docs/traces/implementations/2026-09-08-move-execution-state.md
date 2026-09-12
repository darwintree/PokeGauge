# Implementation Trace: Move Execution state and test surface

Date: 2026-09-08
Source: [讨论记录](../discussion/2026-09-08-move-execution-state.md)
Language: 中文

## Entries

### 1. 满 HP 状态的支持范围与表示

Type: tradeoff

Context:
讨论明确初始满 HP 不应在下一次执行重置，但未指定如何表示进入状态。现有 resolver 已保留各路径伤害与树果、能力变化的关联；calc 已区分多重鳞片／幻影防守的首段规则和太晶甲壳的整次执行规则。

Decision:
复用现有路径伤害，为满 HP 防护特性的下一次执行计算进入 HP，并在缓存中纳入这个值；不再另存一个可由伤害推导的“已受伤”字段。继续使用 calc 的段间规则，保留有限顺序模型。本轮兑现满 HP 防护的状态延续，不扩展为回复、回合末事件或所有 HP 动态威力的模拟。

Reason:
当前确认的反例需要的是初始 HP 与路径伤害的关联，已有分布足够表达；另建状态机或重写 calc 逐段规则会扩大范围。相同首击结果但后续满 HP 防护不同的 Scenario 也必须在计算身份中区分。

Follow-up:
None.

### 2. 等效威力的满 HP 修正

Type: unresolved-implementation-decision

Context:
回归测试发现多重鳞片的伤害矩阵已只减少首段，但现有展示投影仍对每段应用初始减伤。原有合并后的 finalModifier 不能通过乘二可靠还原移除满 HP 减伤后的修正链，因为各阶段存在取整；同时需要保留抗性果消费和攻击方道具。

Decision:
编译时仅为多重鳞片／幻影防守生成受伤后的展示 finalModifier，供后续攻击段使用；移除满 HP 防护和已消费的抗性果后重新合并修正链。太晶甲壳的整次执行规则保持不变。不开展候选二中的投影 interface 重构。

Reason:
这是保持同一状态契约下伤害与既有等效威力展示一致所必需的计算修正，不能把展示取整反推为伤害或近似移除修正。

Follow-up:
None.

### 3. 将进入状态统一到 Hit 接口

Type: unresolved-implementation-decision

Context:
用户进一步要求：新增受支持的状态规则时，段间和跨次不再各实现一次。此前 `afterStatChanges` 使用执行内计数，`afterOutcome` 则在执行外重建 HP、树果和能力阶级；两者并未共享状态转移。内部接口尚无独立外部消费者，可以直接迁移。

Decision:
Hit 改为读取累计 Resolution State 的函数。resolver 在每个实际伤害随机数后统一累计伤害、消费树果并应用能力变化概率；第二次执行直接接收该结果。删除显式状态行表及执行外重建逻辑。执行开始状态单独作为只读输入供太晶甲壳等整次执行效果使用；calc adapter 从进入状态投影计算参数，保留 calc 原生段序、亲子爱取整与增强拳内置加攻的适配。

Reason:
状态变化只在一个 resolver 中定义；执行边界只重启命中检查和整次效果的判定。累计伤害保留 HP 条件所需信息，能力变化计数不再于新执行归零。未扩展回复、回合末事件或所有 HP 动态招式的支持范围。

Follow-up:
None.

### 4. 参考威力与实际状态共用一次遍历

Type: tradeoff

Context:
原先等效威力以另一遍 resolver 将“伤害”替换为威力。现在进入状态包含累计实际伤害，继续替换会错误影响下一段的 HP 条件。

Decision:
按真实伤害推进状态，同时为相同伤害与状态的路径累计参考威力上下界；威力不影响后续结算，无须保留它的完整联合分布。逐段展示通过相同 resolver 推进参考路径，仅向展示层提供威力值。

Reason:
保持伤害与参考威力在同一批可达路径上，避免第二套状态转移；展示层无需依赖新的 Hit 函数接口。

Follow-up:
None.

### 5. 对计算等价的进入状态复用第二次伤害分布

Type: tradeoff

Context:
逐个首轮伤害结果重新解析第二次执行会使十段招式产生大量相同遍历。累计伤害仍须原样保存，不能为优化而改写真实状态。

Decision:
Hit Composition 可提供伤害分布等价键；KO 查询仅按此键缓存第二次执行的伤害分布，不缓存或替换真实状态转移。calc adapter 与逐段随机数缓存共用进入计算参数的投影。已审核的原生多段招式没有其他 HP 动态威力，满 HP 防护在“满 HP／已受伤”内可复用；普通招式及亲子爱保留实际进入 HP。未提供等价键的 Hit Composition 使用完整状态逐一计算。

Reason:
新增规则仍只通过同一 Hit 接口和 resolver 生效。等价键是 adapter 对计算输入的性能契约，不能定义另一套跨次状态更新；缓存开启与关闭的十段回归必须保持相同概率。

Follow-up:
新增原生多段规则若依赖具体剩余 HP，须同步收紧 adapter 的等价键。
