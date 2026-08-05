---
# This section is managed by the CLI. Do not edit manually.
id: "18b95ccd-1145-4def-b195-4179ba9eb479"
title: "Ability init projection to Weather Terrain Stage"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T10:08:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

将状态类特性实现为 Weather／Terrain／Stage Track 的一次性初始化投射。投射完成后各 Track 独立做主，特性不持续锁定、同步或回退 Track。

## Contract

### Projection mappings

天气与场地是全局状态；下列特性在攻击方或防守方选中时均投射：

- Drizzle (`2`) → Weather `rain`
- Sand Stream (`45`)／Sand Spit (`245`) → Weather `sand`
- Drought (`70`) → Weather `sun`
- Snow Warning (`117`) → Weather `snow`
- Electric Surge (`226`) → Terrain `electric`

现有 Stage Track 只表示当前招式类别实际使用的攻防能力，因此 Stage 投射限定为：

- 物理类别：防守方 Intimidate (`22`) → Attacker Stage `-1`。
- 物理类别：攻击方 Defiant (`128`) → Attacker Stage `+1` 与 `+2`。
- 特殊类别：攻击方 Competitive (`172`) → Attacker Stage `+2`。
- 其他侧别或类别不投射；Defender Stage 不承载 Defiant／Competitive 的攻击能力提升。

### Candidate and scenario semantics

- 所有投射都向目标 Track **追加候选并去重**，不得删除或覆盖已有候选；用户是否编辑过目标 Track 不改变该规则。
- 候选始终按 Track 既有固定枚举顺序保存和展示；Stage 按 `-6` 至 `+6` 排序，不按触发先后排序。
- Defiant 的 `+1` 与 `+2` 是两个 Stage Choice 候选，连同原有候选分别进入 row product；它们不是连续叠加步骤。
- Ability、Weather、Terrain 与 Stage 继续是彼此独立的 Choice Track。投射不建立 Ability 与目标候选的因果绑定；多个投射类特性产生的候选允许按现有笛卡尔积交叉组合。

### Selection and default lifecycle

- 用户将投射类特性从未选改为已选时立即投射；取消或换走特性不清除任何已投射候选。
- 取消后重新选择会再次投射，但追加必须幂等；已有候选不得重复。
- Ability Reset 会重新应用 Reset 后全部已选投射类特性，即使某项在 Reset 前已经选中；目标 Track 只追加、不覆盖。
- 新建场景只在最终默认特性确定后投射。异步 catalog 加载期间临时选中的“全部合法特性”不得投射，避免留下最终未选特性的候选。
- 异步使用率成功、失败回退或 Mega 固定特性确定后所得的最终默认均投射；用户已经编辑过目标 Track 时仍按追加规则投射。
- 用户在异步默认完成前主动选择投射类特性时仍立即投射；后续默认刷新继续遵守既有 Ability Track touched 保护。
- 恢复存档时不投射，完整采用保存的 Ability、Weather、Terrain 与 Stage Track。
- `none`、`Unknown ability` 与其他非投射类特性不投射，也不清除或回退任何目标 Track。

### Matchup transitions

- 切换招式类别时，双方 Stage 重置为 `[0]`，Weather 与 Terrain 保留；随后按新类别重新应用当前双方已选特性中的 Stage 投射。
- 切换任一 Battle Pokémon Identity 时，Weather、Terrain 与双方 Stage 重置为中性值；最终默认确定后，重新应用攻防双方当前选中的全部投射类特性，包括未换一侧保留下来的选择。
- Mega 的固定投射类特性遵守相同规则；依赖已经完成的 Ability Track `none` 契约，用户切到 `none` 时不清除投射，重新选择固定特性时幂等追加。

### Display and calculation

- 名单内投射类特性不再显示“效果暂未支持”：Ability Track 与 compiler 均将其识别为 `neutral`，不显示红点或绿点。
- 这些 Ability 不作为效果来源出现在结果中；实际效果和 provenance 由当前 Weather／Terrain／Stage Track 表达。
- 位于不适用侧别或招式类别的名单内特性同样为 `neutral`，不得误报为 unsupported。
- 不新增 toast、tooltip 或投射说明文案；目标 Track 的即时候选变化即为反馈。

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §3–§6
- [[../docs/traces/discussion/2026-08-05-ability-init-projection-contract|Ability 初始化投射契约讨论记录]]
- 相关基建：[[archive/20260805_closed_ability-track-none|Ability Track none]]

## Out of scope

- Cloud Nine 压制天气伤、Mega Sol 自带晴天伤模（见 weather/item composition 子 issue）
- 伤害公式本身
- 新增逐属性 Stage Track、Ability 与 Track 候选的关联场景模型
- 投射动画、toast、tooltip 或其他新 UI

## Acceptance criteria

- [ ] 天气／场地名单在攻防双方均向对应 Track 追加候选；已有候选保留、去重并维持固定顺序。
- [ ] 物理类别仅投射 Defender Intimidate 与 Attacker Defiant；特殊类别仅投射 Attacker Competitive；其他侧别和类别不误写 Stage。
- [ ] Defiant 的 `+1`、`+2` 与既有 Stage 候选分别进入 row product，且不引入 Ability↔Stage 关联模型。
- [ ] 手动选择、重新选择与 Ability Reset 均按契约幂等追加；取消、`none`、Unknown 与非投射类特性不清除目标 Track。
- [ ] 新建场景与 Identity 变化只在最终默认确定后投射；临时 catalog 候选不投射，异步成功／失败回退、Mega 固定特性及 touched 保护行为可验证。
- [ ] 恢复存档不重放投射；已保存的 Ability、Weather、Terrain 与 Stage 保持不变。
- [ ] 切换招式类别仅重置双方 Stage、保留 Weather／Terrain，并按新类别重新应用当前 Stage 投射；切换 Identity 则重置全部目标 Track 后重新应用双方最终选择。
- [ ] 名单内特性在适用与不适用位置都编译为 `neutral`，不显示状态点、不出现在结果 Ability 来源中；目标 Track 继续提供效果与 provenance。
- [ ] 不新增投射提示 UI，现有 Track 信息层级不变。
- [ ] 两份讨论记录中的相关决定均可逐条审计到实现与测试。
