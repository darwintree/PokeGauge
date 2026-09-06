# Implementation Trace: 动效局部对照原型

Date: 2026-09-06
Source: 用户要求沿用之前的 HTML 局部对照方式说明动效优化。
Language: 中文

## Entries

### 1. 对照参数与交付方式

Type: unresolved-implementation-decision

Context:
讨论给出了时长范围，没有选定具体提案参数；用户指定沿用局部对照方式。

Decision:
独立 HTML 使用相同内容左右对照，沿用静态服务 /motion.html。提案采用进入结果等待120ms、入场200ms，普通说明悬停250ms、淡入100ms，弹窗160ms/98%，按钮按下60ms/松开140ms。提供同步重播、三倍慢速重播、减少动态效果演示。源码参数注明来源；减少动态效果开关明确是原型对两侧强制覆盖，不声称当前生产已完整适配。

Reason:
具体参数和可重播样本方便用户判断；不引入新布局或修改生产交互。普通说明与即时伤害读数分开讨论。

Follow-up:
等待用户评估动效方向。

### 2. 统一生产动效

Type: unresolved-implementation-decision

Context:
用户批准原型方案。原型未规定共享 Tooltip 分组行为、其他按钮的适配范围和第三方组件的减少动态效果兜底。

Decision:
使用现有 Base UI Tooltip Provider 的 250ms 悬停意图等待，保留其分组快速切换和键盘即时聚焦；伤害图 Trigger 显式 delay=0。普通 Button、HUD Toggle、TrackOption 和形态按钮按下60ms/释放140ms，保留现有触发与状态行为。以 prefers-reduced-motion 全局关闭非必要动画和过渡，另对交互位移提供局部复位，避免破坏浮层定位变换。

Reason:
复用组件库的交互语义，防止手工定时器影响焦点或悬停切换。全局兜底覆盖已引入的第三方组件，同时保留定位所需的 transform。

Follow-up:
检查实页动效参数、伤害提示、键盘焦点及减少动态效果。
