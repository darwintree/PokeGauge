---
# This section is managed by the CLI. Do not edit manually.
id: "80d30274-ae3a-44b2-ab76-e694eadc8af6"
title: "Define derived display labels for stat-value templates"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-28T09:18:00Z"
updated_at: "2026-07-01T13:28:00Z"
---
## Context

Scenario Explorer 正在正式化 **实数值模版**（按宝可梦保存的性格无关最终实数值配置；进攻一组 offense stat 值，防守一组 `{HP, 防}` 值）。

已确认：**实数值模版不保存名称**。模板只保存最终实数值；UI 上看到的名称 / 标签全部由标签引擎从实数值、物种、stat 轴、当前 stat 名展示策略派生。

以下场景需要同一套 **派生显示标签**：

- 用户从数轴选段切回预设时自动创建的 **临时实数值模版** → 持久化后仍只保存实数值
- 用户通过「添加模版」UI 新建自定义实数值模版
- 系统、用户、临时三类模版的卡片主标签

## Decisions

- 英文术语：能力点数为 **SP（Stat points）**，旧称 `Ability points` 不再作为领域词。
- 模版没有 `name` 字段；不得持久化默认名。
- 默认标签模式为 **SP + stat 名 + 修正**。
- 用户可全局配置 stat 名展示策略；这是读法偏好，用 `localStorage` 持久化，不进入 matchup、模板或计算 pipeline。默认提供三套：
  - `HABCDS`
  - `HP, Atk, Def, Sp.A, Sp.D, Spd`
  - `HP，攻击，防御，特攻，特防，速度`
- 进攻标签格式：`{sp}{stat}{mod?}`，例如 `32A+`、`0C+`、`0S-`。
- 防守标签格式：`{hpSp}{hpStat}{defSp}{defStat}{mod?}`，例如 `32H20B+`。
- HP 无修正后缀；防守组合只在防御 stat 上追加 `+/-`。
- 极限值由实数值派生为固定标签 **`EX`**：
  - 进攻：`32{offenseStat}+`
  - 防守：`32H32{defStat}+`
- `EX` 只覆盖最大极限值；最小值按普通标签展示，例如 `0A-`。
- `32HP` 不再作为默认展示标签。
- 用户可临时切换到实数值显示模式；该模式类似当前实现，展示最终实数值而非 SP 标签，不持久化，不改变模板或计算 pipeline。
- 实数值显示模式需要同时覆盖 track 预设区与结果区；track 预设区每个 track 一个临时开关，结果区一个临时开关作用于整个结果区的所有 scenario 行，三者互不联动。
- 多分配规则沿用既有语义：默认优先无修正；命中 `EX` 时显示 `EX`；分配切换只改标签，不影响模板、row product 或伤害。
- 切换到实数值显示模式时，分配切换可以隐藏，因为最终实数值相同。
- SP 标签 hover tooltip 展示最终实数值与该实数值的所有可达分配策略。

## Open questions

- 无。

## Acceptance criteria

- [x] 文档定稿派生显示标签规则（含 offense / defense 两形态）
- [x] 规则可机械执行，且实现层不需要主观命名判断
- [x] Stat value template 持久化模型不包含名称字段
- [x] 标签引擎支持三套 stat 名展示策略
- [x] 标签引擎支持默认 SP 标签模式与实数值显示模式
- [x] `EX`、HP 无修正、防守组合后缀规则有测试覆盖
- [x] 多分配默认、分配切换、实数值模式隐藏分配切换有测试覆盖
- [x] SP 标签 tooltip 展示最终实数值与所有可达分配策略
- [x] 与实数值模版主 feature 的 persist / create 流程对接点明确
- [x] 实现前逐条审计 [`docs/traces/2026-07-01-stat-value-template-derived-display-labels-grill.md`](../../docs/traces/2026-07-01-stat-value-template-derived-display-labels-grill.md) 中的每项决定，并确认已覆盖

## Resolution

Implemented SP label engine in `src/lib/stat-value-template/ability-points.ts` with `resolveTemplateDisplay()`, stat name strategies in `stat-name-strategy.ts`, rules doc at `docs/domain/stat-value-template-display-labels.md`. UI: preset cards + results use derived labels; three independent actual-value switches; allocation cycle hidden in actual mode; SP tooltips on preset cards. Removed template `name` from types and persist/create flows. Trace: `docs/traces/implementations/2026-07-01-stat-value-template-derived-display-labels.md`.

## Related

- 实数值模版 formalization grill（2026-06-28）→ [`docs/traces/2026-06-28-stat-value-template-grill.md`](../../docs/traces/2026-06-28-stat-value-template-grill.md)
- 派生显示标签 grill（2026-07-01）→ [`docs/traces/2026-07-01-stat-value-template-derived-display-labels-grill.md`](../../docs/traces/2026-07-01-stat-value-template-derived-display-labels-grill.md)
