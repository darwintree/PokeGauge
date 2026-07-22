# Implementation Trace: Home screen (Type + rail)

Date: 2026-07-22
Source: `.issues/20260721_open_设计项目首屏.md` + prototype verdict (Variant B)
Language: zh-Hans

## Entries

### 1. Ship frontend despite design-only issue scope

Type: deviation

Context:
Issue body listed「本 issue 不包含前端实现」. User later selected prototype Variant B and asked to implement it as the real empty-matchup home.

Decision:
Fold Variant B into production Scenario Explorer: null initial matchup, `HomeScreen` until both sides are chosen, then short transition into existing explorer. Remove A/C prototype variants and the switcher from the tree.

Reason:
User request overrides the earlier design-only boundary; shipping the chosen composition is the acceptance path for the empty first screen.

Follow-up:
None.
