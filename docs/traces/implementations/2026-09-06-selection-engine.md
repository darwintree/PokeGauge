# Implementation Trace: 统一选项选择引擎

Date: 2026-09-06
Source: 用户确认“我们直接调整吧”；docs/traces/discussion/2026-09-06-default-track-selections.md
Language: zh-hans

## Entries

### 1. 状态与 IO 的边界

Type: interpretation

Context:
用户要求统一维护选择规则，没有指定引擎接口。原规则分布于 catalog 异步加载、Hook 的多个 ref、Track 控件和领域转换函数。

Decision:
以 SelectionState 和判别联合 SelectionAction 为同步入口，集中处理选择、候选池、编辑保护、默认值更新与重置。catalog 负责获取使用率数据，调用 selection/recommendations 中的同步推荐函数；React 负责加载用户预设、持久化、草稿和事件适配。保留招式快照、实数预设和特性投影的专门领域函数，由入口组合。初始化只读取系统预设；用户预设通过 context 注入。

Reason:
统一决策入口可以直接测试事件序列，同时避免引入通用规则 DSL、异步调度器或新的存储格式。

Follow-up:
None.

### 2. 自动选择所有权与上下文更新

Type: interpretation

Context:
旧实现同时维护 touched refs 和上一份默认值，并在 effect 中同步 catalog；保存逻辑也依赖这些 refs。

Decision:
使用会话内 edited 集合表达选择所有权，替代 touched refs 和上一份默认值比较。恢复的选择全部标记为已编辑，重置按既有身份/招式类别边界释放所有权。React 在 context 改变时更新自身选择状态，使新 catalog 与对应选择一同提交；持久化只读取 selectionIsSettled 的结果。

Reason:
所有写入统一经过入口后，无须通过值相等推测是否编辑；原讨论实现 trace 中的 ref 方案由此替代。数据载入与用户操作的先后关系在同步入口中可测试。

Follow-up:
None.

### 3. 形态转换携带的道具

Type: discovered-constraint

Context:
现有 transition 会在目标形态允许且道具合法时保留当前道具（例如超级烈空坐）。新默认值同步若只看目标使用率，会覆盖该携带选择。

Decision:
沿用 transition 返回的保留选择引用作为携带信号，在新身份中将该侧道具视为显式选择。后到的默认值不再覆盖它，控件仍允许编辑。

Reason:
复用已有合法性判断，避免在选择引擎复制形态和道具合法性规则。

Follow-up:
None.
