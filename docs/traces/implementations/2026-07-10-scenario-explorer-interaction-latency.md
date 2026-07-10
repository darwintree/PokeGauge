# Implementation Trace: Scenario Explorer 交互延迟优化

Date: 2026-07-10
Source: `.issues/archive/20260710_closed_reduce-scenario-explorer-synchronous-interaction-latency.md`
Language: 中文

## Entries

### 1. 分配枚举结果的缓存生命周期与键

Type: unresolved-implementation-decision

Context:
Issue 要求对稳定输入复用分配枚举结果，但没有规定缓存的生命周期、容量管理或键表示。

Decision:
在模块生命周期内分别缓存进攻和防守枚举结果，以参与计算的原始字段组成键；不引入淘汰策略、通用缓存抽象或持久化。

Reason:
输入组合来自有限的宝可梦、分类、目标数值和显示策略集合，缓存值是由静态资源和纯计算生成的小数组。模块级缓存能直接消除重复枚举，同时保持改动局部；当前没有证据表明容量控制或更复杂的缓存机制是必要的。

Follow-up:
如果未来加入可变资源或观察到长期内存增长，再重新评估失效与容量策略。
