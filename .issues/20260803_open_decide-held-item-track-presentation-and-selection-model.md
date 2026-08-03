---
# This section is managed by the CLI. Do not edit manually.
id: "b40bf775-ab1b-4219-923d-2cfcf00979ed"
title: "Decide held-item Track presentation and selection model"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-03T04:30:00Z"
---
## Goal

确定 Held item Track 中道具图片的展示、分区、排序与多选交互，使大量静态候选在桌面和移动端仍可识别、可操作。

## Questions to resolve

- 攻击方与防守方候选如何分区，是否再按效果族、属性或其他稳定维度分组。
- 全量平铺、折叠分区、搜索、选择器或其他交互模型如何取舍。
- 已选项、显式无道具、身份锁定项和部分支持警告如何显示。
- 多选、取消最后一项、跨分区选择及选择顺序采用什么规则。
- 本地化名称、tooltip、键盘操作、触控目标和响应式布局的最低契约。

## Non-goals

- 不决定 sprite 的来源或加载路径。
- 不决定基于使用率的默认选择。
- 不改变道具候选资格、效果计算或结果面板信息层级。

## Acceptance direction

- 明确桌面与移动端的信息架构和选择状态机。
- 分区与排序不改变候选资格或计算身份。
- 名称、锁定态、警告和多选操作均具备可验收的可访问行为。