---
# This section is managed by the CLI. Do not edit manually.
id: "aef1ee92-a146-4e6a-81e9-e8c790a97e29"
title: "Ability stage and screen bypass"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-11T02:22:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现 Unaware 对对方能力阶级的忽略，以及 Infiltrator 对 Screen Track 的绕过；Stage／Screen Track 选项本身不被修改。

## Scope

- Unaware
- Infiltrator

## Domain contract

### Unaware

- 进攻方 Unaware：编译时将**防守方** Stage 视为 `0`（普通与会心分支皆然）。
- 防守方 Unaware：编译时将**进攻方** Stage 视为 `0`（普通与会心分支皆然）。
- 会心既有 clamp（攻方 `max(stage,0)`、防方 `min(stage,0)`）只作用于**未被** Unaware 忽略的一侧。
- 两侧同时选 Unaware 时可叠加为两侧 Stage 皆按 `0` 结算。
- 不回写、不自动改 Stage Track 选项。

### Infiltrator

- 仅**进攻方** Infiltrator 有钩子：绕过本 Scenario 的 Reflect／Light Screen 减伤。
- 防守方 Infiltrator 恒为 `inactive`；不从防守方 Ability 目录移除。
- 不把极光幕加入 Screen Track；不改 Screen Track 选项。
- 墙本就因错类别、破墙招（`breaksScreensBeforeDamage`）或会心-only（`+3`）而未生效时，Infiltrator 无增量 → `inactive`。

### Track Selection Activation（贡献判定）

- Ability 改变了最终采用的 Stage／Screen 修正 → Ability `active`；被抹掉的 Stage／Screen → `inactive`。
- 无增量（Stage 已为 `0`、墙本就未生效、或结果与无该 Ability 相同）→ Ability `inactive`。
- 对齐现有防暴吞会心来源、万能伞压天气、`+3` 吞 Stage／墙的模式。
- 跨机制总契约见 [[../20260807_open_clarify-active-marking-for-ignore-guaranteed-track-conflicts|Clarify active marking for ignore/guaranteed Track conflicts]]；**本票不阻塞于该 issue**。

### Merge and display

- Unaware 置 `0` 后与同侧 Stage `0` 合并，被绕过 Stage 保留在 provenance `inactive`。
- Infiltrator 抹墙后与 Screen `none` 合并，被绕过墙保留在 provenance `inactive`。
- 被绕过的 Stage／Screen 不进结果主行，只进折叠「未生效」；Ability 按既有 active 来源展示。
- 不新增绿点或专用绕过 badge；从 `unsupported` 去红点即可。

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- 名单内特性须从 `unsupported` 转为可审计的 `active`／`inactive`。

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/traces/discussion/2026-08-07-ability-stage-and-screen-bypass|Ability Stage 与 Screen 绕过讨论记录]]
- [[../docs/traces/discussion/2026-07-17-stat-stage-and-critical-interactions|能力阶级与会心交互讨论记录]]
- [[../docs/traces/discussion/2026-07-17-screen-track-and-critical-interactions|Screen Track 与会心交互讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]
- [[../20260807_open_clarify-active-marking-for-ignore-guaranteed-track-conflicts|Clarify active marking for ignore/guaranteed Track conflicts]]

## Out of scope

- 自动修改 Stage Track 或 Screen Track
- 极光幕入 Screen Track
- 其他普通伤害、暴击、命中、接触与道具特性
- Mold Breaker
- 跨机制 ignore／guaranteed active 总契约的最终成文（见独立 grilling issue）

## Acceptance criteria

- [x] Unaware 进攻／防守矩阵：忽略对方 Stage、两分支置 0、与会心 clamp 组合正确；两侧叠加有覆盖。
- [x] Infiltrator 仅进攻方绕过 Reflect／Light Screen；防守方恒 `inactive`；错类别／破墙／`+3` 时无增量。
- [x] Stage／Screen Track 选项不被修改；绕过后与 `0`／`none` 合并并保留 `inactive` provenance。
- [x] 被绕过 Stage／Screen 不进主行；无绿点／专用 bypass UI；二者无红色 unsupported 提示。
- [x] 父 issue checklist 可勾选 Unaware 与 Infiltrator。
- [x] 对 [[../docs/traces/discussion/2026-08-07-ability-stage-and-screen-bypass|讨论记录]] 的每项决定逐行完成实现审计。

## Resolution

Implemented Unaware (109) and Infiltrator (151) as contribution-gated Ability bypasses in `compileAbilityEffect` + `compileScenario`.

- Unaware exposes `ignoresDefenderStage` / `ignoresAttackerStage`; effective stages fed to `compileBranch` are forced to `0` without rewriting Stage Track options. Critical clamp still applies only to the unignored side. Ability is `active` only when the ignored stage would have changed the compiled result (including `+3` cases where the stage still matters without Unaware).
- Infiltrator exposes `bypassesScreens` on the attacker only; an otherwise-active Reflect／Light Screen is compiled to neutral/`inactive`. Defender Infiltrator stays supported but always `inactive`.
- Pipeline merge reuses existing calculation-identity folding: bypassed stages merge with `0`, bypassed screens with `none`, inactive provenance retained.
- Coverage: `ability-stage-screen-bypass.test.ts` (compiler matrix, merge provenance, `@smogon/calc` oracle).
- No green-dot / bypass badge UI; both leave `unsupported` (red-dot) via `DAMAGE_MODIFIER_ABILITY_IDS`.

### Discussion audit (2026-08-07)

| # | Decision | Implementation |
| --- | --- | --- |
| 1 | Attacker Unaware ignores defender Stage; defender Unaware ignores attacker Stage; both may stack; Track options unchanged | `ignoresDefenderStage` / `ignoresAttackerStage` + effective stages; Track options untouched |
| 2 | Ignored side is 0 on ordinary and critical; crit clamp only on unignored side | `effective*Stage` before `compileBranch`; clamp still in `compileBranch` |
| 3 | Infiltrator bypasses Reflect／Light Screen only; no Aurora Veil; no-op walls → inactive | `bypassesScreens` only when `compileScreenEffect` would be `active` |
| 4 | Contribution-based active/inactive for Ability and bypassed Stage/Screen | Stage/screen states + late Ability activation overrides in `compileScenario` |
| 5 | Merge with Stage `0` / Screen `none`, keep inactive provenance | Covered by pipeline merge tests |
| 6 | Defender Infiltrator always inactive; stay in defender catalog | `bypassesScreens` attacker-only; supported id → `inactive` |
| 7 | Bypassed Stage/Screen not in main row; Ability via existing active sources | Reuses existing inactive provenance display |
| 8 | No green-dot / bypass UI; remove red unsupported only | Added to supported set; no UI additions |
