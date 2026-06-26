---
# This section is managed by the CLI. Do not edit manually.
id: "3dc0aa1e-367a-4b33-855d-77db3a4d8667"
title: "Introduce 18 Pokémon type colors and controls"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-26T14:23:00Z"
---
## Context

按 [[AGENTS.md]]，Pokémon 领域 token（属性、克制、HP 等）与 Geist/shadcn 语义分离。当前尚未引入 18 属性的颜色设定，也未在 Scenario Explorer 控件中体现属性色。

与 [[20260626_open_domain-color-tokens-for-damage-visualization|Domain color tokens for damage visualization]] 互补：该 issue 聚焦伤害可视化色阶；本 issue 聚焦属性色与属性相关控件。

## What to build

- 在 `src/index.css`（或约定 token 层）定义 18 属性 CSS 变量，light/dark 各一套
- 暴露 Tailwind `@theme inline` 工具类（如需要）
- 在相关控件（招式、属性标签等）中引入属性色展示
- 不并入 shadcn `--primary` / `--destructive` 语义

## Acceptance criteria

- [ ] 18 属性颜色集中定义，非散落 hardcode
- [ ] light / dark 均有对应值
- [ ] 至少一处 Scenario Explorer 控件使用属性色且语义正确
- [ ] 与 Geist 整体观感协调