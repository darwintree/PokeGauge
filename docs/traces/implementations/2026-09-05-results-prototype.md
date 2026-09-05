# Implementation Trace: 结果区 mock 原型

Date: 2026-09-05
Source: 用户要求使用 prototype 展示桌面及移动端方案，mock 即可。
Language: 中文

## Entries

### 1. 三种查阅结构
Type: unresolved-implementation-decision

Context: 用户尚未决定结果查阅的结构，需要可交互比较。
Decision: A 筛选长列表、B 单招式聚焦、C 固定招式/天气/进攻投入后的道具×防守投入矩阵。共用 192 条合成数据，最多选择 4 条跨筛选比较。
Reason: 三种结构分别检验全局浏览、分组导航、双维比较；矩阵中每格唯一情景，避免把多个结果不明示地合并。保留既有 HUD。矩阵和简化 mock 行属于待验证原型，不修改正式结果的信息契约。
Follow-up: 用户体验后选择或组合方案。

### 2. 原型隔离
Type: tradeoff

Context: 现有首页会加载资源和真实计算；用户只要求 mock。
Decision: 在现有 / 路由以 ?prototype=results&variant=A|B|C 替换内容，保留 AppHeader，用静态配置侧栏模拟工作区密度。仅开发环境动态加载；不操作真实配置、不持久化 mock 状态。开发原型不作为发布功能写 changeset。
Reason: 一条 pnpm prototype:results 命令即可预览，不依赖资源加载；正式入口保持现状。原型尚未获选，不提前合入产品或提交为定稿。选择方案后再按 prototype 技能捕获到临时分支。
Follow-up: 确认设计后捕获原型并正式实现。

### 3. Summary 分组的视觉探索
Type: unresolved-implementation-decision

Context: 用户选择 B 的分组查阅方向，明确去掉结果筛选，点击 summary 项切换分组，默认按招式；尚未规定视觉和切换细节。
Decision: 用 A 双层页签、B 侧边目录、C 紧凑组切换器替换第一轮原型。摘要包含 mock 中全部五个维度，单一维度分组，切换维度回到第一组；不叠加条件。切换视觉方案保留分组和比较项。原型未定稿，直接替换实验代码。
Reason: 保持交互语义一致来比较三种导航占用空间和识别方式。手机 A/B 横向组导航，C 通过底部选择面板定位；总量恒为 192，不把当前组数量表示成筛选数量。
Follow-up: 用户选择视觉方向；正式 summary 的维度范围与复杂 Track 语义待正式实现时确认。

### 4. 正式实现边界及原型捕获
Type: interpretation

Context: 用户选择 A，并要求不做比较、重复点击当前 summary 项取消分组。正式 summary 有四项，mock 额外的天气项没有对应正式摘要。
Decision: 正式启用现有四项：招式、进攻能力值、攻击方道具、防守能力值。分组仅为内存中的查阅状态，不写入 Setup 或分享链接。选中组消失后回退到第一组。按道具分组时读取完整 provenance，一条计算等价合并结果可出现在多个对应组中并显示解释；总量仍为唯一结果数。先分组父行再展开 Range，避免子行脱离父行。
Reason: 遵循现有摘要范围和计算契约，不引入新的计算维度或丢失来源。保留真实每行条件、伤害图、KO、图例与 Range 控件。
Follow-up: None。

原型 primary source 已捕获到 `codex/prototype-results-grouping`，commit `0be20e0f8af985c86863191893fbabc5f2156be4`。该分支保留三种视觉及运行命令；本工作区移除原型入口和比较代码。用户选定 A 的 summary + 组页签结构，后续正式改动以本次请求为准。

### 5. 分组样式审查与 Track 身份
Type: unresolved-implementation-decision

Context: 用户要求全面检查样式，并特别指出切换不同 Track 时分组行可优化。实际检查发现长摘要在手机被截断、Range 防守文案重复、总数错位、页签底部边框与面板不连续；分组项仅文本，缺乏 Track 识别。
Decision: 摘要采用直接的维度+计数文案和固定对齐，保留窄屏横向滚动；shadcn Tabs 扩展 folder 变体，2px 边框与面板相接，焦点环内收。招式组复用模板属性徽标，道具组复用现有图标，能力值组复用 Stat Value 标签与端点颜色并补实数值。组计数用分隔线与身份分开，外框选中态统一。
Reason: 用现有领域视觉提供识别线索，同时避免在 TabsTrigger 中嵌套按钮；招式组代表整个快照，使用模板属性而非任意首条结果的动态属性。
Follow-up: None。

### 6. 分组入口覆盖所有多选 Track
Type: interpretation

Context: 用户明确要求单选 Track 不显示分组入口，并指出其他 Track 入口缺失。
Decision: 覆盖全部 12 个 Track（招式、双方能力值/阶级/特性/道具、屏障、场地、天气），仅当前分支数 > 1 的 Track 显示分组按钮。Range 按领域定义是一条分支，因此不显示分组入口；已有结果行仍可展开。当前分组维度不可用时显示全部结果，保留用户的内存分组偏好以便重新加入选项后恢复。屏障 provenance 的 reflect/light-screen 统一映射回 walls 选择，避免同一选择拆成多组。原第 4 条的四入口范围由本次明确请求扩展。
Reason: 分组只覆盖实际可比较的维度，不出现单组导航；适配各 Track 的既有来源语义。
Follow-up: None。

### 7. 分组先于结果合并
Type: unresolved-implementation-decision

Context: 用户指出分组后跨组的合并项应重新拆开；实现需要确定拆分后的计数、来源与计算复用方式。之前第 4 条的多组共享结果策略尚未发布。
Decision: 用所选 Track 的原始分支作为合并边界，在 pipeline 中分别累积组内 provenance、支持状态和命中语义。总条数为全部组拆分后的行数；组内仍合并其他维度的等价情景。以计算身份复用本轮伤害和概率结果。取消分组回到原来的合并规则，默认 pipeline 调用不变。移除旧的跨组共享结果说明。
Reason: 合并后的独立 provenance 集合已丢失各 Track 之间的组合关系，不能简单复制行或裁剪单个来源来正确还原。招式快照本身已包含在计算身份中，无须额外分区。
Follow-up: None。

### 8. 展开防守能力值时保持操作对象位置
Type: unresolved-implementation-decision

Context: 用户澄清两次点击的感受来自布局切换：防守方展开时双列变单列，攻击方占据原点击位置。需要提供足够编辑宽度同时保留操作对象。
Decision: 窄容器展开任一能力值 Track 后，将正在编辑的一方置于单列顶部；防守方标题的纵向位置和右侧箭头位置保持不变，另一方排在下面。收起后恢复攻击方左、防守方右。沿用现有展开状态，不另存布局状态。
Reason: 保留完整编辑宽度及两方内容，避免点击防守方后首先看到攻击方。无需新增弹窗或自动跳转。
Follow-up: None。
