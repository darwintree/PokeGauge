# Ability 初始化投射契约讨论记录

对应 spec change: None.

## 1. 天气与场地投射的适用侧

问题：天气与场地类特性是否只在某一侧选中时投射。

决定：攻击方或防守方选中 Drought、Drizzle、Sand Stream、Sand Spit、Snow Warning、Electric Surge 时，都向全局 Weather／Terrain Track 投射对应候选。

## 2. Stage 投射的适用侧与招式类别

问题：现有 Stage Track 只表示当前招式类别使用的攻防能力，如何表达 Intimidate、Defiant 与 Competitive。

决定：物理类别下，防守方 Intimidate 向 Attacker Stage 投射 `-1`，攻击方 Defiant 向 Attacker Stage 投射 `+1` 与 `+2`；特殊类别下，攻击方 Competitive 向 Attacker Stage 投射 `+2`。其他侧别或类别不投射。

## 3. 投射写入方式

问题：投射值应替换目标 Track，还是作为候选追加。

决定：Weather、Terrain 与 Stage 的全部投射都采用追加候选并去重；不删除或覆盖现有候选，即使用户已经编辑过目标 Track。

## 4. 初始与默认选择的投射时机

问题：新建场景、Reset、Identity 变化与异步默认选择是否触发投射。

决定：新建场景的最终默认、Ability Reset、Identity 变化后的最终默认，以及异步使用率成功或失败回退所得的最终默认都触发投射。用户手动将特性从未选改为已选时立即触发。

## 5. 临时 catalog 候选

问题：异步默认完成前临时选中的全部合法特性是否触发投射。

决定：临时候选阶段不投射；只在最终默认确定后投射。用户在此期间主动选择的特性仍立即投射。

## 6. 恢复存档

问题：恢复已保存场景时是否根据已选特性重新投射。

决定：恢复存档时不投射，完整采用已保存的 Ability、Weather、Terrain 与 Stage Track。

## 7. 取消、重新选择与 Reset

问题：取消、重新选择投射类特性或执行 Ability Reset 时如何处理已投射候选。

决定：取消或换走特性不清除候选；重新选择会再次执行幂等追加；Ability Reset 会重新应用 Reset 后全部已选投射类特性，即使其中某项此前已经选中。

## 8. 切换招式类别

问题：招式类别变化后如何处理 Stage、Weather、Terrain 与已选特性。

决定：双方 Stage 重置为 `[0]`，Weather 与 Terrain 保留；随后按新类别重新应用当前双方已选特性中的 Stage 投射。

## 9. 切换 Pokémon Identity

问题：任一 Pokémon Identity 变化后如何重建目标 Track 与投射。

决定：Weather、Terrain 与双方 Stage 重置为中性值；最终默认确定后，重新应用攻防双方当前选中的全部投射类特性。

## 10. Track 与 Ability 的组合关系

问题：投射后是否维持 Ability 与对应 Track 候选的因果绑定。

决定：不建立绑定。Ability、Weather、Terrain 与 Stage 继续作为独立 Choice Track 进入笛卡尔积；多个投射类特性的候选可以互相交叉组合。

## 11. 候选顺序

问题：追加候选按触发先后还是 Track 固定顺序展示和保存。

决定：去重后始终按各 Track 既有固定枚举顺序展示和保存；Stage 按 `-6` 至 `+6` 排序。

## 12. Ability 状态与结果来源

问题：已支持投射的特性是否继续标记为未支持，或作为生效来源展示。

决定：这些特性编译和展示为 `neutral`，不显示红点或绿点，也不作为 Ability 来源进入结果；当前 Weather、Terrain 与 Stage Track 表达实际效果及来源。特性位于不适用的侧别或类别时同样为 `neutral`。

## 13. 投射反馈

问题：投射发生时是否新增 toast、tooltip 或说明文案。

决定：不新增额外反馈；目标 Track 的即时候选变化即为反馈。

## 14. Ability Track none 前置

问题：当前 issue 是否需要声明由 Ability Track none 阻塞。

决定：Ability Track none 已完成并合入，不添加 `Blocked by`。
