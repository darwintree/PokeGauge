---
# This section is managed by the CLI. Do not edit manually.
id: "f070fdcf-d244-4d87-bf3e-2089f15b5e2c"
title: "Research weather power and accuracy support matrix"
status: "open"
priority: "high"
labels: ["WAYFINDER:RESEARCH", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

针对当前 Champions／Gen 9 对齐规则，从高可信一手来源研究无天气、晴天、下雨、沙暴与下雪对招式直接威力／伤害和命中的影响，建立 move-id 可执行支持矩阵；区分通用天气修正、招式特例、上游可直接归一化字段与必须由应用维护的审核元数据。输出 `docs/research/` 资产，供最终规格决策使用。

## Confirmed constraints

- Weather 是 multi-select Track；默认只选无天气。
- 本轮只包含直接伤害／威力与命中概率。
- 不包含回合末伤害、沙暴／下雪防御能力修正、回复、状态免疫或天气导致的招式属性变化。
- 研究不能从本地化效果文本运行时推断公式；需要结构化、可审核的规格边界。

## Skills

使用 `research`；只依赖官方 API、官方数据、规则实现源代码等一手来源。
