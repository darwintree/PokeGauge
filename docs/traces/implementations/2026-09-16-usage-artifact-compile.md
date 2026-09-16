# Implementation Trace: 部署期编译使用率产物

Date: 2026-09-16
Source: 用户请求（"使用率明细层缺身份维度导致「招式未加载」"实现），`.issues/20260916_open_使用率明细层缺身份维度导致-招式未加载.md`
Language: zh-hans

## Entries

### 1. 产物必须是逐行无损的，不能预先裁剪 top-N

Type: unresolved-implementation-decision

Context:

用户已定下产物"同时包含排名与逐宝可梦明细"，但没有说明每个分类保留多少行。直观做法是按客户端实际读取的窗口裁剪（招式 10、道具 10、特性 3、性格 5），产物会更小。

Decision:

产物保留上游给出的**全部**行，只加一个 64 行的防御性上限（`USAGE_ARTIFACT_ROW_GUARD`），客户端窗口裁剪仍留在运行时。

Reason:

运行时并不是"先取前 N 行再过滤"，而是顺序敏感的：`recommendMoves` 与 `recommendHeldItems` 都是先排序、去重、**过滤掉本地解析不出 id 的行**，之后才 `slice(0, 10)`（`src/lib/scenario/selection/recommendations.ts:33`、`:102`）。若在编译期就裁到 10 行，被裁掉的行本来可能因为前面的行未解析而进入窗口，行为会发生变化。`recommendMoveCategory` 还会扫描全部性格行来决定物攻/特攻方向（`:76-86`）。因为第 2 条把编译期放在"名前 id 解析"之后，产物行数无法凭空假设。实测 Champions 每分类固定 10 行、性格 10 行，故上限不会生效。

Follow-up: None

### 2. 编译期保留名字，运行期沿用既有 id 解析

Type: unresolved-implementation-decision

Context:

用户要求产物以数字 `BattlePokemonId` 为键（"2. 同意"），但未说明招式/特性/道具名是否也在编译期解析成 id。

Decision:

只有**宝可梦**在编译期 join 成数字 id；招式、特性、道具、性格仍以**名字**存储，运行时用既有的 `getMoveIdByJoinName` 等解析。

Reason:

宝可梦 join 是缺陷根源（上游改名会让选择器静默变空），把它固定到构建期可以在上游漂移时**构建失败**而不是线上静默失败。招式/特性/道具不同：它们的解析表来自本仓库生成的资源（`src/lib/resources/generated/`），与产物同属一次部署，不存在跨来源漂移。在编译期再解析一遍会把道具的 `null`（`nothing` 与未映射名）语义复制到产物里，而运行时的道具逻辑恰恰依赖保留这些 null 行不做回填（`recommendations.ts:130`）。保留名字使产物与现有转发模式共用同一条解析路径，两种模式不可能在形状上分叉。

Follow-up: None

### 3. 在 `fetchChampionsBattleData` 处合成 battle rows，而非改造四个读取器

Type: unresolved-implementation-decision

Context:

四个明细读取器（招式/特性/道具/性格）各自从 `ChampionsBattleApi` 的行里筛 `category`。把产物接进去有两条路：改每个读取器，或在上游数据边界处还原成 `ChampionsBattleApi`。

Decision:

新增 `battleDataFromArtifact`，把产物桶反序列化成 `ChampionsBattleRow[]`，接到 `fetchChampionsSourceBattleData` 的入口，四个读取器一行不改。

Reason:

产物桶与 battle rows 是同一信息的两种编码，转换是一对一的（rank 由数组下标还原——已验证上游每分类 rank 为密集 1..n 且文件内有序）。在此处转换后，"产物模式"和"转发模式"共用下游全部逻辑，包括 id 解析、`category` 过滤与排序，两者不可能出现行为差异。反过来逐个改造读取器会让两条路径各自演化，正是这次要消除的问题类别。

Follow-up: None

### 4. 规则列表改由 manifest 提供，冷启动也能命中产物

