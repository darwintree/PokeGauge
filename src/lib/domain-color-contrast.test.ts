/// <reference types="node" />

import { readFileSync } from "node:fs"

import { expect, it } from "vitest"

import { POKEMON_TYPES } from "./pokemon/types"

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")

function token(name: string): string {
  const value = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1]
  if (!value) throw new Error(`Missing color token: --${name}`)
  return value
}

function luminance(hex: string): number {
  const channels = hex.match(/[0-9a-f]{2}/gi)
  if (!channels) throw new Error(`Invalid hex color: ${hex}`)
  const [red, green, blue] = channels.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

it("keeps type and stat-tier text colors at WCAG AA contrast", () => {
  const pairs = [
    ...POKEMON_TYPES.map((type) => [
      `pokemon-type-${type}`,
      `pokemon-type-${type}-foreground`,
    ]),
    ...["stat-tier-0", "stat-offense-max", "stat-bulk-mid", "stat-tier-ex"].flatMap(
      (tier) => [
        [`${tier}-bg`, `${tier}-fg`],
        [`${tier}-bg`, `${tier}-muted`],
      ],
    ),
  ]

  for (const [background, foreground] of pairs) {
    expect(
      contrast(token(background), token(foreground)),
      `--${foreground} on --${background}`,
    ).toBeGreaterThanOrEqual(4.5)
  }
})
