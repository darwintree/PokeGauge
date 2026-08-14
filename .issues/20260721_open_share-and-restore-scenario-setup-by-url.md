---
# This section is managed by the CLI. Do not edit manually.
id: "d880f600-375a-42b4-bab0-5f0391c4a6f6"
title: "Share and restore Scenario Setup by URL"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-HUMAN"]
created_at: "2026-07-21T10:07:00Z"
updated_at: "2026-08-14T03:49:00Z"
---
## Context

Scenario Explorer 已通过单槽 `localStorage` 快照支持刷新恢复，但仍无法把同一组计算输入交给其他用户跨浏览器复现。URL 分享需要独立于本地快照的稳定领域契约，不能直接发布当前 `TrackState`。

## Split progress

- 页面刷新后的浏览器本地恢复已拆分为 [[archive/20260730_closed_persist-scenario-explorer-state-across-refresh|Persist Scenario Explorer state across refresh]]。
- 本 issue 继续只跟踪 URL 分享、跨浏览器恢复及其错误反馈。

## Goal

用户可以生成一个自包含 URL；接收者打开后，在当前支持的资源与规则范围内恢复同一 Scenario Setup，并重新生成相同的 Scenario 结果集合。结果行顺序不属于恢复保证。

## Confirmed non-UI contract

- 分享对象是 Scenario Setup：Matchup、Move side、已选 Move Snapshots、双方 Stat Track 模式与全部已选 Stat Values、能力阶级、Held items、Abilities、Weather、Terrain、Screens 和 Probability Mode。
- Range 分享全部已选 Stat Values，不只分享包络端点。Stat 以值为身份；不分享本地 Stat Preset identity，也不在接收端自动创建用户 Preset。
- 已选但不可计算的 Move Snapshot 仍分享；完全相同的多个 Snapshot 保留多重性。随机 snapshot identity、任何集合顺序和结果行顺序都不属于分享语义。
- 不分享候选池、未选 Move Snapshots、locale、展示偏好、结果、引擎版本或自由文本。合法的零 Move／零结果 Setup 可以分享。
- 链接使用稳定 Battle Pokémon Identity、上游资源 identity 和语义值；结果始终由接收时的当前资源与规则重新计算。
- 显式生成自包含、带 schema version 的 query payload，不依赖账号、数据库或短链。相同受支持版本内的同一 Setup 生成相同链接。
- 有效 URL 优先于本地快照，但未编辑导入保持临时状态；首次共享语义修改后才成为新的本地最近设定。无效 URL 不得静默回退并展示本地设定冒充恢复成功。
- 恢复只依赖本地生成资源与静态规则，不等待 Champions 在线排名或默认选择；迟到默认值不得覆盖恢复状态。
- 任何被分享的已选资源或语义失效都阻止整份 Setup 应用；不删除失效项后部分恢复。解析与校验返回结构化失败原因，本地快照保持不变。
- 链接无创建时间、TTL、来源认证或历史规则保证。Breaking schema change 可以使旧版本数据过期并拒绝解析；不提前承诺迁移。

## Confirmed transport boundary

- 采用外层 version、无 padding base64url、CRC-32 的专用 canonical bit payload；V1 冻结字段次序、枚举、字段宽度与 decoder 语义。
- 无顺序 Set 严格递增且不重复；Move Snapshot 多重集按完整语义元组非递减，允许完全相同项。只允许不足一个字节的零 padding，额外或非零 trailing bits 均无效。
- 会增长的 ID 与 count 在 V1 预留 escape sentinel 和规范无符号变长整数，不允许截断。
- 正常生成的完整 URL 以约 1,800 个 ASCII 字符为可移植上限；外部输入另设约 8 KB 绝对防护上限。V1 不承诺二维码能力。
- Share schema 独立于 `TrackState` 和 localStorage snapshot；未知或已过期 version 不尝试猜测或跨版本解析。

## Deferred UI and interaction decisions

- 分享入口的位置与层级。
- 复制成功、剪贴板失败和超限时的交互。
- 阻断恢复错误与结构化失败原因的具体呈现。
- 返回本地设定等恢复操作的界面流程。

## Acceptance criteria

- [ ] 用户能从当前 Scenario Explorer 生成可复制链接。
- [ ] 在新的浏览器会话打开链接后，Matchup、所有纳入契约的已选语义和结果集合一致；不要求结果行顺序或本地 identity 一致。
- [ ] Range round trip 保留包络内全部已选 Stat Values；用户 Preset identity 不进入链接，也不被自动导入。
- [ ] Round trip 保留不可计算的已选 Move、零 Move Setup 和完全相同 Move Snapshots 的多重性。
- [ ] 恢复过程不等待 Champions 在线数据，且后台结果不会覆盖恢复状态。
- [ ] 相同配置在四种 Supported locale 下使用相同稳定资源 identity。
- [ ] 无效、损坏、未知或已过期 URL 不应用任何共享状态、不覆盖本地快照，并返回结构化失败原因。
- [ ] 有效分享 URL 优先于本地快照；未编辑导入不覆盖最近本地设定，首次共享语义修改后才进入本地持久化。
- [ ] 测试覆盖 semantic round trip、canonicality、CRC、truncation、trailing bits、字段边界、escape value、版本错误、未知资源、后台默认值竞争和多 Move Snapshot。
- [ ] 实现完成前逐行审计 [`docs/traces/discussion/2026-08-14-scenario-setup-sharing.md`](../docs/traces/discussion/2026-08-14-scenario-setup-sharing.md)，确认每项决定均已实现并测试，或明确标记为不适用。
- [ ] UI 与交互决策在对应前端实现开始前另行确认。

## Out of scope

- 用户账号与云端同步
- 服务端短链接
- 多人实时协作
- 导出文件或图片

## Discussion trace

- [`docs/traces/discussion/2026-08-14-scenario-setup-sharing.md`](../docs/traces/discussion/2026-08-14-scenario-setup-sharing.md)

## Progress log

- 2026-08-14：完成非 UI／交互契约 grilling；确认 Scenario Setup 领域边界、版本失效策略、恢复原子性与紧凑 URL transport，UI／交互另行讨论。
