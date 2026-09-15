# Implementation Trace: Usage source + rule

Date: 2026-09-15
Source: Issue `9fd128be` / usage-source-requirements.md
Language: 简体中文

## Entries

### 1. Smogon 规则列表只收 VGC chaos 文件

Type: tradeoff

Context:
产品要求规则列表跟来源走，并点名 Reg M-C / M-B / M-A、BO3 与 rating cutoff。Smogon chaos 目录里还有 Champions BSS / OU / UU。

Decision:
`/api/smogon/formats` 只列出 `gen9championsvgc…reg…`（含 BO3）的全部 cutoff 文件。来源内默认仍复用现有 latest 逻辑：当前/上月目录里、cutoff-0 文件排序后的最后一项。不在 Worker 里解析 chaos JSON。

Reason:
与产品举例一致，避免把无关梯队塞进同一个下拉。多规则各一份大包的传输问题标给 `a6d04964`，本票不裁剪。

Follow-up: 加载优化票若要预裁剪，按 `(month, file)` 规则身份缓存。

### 2. 客户端只持久化排名快照，不持久化整包 chaos

Type: tradeoff

Context:
产品要求有缓存时立刻按上次结果画排序，超过 12 小时才后台拉新。Smogon chaos 约 12.9MB，本票禁止在 Worker 里 `JSON.parse` 整包。

Decision:
`localStorage` 只存 `{ fetchedAt, fingerprint, pokemonIds }`。后台拉到的新指纹先放 pending，点绿点才写回并 bump generation。招式/特性/道具/性格仍按现有按需请求。

Reason:
排名列表是对话里会挡住操作的那一层；推荐路径本来就有 loading 状态。把 12.9MB 塞进 localStorage 会撞配额，也超出本票范围。

Follow-up: `a6d04964` 若落地边缘/会话缓存，可再让推荐路径也免于 12 小时内重复拉包。

### 3. 手动拉取立即应用，后台拉取才出绿点

Type: interpretation

Context:
产品禁止后台更新自动换排序，也要求手动拉取随时可用。

Decision:
`refreshUsageStore` 走 apply；超过 12 小时的自动拉取走 pending。设置页没有绿点。

Reason:
手动拉取是用户明确要新数据；绿点只承担「应用有更新」那一类安静指示。

Follow-up: None
