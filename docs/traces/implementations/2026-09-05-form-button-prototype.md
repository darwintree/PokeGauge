# Implementation Trace: 形态按钮原型

Date: 2026-09-05
Source: 用户要求用 prototype 技能比较几种形态按钮方案
Language: 中文

## Entries

### 1. 对比范围

Type: unresolved-implementation-decision

Context:
用户未限定方案数量和具体外形。现有按钮是否已发布未知，按现有用户依赖其选择行为处理。

Decision:
在原页面通过开发模式 prototype=forms 和 variant=A/B/C 参数，对比角落文字按钮、底部操作条、侧边页签。保留现有选择器行为；原型切换不写入持久存储。此为开发内部原型，不增加产品发布片段。

Reason:
在实际卡片密度中比较结构差异，避免独立大卡片掩盖窄屏占位问题。

Follow-up:
等待用户选择方向；选定后按 prototype 技能将原型保存到临时分支并重写正式实现。

### 2. 改为 FORM 标签试样

Type: interpretation

Context:
用户否定先前三种布局和生成图标，要求试用代码中已有的 FORM 标签。

Decision:
复用道具选择器黑底白字、5px 圆角和 9px 粗体字的视觉，右上角入口使用现有 Button，并保留本地化无障碍名称。点击区域高度为 24px。删除未获采用的 A/B/C 原型布局与切换逻辑。

Reason:
用户明确指定视觉参考；继续使用开发模式试样，尚未把试用等同于正式采用。

Follow-up:
等待用户查看 FORM 试样。

### 3. 强化可点击感

Type: unresolved-implementation-decision

Context:
用户认为黑底 FORM 缺乏可点击感，并授权自由调整，以效果优先。

Decision:
试样改为白底深色描边、下拉箭头和硬底边的紧凑按键。悬停变黄并轻微抬起，按下时底边收起；键盘焦点显示外轮廓。

Reason:
静态黑底块容易与身份标签混淆，独立按键轮廓与下拉箭头可在悬停前表达交互。

Follow-up:
等待用户评估原型。

### 4. 首页入口位置

Type: unresolved-implementation-decision

Context:
用户认可按键视觉，并要求首页也改；首页为水平身份行，右侧已有属性标签。

Decision:
首页复用同款 FORM 按键，放在身份行右上边缘，向上偏移 12px，避免遮挡属性。开发原型参数仍控制首页与对阵两处试样。

Reason:
在手机与桌面保留完整名称和属性，同时提供一致的形态选择入口。

Follow-up:
桌面与 390px 手机截图已检查，类型检查通过。正式落地与原型归档待后续执行。

### 5. 正式采用

Type: interpretation

Context:
用户确认首页与 Setup 一致的方案，并要求正式实现。

Decision:
首页和 Setup 共用 FORM 下拉按键与身份卡 CSS，保留既有选择器行为。原型保存到 codex/prototype-home-form（c95b1531a5370929b400de66e5217f4f3a568d15），正式源码移除全部本次原型开关。

Reason:
已验证视觉无需平行组件或额外运行时配置。

Follow-up:
四语言 patch 发布说明已添加；构建、相关测试通过。
