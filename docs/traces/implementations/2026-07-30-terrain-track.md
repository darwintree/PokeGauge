# Implementation Trace: Terrain Track

Date: 2026-07-30
Source: `.issues/20260715_working_specify-terrain-track-and-grounded-eligibility.md`
Language: 中文

## Entries

### 1. 从现有 matchup 输入推导接地状态

Type: unresolved-implementation-decision

Context:
Issue 要求定义接地 eligibility，但没有决定其输入来源；当前产品也没有额外的“接地”Track，且已暴露的道具不包含气球与黑色铁球。

Decision:
接地状态由双方当前 Battle Pokémon 的属性和该 Scenario 选中的特性推导：飞行属性或飘浮特性视为未接地，其余视为接地。不新增接地 Track；重力、道具造成的接地变化等尚未暴露的状态不推断。

Reason:
这覆盖当前输入能够可靠表达的全部接地因素，也遵守“不新增接地 Track”的既有约束；为不存在的输入猜测状态会产生不可验证结果。

Follow-up:
当产品加入重力、气球、黑色铁球或会改变接地状态的其他机制时，扩展统一的接地判定。

### 2. 场地只覆盖本次直伤的最小闭环

Type: unresolved-implementation-decision

Context:
Issue 要求找出“只支持直接伤害影响时不可回避的最小范围”，但没有列举具体机制。

Decision:
覆盖第九世代四种场地的通用威力修正、青草场地对地震／重踏的减伤，以及电力上升、精神剑、广域战力、薄雾炸裂、铁滚轮和大地波动的直接威力、可用性或目标变化。广域战力在精神场地中按条件获得多人目标开关；大地波动因招式属性变化沿用天气球的暂不可计算策略。场地回复、状态免疫、种子、优先度阻挡及其他非公式效果暂不模拟。

Reason:
这些规则会直接改变当前一次攻击的威力、倍率、多人目标修正或能否造成伤害；其余规则需要产品尚未表达的回合、状态或招式优先度输入。

Follow-up:
当招式资源暴露优先度，或产品加入回合／状态模拟时，再补精神场地的优先度阻挡等规则。
