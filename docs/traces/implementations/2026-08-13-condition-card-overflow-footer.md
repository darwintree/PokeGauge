# Implementation Trace: Condition-card overflow footer

Date: 2026-08-13
Source: 用户选定原型 footer 变体（能力阶级 +N 与折叠未生效 +N 混淆）
Language: 中文

## Entries

### 1. 折叠未生效来源改为卡底文案行，不再用虚线 +N

Type: decision

Context:
伤害条件卡把生效阶级画成实心 `+2` / `-1`，把未生效/不支持/中性来源折叠成防御行右侧的虚线 `+N`。两个标记共用同一套字形和同一列。原型四变体里用户选定 footer。

Decision:
`AdditionalConditionDetails` 离开防御身份行，落到条件卡底部。摘要用已有 `damage.conditions.other`（「其他条件（N）」），点开就地展开列表；不再画 `+N` 芯片，也不再弹出绝对定位浮层。折叠集合与计数规则不变。

Reason:
Footer 把「计数」从阶级 token 的视觉家族里拆走，同时保留结果面「非生效来源默认折叠」的信息。就地展开比浮层更不容易盖住下一行。

Follow-up:
None.
