# Ability weather and item composition 讨论记录

对应 spec change: None.

## 1. 实现范围

问题：本票包含哪些 Ability 与组合语义。

决定：范围固定为 Cloud Nine、Air Lock、Mega Sol 与 Unnerve。

## 2. Cloud Nine／Air Lock 的压制范围

问题：Cloud Nine／Air Lock 只压制普通晴雨火／水伤害模，还是压制 Weather Track 的全部当前已支持计算效果。

决定：任一侧 Cloud Nine／Air Lock 都压制 raw Weather Selection 对当前计算器全部已支持机制的影响，包括 weather damage、Base Power、Battle Odds 命中及 Sand Force／Solar Power 的 Weather gate；不删除或改写 Weather Selection，也不压制 Mega Sol。

## 3. Cloud Nine／Air Lock 与 Weather Ball

问题：raw Weather 令 Weather Ball 因尚未支持天气变体而 unavailable 时，天气压制是否恢复其无天气基础行为。

决定：Cloud Nine／Air Lock 压制 raw Weather 后，Weather Ball 按无天气基础行为保持 calculable。

## 4. Mega Sol 的天气语义

问题：Mega Sol 的晴天语义与 raw Weather 是叠加、补入还是替换关系。

决定：任一侧 Mega Sol 都为当前已支持的天气消费者提供有效晴天，并替换而非叠加 raw Weather 的语义；raw Weather Selection 本身不被改写。

## 5. Mega Sol 的优先级与例外

问题：Cloud Nine、Air Lock、Utility Umbrella 或固定源码例外是否取消 Mega Sol。

决定：Cloud Nine、Air Lock 与 Utility Umbrella 都不取消 Mega Sol；保留固定 Showdown 源码中的 Electro Shot 例外。

## 6. Mega Sol 与 Weather Ball

问题：本票是否借 Mega Sol 补齐 Weather Ball 的天气属性与威力机制。

决定：不补齐；Mega Sol + Weather Ball 仍可因独立的 unsupported move mechanic 而 unavailable。

## 7. Weather 与 Ability activation

问题：天气被压制或替换时，Weather Selection 与 Ability 如何记录 activation。

决定：Weather 仍保留在 Scenario 中；其语义被压制或替换时为 `inactive`，实际改变结果的 Cloud Nine／Air Lock／Mega Sol 为 `active`。raw Weather 已是 sun 且 Mega Sol 没有增量时，Mega Sol 为 `inactive`。

## 8. Unnerve 的方向

问题：Unnerve 压制哪一侧的抗性树果。

决定：只压制对方的 Berry。当前 frozen item 模型只有 defender-side 抗性树果，因此 attacker Unnerve 可以压制 defender Berry；defender Unnerve 当前没有可压制的 attacker Berry，恒为 `inactive`。

## 9. Unnerve 的 Berry 范围

问题：Unnerve 是否覆盖 frozen resistance berry 集合中的 Chilan Berry。

决定：覆盖全部 18 枚 frozen resistance berries，包括不要求超克的 Chilan Berry；不改变树果持续持有的静态警告。

## 10. Unnerve activation

问题：qualifying Berry 被 Unnerve 压制时，双方来源如何标记。

决定：Berry 为 `inactive`，Unnerve 为 `active`；Berry 原本不满足属性／超克 gate 时，Berry 与 Unnerve 都为 `inactive`。

## 11. 冗余抑制来源

问题：多个来源各自足以压制同一 Weather／Berry hook 时，是否只允许其中一个为 `active`。

决定：所有独立充分且底层 hook 原本 eligible 的抑制来源都为 `active`，不按 compiler 顺序挑选赢家；被压制来源为 `inactive`。

## 12. Track 支持披露

问题：四个 Ability 进入支持集后是否新增额外 Track 披露。

决定：移除红色 unsupported 提示；不新增绿点、开关或 partial-support 披露。

## 13. 明确排除项

问题：本票是否实现天气初始化投射、树果消耗、未暴露天气、Weather Ball 天气变体，或重新实现 Sand Force／Solar Power。

决定：全部排除；Sand Force／Solar Power 仅作为 Cloud Nine／Air Lock 与 Mega Sol 的既有 Weather consumer 参与组合。

## 14. 文档载体

问题：本轮是否需要新增领域术语或 ADR。

决定：不新增；现有 Track、Track Selection Activation 与 compiler → kernel 边界足以表达本契约。
