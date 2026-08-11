# Implementation Trace: Green-dot conditional ability effects

Date: 2026-08-11
Source: `.issues/20260805_working_green-dot-conditional-ability-effects.md`
Language: 中文

## Entries

### 1. HUD `signal-green` token

Type: unresolved-implementation-decision

Context:
Issue 要求静态绿点披露，但 `design.md` 原先只有 `destructive`（红点）与 `signal-yellow`，没有肯定性披露色；规范又要求新颜色必须有可复用语义角色。

Decision:
在 HUD 中新增 `signal-green: #2f9e44`，角色为 affirmative Track disclosure（Assumed-Satisfied Ability Selection）；Track 用 `bg-signal-green`，与红点同样带 `border-ink`。

Reason:
与 `destructive` 红点成对，避免把属性/克制等 domain 绿挪作 HUD chrome；一处 token 可供同类 Track 披露复用。

Follow-up:
None.
