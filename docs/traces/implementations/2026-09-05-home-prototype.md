# Implementation Trace: 首页布局原型

Date: 2026-09-05
Source: 用户要求用 prototype 探索首页整体调整
Language: 中文

## Entries

### 1. 三种布局与内存状态

Type: unresolved-implementation-decision

Context:
用户认可 FORM 按键，希望首页整体一起调整，并要求可比较原型；尚未选定首页布局。

Decision:
在原路由 /?prototype=home&variant=A/B/C 中，使用已加载宝可梦目录，提供 A 独立对阵卡、B 横向对战台、C 分步选择。原型选人状态只存在组件内存，切换布局保留，刷新清空。示例、清空与已选状态由底部控制条提供。

Reason:
对比同时呈现双方、集中操作台、逐步聚焦的差异；保留真实选择器验证 FORM 和长名称占位。

Follow-up:
用户选择方向后重写正式实现，并按 prototype 技能归档原型。

### 2. 明确开始动作

Type: unresolved-implementation-decision

Context:
当前首页选齐双方自动进入计算，无法停留检查已选布局；分步方案也需要明确结束动作。

Decision:
试样选齐双方后启用开始计算，点击仅显示就绪提示，不调用真实计算页跳转。此为待评估原型行为，未变更产品默认行为。仅开发模式可用，不创建产品 changeset。

Reason:
让用户可反复查看空白、单方、双方已选状态和不同 FORM。

Follow-up:
正式实现前决定是否保留手动开始。已通过类型与 lint 检查，并检查手机三种布局及桌面 A；FORM 打开行为已验证。

### 3. 收回原始布局，仅微调

Type: interpretation

Context:
用户明确要求不大改，基于原始方案小幅修改。

Decision:
移除 A/B/C 布局和切换代码，直接复用 MatchupLanding。保留原始标题、总外框、桌面并排／手机堆叠结构。只调整选择行至 80px、内外间距，并将 FORM 放入行内右上角。原型仍为内存选人，选齐后停留供视觉检查；没有新增产品流程。

Reason:
用最小布局改动解决 FORM 悬浮于边缘和信息拥挤的问题。

Follow-up:
已查看桌面和 390px 手机样例截图，无名称或属性遮挡，类型检查通过；等待用户评估。

### 4. 复用 Setup 身份卡

Type: unresolved-implementation-decision

Context:
用户建议模仿 workspace 参数页的 Setup。

Decision:
首页原型直接启用现有 BattlePokemonPicker 的 compactSide，复用精灵、ATK/DEF、名称、属性布局。两侧保持并排，使用共享外框与中间分隔线；首页最大宽度收至 480px，保留原标题与居中位置。

Reason:
复用真实 Setup 渲染使视觉和后续页面一致，不重新设计信息结构。

Follow-up:
桌面和手机已视觉检查，类型检查通过；仍为开发原型。

### 5. 正式落地与原型保存

Type: interpretation

Context:
用户确认 Setup 风格首页并要求实现、simplify 后创建 PR。

Decision:
正式首页使用共享身份卡样式和 compactSide；保留选齐自动进入 workspace 与继续上次对阵的原流程。FORM 用现有 Button 组合下拉箭头，移除开发原型组件、入口、脚本和旧圆形按钮样式。

Reason:
只落地已经确认的视觉方案，复用现有选择与状态逻辑。simplify 将样式集中到身份卡 CSS，删除临时分支条件。

Follow-up:
原型主源保存于 codex/prototype-home-form，提交 c95b1531a5370929b400de66e5217f4f3a568d15。pnpm build、11 项相关测试和定向 lint 通过；正式首页与 FORM 交互已浏览器验证。
