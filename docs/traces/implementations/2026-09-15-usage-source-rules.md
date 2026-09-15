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
`refreshUsageStore` 走 apply；超过 12 小时的自动拉取走 pending。设置页没有待应用按钮。

Reason:
手动拉取是用户明确要新数据；待应用按钮只承担「应用有更新」那一类安静指示。

Follow-up: None

### 4. Pikalytics 规则只从 `#format_dd` 读

Type: bugfix

Context:
评审看到 Naive / Modest。Pikalytics 图鉴 HTML 里除了赛制下拉，还有性格下拉 `#nature_select`（value 为 `modest` / `naive`）。第一版用页面上全部 `<option>` 当规则。

Decision:
Worker 只解析第一个 `#format_dd`，按 id 去重。性格 / 招式 / 道具选项不进目录。

Reason:
那些名字是性格，不是赛制；产品要求规则跟来源的赛制列表走。

Follow-up: None

### 5. 默认「当前系列」过滤的年份取自来源默认规则

Type: tradeoff

Context:
Pikalytics 全表 100+ 项（旧世代、OU、ZA…）。产品要求一个小过滤：当前系列 VGC / Champions，默认开，设置可关。

Decision:
开着时只留 id 含 `championsvgc{year}` 或 `vgc{year}` 的规则。`year` 从来源自己的 defaultId 里的 `vgcYYYY` 取（没有则用 UTC 年）。Champions 赛季列表全留。当前选中项若被过滤掉，仍钉在列表最前。过滤开关持久化，默认开。

Reason:
跟 Darwin 举的 current-series VGC/Champions 一致，又不把年份写死成 2026。不另做搜索/chip UI。

Follow-up: 明年默认规则换年份后过滤自动跟着走。

### 6. 历史 Champions 赛季用 battle rows 的 column_position 排名

Type: tradeoff

Context:
Champions `/api` 的 `seasons` 含 `Current` / `M6` / `M5` / `M4`，但每个 Pokémon 的 `summary.battleSummary` 只有 `Current`。选 M4 时按 `battleSummary[M4]` 取值得到空列表，选择器退回字母序（阿柏怪 / 阿柏蛇）。M4 的使用率名次在 `/api/battle/Doubles/{name}?season=M4` 的 `column_position`（与 Current 索引里的 `position` 同义）；没有按赛季的批量排名接口。归档季的 CSV 不再单独托管。

Decision:
Current 仍走索引 `battleSummary`。索引该赛季没有名次时，对索引里的条目按 `battleName` 去重，分批（8）请求已有的 battle rows 端点，用首行 `column_position` 排序。结果仍写入 12 小时排名缓存。不在本票做 Worker 聚合（归 `a6d04964`）。

Reason:
规则下拉已经列出 M4，产品要求换规则立刻改宝可梦排序。客户端 fan-out 是现有 CORS 端点上最小的补法。

Follow-up: Worker 若缓存赛季排名快照，可去掉首次约 200 次 HTTP。

### 7. 对话使用率 chrome 用摘要行 disclosure，不用弹层

Type: interpretation

Context:
评审说三行太高。产品要求默认一行看当前来源 + 规则，按需展开才能改、看相对时间、立即拉取、应用更新。设置页保持展开。

Decision:
对话用与 Track 面板相同的 `aria-expanded` 摘要按钮：一行显示来源（ink）+ 规则（muted）+ 可选「有更新」提示 + chevron。展开后在下方级联露出两个下拉和 Fetch status。关闭对话时用 `key` 重置为收起。不用 `<dialog>` / 绿点 / 独立提示条。

Reason:
最小增量，沿用已有 HUD 展开控件，不另装 Collapsible。

Follow-up: None

### 8. 缓存排名 id 在展示时再挂上 Mega

Type: bugfix

Context:
12 小时缓存只存来源给出的 `pokemonIds`。Champions 条目是基础形态 id（喷火龙 6），Mega 身份只存在本地图鉴。有缓存时选择器直接按缓存 id 排序，Mega 被丢到列表末尾，看起来像从使用率列表里消失。无缓存的第一次拉取会把 Mega 插在基础形态后面，所以是「有时」缺失。Mega 优先开关只是把已在列表里的 Mega 提前，不负责把它们挂回对应种族。

Decision:
把「按使用率 id 排序并在该种族后挂上 Mega」收成 `orderPokemonOptionsByUsageIds`，缓存路径和网络路径共用。缓存仍只存来源 id，不把 Mega 写进 12h 快照。

Reason:
Mega 跟种族走是已有选择器行为；缓存不该改变合并规则。一个函数避免缓存 / 实时两条路再次分叉。

Follow-up: None
