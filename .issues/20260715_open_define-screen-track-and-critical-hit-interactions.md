---
# This section is managed by the CLI. Do not edit manually.
id: "5735d6e3-3963-4e9a-8908-dfd0337be32c"
title: "Define Screen track and critical-hit interactions"
status: "open"
priority: "medium"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-15T02:47:00Z"
---
## Parent map

[[20260715_open_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

## Question

定义防守方 Screen Track 在当前 VGC 双打规则中的完整规格，包括反射壁／光墙的修正、物理／特殊映射、会心交互、默认选择、标签与效果等价合并案例；核对需要进入本轮的公式事实，并明确所有绕过／移除墙机制的范围边界。

## Confirmed constraints

- Screen 是 multi-select Track，选项仅为无墙、反射壁、光墙，默认只选无墙。
- 不提供双墙项；对单个 Move snapshot，双墙不会形成新的有效结果。
- 物理招式下无墙与光墙等价；特殊招式下无墙与反射壁等价，均应覆盖策略 A 的合并验收。
- 会心忽略墙。
- 破墙、穿透或移除墙的招式与特性不进入本轮，除非当前票核对规则后发现它们是满足既定契约不可回避的阻塞事实。

## Skills

使用 `grilling` 与 `domain-modeling`；机制事实从当前 ruleset 的高可信来源核对。
