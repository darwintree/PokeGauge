# Implementation Trace: Condition-card stat-stage rail

Date: 2026-08-14
Source: 用户选定安静版 Rail（能力阶级应是伤害条件卡上的首要数据）
Language: 中文

## Entries

### 1. 生效阶级从右侧 token 改到左侧数字列

Type: decision

Context:
伤害条件卡把生效阶级画成与道具、特性同一组的 9px token。原型比较了 token 簇、行首替换攻/防、卡头对、左侧列。用户认可 Prefix 与 Rail 的结构，但描边、反相填充、每张卡标 0 噪声过大。收成纯数字后暂定 Rail。

Decision:
条件卡 body 改为 `1.5rem` 阶级列 + 身份行。列内只排攻/防两个生效阶级，12px extra-bold tabular 数字，无框无填色；0 留空，发丝分隔。身份行仍保留「攻 / 防」标签。`ActiveTokens` 不再收录 stage track。未生效 / 不支持 / 中性来源仍在卡底 footer。Range 子行 `ChildScenarioDiff` 不画阶级列。

Reason:
Rail 让阶级可以跨行扫列，且不和 Stat Value chip、道具图标抢同一视觉家族。0 留空是为了让有阶级的行自己跳出来。暂定，空列在默认全 0 时仍占 1.5rem。

Follow-up:
若默认全 0 视图里空列仍嫌吵，再考虑仅在至少一侧非 0 时展开列，或改回 Prefix（0 行完全不加列）。
