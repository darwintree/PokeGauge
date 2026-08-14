# Implementation Trace: Mobile caption result rows

Date: 2026-08-14
Source: 用户确认 caption 原型并要求落地；百分比放到对应 damage box 下方；不要点击展开完整条件卡
Language: zh-Hans

## Entries

### 1. Range 展开箭头留在 caption 芯片旁

Type: unresolved-implementation-decision

Context:
用户不要点击展开完整条件卡，但没说 Range 母行的轴展开（0A~EX → 子行）在移动端怎么进。生产芯片上的展开是现有结果表行为。

Decision:
caption 芯片旁保留小号展开按钮，沿用现有 `onToggle` / `aria-label`。不把整张条件卡重新挂到 tap 上。

Reason:
展开 Range 和打开条件卡是两件事。拿掉前者会让移动端无法看区间端点子行。

Follow-up:
None.

### 2. 子行仍用 ChildScenarioDiff，不复用招式 caption

Type: unresolved-implementation-decision

Context:
caption 是「招式 + 攻防芯片」。展开后的子行在桌面只显示变化轴。源没说移动端子行要不要再画一行招式名。

Decision:
`diff` 行继续只渲染 `ChildScenarioDiff`，caption 只给母行。

Reason:
子行已经用母行上下文；再画招式名会让「只变了这一轴」读不出来，也会让子行测试里不该出现的招式名进 DOM。

Follow-up:
None.

### 3. caption 芯片不做 tooltip

Type: tradeoff

Context:
Stat Value Display spec 要求结果行芯片悬停/聚焦揭示实际值。caption 芯片高 14px，套生产 `StatValueChip` 会回到 24px 最小高度，破坏已确认的密度。

Decision:
移动端 caption 芯片是静态色标，不是 tooltip 按钮。桌面条件卡仍用完整芯片。

Reason:
用户已确认 caption 字号和间距。密度优先于在 14px 目标上复用 tooltip。实际值仍可通过「显示能力实数值」注在芯片上。

Follow-up:
None.
