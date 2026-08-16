# Implementation Trace: Picker ranking load

Date: 2026-08-16
Source: picker ranking-load prototype (discarded after landing)
Language: zh-Hans

## Entries

### 1. 排序查询用 Champions 使用率，不是 PokeAPI

Type: interpretation

Context:
用户说「显式查询 pokeapi」。产品里改名单顺序的网络请求是 Champions 使用率；PokeAPI 资源已在本地生成。

Decision:
点开选择器时查询的是既有 `rankPokemonOptionsByChampionsUsage`。PokeAPI 精灵图仍按现有 hotlink，不纳入这次加载闸门。

Reason:
原型验证的是「挡住列表 / 可强制不加载 / 迟到结果不改序」，数据源与当前 ranking 函数一致。

Follow-up:
None.

### 2. 强制不加载只取消本轮应用，不拆 Champions 缓存

Type: decision

Context:
`listChampionsPokemonUsageIds` 在模块里缓存 Promise，跳过无法真正 abort 网络。

Decision:
跳过时递增 generation，迟到的 `queryOk` 被 reducer 忽略。缓存保留，下次打开若 query 已是 `cancelled` 会重新走 inFlight；若缓存已有数据，列表仍会先挡一帧再显示。

Reason:
与原型「取消查询，迟到完成无效」一致；清掉全局缓存会让另一个选择器也丢结果。

Follow-up:
None.

### 3. 状态机放在单个选择器里

Type: tradeoff

Context:
进攻/防守两个选择器都要同一套打开-等待-跳过。提到页面级可以让 landing → explorer 换挂载时保留 ready。

Decision:
每个 `BattlePokemonPicker` 自己持有 ranking-load。页面不再在载入时预排序。

Reason:
原型是单选择器；换页重挂只是再查一次，Champions Promise 仍热。少一层 lifting。

Follow-up:
None.

### 4. 按 ranked id 第一次出现排序

Type: decision

Context:
Champions 排序会把 Mega 接到基础形态后面，同一 id 可能在 id 列表里出现多次。用最后一次下标排序会把重复的 Mega id 排到基础形态之后。

Decision:
`orderOptionsByIds` 按第一次出现保留，再把未出现的选项接到后面。

Reason:
与 `rankPokemonOptionsByChampionsUsage` 的展开顺序一致。

Follow-up:
None.

### 5. 超时与网络错误走 queryFail

Type: decision

Context:
`rankPokemonOptionsByChampionsUsage` 曾把 timeout/reject 收成 `[]`，选择器的 `.catch(queryFail)` 是死代码。空使用率仍是合法成功。

Decision:
ranking 函数不再吞掉失败。空数组仍返回默认顺序并 `queryOk`；timeout/reject 抛出，选择器 dispatch `queryFail`。

Reason:
失败下次打开应直接默认顺序，不能把「没排到」记成已完成的使用率顺序。

Follow-up:
None.

### 6. 选择器 ranking 不等待默认招式超时

Type: deviation

Context:
`rankPokemonOptionsByChampionsUsage` / `rankMoveOptionsByChampionsUsage` 共用默认招式 5s `withTimeout`。超时走 `queryFail`，闸门结束并展开默认顺序；迟到的使用率被忽略，且 `failed` 下次打开仍是默认。用户看到的是「加载完成还是默认顺序」。选择器已有「显示默认顺序」。

Decision:
这两个 ranking 函数不再套 `withTimeout`，一直等到 Champions 返回或真正失败。`resolveDefaultMovePick` 等默认挑选路径仍用 5s。

Reason:
跳过是用户主动放弃；自动超时把慢查询伪装成加载成功。

Follow-up:
None.
