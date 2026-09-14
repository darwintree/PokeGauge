# Implementation Trace: Matchup 标题栏

Date: 2026-09-15
Source: 用户要求复用 Track 标题样式，并在标题右侧添加攻防交换图标。
Language: 中文

## Entries

### 1. 攻防交换复用宝可梦选择行为

Type: interpretation

Context:
用户未指定交换时各 Track 的配置迁移规则。

Decision:
交换双方宝可梦身份，调用现有的攻方与守方选择回调；招式分类和 Track 配置依照现有更换宝可梦规则处理。

Reason:
保持现有选择行为，为标题栏提供直接的交换操作，不引入跨攻防能力配置转换规则。现有界面稳定性未知，按已有消费者依赖其选择行为处理并保留该行为。

Follow-up:
None.

### 2. 移动端交换按钮文案

Type: unresolved-implementation-decision

Context:
用户要求区分对战和招式图标，并确认各语言的移动端按钮长度；未指定替代图标和短文案。

Decision:
对战使用 ShieldHalf，招式继续使用 Swords。按钮可见文案为「交换攻防」「交換攻防」「Swap sides」「攻守交代」，保留完整的无障碍标签和提示。

Reason:
盾牌与双剑区别明确；短标签减少英语和日语在窄屏上的宽度压力，完整标签仍说明交换对象。

Follow-up:
None.

### 3. 精灵球标题图标

Type: unresolved-implementation-decision

Context:
用户提出自行绘制精灵球 SVG，未指定颜色或细节。

Decision:
使用单色外圆、中央横线和按钮圆环，保持现有 14px 图标尺寸、1.75 描边和 muted 前景色，替换第 2 条选择的盾牌。

Reason:
小尺寸轮廓清晰，与招式双剑区分，同时沿用标题栏视觉层级。

Follow-up:
None.
