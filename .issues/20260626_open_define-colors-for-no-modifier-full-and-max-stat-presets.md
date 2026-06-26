---
# This section is managed by the CLI. Do not edit manually.
id: "212c36d9-9aab-45d6-a59a-27055bbce3a1"
title: "Define colors for no-modifier, full, and max stat presets"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-26T14:23:00Z"
updated_at: "2026-06-26T14:23:00Z"
---
## Context

攻击方「实数值（性格 + 努力）」预设包含无修正、full、max 等档位（见 catalog / mock 配置）。这些档位目前在 UI 中缺乏一致的颜色编码，用户难以快速区分不同努力/性格组合语义。

相关实现：
- `src/components/scenario-explorer/config-multi-select.tsx`
- catalog 中 `attackerStats` 预设定义

## What to build

- 定义无修正 / full / max（及同类 preset 档位）的领域色 token
- 在实数值多选控件或标签中应用对应颜色
- 与 18 属性色、伤害可视化 token 保持分层，不混用 shadcn 语义色

## Acceptance criteria

- [ ] 无修正、full、max 各有稳定、可区分的颜色 token
- [ ] token 在 light / dark 下可读
- [ ] `ConfigMultiSelect` 或等价控件中 preset 档位可见颜色编码
- [ ] 颜色语义与伤害计算 preset 含义一致