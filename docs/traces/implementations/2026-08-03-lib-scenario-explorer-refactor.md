# Implementation Trace: lib 与 Scenario Explorer 层级重构

Date: 2026-08-03
Source: `.issues/20260803_working_restructure-lib-modules-and-scenario-explorer-file-hierarchy.md`
Language: 中文

## Entries

### 1. 能力值哨兵的归属

Type: unresolved-implementation-decision

Context:
Issue 要求将 unknown Ability sentinel 移到 Ability/Catalog ownership，但当前仓库只有 `calc-adapter/ability.ts` 与 Catalog 的能力选项组装，没有独立的 Ability 模块。

Decision:
建立 `src/lib/ability/` 公共模块，集中放置 Adaptability 与 unknown Ability 的稳定 ID；Catalog 和 damage-calculation 都从该模块读取。

Reason:
能力 ID 是跨 Catalog 与伤害编译器共享的领域身份，不应继续依附计算适配器，也不应让 damage-calculation 反向依赖 Catalog。

Follow-up: None

### 2. CSS 拆分的级联边界

Type: unresolved-implementation-decision

Context:
`src/index.css` 同时包含全局 HUD 变量、宝可梦/能力值/伤害领域 token、Track Option 规则和页面动效；CSS 入口仍必须保持单一且原有层级不能改变。

Decision:
保留 `src/index.css` 作为入口，将 HUD 主题放入 `src/styles/hud.css`，领域 token 与组件规则分别放入 `src/styles/domain.css`、`src/styles/track-options.css`，动效放入 `src/styles/motion.css`；入口显式声明 `@layer base, components`，让导入文件中的组件层继续位于 base 层之后。

Reason:
这样只改变文件归属，不引入运行时样式加载或重复选择器，同时保留 HUD base 与 domain/track 组件的原级联关系。

Follow-up: `pnpm build`、`pnpm test` 与颜色对比测试均通过。
