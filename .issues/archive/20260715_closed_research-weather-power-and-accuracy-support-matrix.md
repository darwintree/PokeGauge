---
# This section is managed by the CLI. Do not edit manually.
id: "f070fdcf-d244-4d87-bf3e-2089f15b5e2c"
title: "Research weather power and accuracy support matrix"
status: "closed"
priority: "high"
labels: ["WAYFINDER:RESEARCH", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T02:17:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

针对当前 Champions／Gen 9 对齐规则，从高可信一手来源研究无天气、晴天、下雨、沙暴与下雪对招式直接威力／伤害和命中的影响，建立 move-id 可执行支持矩阵；区分通用天气修正、招式特例、上游可直接归一化字段与必须由应用维护的审核元数据。输出 `docs/research/` 资产，供最终规格决策使用。

## Confirmed constraints

- Weather 是 multi-select Track；默认只选无天气。
- 本轮只包含直接伤害／威力与命中概率。
- 不包含回合末伤害、沙暴／下雪防御能力修正、回复、状态免疫或天气导致的招式属性变化。
- 研究不能从本地化效果文本运行时推断公式；需要结构化、可审核的规格边界。

## Skills

使用 `research`；只依赖官方 API、官方数据、规则实现源代码等一手来源。

## Research asset

[[../../docs/research/2026-07-17-champions-gen9-weather-power-and-accuracy-support-matrix|Champions / Gen 9 Weather Power and Accuracy Support Matrix]]

## Resolution

- 通用规则只需晴天／下雨的属性伤害修正；沙暴／下雪在本轮没有通用直接伤害修正。
- 以 PokeAPI numeric move id 维护 9 个已审核例外：暴风雪、日光束、打雷、暴风、日光刃、枯叶风暴、鸣雷风暴、热沙风暴与水蒸气；阳春风暴不是天气例外。
- 气象球在任何非无天气状态下同时改变威力与属性；属性变化仍在范围外，因此这些 Scenario 暂不计算，无天气仍可计算。
- PokeAPI 仅直接提供静态 id、属性、威力与命中；天气规则、必中语义和公式顺序由应用审核元数据与 Gen 9 adapter 编译，不能运行时解析本地化效果文本。
- 已明确 move-specific base-power、通用天气伤害和命中覆盖的顺序、取整及验收检查。现有 [[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]] 足以承接最终天气规格，不新增天气子票。
