# Implementation Trace: Battle Modifier Integration

Date: 2026-07-17
Source: `.issues/20260715_open_integrate-battle-modifier-ordering-and-specification-seams.md`
Language: Chinese

## Entries

### 1. Range 的 kernel 调用粒度

Type: unresolved-implementation-decision

Context:
规格要求每个 calculation identity 只调用 kernel 一次，同时 Range 行需要两个有序公式端点和各自的 HP；规格未明确 kernel interface 是单端点还是端点组。

Decision:
一个 compiled calculation input 可包含 `lowOutcome` 与可选的 `highOutcome`。Pipeline 对每个合并后的 identity 调用 kernel 一次，由 kernel 在该次调用内分别计算存在的端点。

Reason:
这同时保持“一 identity 一次调用”的 pipeline 契约、Range 端点与 HP 的完整 identity，并避免在 pipeline 外层建立第二种 Range 计算 seam。

Follow-up:
None.

### 2. 首批必中 Move template 审核集合

Type: unresolved-implementation-decision

Context:
规格要求已审核的必中模板以 `100%` 初始化并保留必中语义，但没有给出完整 numeric move-id 集合。现有研究只明确举证 Swift（129）、Kowtow Cleave（869）与 Flower Trick（870），并说明不能从 PokeAPI `accuracy: null` 推断必中。

Decision:
首批结构化审核元数据只纳入 129、869、870；三者初始化 `alwaysHits`，其中 Flower Trick 同时初始化 Critical stage `+3`。其他 `accuracy: null` 或 `0` 的招式保持未配置，等待后续审核元数据扩展。

Reason:
这落实已具证据的模板语义，同时避免把 51 个语义混杂的 `null` 招式一律误判为必中。

Follow-up:
扩展 reviewed move semantics 时按 numeric move id 增补同一结构化表。

### 3. Snapshot ownership 由 React subtree key 强制

Type: unresolved-implementation-decision

Context:
规格要求 attacker 或 Move side 变化时重建 snapshots，而 defender 变化时保留，但没有规定如何避免新 catalog 与旧 owner snapshots 在 effect 执行前短暂同屏。

Decision:
Scenario content subtree 以 attacker 与 Move side 为 key，明确排除 defender。新 owner 的 catalog 到达时 subtree 同步 remount；defender catalog 变化则保留 subtree，由 state hook 原样移植 snapshots。

Reason:
仅靠 effect reset 会产生一个无效 render，使旧 snapshot 引用新 catalog 中不存在的 Move。Ownership key 直接表达生命周期，不需要第二套同步状态。

Follow-up:
None.

### 4. 首批可进入候选池的 null-power Move

Type: unresolved-implementation-decision

Context:
规格要求只有结构化审核元数据允许变量威力招式进入候选池，但没有给出首批 allow-list。现有研究明确核对了 Gyro Ball（360）、Heavy Slam（484）与 Electro Ball（486）的 `power: null` 语义及手动具体威力降级。

Decision:
结构化元数据首批只纳入 360、484、486，三者以未配置的 `power: 0` 创建 snapshot，等待用户输入具体威力。其他 `power: null` 招式仍不进入候选池；不得仅凭 null 推断支持。

Reason:
这让“经审核 null-power 招式可进入”的分支真实可验收，同时不从 PokeAPI prose 或 null 标量扩大支持集合。

Follow-up:
新增变量威力候选时，按 numeric move id 扩展同一结构化表。

### 5. 非 Oricorio 使用 Revelation Dance 的属性

Type: unresolved-implementation-decision

Context:
候选池不校验 learnset，因此任意 attacker 都能选择 Revelation Dance。规格要求其属性由 `(move id, attacker identity)` 解析，但没有明确非法组合应回退到模板 Normal，还是继续应用招式的通用“使用者第一属性”规则。

Decision:
Move 686 对所有 attacker identity 使用该 Battle Pokémon 资源的第一属性；缺少属性时才回退到模板属性。Aura Wheel、Raging Bull 与 Ivy Cudgel 仍只使用审核过的 form-id 映射。

Reason:
全局候选池刻意不做合法性校验；一旦允许创建 snapshot，按通用招式规则计算比因非法组合静默回退 Normal 更一致，且仍只依赖 numeric move id 与 Battle Pokémon identity。

Follow-up:
None.
