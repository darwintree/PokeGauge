import { describe, expect, it } from "vitest"

import { DAMAGE_TWO_THIRDS, damageToneOf } from "./damage-tone"

describe("damageToneOf", () => {
  it("matches from the top so guaranteed wins over lethal and warm", () => {
    expect(damageToneOf(100, 120)).toBe("guaranteed")
    expect(damageToneOf(70, 110)).toBe("lethal")
    expect(damageToneOf(70, 90)).toBe("warm")
  })

  it("uses 40% max for safe and 2/3 min for warm", () => {
    expect(damageToneOf(18, 32)).toBe("safe")
    expect(damageToneOf(18, 40)).toBe("cool")
    expect(damageToneOf(DAMAGE_TWO_THIRDS, 80)).toBe("cool")
    expect(damageToneOf(DAMAGE_TWO_THIRDS + 0.01, 80)).toBe("warm")
  })

  it("ignores the idea of a crit peak: 90–99 stays cool/warm, not lethal", () => {
    expect(damageToneOf(90, 99)).toBe("warm")
    expect(damageToneOf(42, 58)).toBe("cool")
  })
})
