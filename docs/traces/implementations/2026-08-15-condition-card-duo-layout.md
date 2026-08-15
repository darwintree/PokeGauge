# Implementation Trace: Condition-card duo layout

Date: 2026-08-15
Source: 用户评审 5 变体原型后选定 duo(「我们按照duo做变更吧」)
Language: 中文

## Entries

### 1. 「其他条件」折叠:无状态 `<details>` + flex 排序,而非原型的 useState button

Type: decision

Context:
原型 duo 用 `useState` + button 实现展开。落地时发现结果行测试链(`ability-track.test.ts` / `screen-track.test.ts`)用 `renderToStaticMarkup` 直渲 `DamageResultRow`,并断言折叠内容(「Inactive」「Run Away」等)出现在静态 markup 中。`useState` 初值 false 会让这些断言失败;且结果行整链(行、芯片、tooltip)本来没有任何 hook。

Decision:
`ConditionsStrip` 沿用旧 footer 的 `<details>`。details 自身 `flex flex-wrap`,`summary` 必须作首子元素,故用 `order-2 ml-auto` 右锚、战场 chips 包一层 `order-1` span 排左,不进入 summary 点击区;展开列表 `order-3 w-full`。chevron 旋转用 `group-open:rotate-180`。仅战场条件、无其他条件时退化为纯 div 行,不渲染 details。

Reason:
静态渲染链不该为一次折叠交互引入 hook;details 原生 SSR 输出全部子节点,测试与无 JS 环境都可见。

### 2. 左侧 stage rail 移除,阶级右锚进栏首

Type: decision

Context:
2026-08-14 的 rail(1.5rem 阶级列)是为单栏身份行设计的。duo 把 body 切成攻/防两栏后,rail 会成为第三列,半栏只剩约 6.5rem,区间数值对放不下。

Decision:
删除 `StageRailCell` 与 rail 列。非 0 阶级以 10px extra-bold 数字右锚在各栏行首(标签 / 道具 icon / 特性 之后);0 不渲染,原 sr-only 的 0 值一并去掉。本 trace 取代 `2026-08-14-condition-card-stat-stage-rail.md` 的 rail 结构(阶级仍是每侧首要数值信号,只是位置随双栏调整)。

Reason:
双栏内行首已有「攻/防」标签作身份,阶级贴着所属单位比独立列更直接;宽度也不够三列。

### 3. 特性 / 战场 chip 加 `max-w` + truncate

Type: decision

Context:
栏半宽约 118px、底条整卡约 236px。中日文特性名 4-6 字常见,原型只用 `flex-wrap` 时极端满载会把行顶成两行以上。

Decision:
`TextTokenChip` 统一 `max-w-[5rem] truncate`,栏内 chip 加 `title` 兜底全名(底条战场 chip 同源)。超长就截断,不换行。

Reason:
原型实测换行主要发生在 chip 而非区间数值;截断 + tooltip 比允许换行的高度代价小。上限 5rem 是经验值,覆盖常见 4 字中文名。

### 4. 行为 parity:active / other 的过滤差异原样保留

Type: decision

Context:
旧实现里 `ActiveTokens`(行内激活 token)只滤 `none`/`0`/隐藏特性,不滤 `itemIsHiddenNeutral`;`AdditionalConditionDetails`(其他条件)两者都滤。两者不一致但都是现状行为。

Decision:
`sideTokens` / `activeTokens` 沿用前者过滤,`additionalEntries` 沿用后者。本轮是布局重设计,不顺手改过滤语义。

Reason:
改过滤是行为变更,应独立评估;重设计 diff 里夹带会让回归定位变难。

### 5. compact 数值 chip 与 range chevron 的具体数值

Type: decision

Context:
用户要求「stat value label 的字体和外边缘间距适当调整」,只给了方向。range 展开按钮原大小 24px,在收紧后的 chip 旁比例失调。

Decision:
`.stat-value-chip--compact`:min-height 24→18px、横向 padding 6→4px、边框 2→1.5px、圆角 9→6px。`StatValueChipPair` 的展开按钮在 compact 下 24→18px、图标 14→12px。compact 消费者只有条件卡与统计轨道摘要两处,非 compact 尺寸不变。

Reason:
18px 对齐条件卡行高(`h-4` 行首 + 4px 间距节奏),chevron 18px 与 chip 等高。比旧值小约 25%,区间双 chip + chevron 在半栏 118px 内单行放下。

## Verification

- `pnpm tsc --noEmit` 干净;`pnpm test` 577/577(含两条断言折叠内容的 track 测试)。
- 原型页 `?prototype=condition-card` 的 current 变体现渲染落地实现:6 场景实测高度 79 / 79 / 98 / 79 / 98 / 98px,极限满载(双道具+双特性+区间+天气场地墙+双阶级+CT)98px 无截断;「其他条件」折叠/展开、chevron 旋转浏览器实测通过。
