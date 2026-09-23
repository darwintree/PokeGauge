# Result 区重设计：稳定决策与待决项（2026-09-23）

基线：`docs/traces/discussion/2026-09-22-result-zone-requirements.md`（原型只是探索手段，不等同于需求）。
本轮按 grill-proposal 从零重探，假定之前无任何决策；推荐参考了工作区现状，但拍板均为本轮新确认。

## 已锁

- 组件（稿：`src/features/scenario-explorer/results/result-bar-component.prototype.html`，以稿为准）：
  单 `.bar`（0→max）+ 内嵌右锚 `.tail`；暴击线条件 `ce-mx>0.4`；5 档 tone 与 `damage-tone.ts` 同规则；
  超限顶边无标记；暴击 == max 不画紫色；百分比文字在上、条在下。
- 空间预算：左 1/3（百分比 + 条上下两行）+ 右 2/3（至多 2 行）。
- 分组键必要条件：必含 `attacker+move`；不同 attacker 的同招式绝不同组。
- 三场景通用骨架：move / atk / def 一次规划。
- KO 为次级信息（只锁优先级，展示形式待决）。
- 图标：道具 sprite 用生产图；全部图标与生产资源一致（原型必须用生产 icon 测视觉）。
- 窄屏与桌面端同等优先级规划（落地方式 out of scope）。

## 待决

**注：待决 = 开放作答，不代表从现有选项里二选一；最终决策可以完全抛开现有方向。**

- Q7：道具进不进组键。
- Q10：同组多防守方时，分节还是一条龙（现有对照：`result-zone-q5-mix-section.prototype.html`，仅参考）。
- Q11：去重机制（明确是待决设计项，不是"本轮不做"；行内该重复就重复，直到定案）。
- 右区组织整批：攻防分区形式、场的位置、行默认露/藏内容。
- KO / 全名 / 公式的展示形式。

## out of scope

- 组内排序；窄屏与桌面端的结构关系（同骨架还是两套）。

## 搁置（本次不做任何要求）

- 结果表面用不用卡片（Q16）。

## 原型构件清单

- 保留：`result-bar-component.prototype.html`（已锁组件的唯一载体）。
- 待清（等下令再删）：`result-row`、`result-variants`、`result-tracks-dense`、`result-narrow-2row`、
  `result-zone-partition`、`result-zone-2row-v3`、`result-zone-q5-mix-section`、
  `result-zone-row-schemes`、`result-zone-radical`（`.prototype.html`，同目录）。
