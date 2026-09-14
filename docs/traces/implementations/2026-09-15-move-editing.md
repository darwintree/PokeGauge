# Implementation Trace: 招式编辑交互

Date: 2026-09-15
Source: 用户要求新增招式不进入编辑区，威力输入去掉上下切换并允许清空编辑。
Language: zh-hans

## Entries

### 1. 空白输入的提交边界

Type: unresolved-implementation-decision

Context:
用户要求清空时不转成 0 或警告，未指定空白失焦后的处理。

Decision:
空白只保存在编辑器本地，计算继续使用上一次威力；输入数字时更新威力，空白失焦时恢复上一次数值。继续沿用领域层的数值范围归一化。

Reason:
允许全选删除后重新输入，避免把编辑中间状态写入计算或持久化数据。现有数值模型及其消费者保持兼容，用户明确要求的交互直接替换。

Follow-up:
None.
