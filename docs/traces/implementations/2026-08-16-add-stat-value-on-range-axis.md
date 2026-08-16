# Implementation Trace: Add Stat Value on existing Range axis

Date: 2026-08-16
Source: `.issues/20260815_working_add-a-new-stat-value-by-dragging-on-the-existing-range-axis.md`
Language: 中文

## Entries

### 1. 草稿叠在既有轴上，不另开单点轴

Type: interpretation

Context:
源要求点添加后在已有数轴上放新点，既有区间半透明保留。当时交互未定稿。

Decision:
`StatRangeInput` 增加 `draftValue` / `onDraftChange`。添加期间区间带、端点手柄、内部点降到 40% 且不可拖；新点用原来的空心手柄叠在轴上拖。确认 / 取消放在轴下方，对齐轴身。

Reason:
第二条单点轴就是本票要去掉的东西。半透明只作用在选中区间层，刻度轴本身保持可读。

Follow-up:
None.

### 2. 结果预览用派生 TrackState，不改真实选中集合

Type: decision

Context:
源要求拖点时结果区只显示新点，确认或取消后恢复原选中集合与结果。若把草稿写进 `trackState`，包络和选项会被改掉，取消还得快照还原。

Decision:
草稿只活在 `useScenarioState` 的 overlay。pipeline 走 `trackStatePreviewingOffense` / `Defense`：把该侧切到 Choice，且只选中草稿值。匹配已有 Preset 时用它的 id；否则注入稳定 id `__draft-stat__` 的 Temporary。真实 `trackState` 与 persistence 不动。

Reason:
取消等于丢掉 overlay。确认才走原来的 `confirmAdd*` 写入。

Follow-up:
None.

### 3. 添加起点仍用第二条 snap

Type: interpretation

Context:
旧单点轴的初值是 `snapPoints[1]`，通常是 32A / 中档。

Decision:
toggle 进入添加时仍用这个点。

Reason:
行为与旧面板一致，用户本来就会拖走。

Follow-up:
None.

### 4. 草稿身份用 Stat Value Label，不用 `__draft-stat__`

Type: decision

Context:
结果行按 Preset id 找 chip；真实 `trackState` 没有草稿 Preset，于是 fallback 把 `__draft-stat__` 画在脸上。

Decision:
新值草稿的 id 改为 `resolveOffenseChip` / `resolveDefenseChip` 算出的 Label。结果区改用 `pipelineTrackState` 查 Preset，Temporary 虚线和档位色一起对上。

Reason:
Label 是 Stat Value 的默认身份。哨兵 id 会漏到结果面上。

Follow-up:
None.
