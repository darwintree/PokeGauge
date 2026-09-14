# Implementation Trace: Champions 宝可梦名称映射

Date: 2026-09-15
Source: 用户反馈轰擂金刚猩未正常渲染
Language: 简体中文

## Entries

### 1. 精确身份优先于计算器别名

Type: unresolved-implementation-decision

Context:
使用率索引中的 Rillaboom 被映射为超极巨化形态 10209，原因是其 calcSpeciesName 覆盖普通形态 812 的精确名称。用户未指定映射冲突的处理方式。

Decision:
先建立计算器别名映射，再用资源名称与 pokemonSlug 覆盖，使精确身份优先。按已有消费者依赖的稳定接口处理，保留别名回退和返回结构。

Reason:
纠正同类名称冲突，无需添加轰擂金刚猩特例，也不改变选择器的形态过滤规则。

Follow-up:
None.

### 2. 资源标识优先于显示名称

Type: unresolved-implementation-decision

Context:
全量对比当前 262 条双打排名发现 20 条受影响记录；皮卡丘与搭档皮卡丘还共用显示名称 Pikachu。

Decision:
映射优先级进一步明确为 pokemonSlug > 显示名称 > 计算器别名。

Reason:
唯一资源标识 pikachu 应指向普通皮卡丘 25，而非搭档皮卡丘 10158；显示名称不能充当唯一身份。

Follow-up:
None.
