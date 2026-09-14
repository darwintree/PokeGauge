# Implementation Trace: Stat Track 切换按钮

Date: 2026-09-15
Source: 用户要求在最新 origin/main 上重做：至少选中两个值时显示区间切换按钮，并更改图标。
Language: 简体中文

## Entries

### 1. 按钮图标表达当前模式

Type: unresolved-implementation-decision

Context:
新版在轨道标题使用独立切换按钮，用户未指定具体图标。按钮的可见文字表达当前模式，无障碍名称表达目标动作。

Decision:
沿用项目 lucide-react：选项模式用 Ellipsis，区间模式用 MoveHorizontal。图标与当前模式文字一致；区间摘要中的数据标记保持现有表达。

Reason:
在已有 HUD / shadcn 系统内区分离散集合和连续范围，不引入依赖或新的交互布局。当前代码已合并 origin/main，按稳定用户界面处理，仅修改明确要求的按钮显示条件和图标，不改变选择数据或计算语义。

Follow-up:
None.

### 2. 按用户反馈改为收拢与展开动作

Type: interpretation

Context:
用户认为双向箭头不合适，希望使用类似压缩、解压缩的图标。

Decision:
用 Minimize2 表示从选项收拢为区间，用 Maximize2 表示从区间展开为选项。替代第 1 条的图标选择；当前模式文字与目标动作的无障碍名称保持一致的原有含义。

Reason:
相向与背向箭头对应用户提出的压缩和解压缩，比双向水平箭头更明确地提示切换动作。

Follow-up:
None.

### 3. 用收拢和打散表达操作

Type: interpretation

Context:
用户认可 Minimize2，要求配字参考 design.md；返回选项应表达打散而不是放大。design.md 的 Voice and content 要求动作标签使用动词，上下文明确对象时允许省略名词。

Decision:
保留 Minimize2，以 Ungroup 的分离矩形替代 Maximize2。可见文字采用“收拢”和“打散”，无障碍名称同时包含动作与目标模式；四语言同步。替代前两条的图标和状态配字决定。

Reason:
轨道上下文已经说明操作对象，短动词适合紧凑标题；分离对象图标表达取消组合，不暗示放大或改变数值。

Follow-up:
None.

最终文案确认：用户随后将“收拢”确定为“聚合”，并确认反向操作使用“拆分”；对应图标保持 Minimize2 / Ungroup。
