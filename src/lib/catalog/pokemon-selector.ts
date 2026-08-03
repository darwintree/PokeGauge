import type { BattlePokemonOption } from "./types"

export function prioritizeBattlePokemonOptions(
  options: BattlePokemonOption[],
  currentSpeciesId: number | null,
  sameSpeciesFirst: boolean,
  megaFirst: boolean,
): BattlePokemonOption[] {
  return options
    .map((option, index) => ({ option, index }))
    .sort((a, b) => {
      const sameSpecies =
        sameSpeciesFirst && currentSpeciesId !== null
          ? Number(b.option.speciesId === currentSpeciesId) -
            Number(a.option.speciesId === currentSpeciesId)
          : 0
      if (sameSpecies !== 0) return sameSpecies
      const mega = megaFirst
        ? Number(b.option.isMega) - Number(a.option.isMega)
        : 0
      return mega || a.index - b.index
    })
    .map(({ option }) => option)
}

export function speciesHasMultipleBattlePokemonIdentities(
  options: BattlePokemonOption[],
  selected: BattlePokemonOption | null,
): boolean {
  return selected !== null &&
    options.filter((option) => option.speciesId === selected.speciesId).length >= 2
}
