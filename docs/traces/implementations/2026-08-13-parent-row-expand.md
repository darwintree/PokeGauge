# Implementation Trace: Parent-row Range expand

Date: 2026-08-13
Source: `.issues/20260813_working_style-expandable-range-items-on-parent-result-rows.md`；讨论记录 `docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching.md` §1–4
Language: zh-Hans

## Entries

### 1. 子行用patched pipeline再按非 Stat Track provenance对齐

Type: unresolved-implementation-decision

Context:
源要求展开只动该母行对应轴的 Choice，不改 Stat Track 全局模式。`runScenarioPipeline` 按整份 TrackState 做笛卡尔积，没有「只算这一行」的入口。源没说子行结果从哪来。

Decision:
展开时复制 TrackState，把展开轴改成 `preset`（未展开轴保持 Range），再跑同一条 pipeline。子行用 `snapshotId`、未展开轴的 id、以及除 `attacker-stat` / `defender-stat` 外的 provenance 对齐到母行。

Reason:
不改编译器，也不为展开另写一套伤害路径。全表切到 Choice 的成本已经存在；按签名缓存，同一种展开组合只算一次。

Follow-up:
None.

### 2. 展开态留在结果表，切模式时清空

Type: unresolved-implementation-decision

Context:
源说行内展开不改变 Stat Track 全局模式，但没说展开态存在哪、模式切走后是否保留。

Decision:
`DamageResults` 本地 `useState`，key 为母行 `calculationIdentity`。Offense / Defense Stat Track 任一模式变化时清空。

Reason:
展开是结果表视图，不是 Track 取值。切走 Range 后母行形态已变；再切回来从收起开始，避免对着新母行复用旧箭头状态。

Follow-up:
None.
