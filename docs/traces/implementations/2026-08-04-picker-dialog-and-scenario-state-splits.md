# Implementation Trace: PickerDialog API and ScenarioState prop narrowing

Date: 2026-08-04
Source: `.issues/20260804_open_extract-shared-pickerdialog-wrapper-for-pokemon-and-move-pickers.md`, `.issues/20260804_open_split-usescenariostate-god-hook-and-narrow-component-props.md`
Language: 中文

## Entries

### 1. 共享 PickerDialog 的 API 形态

Type: unresolved-implementation-decision

Context:
Issue #5 只要求提取“Dialog + bottom-sheet 样式 + 搜索头 + 可滚动列表”的共享包装，没有规定 props 形状。两个消费方结构不同：pokemon 弹窗在列表外有筛选控件和同形态紧凑行，move 弹窗的列头在滚动区内。

Decision:
采用 `PickerDialog` 的插槽式 API：`beforeList` 渲染滚动区上方内容，`bodyClassName` 覆盖滚动容器样式，`empty`/`children` 二选一渲染空态或列表内容；搜索输入与 `useId` 由共享组件持有。

Reason:
两个消费方共享标题、搜索、滚动容器与空态样式，差异只在列表前后内容；插槽式 API 用最少的 props 覆盖差异，避免把筛选/列头逻辑上提。

Follow-up: None.

### 2. ScenarioState props 收窄范围

Type: tradeoff

Context:
Issue #6 要求“Pass narrow props instead of the whole ScenarioState to StatTrack, ScenarioSetSummary, and ScenarioSetupPanel where practical”。`ResultSetSummary` 只读 `selectionSummary` 与 `trackState`，容易收窄；`StatTrack` 使用 state 中约 24 个字段（presets、bounds、adding 状态及 18 个回调），`ScenarioSetupPanel` 把 state 原样传给 StatTrack 并为其余轨道使用其中的回调。

Decision:
只收窄 `ResultSetSummary`（改为 `trackState` + `rowCount`），并顺带删除因此失去消费者的 `selectionSummary`（其中还含硬编码中文串）。`StatTrack` 与 `ScenarioSetupPanel` 保持 `state: ScenarioState`。

Reason:
后两者消费了 state 表面的大部分字段，逐字段声明会产生 20+ props 的重复类型并随 state 演进漂移；“where practical” 留给真正能减少耦合的界面。主 hook 本身仍按 issue 拆出 persistence 与 catalog-transition 两个 hook。

Follow-up: 若 StatTrack/SetupPanel 未来再拆分，可按新边界重新收窄 props。
