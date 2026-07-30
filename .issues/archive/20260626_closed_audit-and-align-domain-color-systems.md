---
# This section is managed by the CLI. Do not edit manually.
id: "00959cba-0787-4ff6-946e-f08065b59b1a"
title: "Audit and align domain color systems"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT"]
created_at: "2026-06-26T13:42:00Z"
updated_at: "2026-07-30T05:52:00Z"
---
## Problem

PokeLens 已实现三套领域颜色：

- Pokémon 属性色
- 能力值层级色
- 伤害与 KO 可视化色

但实现来源、命名、对比度和规范归属并不一致。原 issue 只描述伤害颜色，并且关于 Tailwind 默认色与 `design.md § Lethality tones` 的内容已经过时。

本 issue 负责确认领域颜色系统的边界，并让现有实现符合该边界。HUD chrome 色板的收敛由独立 issue 处理。

## Confirmed direction

- 调整并集中伤害颜色 token。
- 消除属性色在 CSS 与 TypeScript 中的颜色值重复。
- 修复属性色前景色选择与文字对比度。
- 重新校准能力值层级文字颜色，使实际使用组合满足 WCAG AA。
- 将 `crit-violet` 明确归入伤害领域，而不是 HUD chrome。
- 暂不创建属性克制与 HP 颜色 token，直到出现实际消费者。
- 保持产品为 light-only，不恢复 dark theme。

## Scope

### Damage colors

- 在 `src/index.css` 中建立统一的 `--damage-*` token。
- 覆盖 cool、warm、lethal 渐变端点及 critical range 颜色。
- `DamageBoxPlot`、legend 与 tooltip marker 共用相同 token。
- 删除 `TONE_DOT_CLASS` 中重复的十六进制颜色。
- 将 `--crit-violet` 重命名或迁移为明确的 damage-domain token。
- OHKO 黄色徽章继续使用 HUD 的 `signal-yellow`，因为它表达高显著状态，而不是伤害档位。
- 保持现有阈值不变：
  - cool: peak < 75%
  - warm: 75% ≤ peak < 100%
  - lethal: peak ≥ 100%

### Pokémon type colors

- 18 种属性颜色只有一个权威来源。
- CSS 与 TypeScript 不再分别维护相同 hex。
- 前景色采用明确、可验证的配对，不再依赖当前的近似亮度阈值。
- 修复 psychic `#F85888` 配白字只有约 `3.11:1` 的对比度问题。
- 保持 Showdown 属性背景色及现有 TypeBadge 语义不变。

### Stat tier colors

- 保持 `0`、进攻 `max`、防守 `32HP`、`ex` 的领域语义与现有落点。
- 重新校准 fg 与 muted 色，使实际背景上的文字达到 WCAG AA。
- 当前需要处理的组合包括：
  - offense max 主文字约 `4.28:1`
  - bulk mid 主文字约 `4.15:1`
  - 四组 muted 文字约 `2.15:1` 至 `2.89:1`
- 不通过改变 tier 含义或增加新 tier 解决对比度问题。

### Documentation and ownership

- `design.md` 只记录产品级颜色分层和通用规则，不重新加入组件级色值表。
- 具体领域 token 与值由 `src/index.css` 持有。
- 删除代码中已经不存在的 `design.md § Lethality tones`、`§ Damage plot` 等引用。
- HUD chrome 与领域颜色不得互相作为语义别名，即使当前 hex 相同。

## Related work

- HUD 中性表面、边界、app bar 与其他 chrome 色的收敛由 [[../20260730_open_simplify-hud-color-palette-and-semantic-roles|HUD palette simplification]] 处理。
- 两个 issue 可以独立实现，但最终需要共同核对 `design.md` 与 `src/index.css` 的分层描述。

## Out of scope

- HUD 基础色板的合并与重新命名。
- Pokémon 属性克制颜色。
- HP 或状态颜色。
- 新增 dark theme。
- 改变伤害档位阈值。
- 改变结果区信息层级或组件结构。

## Acceptance criteria

- [x] 伤害渐变、tooltip marker、legend 与 critical range 均使用集中定义的 damage token
- [x] `DamageBoxPlot` 不再包含伤害色十六进制硬编码
- [x] `crit-violet` 已归入 damage-domain 命名
- [x] 18 种属性背景颜色只有一个权威来源
- [x] 属性前景色配对全部达到 WCAG AA
- [x] 能力值层级的主文字与辅助文字在实际背景上达到 WCAG AA
- [x] stat tier 语义与现有 UI 落点保持不变
- [x] 未提前创建 effectiveness 或 HP 空 token
- [x] 过时的 `design.md` 章节引用已移除
- [x] 有一个可运行检查覆盖属性与 stat tier 的关键对比度组合
- [x] `pnpm build` 通过

## Resolution

- `src/index.css` 现在集中持有 damage、Pokémon type 背景/前景和 stat tier 色值。
- `DamageBoxPlot` 的渐变、tooltip marker、legend 和 critical range 共享 damage token。
- TypeBadge 不再维护 TypeScript hex 镜像或运行时亮度阈值；psychic 等 18 种属性使用显式前景配对。
- stat tier 主文字与辅助文字已在保留灰、蓝、紫语义的前提下校准到 WCAG AA。
- 新增 `src/lib/domain-color-contrast.test.ts`，直接读取 CSS token 检查 18 种属性和 stat tier 关键组合。
- 已通过 `pnpm test`（246 tests）、`pnpm build`、`pnpm lint`（仅既有 warnings）与桌面/窄屏视觉审查。
