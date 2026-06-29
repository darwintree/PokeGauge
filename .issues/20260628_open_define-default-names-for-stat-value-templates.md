---
# This section is managed by the CLI. Do not edit manually.
id: "80d30274-ae3a-44b2-ab76-e694eadc8af6"
title: "Define default names for stat-value templates"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-28T09:18:00Z"
updated_at: "2026-06-28T09:18:00Z"
---
## Context

Scenario Explorer 正在正式化 **实数值模版**（按宝可梦保存的性格无关实数值配置；进攻一组 offense stat 值，防守一组 `{HP, 防}` 值）。

以下场景需要 **默认名称**（用户持久化时可不改名）：

- 用户从数轴选段切回预设时自动创建的 **临时实数值模版** → 持久化
- 用户通过「添加模版」UI 新建自定义实数值模版

命名规则 **不在主 feature 内定稿**；本 issue 单独收敛默认名规则与展示格式。

## Open questions

- 进攻（单 stat）：默认名是否直接用实数值（如 `142`）？是否带 stat 标签前缀（如 `物攻 142`）？
- 防守（HP + 防）：默认名格式 — `150/98`、`HP 150 · 防 98`、或其他？
- 临时模版默认名 vs 用户主动「添加模版」默认名是否同一规则？
- 同宝可梦下重名冲突：自动 suffix（`142 (2)`）还是禁止？
- 默认名长度 / 本地化（中/英 UI 标签）

## Acceptance criteria

- [ ] 文档或 ADR 定稿默认命名规则（含 offense / defense 两形态）
- [ ] 规则可机械执行（实现层无主观判断）
- [ ] 与实数值模版主 feature 的 persist / create 流程对接点明确

## Related

- 实数值模版 formalization grill（2026-06-28）→ [`docs/traces/2026-06-28-stat-value-template-grill.md`](../../docs/traces/2026-06-28-stat-value-template-grill.md)