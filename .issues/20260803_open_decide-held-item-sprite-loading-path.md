---
# This section is managed by the CLI. Do not edit manually.
id: "375c3b74-e8fa-432b-a2ea-29ee862d2ea5"
title: "Decide held-item sprite loading path"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-03T04:30:00Z"
---
## Goal

确定 Held item sprite 从权威来源到产品运行时的加载路径，并明确当前本地 vendoring 是否继续作为长期契约。

## Questions to resolve

- 图片来源、版本固定方式及资源身份由什么定义。
- 采用源文件落仓、资源生成时复制、构建时打包，还是不可变静态资源托管。
- PokeAPI numeric item id、资源文件名与 gen8/gen9 特殊路径如何关联。
- 开发、构建和部署环境中的缓存、更新、离线可用性及加载失败 fallback。
- 是否继续保留 frozen-85 spec 的本地 vendoring 和禁止运行时 hotlink 契约；若改变，需形成明确 spec change。

## Non-goals

- 不决定道具图标的分区、排序或选择交互。
- 不改变 Held item 效果白名单或计算语义。

## Acceptance direction

- 给出一条可复现的开发、构建和部署加载链路。
- 明确资源版本、更新责任、缓存与失败行为。
- 明确该决策是否触发现有 Held-item spec 变更。