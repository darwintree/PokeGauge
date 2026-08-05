import { expect, it } from "vitest"

import {
  formTriggerIdentityFor,
  isFormTriggerItem,
  isLegalFormTriggerTransition,
} from "./form-triggers"

it("maps Mega Stones and Ogerpon Masks to their target identities", () => {
  expect(formTriggerIdentityFor(699)).toBe(10034) // Charizardite X
  expect(formTriggerIdentityFor(717)).toBe(10035) // Charizardite Y
  expect(formTriggerIdentityFor(722)).toBe(10058) // Garchompite
  expect(formTriggerIdentityFor(2106)).toBe(10273)
  expect(formTriggerIdentityFor(2107)).toBe(10274)
  expect(formTriggerIdentityFor(2108)).toBe(10275)
  expect(formTriggerIdentityFor(247)).toBeNull()
  expect(isFormTriggerItem(717)).toBe(true)
  expect(isFormTriggerItem(247)).toBe(false)
})

it("allows form-trigger transitions only to selectable same-species targets", () => {
  const selectable = new Set([6, 10034, 10035, 445, 1017, 10273])

  expect(isLegalFormTriggerTransition(6, 699, selectable)).toBe(true)
  expect(isLegalFormTriggerTransition(6, 717, selectable)).toBe(true)
  expect(isLegalFormTriggerTransition(445, 699, selectable)).toBe(false)
  expect(isLegalFormTriggerTransition(6, 722, selectable)).toBe(false)
  expect(isLegalFormTriggerTransition(1017, 2106, selectable)).toBe(true)
  expect(isLegalFormTriggerTransition(1017, 2107, selectable)).toBe(false)
  expect(isLegalFormTriggerTransition(6, 247, selectable)).toBe(false)
})
