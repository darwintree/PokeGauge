# Implementation Trace: Unify Stat Track onto one selected Stat Value set

Date: 2026-08-13
Source: `.issues/20260813_open_unify-stat-track-onto-one-selected-stat-value-set.md`
Language: zh-Hans

## Entries

### 1. 保留 `statRange` / `defenderRanges` 作为派生缓存

Type: decision

Context:
Issue 要求「任何 persisted Range interval 都从选中集合的包络派生，不是第二套真相」。未规定 TrackState 上是否删掉这两个字段。Pipeline、折叠浅井、滑条仍在读它们。

Decision:
字段留在 `TrackState` 上。所有 `trackStateAfter*` 在改选中集合后立刻用包络回写。测试不断言缓存方式。

Reason:
删字段会逼 pipeline / UI 每次现场算包络，diff 更大，也不改变玩家可见行为。

Follow-up:
None.

### 2. 存储版本保持 4，用 touched 键识别双库快照

Type: decision

Context:
Issue 要求能恢复 pre-unification 双库快照，但没要求 bump storage version。现有测试大量写死 `version: 4`。

Decision:
`SCENARIO_STORAGE_VERSION` 仍为 4。`isDualStoreTrackState` 看 `statRangeTouched` / `defenderRangeTouched` 是否以 boolean 出现。解析器把这两个键标成可选；写出时 `stripTouched` 去掉它们。

Reason:
避免为识别旧档去改每一个 version: 4 fixture。touched 键只存在于旧模型，正好当 discriminator。

Follow-up:
None.

### 3. restore 放在 persistence，不放进 `stat-selection.ts`

Type: decision

Context:
`defaultTrackState` 需要 `offenseEnvelopeOf` / `with*RangeEndpoints`。若 `stat-selection` 再 import `state.ts` 的 preset 装配函数，会和 `state.ts → stat-selection.ts` 形成环。

Decision:
选中集合生命周期留在 `stat-selection.ts`。`restorePersistedTrackState` 放在 `scenario-storage.ts`，由它装配 catalog presets 再调用 `trackStateAfter*Range` / `with*Envelope`。

Reason:
打破环，restore 本来就是 persistence 的职责。

Follow-up:
None.

### 4. 当前模型恢复允许空选中 ID（解析器不收紧）

Type: interpretation

Context:
Issue 说选中集合不能为空，但解析器与若干合成 fixture 仍可能带空 ID 数组。恢复当前模型时若强制回填默认选中，会改写「以保存集合为准」。

Decision:
当前模型 / Choice 恢复按保存的 ID 原样再派生包络。空集合不在 restore 里补默认。运行时 toggle / delete 仍禁止删光。

Reason:
保守解释「restore as-is」。空集合只应出现在坏档或测试夹具，不是新对阵路径。

Follow-up:
若产品要拒绝空选中旧档，另开校验，不要 silently rewrite。

### 5. 手柄交叉：drag hook 不再互夹，transition 负责排序

Type: decision

Context:
Story 28 要求交叉后换角色。旧 `useDualHandleDrag` 把 min 夹在 `<= max`、max 夹在 `>= min`，交叉到不了 transition。

Decision:
Drag 只夹在轴 bounds 内。`trackStateAfter*Range` 用 `orderedStatRange` / `orderedDefenderRanges` 排序后再 keep / drop / ensure。Fine-tune nudge 仍不交叉（issue 只写了拖动手柄）。

Reason:
排序是值模型的事，放在 hook 里会让测试看不到交叉。Nudge 保持旧夹紧，避免微调一步跨过另一端。

Follow-up:
None.

### 6. 单点 Range 展开滑条显示两个手柄

Type: decision

Context:
Story 26：一个 chip、两个手柄。`StatRangeInput` 在 `min === max` 时藏掉 max 手柄，向右扩大只能靠「拖 min 越过 max 再 swap」，展开滑条上也不对称。

Decision:
`mode === "range"` 时始终画两个手柄；`min === max` 只藏第二条数字标签和填充条。`mode === "single"` 仍是单点。

Reason:
值模型已支持从一点向两边长；UI 再藏手柄会挡住 story 26。视觉仍用现有 HUD 手柄，不新做样式。

Follow-up:
重叠时 DOM 后画的 max 在上，点按微调只能打到 max；向左微调仍要拖（或先分开）。可接受。

### 7. 配对测试钉死旧默认包络，而不是新 Matchup 默认

Type: deviation

Context:
Issue 要求计算端点配对测试一字不改，作为「本票不碰 Range endpoint identity」的守卫。新默认防守选中是 `0H0B`+`32H0B`，两者 Def 常是同一点，包络不再是物种 min-bulk → standard-bulk，原先 84 的 min-damage 对不上。

Decision:
配对测试仍断言 `min-off × max-def` 与 `max-off × min-def`。Range 跑次显式把包络设成 `0A`+`EX` 与 `min-bulk`+`standard-bulk`，与改默认之前的物种包络一致。

Reason:
测试要守的是配对公式，不是新对阵默认选中。若继续读 `defaultTrackState` 的包络，失败反映的是默认换了，不是配对坏了。

Follow-up:
None.
