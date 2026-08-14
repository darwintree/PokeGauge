---
# This section is managed by the CLI. Do not edit manually.
id: "793849c1-508d-4b35-a433-202d9928dcfd"
title: "Persist Scenario Explorer state across refresh"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-30T02:55:00Z"
updated_at: "2026-08-14T03:50:00Z"
---
## Parent feature

[[../20260721_open_share-and-restore-scenario-setup-by-url|Share and restore Scenario Setup by URL]]

## Problem

Scenario Explorer 的 matchup 与 Track 配置只存在 React 运行时中，刷新页面后会回到首页并丢失当前计算条件。

## Scope

- 使用单一 `localStorage` key 保存最后一个完整 matchup、Move category 与 Track 状态。
- 刷新后直接恢复 Scenario Explorer 与结果行，不等待 Champions 默认值。
- 使用稳定资源 identity，不保存本地化名称。
- 每次有效配置变化后自动整体覆盖，不保存首页的单侧选择。
- 本地数据损坏、结构不完整、资源失效或版本不支持时删除整份快照并静默回到默认首页。
- `localStorage` 读写失败时继续使用运行时状态，不提示或重试。

## Out of scope

- URL 状态、复制链接与跨浏览器分享
- 账号、数据库、云同步与短链
- 新的分享或恢复 UI
- 历史、多槽位、TTL、版本迁移、部分恢复与多标签页实时同步
- 新建场景或清除已保存场景的入口

## Acceptance criteria

- [x] 刷新后恢复 attacker、defender 与 Move category。
- [x] 刷新后恢复 Move snapshots、选择状态和当前所有 Track 配置。
- [x] Champions 的迟到默认值不会覆盖恢复的 Move 或 Ability 选择。
- [x] 切换 Supported locale 后仍以稳定 identity 恢复同一配置。
- [x] 损坏、不完整、资源失效或不支持版本的本地数据会被整份丢弃且不导致白屏。
- [x] 多标签页采用最后写入覆盖，不做实时同步。
- [x] 测试覆盖存储 round trip、损坏数据与版本错误。

## Progress log

- 2026-07-30: 从 URL 分享 feature 拆出，开始实现页面刷新恢复。
- 2026-07-30: 经 batch grill 确认使用 throwaway `localStorage` 单快照；URL、兼容迁移、部分恢复、错误提示和清除入口均不在本次范围。
- 2026-07-30: 完成实现。`pnpm build`、241 项测试与 lint 通过；桌面和 390px 移动端冷启动刷新验证通过，控制台无错误。

## Resolution

Scenario Explorer 现在自动保存最后一个完整场景，并在刷新或重新访问后通过稳定 identity 恢复。快照采用单版本 throwaway 契约，无法识别时整份丢弃；URL 分享仍留在父 feature。
