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

### 3. Catalog identity 过渡时的同步保护

Type: unresolved-implementation-decision

Context:
规格要求 attacker 或 Move side 变化时重建 snapshots、defender 变化时保留 snapshots；Ability 契约又要求更换任一方只重建该方 Ability Track，Move side 变化保留双方 Ability。规格没有规定如何避免新 catalog 与旧 owner state 在 effect 执行前短暂同屏。

Decision:
Scenario state hook 在 identity 变化时保持挂载。若本次 render 的 catalog identity 与 hook 已接收的 identity 不同，则暂不运行 scenario pipeline；随后 effect 按新 catalog 重建 owner 相关 state，并分别保留契约要求保留的 snapshots 与双方 Ability selections。

Reason:
仅靠 effect reset 会产生一个无效 render，使旧 snapshot 或 ability id 引用新 catalog；以 subtree key remount 又会无条件丢失双方 Ability selections。过渡 render 的计算保护让生命周期规则可以逐 Track 落实，同时不把无效组合送入 compiler。

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

### 6. 缺少当前特性关系的 Battle Pokémon identity

Type: unresolved-implementation-decision

Context:
Ability Track 契约要求每个候选 Battle Pokémon identity 都列出 PokeAPI 当前特性关系中的全部真实特性，并始终至少选择一项。当前上游 CSV 中有少量新形态具备基础能力值，却没有 `pokemon_abilities.csv` 关系；规格没有定义这类不完整 identity 的降级方式。

Decision:
资源生成器把缺少当前特性关系的 identity 记入 diagnostics，并像缺少 battle stats 的 identity 一样暂不生成可选 Battle Pokémon 资源；不创建虚构特性、不借用其他形态的特性，也不读取历史特性关系兜底。

Reason:
只有排除不完整 identity 才能同时维持“候选来自当前 PokeAPI 关系”和“Track 至少一项真实选择”两个契约。其他降级方式都会伪造合法性，或把历史／其他形态关系错误归给当前 identity。

Follow-up:
上游补齐当前特性关系后，重新生成资源即可自动恢复这些 identity。
