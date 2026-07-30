---
# This section is managed by the CLI. Do not edit manually.
id: "c31be287-8cdf-459a-bbb0-898ec1185b5c"
title: "Simplify HUD color palette and semantic roles"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "NEEDS-TRIAGE"]
created_at: "2026-07-30T05:41:00Z"
updated_at: "2026-07-30T08:15:00Z"
---
## Problem

PokeLens 的 HUD 色板包含多组视觉上接近的中性颜色：

| Token | 当前值 |
| --- | --- |
| `bg-app` | `#e8ecfa` |
| `bg-sidebar` | `#eef1fb` |
| `token-bg` | `#e8ebf6` |
| `hairline` | `#e3e6f2` |
| `card-border` | `#c9cede` |
| `paper` | `#ffffff` |
| `notice-bg` | `#fff8e0` |

这些 token 当前都有名称，但尚未证明每个角色都需要独立颜色。相近但独立的 token 会让新组件难以选择正确颜色，也容易继续扩张色板。

运行时还有未完整进入规范的颜色：

- `--appbar-from` / `--appbar-to`
- `--chart-1` 至 `--chart-5`
- 无道具图标的 `#94a3b8`
- 标题文字阴影的 `#fff`
- HUD shadow 中重复编码的 ink RGB 值

本 issue 负责减少没有充分语义依据的颜色差异，并确认最小可用的 HUD palette。

## Questions to resolve

- 应用画布、sidebar 与 neutral token 是否确实需要三种不同浅色表面？
- `hairline` 与 `card-border` 是否需要不同颜色，还是只需要不同宽度或透明度？
- `notice-bg` 是否是稳定的产品语义，还是单个组件的局部 tint？
- app bar 是否需要两个独立渐变端点？
- shadow 是否应从 `ink` 派生，而不是重复编码 RGB？
- shadcn 默认 chart token 在没有图表消费者时是否应存在？

## Scope

- 盘点每个 HUD 与 shadcn 颜色 token 的实际消费者。
- 为每个保留 token 指定唯一、可复用的语义角色。
- 合并视觉接近且实际用途可由同一角色覆盖的 token。
- 优先通过现有 token、透明度或 `color-mix()` 表达层级，不为单个组件新增颜色。
- 简化 shadcn semantic token 到 HUD token 的映射。
- 确认 app bar 使用单色还是渐变，并将最终角色写入规范。
- 删除没有消费者的 `--chart-1` 至 `--chart-5` 及 `@theme inline` 暴露。
- 将以下单次硬编码替换为现有 token 或明确的派生值：
  - 无道具图标 `#94a3b8`
  - 标题阴影 `#fff`
  - shadow 中重复的 ink RGB
- 将 `crit-violet` 移交给 [[20260626_closed_audit-and-align-domain-color-systems|domain color issue]]，不保留为 HUD token。

## Constraints

- 相近颜色不因数值接近而机械合并；语义角色和实际层级仍是判断依据。
- 不通过增加更多 token 解决命名不清问题。
- 不改变结果区的信息层级。
- 不改变产品的 Game HUD 方向。
- 保持 light-only。
- 所有文字与交互状态继续满足 WCAG AA。

## Out of scope

- Pokémon 属性色。
- 能力值层级色。
- 伤害与 critical range 颜色。
- 属性克制、HP 或状态颜色。
- dark theme。
- 组件结构或页面布局重设计。

## Acceptance criteria

- [x] 每个保留的 HUD 颜色都有不同且可复用的语义角色
- [x] 无法说明独立角色的相近颜色已经合并
- [x] `design.md` 与 `src/index.css` 对最终 HUD palette 的描述一致
- [x] shadcn semantic tokens 映射到最小必要的 HUD palette
- [x] 未使用的 chart token 已删除
- [x] app bar 颜色的语义与是否保留渐变已经明确
- [x] HUD shadow 从共享 token 派生，不重复编码 ink RGB
- [x] 产品组件中不存在可由已有 HUD token 表达的单次硬编码颜色
- [x] 关键表面、文字、边界和交互状态通过视觉回归检查
- [x] 所有文字颜色在实际背景上满足 WCAG AA
- [x] `pnpm build` 通过

## Resolution

- `bg-sidebar` 已并入 `token-bg`，sidebar 与 shadcn muted/sidebar 语义统一使用中性填充。
- `hairline` 与 `card-border` 保留，分别用于非交互分隔与可感知的交互边界。
- `notice-bg` 保留为通知表面语义。
- app bar 已拍平为单色 `appbar: #33426e`。
- 无消费者的 chart tokens 已删除。
- HUD shadows 已由 `ink` 派生；无道具图标与标题阴影已改用 `hud-muted` / `paper` 派生或引用。
- `pnpm lint`、`pnpm test`（260 tests）与 `pnpm build` 均通过；浏览器视觉回归确认关键颜色计算值符合规范。
