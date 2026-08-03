---
# This section is managed by the CLI. Do not edit manually.
id: "d880f600-375a-42b4-bab0-5f0391c4a6f6"
title: "Share and restore Scenario Explorer configurations by URL"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-HUMAN"]
created_at: "2026-07-21T10:07:00Z"
updated_at: "2026-08-03T08:24:00Z"
---
## Context

当前 Scenario Explorer 的 Matchup 与各 Track 配置只保存在 React 运行时状态中。刷新页面后配置丢失，也无法把同一组伤害计算条件交给其他用户复现。

## Split progress

- 页面刷新后的浏览器本地恢复已拆分为 [[archive/20260730_closed_persist-scenario-explorer-state-across-refresh|Persist Scenario Explorer state across refresh]]。
- 本 issue 继续只跟踪 URL 分享、跨浏览器恢复及其错误反馈。

## Goal

用户可以生成一个可复制的 URL；接收者打开后，在当前支持的规则范围内恢复同一 Matchup、Track 取值和结果行。

## Proposed MVP boundary

- 使用自包含、带版本号的 URL 状态，不依赖账号、数据库或短链服务。
- 使用稳定 Battle Pokémon Identity、上游资源 identity 与语义值编码，不保存本地化名称。
- 覆盖进攻方、防守方、Move side、Move snapshots 及选中状态、能力值配置、能力阶级、特性、墙、道具、天气和结果显示模式。
- 恢复出的状态视为用户已配置状态；迟到的 Champions 排名、Move pick 或 Ability pick 不得覆盖它。
- 未知版本、损坏数据、已删除资源和当前不支持的值必须安全降级，并给出可理解的反馈。

## Decisions needed before implementation

- URL 是随每次修改实时更新，还是由显式“复制链接”操作生成。
- 用户自定义 Stat Preset 按 Preset identity 还是按 Stat Value 写入 URL。
- Move snapshot 的可编辑字段、创建顺序与 selected/unselected 状态的最小序列化形状。
- 状态版本迁移与向后兼容策略。
- 最大 URL 长度及超限时的产品行为。
- locale、显示实数值等纯展示偏好是否进入分享状态。

## Acceptance criteria

- [ ] 用户能从当前 Scenario Explorer 生成可复制链接。
- [ ] 在新的浏览器会话打开链接后，Matchup、所有纳入契约的 Track 状态和结果行一致。
- [ ] 恢复过程不等待 Champions 在线数据，且后台结果不会覆盖恢复状态。
- [ ] 相同配置在四种 Supported locale 下使用相同稳定资源 identity。
- [ ] 无效或部分过期的 URL 不导致白屏，并明确指出无法恢复的部分。
- [ ] 测试覆盖 round trip、版本错误、未知资源、后台默认值竞争和多 Move snapshot。

## Out of scope

- 用户账号与云端同步
- 服务端短链接
- 多人实时协作
- 导出文件或图片
