# Implementation Trace: Stat tier color tokens

Date: 2026-06-28
Source: `.issues/20260626_open_define-colors-for-no-modifier-full-and-max-stat-presets.md`, `docs/traces/2026-06-28-stat-tier-color-tokens-grill.md`
Language: 中文

## Entries

### 1. `standard` 进攻 preset 映射到 max 档而非 ex

Type: interpretation

Context:
Grill 定稿进攻三档为 0 · max · ex；catalog 现有四个 preset id（`neutral-zero`、`neutral-max`、`standard`、`extreme`）。Grill 未逐 id 对照。

Decision:
`neutral-zero` → `--stat-tier-0-*`；`neutral-max` 与 `standard` → `--stat-offense-max-*`；`extreme` → `--stat-tier-ex-*`。`standard` 虽有性格但修正的是速度而非进攻 stat，语义上归入 max。

Reason:
与 tier 定义「max = 满努力、ex = 满努力 + 进攻 stat 性格修正」一致；避免四个 preset 挤进三档时把 `standard` 误标为 ex。

Follow-up:
None.

### 2. 防守 32HP 档 catalog 未落地

Type: open-question

Context:
Grill 与 issue 定义防守 pill 三档 0 · 32HP · ex，并规定 `--stat-bulk-mid-*`。当前 catalog / calc preset 仅 `min-bulk` 与 `standard-bulk` 两项。

Decision:
CSS 已定义 `--stat-bulk-mid-*`；`defenderBulkTier` 预留 `hp-32` → mid。本 issue 仅对现有两项 pills 与结果行上色（0 / ex）。32HP preset 增项留给后续 catalog 工作。

Reason:
Issue acceptance 要求 E 为「bulk pills 可见 tier 色」，未强制本迭代新增第三 preset；token 与映射先就绪。

Follow-up:
None — `hp-32` added in catalog (`registry.ts`) and calc presets (`presets.ts`).
