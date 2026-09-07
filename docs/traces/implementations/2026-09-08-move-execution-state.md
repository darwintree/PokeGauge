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
