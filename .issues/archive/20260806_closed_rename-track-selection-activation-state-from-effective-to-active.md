---
# This section is managed by the CLI. Do not edit manually.
id: "bcc166c7-460d-4ce1-b594-87d564f05c84"
title: "Rename track selection activation state from effective to active"
status: "closed"
priority: "low"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-06T06:54:00Z"
updated_at: "2026-08-06T08:16:00Z"
---
## Problem

领域术语已经将 Choice Track 中 Selection 是否参与最终结果统一为 **Track Selection Activation**，状态为 `active`、`inactive`、`unsupported` 与 `neutral`。代码仍使用 `SourceState`、`effective` 和 `provenance.effective`，与 `CONTEXT.md` 不一致。

## Issue Assessment

- Impact：不一致的术语会让后续 Ability、Item 与结果 provenance 实现继续扩散旧命名。
- Evidence：`src/lib/damage-calculation/scenario-compiler.ts` 与 `src/lib/scenario/` 仍以 `effective` 表示已生效 Selection。
- Scope：只做类型、字段、字面量、变量名、当前测试和当前活跃文档中的机械重命名。
- Decision：valid；不得改变任何 activation 判定、伤害计算、合并或展示行为。

## Contract

- `SourceState` 重命名为 `TrackSelectionActivation`。
- 状态字面量 `effective` 重命名为 `active`。
- provenance option-set 的 `effective` key 重命名为 `active`。
- 同步当前代码、测试、fixture 与活跃 issue 中指向这些程序符号的命名。
- 不修改 `docs/traces/discussion/` 或 `docs/traces/implementations/` 中的历史记录。
- 不改变 serialized Scenario Track State；若没有持久化 provenance，则不得新增迁移层。
- 本 issue 不阻塞 [[../20260805_open_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]，两者按落地时现有字面量适配即可。

## Verification Checklist

- [x] `SourceState`、`effective` 与 `provenance.effective` 的当前程序引用已完成机械重命名。
- [x] Activation 状态集合仍严格为 active／inactive／unsupported／neutral。
- [x] 现有 compiler、pipeline、merge 与 UI 测试只更新命名，行为断言不变。
- [x] 历史 trace 未被改写。
- [ ] `pnpm test`、`pnpm lint` 与 `pnpm build` 通过。`pnpm lint` 与 `pnpm build` 通过；`pnpm test` 的 15 个 `src/lib/scenario/evaluate.test.ts` 场景数量断言在未改动的 `HEAD` 基线副本中同样失败。排除该基线文件后 38 个测试文件、325 项测试通过。

## Progress Log

- 2026-08-06：术语契约确认；拆为独立的无行为变更任务。
- 2026-08-06：完成类型、状态字面量、provenance key、变量、测试 fixture 与活跃 issue 的机械重命名；未创建 implementation trace，未修改历史 trace。

## Resolution

`SourceState` 已重命名为 `TrackSelectionActivation`，四态集合为 `active | inactive | unsupported | neutral`。Compiler、scenario provenance 聚合、结果 UI 消费和当前测试统一使用 `active`，计算、合并、序列化 Track State 与展示行为未变。

验证结果：`pnpm lint`、`pnpm build` 通过；`pnpm vitest run --exclude src/lib/scenario/evaluate.test.ts` 通过（38 files／325 tests）。完整 `pnpm test` 在 `src/lib/scenario/evaluate.test.ts` 有 15 个当前 HEAD 已存在的默认 Scenario 乘积数量失败；从未修改的 `HEAD` 临时副本运行得到同一组 15 个失败，因此未在本机械重命名 issue 中改写其行为断言。

## References

- [[../CONTEXT|Domain context]]
- [[../docs/traces/discussion/2026-08-06-offensive-defensive-ability-modifiers-contract|进攻与防守特性伤害修正契约讨论记录]]
