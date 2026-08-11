---
# This section is managed by the CLI. Do not edit manually.
id: "4d2d962d-955b-4c23-ab42-598e6f33a7bf"
title: "Green-dot conditional ability effects"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-11T03:37:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现条件触发类特性：选中即表示缺失的战斗条件已满足并按该假设编译；一并交付 Ability Track 静态绿点与族级 hover；不新增 HP%／状态 Track。

## Scope

- Multiscale
- Overgrow、Blaze、Torrent、Swarm
- Guts、Marvel Scale、Merciless

## Domain contract

**Assumed-Satisfied Ability Selection（假设条件已满足的特性选择）**：对缺少 HP%／异常状态等 Track 输入的 Ability，选中该 Ability 即表示该条件在本 Scenario 中已满足。绿点是 Track 披露，不是 Track Selection Activation；Activation 仍只用 `active`／`inactive`／`unsupported`／`neutral`。

假设条件与机械 gate 正交：条件假设成立时绿点仍在；招式属性、物特类别、防暴等 gate 未命中时 Activation 为 `inactive`。

### Ability matrix

| Ability | 侧 | 假设条件 | 效果 | 额外 gate |
| --- | --- | --- | --- | --- |
| Multiscale | 防守 | 满 HP | `finalModifier` `2048` | 无 |
| Overgrow | 进攻 | HP≤⅓ | `basePower` `6144` | 草 |
| Blaze | 进攻 | HP≤⅓ | `basePower` `6144` | 火 |
| Torrent | 进攻 | HP≤⅓ | `basePower` `6144` | 水 |
| Swarm | 进攻 | HP≤⅓ | `basePower` `6144` | 虫 |
| Guts | 进攻 | 攻击方有异常状态 | `attackerAttack` `6144` | `physical` |
| Marvel Scale | 防守 | 防守方有异常状态 | `defenseModifier` `6144` | `physical` |
| Merciless | 进攻 | 防守方中毒／剧毒 | `criticalStage = 3` | 遇 `preventsCritical` → `inactive` |

`6144` 与 `2048` 均为现有 4096 整数 modifier 表示。

### Compiler notes

- Multiscale 按单次结算击处理：本 Scenario 该击按满 HP ×0.5；多段第一击语义不在本票。
- Guts 不实现灼伤物攻减半，也不实现忽略灼伤；无状态模型时只提供物理 `6144`。
- Merciless 写入既有会心路径，复用会心 stage Ability 的 provenance；`preventsCritical` 时为 `inactive`。
- 出现在无机械钩子一侧（如进攻方 Multiscale）时仍为支持特性：静态绿点保留，Activation = `inactive`；不改 catalog 侧别过滤。
- 本票八个 Ability 从 `unsupported` 转入支持集；与红点互斥（去红加绿）。

## Track UI

- 名单内特性选项使用**静态绿点**（对齐红点静态披露）。
- Hover 按族：Multiscale「按满 HP 结算」；猛火族「按 HP≤⅓ 结算」；Guts／Marvel Scale「按已陷入异常状态结算」；Merciless「按对手中毒／剧毒结算」。
- 绿点不得与红点「效果暂未支持」、结果侧「未生效」、或「已判断无效」混淆。
- 结果侧不显示绿点，继续用普通 `active`／`inactive` provenance。

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §8
- [[../docs/traces/discussion/2026-08-07-green-dot-conditional-ability-effects|绿点条件触发特性讨论记录]]
- `none` Track 基建：[[20260805_closed_ability-track-none|Ability Track none]]

## Out of scope

- Unburden、Supreme Overlord、Friend Guard、Disguise、Shadow Shield 等仍 defer
- HP%／状态 Track 或 abilityOn 开关
- 灼伤降攻与 Guts 忽略灼伤
- Multiscale 多段／第二击语义
- 结果侧绿点或「条件已假设」脚注
- Ability Track `none`（见 none 子 issue）

## Acceptance criteria

- [x] 八个 Ability 均有 active／inactive compiler 覆盖；类型／类别／防暴／错误侧等 gate 未命中边界有用例。
- [x] Multiscale 单次结算击 `final` `2048`；猛火族匹配属性时 `basePower` `6144`；Guts／Marvel Scale 在 `physical` 下分别为攻击／防御 `6144`；Merciless 为 `criticalStage = 3` 且遇防暴为 `inactive`。
- [x] 不新增 HP%／状态 Track；不实现灼伤交互；不实现 Multiscale 多段语义。
- [x] Ability Track 静态绿点 + 族级 hover；与红点互斥；结果侧无绿点。
- [x] 八个 Ability 无红色 unsupported 提示；父 issue checklist 对应项可勾选。
- [x] 对 [[../docs/traces/discussion/2026-08-07-green-dot-conditional-ability-effects|讨论记录]] 的每项决定逐行完成实现审计。

## Resolution

实现 Assumed-Satisfied Ability Selection：八个特性进入 `DAMAGE_MODIFIER_ABILITY_IDS`，选中即按假设条件编译；Ability Track 静态绿点 + 族级 hover；结果侧仍只用 `active`／`inactive`。

### Discussion audit（2026-08-07）

| § | Decision | Implementation |
| --- | --- | --- |
| 1 | 绿点是 Track UI 披露，不扩展 Activation | Activation 仍为四态；绿点仅 Track option 披露 |
| 2 | 假设条件 ⊥ 机械 gate | 绿点始终在名单选项上；gate 未命中 → `inactive` |
| 3 | 静态绿点 | 选项渲染时即显示，不依赖 Selection |
| 4 | Merciless → `criticalStage = 3` | 对齐 Super Luck 路径 |
| 5 | 效果矩阵 | `compileAbilityEffect` 按矩阵写入 |
| 6 | 防暴 → Merciless `inactive` | 复用 scenario-compiler 会心 provenance |
| 7 | 不实现灼伤 | 无 burn 模型；Guts 仅物理 `6144` |
| 8 | 结果侧无绿点 | 未改 `DamageResultRow` |
| 9 | 族级 hover | 四族 i18n key |
| 10 | 错侧：绿点保留，Activation `inactive` | catalog 不过滤；compiler 错侧 `inactive` |
| 11 | Multiscale 单次满 HP ×0.5 | 防守 `finalModifier` `2048`；无多段分支 |
| 12 | 红绿互斥 | 进支持集后绿点；`unsupported` 才红点 |

Trace: [[../docs/traces/implementations/2026-08-11-green-dot-conditional-ability-effects|2026-08-11 green-dot implementation]]
