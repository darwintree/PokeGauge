---
# This section is managed by the CLI. Do not edit manually.
id: "7789004a-e513-4266-97cf-f7600b79af60"
title: "Unify displayed power and accuracy with compiled kernel semantics"
status: "open"
priority: "high"
labels: ["TECH-DEBT", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:40:00Z"
updated_at: "2026-08-03T04:40:00Z"
---
## Problem

当前 React 只渲染 scenario compiler 提供的 moveMechanics，但 compiler 为展示和 kernel 分别构造了两套派生结果：

- kernel 消费 calculation branch，在 Base Power、伤害公式、Spread、Weather、Critical、随机 roll、STAB、Type effectiveness 与 final modifier 等阶段分别执行固定点取整。
- 展示侧 effectivePower 重新把若干 modifier 合成后一次取整；accuracy 则经另一条 display 字段路径暴露。
- 两条路径可以漂移。当前明确 case 是 Terrain basePowerModifier 已进入 kernel，却没有进入 effectivePower 的展示合成。

这不是单独补上 Terrain 参数的问题，而是同一机制存在两个 source of truth。

## Goal

让前端展示的威力与命中语义、damage kernel 输入及概率输入由同一个编译 source 派生。固定点修正、阶段顺序、取整、封顶和 override 只能在一个 deep module 内定义一次。

## Architectural direction

- Seam 位于 Scenario 编译结果，在 kernel 与 presentation 分流之前。
- 该 module 的 interface 同时支持 kernel 计算与展示投影；调用方不需要知道 modifier 链的内部顺序或重复实现公式。
- React 只渲染编译后的 presentation projection，不从原始 Track 选择或 modifier 字段重建威力、命中。
- 如果真实 kernel 不存在单一的最终威力变量，interface 必须明确展示值的定义与名称，而不是伪装成 kernel 直接使用的数值。
- 测试通过这一 interface 验证计算输入和展示投影，不穿透 module 检查内部 helper。

## Questions to resolve

- canonical compiled representation 应表达阶段化公式输入、展示投影，还是二者由同一结果对象派生。
- 最终威力应定义为哪种可解释值；当阶段化取整无法压缩为单一等价威力时，是展示分阶段值、理论等价值，还是调整标签。
- 普通分支与必定会心分支存在差异时，展示投影如何表达。
- 命中展示是否直接来自 canonical probability input；Actual probability、16 roll、always-hits、天气 override 与超过 100 的封顶如何呈现。
- Effect-equivalent scenario merge 是否直接复用同一 canonical calculation identity。

## Required cases

### Terrain drift

选择能触发 Electric、Grassy 或 Psychic Terrain 威力修正的接地攻击方。Terrain 必须同时出现在 canonical kernel input 与展示投影中；不能只修复某一张卡片的数字。

### Numeric accuracy

Wide Lens 与 Bright Powder／Lax Incense 的固定点链只计算一次。展示百分比与 Actual probability 的 hitProbability 必须来自同一结果；always-hits、天气后置 override 与 100% 封顶保持一致。16 roll 忽略命中概率的契约必须显式表达。

### Phase-sensitive power

覆盖 Held item、Weather、Terrain、Spread、STAB 与 Type effectiveness 的组合，证明展示投影来自 kernel 的阶段语义，而不是独立的扁平 modifier 链。免疫仍显示 0。

## Non-goals

- 不改变当前 damage formula、固定点系数或各阶段取整规则。
- 不新增天气、场地、道具或招式机制。
- 不重新设计 Damage Conditions Card 的视觉层级。
- 不把 presentation concerns 放进纯 damage kernel；共享的是编译 source 与语义，不是 React 依赖。

## Acceptance criteria

- 威力与命中的机制规则只有一个 source of truth，删除当前平行的展示计算路径。
- kernel input、probability input 与 presentation projection 均从同一 module interface 获得。
- Terrain case 在展示和实际计算中一致，并有会在任一路径遗漏时失败的回归测试。
- accuracy modifier、override、封顶和概率模式有共享来源的回归测试。
- 测试覆盖 module interface，内部重构不会要求同时修改两套期望算法。