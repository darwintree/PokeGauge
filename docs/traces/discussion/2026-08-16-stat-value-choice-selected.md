# Stat Value Choice 选中态

对应 spec change: [`docs/spec/changes/2026-08-16-stat-value-choice-selected.md`](../../spec/changes/2026-08-16-stat-value-choice-selected.md)

Question: Choice 上 Stat Value 的选中 / 未选中如何读得更开，同时保留投资档颜色。

Verdict: **B · Yellow + band tab**。选中用 HUD `signal-yellow` 底 + ink 框 + hard shadow；投资档收到左侧色带。未选中保持纸色底 + 档位描边和字色。结果行 chip 仍是数据标记，不用选中黄。

未采纳：A 同色描边变填充（0 投资几乎看不见）；C 勾选章 + 未选中淡出；D 已选 / 候选分轨。