Type: unresolved-implementation-decision

Context:

用户选择 `Current` 作为编译规则（"1. 不用快照，我们用current就行"），并要求显式声明已编译的 `(source, rule)` 对而非"最近三个"启发式。但规则列表原本来自上游 index（2.92 MB），且冷启动时 `usageRuleId` 为 `null`。

Decision:

产物目录额外产出 `manifest.json`（规则列表 + `defaultId` + `compiledRules`）。`listChampionsUsageRules()` 优先读 manifest；`compiledRuleId()` 在 `usageRuleId` 为空时用 manifest 的 `defaultId` 兜底。

Reason:

若规则列表仍取自上游 index，则"命中产物"这一优化的前提（不下载 2.92 MB）就无法成立，而且冷启动必然先解析 upstream 默认赛季、再回落到转发模式，等于产物在最常见的首次加载路径上失效。manifest 同时承载"哪些规则已编译"这一显式声明，满足用户否掉启发式的约束。

Follow-up: None

### 5. 编译不进 `pnpm build`，但属于部署构建命令

Type: unresolved-implementation-decision

Context:

用户要求"每天定时重新编译"，并同意新增定时部署工作流。未说明编译在构建中的位置。

Decision:

新增独立的 `pnpm usage:compile`，并组合出 `build:deploy = pnpm build && pnpm usage:compile` 作为 Workers Builds 的 **build command**；`pnpm build` 自身不联网。

Reason:

`pnpm build` 目前在 CI 中无需网络（install → lint → test → build）。把联网抓取塞进 build 会让本地构建与 PR 构建依赖上游可用性。放在 `build` 之后而非之前，是因为 `vite build` 会清空 `dist/`，先编译会被删除。Workers Builds 的 build command 对生产与预览构建都会执行，而 deploy command 才会区分生产/预览，因此把编译放在 build command 可让预览构建也带上产物。

Follow-up: None

### 6. 定时刷新改为触发 Workers Builds，而非在 GitHub Actions 里 `wrangler deploy`

Type: unresolved-implementation-decision

Context:

用户已同意"新增定时部署工作流"并授权配置 secret，但没有指定部署由谁执行。实现时通过 `gh api .../check-runs` 发现仓库**已经接入 Cloudflare Workers Builds**（配置在 dashboard，仓库内无任何配置）：push 到 `main` 会自动生产部署，PR 分支会出预览部署。

Decision:

删除工作流中的 `wrangler deploy` 与 `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` 依赖，改为定时 POST Cloudflare **Deploy Hook**；部署路径唯一，编译步骤由 Workers Builds 的 build command 承担。

Reason:

两条路径同时 `wrangler deploy` 会互相竞争，且产物是否包含编译步骤取决于哪一条先跑完，属于不稳定状态。Deploy Hook 的 URL 自身即凭据（官方文档明确无需 `Authorization` 头），因此不必把账户级 API token 放进 GitHub secret。实测该预览部署的 `/usage/champions/manifest.json` 返回 `content-type: text/html`（SPA 回落），证实 Workers Builds 的执行路径不含 `usage:compile`——即编译位置必须由 build command 决定；客户端对非 JSON 响应返回 `null`，故未配置时安全回落转发模式。

Follow-up: build command 与 Deploy Hook 需在 dashboard 配置，无法由仓库内文件保证；已写入 README。

### 7. 产物缓存用 must-revalidate 而非长缓存

Type: unresolved-implementation-decision

Context:

产物是静态资源，CDN 默认会缓存。但排名每日变化，长缓存会把用户钉在旧快照上。

Decision:

`public/_headers` 对 `/usage/*` 设置 `Cache-Control: public, max-age=0, must-revalidate`。

Reason:

`no-cache` 语义允许存储但要求复用前校验，因此常态是廉价的 304，而不是每天重新下载整个产物；同时避免用户跨天看到过期排名。已确认 Workers 静态资源支持 `_headers`（`developers.cloudflare.com/workers/static-assets/headers/`）。

Follow-up: None
