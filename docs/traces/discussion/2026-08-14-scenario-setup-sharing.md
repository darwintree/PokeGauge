# Scenario Setup 分享讨论记录

对应 spec change: None.

## 1. 分享对象

问题：配置分享链接代表可编辑的当前计算输入、冻结的历史结果，还是完整 UI 会话。

决定：分享对象是 Scenario Setup；它恢复计算输入，并由接收时的当前引擎重新计算，不冻结历史结果，也不表示完整 UI 会话。

## 2. 链接生成时机

问题：URL 是否随每次配置变化实时更新。

决定：仅在用户显式发起分享时生成链接，不实时同步地址栏。

## 3. 分享范围

问题：链接分享完整编辑器状态，还是当前已选的计算语义。

决定：只分享当前已选的计算语义；未选候选不属于分享契约。

## 4. V1 领域字段

问题：V1 Scenario Setup 包含哪些领域输入。

决定：包含双方 Battle Pokémon Identity、Move side、已选 Move Snapshots、双方 Stat Track 模式与全部已选 Stat Values、双方能力阶级、Held items、Abilities、Weather、Terrain、Screens 和 Probability Mode。

## 5. 排除字段

问题：候选池、展示状态和运行时身份是否进入链接。

决定：不包含候选池、未选 Move Snapshots、Stat Preset identities、locale、展示偏好、结果、随机 snapshot identity、引擎版本或自由文本。

## 6. Stat Value 身份

问题：跨浏览器分享 Stat Preset identity 还是 Stat Value。

决定：分享 Stat Value；接收端按值去重，优先映射完全相同的现有 Preset，没有匹配项时使用 Temporary Stat Value，不自动创建用户 Preset。

## 7. Range 的已选集合

问题：Range 只分享包络端点，还是分享当前已选的完整 Stat Value 集合。

决定：分享完整已选集合；包络内仍被用户选中的 Stat Values 也必须保留。

## 8. 已选但不可计算的 Move Snapshot

问题：未配置或当前不可计算的已选 Move Snapshot 是否进入链接。

决定：进入链接，并在接收端保留相同的已选请求与 Unavailable Scenario 语义。

## 9. Move Snapshot 语义字段

问题：Move Snapshot 分享完整运行时对象、模板 identity，还是最小语义字段。

决定：分享 move identity、power、Hit Fact、critical stage 和 spread 语义；不分享随机 identity 或可由当前规则推导的资格字段，恢复时创建新的本地 snapshot identity。

## 10. 候选池恢复

问题：接收端是否重建或混入发送端未分享的 Move 与 Held-item 候选。

决定：恢复后 Track 只保留链接中的已选项；其他候选由用户之后通过既有 Picker 添加。

## 11. 顺序语义

问题：任何 Track 选择或 Move Snapshot 的原顺序是否属于分享语义。

决定：不保留任何顺序语义；无顺序集合使用规范顺序编码，接收端结果行顺序不属于恢复保证。

## 12. 重复 Move Snapshots

问题：语义完全相同的多个已选 Move Snapshots 是否去重。

决定：不去重；保留多重性，并在接收端恢复为多个独立 snapshot identities。

## 13. 零结果设定

问题：没有已选 Move 或只有不可计算 Move 的 Scenario Setup 是否允许分享。

决定：允许分享领域上合法的零结果设定；缺失其他必选 Track 的结构非法状态不允许分享。

## 14. URL 与本地设定优先级

问题：打开分享 URL 时，URL 与接收端本地快照谁优先。

决定：有效 URL 优先成为当前 Scenario Setup；无效 URL 不得静默展示本地设定冒充恢复成功，本地快照保持不变。

## 15. 导入后的本地持久化

问题：仅打开分享链接是否立即覆盖接收端的最近本地设定。

决定：未编辑的导入是临时状态；只有用户首次修改共享语义后，才写入为新的本地最近设定。

## 16. 分享参数生命周期

问题：导入后地址栏中的原始分享参数何时移除。

决定：未编辑时保留；首次共享语义修改时移除，并由之后的显式分享操作生成新链接。

## 17. URL 载体

问题：Scenario Setup 使用 query、fragment 还是路径承载。

决定：使用独立 query 参数；规范分享链接不携带 prototype、performance 等非产品参数，fragment 继续留给页面锚点。

## 18. 编码方向

问题：URL payload 使用 JSON 压缩、通用序列化格式还是专用紧凑编码。

