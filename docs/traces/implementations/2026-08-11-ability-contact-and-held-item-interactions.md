# Implementation Trace: Ability contact and held-item interactions

Date: 2026-08-11
Source: `.issues/20260805_working_ability-contact-and-held-item-interactions.md` + `docs/traces/discussion/2026-08-07-ability-contact-and-held-item-interactions.md`
Language: 中文

## Entries

### 1. Klutz 贡献判定时点

Type: unresolved-implementation-decision

Context:
讨论记录要求「若无 Klutz 时该侧至少有一个 hook 会 `active`」才标 Klutz `active`，但未说明这是 `compileHeldItem` 的即时 gate 结果，还是经过 accuracy／critical-stage／Utility Umbrella 等后置可见性 refinement 之后的最终 item state。Accuracy 与伞在 compiler 里本来就会把 compile-time `active` 改成 `inactive`。

Decision:
先按无 Klutz 走完 item 的后置 refinement（用 raw item mods 判断 would-be-active），再用该结果决定 Klutz；若 Klutz `active` 则把 item 标 `inactive`，计算路径则在编译早期就 neutralize item mods（含 `suppressOrdinaryWeatherDamage`）。

Reason:
与现有 Wide Lens／Scope Lens／Umbrella 的「最终可见才算贡献」一致；若只用 compile-time gate，classic 模式下 Wide Lens 会误标 Klutz `active`。

Follow-up:
None.
