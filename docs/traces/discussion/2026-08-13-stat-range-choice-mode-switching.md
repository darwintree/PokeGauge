# Stat Range / Choice 切换交互讨论记录

对应 spec change: None.

## 1. Range 模式下结果行如何展开 Choice

问题：在 Range 模式下盯着一条结果再看对应 Choice，结果集该整表翻转、只留下该招式，还是原地展开。

决定：Range 模式下，原始结果行是母行。点击母行中的 Range 区间，只在该母行下展开子行；其他母行不变。展开只动该母行 scenario 的对应部分。

## 2. 进攻与防守区间是否分开展开

问题：母行同时有进攻、防守区间时，点击其中一项会展开什么。

决定：点进攻只展开进攻对应的 Choice，点防守只展开防守对应的 Choice。若两项都是可展开区间，两项都可以点。两项都展开时，子行是该母行两轴 Choice 的组合。

## 3. 子行能否继续展开

问题：展开后的子行是否还能再点开。

决定：子行不可展开。

## 4. 行内展开与 Stat Track 模式的关系

问题：展开母行是否同时把 Stat Track 切到 Preset。

决定：行内展开不改变 Stat Track 的全局模式。Track 仍停在 Range；子行只展示该母行对应轴的 Choice。

## 5. 折叠 Stat Track 如何切模式

问题：Stat Track 折叠时能否切换 Preset / Range，是否必须先展开面板。

决定：折叠的 Stat Track 上有可从外部点击的切换控件，点击后直接切换该 Track 的模式，不必先展开面板。该切换仍是该轴的全局模式切换，会改变结果表中该轴的母行形态。

## 6. 交互与视觉的分工

问题：当前原型的交互是否可以定稿，视觉是否一并定稿。

决定：交互定稿。母行可展开项样式、能力值 chip 样式、折叠 Stat Track 切换按钮样式另开三个子 issue，按此顺序处理。

## 7. 折叠浅井里点 chip 是否切模式

问题：折叠 Stat Track 浅井整块可点之后，点在井内的 Stat Value Label chip 上会不会切换该轴全局模式。结果行 chip 仍是数据标记。

决定：点在 chip 上不切模式，只走 tooltip。点在浅井其余区域（空隙、井底轨）才切换该轴全局模式。

## 8. 折叠切换样式子票何时归档

问题：折叠 Stat Track 切换视觉已进产品后，这张子票是否立刻归档。

决定：先更新 issue，不立刻归档。母行 chevron 进入产品后，再收视觉并归档。

## 9. Choice 与 Range 是否各有一套值

问题：切全局模式时，Choice 选中与 Range 区间是两套独立配置、每次和解，还是同一套值的两种体现。

决定：一条 Stat Track 只有一组选中 Stat Value。Choice 与 Range 是这组值的两种模式，不是两套库。

## 10. 选中集合与 Stat Preset 的关系

问题：选中集合的成员是 Stat Preset 身份，还是与 Preset 正交的 Stat Value。

决定：选中的是 Stat Value，即该 Track 作为 Choice Track 时的已选中值。与 Stat Preset 正交。按 Stat Value 去重。

## 11. 防守 Range 的端点是什么

问题：Defense Stat Range 是两个完整 Defense Stat Value，还是 HP×Def 矩形的四个角。

决定：两个完整端点，取当前选中值的轴对齐包络：`(min HP, min Def)` 与 `(max HP, max Def)`。不是四个角的笛卡尔积。

## 12. 缺的包络端点何时写入选中集合

问题：包络角不在选中集合里时，何时补 Temporary Stat Value；母行展开是否也补。

决定：进入 Range 或拖边界时，缺的端点若无对应 Preset 则补 Temporary Stat Value，有对应值则直接选中。母行展开只读，不写选中集合。

## 13. 拖动包络时如何改选中集合

问题：拖边界是取消旧端点再造 temp，还是只取消落到包络外的值。

决定：仍落在包络内的选中值保持选中；扩大包络时旧端点留作内部点。落到包络外的值取消选中。

## 14. Temporary Stat Value 的生命周期

问题：无对应 Preset 的选中值如何创建、删除、能否保存。

决定：仅当需要某个 Stat Value 且不存在对应 Preset 时创建。取消选中即删除。可以保存成用户 Stat Preset；保存后仍选中，取消不再删除。

## 15. 选中集合可否为空；单值如何拖成区间

问题：0 个或 1 个选中时 Range 如何表现；单值两个手柄能否向两边拖。

决定：不允许 0 个。1 个时 Range 显示一枚 chip。拖任一手柄向任一方向：保留该值，在新位置补 Temporary Stat Value；手柄交叉即换角色。

## 16. 新对阵默认模式

问题：初次进入默认 Choice、Range，还是记住上次模式。

决定：默认 Range。

## 17. 新对阵默认选中哪些值

问题：默认 Range 的选中集合用现有 Choice 默认、物种最小～最大，还是系统端点加用户 Preset。

决定：进攻选中 `0A`、`EX` 以及该 Identity 下全部用户进攻 Preset。防守选中 `0H0B`、`32H0B` 以及该 Identity 下全部用户防守 Preset。用户 Preset 在端点外则撑开包络，在内则为内部点。本次会话新增或保存的用户 Preset 同样进入选中集合。

## 18. 母行展开的子行是什么

问题：Range 母行展开后，子行是整组选中值、只有端点，还是包络内全部池成员。

决定：当前整组选中值（含内部点）。展开只读。

## 19. Choice 能否取消最后一个值

问题：0 个已禁止时，Choice 里点掉最后一项如何处理。

决定：不能取消最后一个。点掉最后一项是空操作。

## 20. 换 Battle Pokémon Identity 时 Stat Track 怎么办

问题：换 Identity 是重置为默认，还是尽量保留选中值。

决定：重置为默认 Range 与第 17 条的默认选中。

## 21. 恢复已保存 Matchup

问题：打开旧档是沿用保存状态，还是一律改写成默认 Range。

决定：以保存的模式和选中集合为准，不改写成默认 Range。