决定：使用带外层 schema version 的手写 bit codec，并以无 padding 的 base64url 承载；V1 冻结字段顺序、枚举表、字段宽度和 decoder 语义。

## 19. URL 长度边界

问题：生成和接收的分享 URL 采用什么长度边界。

决定：正常生成链接以约 1,800 个 ASCII 字符为可移植上限；外部输入另设约 8 KB 的绝对防护上限；V1 不承诺二维码能力。

## 20. 计算规则版本

问题：分享链接是否保存或锁定计算引擎与资源版本。

决定：不保存或锁定；schema version 只描述 Scenario Setup 数据契约，结果始终由接收时的当前规则计算。

## 21. 失效数据恢复

问题：被引用的已选资源或语义值失效时，是否删除该项后部分恢复。

决定：不部分应用；任何共享语义失效都阻止整份 Scenario Setup 恢复，并返回全部可确定的结构化失败原因。

## 22. 规范编码校验

问题：decoder 是否接受非规范顺序和重复的 Set 值后自行归一化。

决定：不接受；Set 类型字段必须严格递增且无重复，Move Snapshot 多重集按完整语义元组非递减排列并允许完全相同的重复项。

## 23. 尾部数据

问题：V1 decoder 如何处理 trailing bits。

决定：只允许不足一个字节的零 padding；非零 padding、额外完整字节或未完整字段均视为损坏，扩展字段必须升级 schema version。

## 24. 候选空间增长

问题：稳定 ID 或集合数量超过 V1 常见固定宽度时如何处理。

决定：会增长的 ID 与 count 从 V1 起保留 escape sentinel，并使用规范的无符号变长整数；不得静默截断。

## 25. 损坏检测

问题：bit payload 是否需要独立 checksum。

决定：追加标准 CRC-32，在领域解析前验证；checksum 只检测意外损坏，不提供来源认证。

## 26. Share schema 与运行时状态

问题：URL 是否直接序列化 TrackState 或复用 localStorage snapshot schema。

决定：使用独立的 Shared Scenario Setup schema；运行时状态和本地缓存 schema 不属于已发布分享契约。

## 27. Stat 模式术语

问题：分享契约使用运行时的 preset/range，还是领域的 Choice/Range。

决定：使用 Choice/Range；运行时适配不改变领域术语。

## 28. Decode 失败契约

问题：解析与校验失败使用异常、null 还是结构化结果。

决定：公共边界返回 success 或结构化 failures；失败包含稳定阶段、代码与可定位字段，不静默回退本地状态。

## 29. Version dispatch

问题：decoder 是否猜测 payload 版本或跨版本尝试解析。

决定：外层版本精确派发到对应 decoder；未知或已过期版本直接拒绝，不猜测或跨版本回退。

## 30. 资源校验来源

问题：恢复是否依赖 Champions 在线数据。

决定：不依赖；使用本地生成资源与当前静态规则校验 identity、side eligibility、形态锁定、Move 语义和 Stat bounds。

## 31. 合法最小基数

问题：哪些 Track 可以为空。

决定：已选 Move Snapshot 可以为零；其他分支 Track 必须至少有一个选择，双方 Stat Value 集合至少一个且 Range 允许单点包络，Probability Mode 恰有一个。

## 32. Breaking change 与旧版本

问题：新增 Track 等 breaking change 是否必须迁移旧分享数据。

决定：不提前建设迁移；breaking change 可以使旧版本数据过期并拒绝解析，是否继续支持旧版本只在出现真实需求时决定。

## 33. 链接寿命

问题：链接是否包含创建时间、TTL 或固定有效期。

决定：不包含创建时间或 TTL；同一受支持版本内相同 Scenario Setup 生成相同链接，资源失效或版本被明确过期时链接可以失效。

## 34. 来源证明

问题：分享链接是否证明发送者身份或内容真实性。

决定：不证明；链接是可编辑且不受信任的用户输入，checksum 不构成签名。

## 35. 数据与隐私边界

问题：V1 是否允许备注、名称等自由文本。

决定：不允许；V1 只包含已确认的数字 identity、枚举和数值，未来加入用户文本必须重新确认契约。

## 36. UI 与交互范围

问题：本次讨论是否同时决定分享入口、复制反馈与恢复错误界面。

决定：不决定；UI 与交互另行讨论，本次只确认非 UI 的领域与数据契约。
