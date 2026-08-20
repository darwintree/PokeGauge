import { describe, expect, it } from "vitest"

import { damageToneOf } from "./damage-tone"

describe("damageToneOf", () => {
  it("matches from the top so guaranteed wins over lethal and warm", () => {
    expect(damageToneOf(100, 120)).toBe("guaranteed")
    expect(damageToneOf(70, 110)).toBe("lethal")
    expect(damageToneOf(70, 90)).toBe("warm")
  })

  it("uses 43% max for safe and 50% min for warm", () => {
    expect(damageToneOf(18, 32)).toBe("safe")
    expect(damageToneOf(18, 43)).toBe("cool")
    expect(damageToneOf(42, 58)).toBe("cool")
    expect(damageToneOf(50, 58)).toBe("warm")
    expect(damageToneOf(90, 99)).toBe("warm")
  })

  it("treats the top edge of each band inclusively", () => {
    expect(damageToneOf(42.9, 42.9)).toBe("safe")
    expect(damageToneOf(43, 43)).toBe("cool")
    expect(damageToneOf(49.9, 49.9)).toBe("cool")
    expect(damageToneOf(50, 50)).toBe("warm")
    expect(damageToneOf(99, 99)).toBe("warm")
    expect(damageToneOf(100, 100)).toBe("guaranteed")
    expect(damageToneOf(50, 100)).toBe("lethal")
  })
})
