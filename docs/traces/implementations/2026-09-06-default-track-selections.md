# Implementation Trace: 默认 Track 选择

Date: 2026-09-06
Source: docs/traces/discussion/2026-09-06-default-track-selections.md
Language: zh-hans

## Entries

### 1. 阶级推荐的规则边界

Type: interpretation

Context:
讨论要求按当前引擎支持的威吓交互求值，但没有规定实现接入点。ADR 0007 明确不依赖 calc 内部 mechanics 导出。现有能力阶级是显式输入，特性投影不直接改变伤害。

Decision:
在现有特性投影内以双方特性组合生成阶级推荐，按已安装 calc 0.11.0 的 Gen 9 威吓规则覆盖免疫、唱反调、看门犬和单纯。保留伤害引擎边界，不导入内部 mechanics，也不修改伤害计算。能力阶级只推荐当前招式类别使用的进攻实数对应阶级；道具联动不扩大到本轮特性组合求值。

Reason:
这里决定的是默认选中输入，不是新增伤害机制。限定规则范围避免为默认推荐执行一次完整伤害计算或依赖引擎私有入口。

Follow-up:
None.

### 2. 手动编辑保护的生命周期

Type: interpretation

Context:
讨论要求保护手动选择，并在相关重置时恢复默认；现有 identity/category transition 会重置阶级，identity transition 还会重置天气与场地。恢复的 Setup 不携带自动推荐的编辑标记。

Decision:
使用与现有异步默认保护相同的会话内 ref 保存天气、场地、进攻阶级是否已编辑。恢复已有 Setup 时均标记为已编辑，不改变存储或分享格式。切换身份时清除天气与场地保护；现有会重置阶级的身份或类别切换清除阶级保护。进攻阶级重置清除手动保护及旧池后，按当前特性重新生成默认阶级与候选。

Reason:
使保护范围与现有 Track 重置边界一致，同时保留已有 Setup 的语义。

Follow-up:
None.

### 3. 场地推荐覆盖范围

Type: interpretation

Context:
讨论确认场地推荐冲突时全部选中，但原实现仅投影电气制造者，不能表达不同场地的推荐冲突。

Decision:
补齐精神制造者、薄雾制造者与青草制造者的场地推荐映射，并与电气制造者一样归为通过 Track 投影的特性。双方推荐场地按 Track 顺序去重，选中所有推荐值。

Reason:
四种场地已经是可计算的 Track 取值；补齐推荐映射使已确认的冲突规则可用于实际场地组合。

Follow-up:
None.
