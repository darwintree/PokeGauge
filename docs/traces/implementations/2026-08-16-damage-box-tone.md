# Implementation Trace: Damage box tone

Date: 2026-08-16
Source: 用户确认原型 Variant B（lit two-stop）；离散点五档 + Range 一条 envelope 借两端箱子色
Language: 中文

## Entries

### 1. Range 行额外带两端 16-roll 箱子百分比

Type: decision

Context:
Envelope 的 `minPercent`/`maxPercent` 只是低端最低卷和高端最高卷。两端各自的 max/min 卷不在原 `ScenarioResult` 上，而分档规则要用整只箱子。

Decision:
`result.high` 存在时写入 `rangeEndpoints: { low, high }`，各为该端点的 `minPercent`/`maxPercent`。UI 只拿它们算色；pill 几何仍用 envelope min/max。退化 Range（两端 stat 相同、无 high）不写该字段，走离散单色。

Reason:
把色算在 UI、把两端箱子数据留在 pipeline，阈值改了不用重算伤害。

Follow-up:
None.

### 2. 旧 cool/warm/lethal 类名保留，只加 safe / guaranteed

Type: decision

Context:
黄/橙/红已有 `--damage-cool-*` 等 token。新绿和暗红需要名字，且不能复用 HUD `signal-green`。

Decision:
新增 `--damage-safe-*`、`--damage-guaranteed-*` 及对应 class。Range B 用 `.damage-tone-envelope`：先 90deg 两端 end 色，再叠 paper/ink 的 180deg 光影。原型文件从主树拿掉，避免和第二套画法并存。

Reason:
生产 token 继续当权威；绿用偏黄的 chartreuse，和属性草色、特性绿点分开。

Follow-up:
None.
