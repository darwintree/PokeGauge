---
# This section is managed by the CLI. Do not edit manually.
id: "5735d6e3-3963-4e9a-8908-dfd0337be32c"
title: "Define Screen track and critical-hit interactions"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T03:43:00Z"
---
## Parent map

[[20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]]

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

## Discussion trace

[[../../docs/traces/discussion/2026-07-17-screen-track-and-critical-interactions|Screen Track 与会心交互讨论记录]]

## Resolution

- Screen Track 是至少保留一项的 multi-select Track，选项顺序固定为无墙、反射壁、光墙，默认只选无墙；清空、取消最后一项或重置时回到无墙。更换攻防方、Move side 或 Move snapshot 时保留选择。
- 同时选择反射壁与光墙表示两个独立 Scenario，不表示双墙同时生效，也不增加双墙选项。结果行排序不在本轮固定。
- 当前 VGC 双打基线采用 Gen 9 fixed-point final modifier `2732/4096` 及对应取整，不能用浮点 `2/3` 近似。物理招式受反射壁影响，特殊招式受光墙影响；按招式分类而非实际读取的防御 stat 判断，因此精神冲击等特殊招式仍受光墙影响。
- Critical stage 为 `+0`～`+2` 时，相关墙修正普通伤害箱体与 ADD 的非会心命中分支，会心须须与 ADD 的会心命中分支忽略墙。结果主行只显示一次生效墙名称，不额外说明会心分支忽略墙。
- Critical stage 为 `+3` 时，墙对整行未生效，只使用无墙修正的会心分支；墙 Scenario 与无墙合并，被选择的墙折叠标记“未生效”。
- 效果等价键只包含普通／会心分支实际采用的墙修正，不包含原始 Screen 选项，也不能按取整后伤害碰巧相同合并。物理招式下光墙与无墙合并，特殊招式下反射壁与无墙合并；错误分类墙折叠标记“未生效”。
- 无墙只在 Track 中作为真实选项显示，不在结果主行或折叠来源中显示。生效墙只显示名称，不显示“已支持”、适用分类、倍率或公式说明。
- move id `280` 劈瓦、`706` 精神之牙与 `873` 怒牛使用审核语义 `breaksScreensBeforeDamage`；本次伤害不应用墙，墙折叠标记“未生效”，不建立通用招式效果系统。
- Screen Track 只表示本次计算时墙是否存在；不记录剩余回合、施放者、Light Clay、入场清除历史，也不模拟破墙命中后的场地状态。穿透、除雾、换场、Screen Cleaner 等其他机制与极光幕不进入本轮；未支持特性继续遵循既有“效果暂未支持”契约。
- 本票只锁定 Screen 的分支输入、精确修正与验收结果；天气、道具、适应力等修正的完整链式顺序由后续整合票统一收口。

## Acceptance criteria

- [ ] 后续实现完成前，逐条审计讨论记录中的每项决定均已落实或由明确的新决策替代。
- [ ] 三项 Screen 全选时，物理与特殊招式在 Critical stage `+0`～`+2` 各形成两行，在 `+3` 各形成一行；错误分类墙和必定会心下的墙来源标记为“未生效”，无墙不显示。
- [ ] 三个破墙招式在三项 Screen 全选时各形成一行，普通与会心伤害均不应用墙。
- [ ] 多个公式 case 覆盖物理反射壁、特殊光墙、错误分类墙、普通会心、必定会心、精神冲击分类与三个破墙招式，并逐项比较本地内核和 `@smogon/calc` 的普通／会心全部 16 rolls。
- [ ] Scenario 行数、合并来源、标签与 Actual probability 分支由产品测试覆盖，不依赖 Smogon 描述输出。

## Superseded by integration

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]] 将精神冲击列为暂不支持并排除出 Move 搜索，因此本票的精神冲击 Smogon oracle case 改由普通特殊招式验证光墙分类；其余 Screen 契约不变。
