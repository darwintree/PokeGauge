/** Reviewed damage-relevant changes; other battle-state effects remain outside this model. */
export type MoveStatChange = {
  side: "attacker" | "defender"
  stat: "atk" | "spa" | "def" | "spd"
  stages: number
  probability: number
}

// Pokémon Showdown data/moves.ts; PokeAPI move_meta_stat_changes.csv, reviewed 2026-09-06.
const MOVE_STAT_CHANGES: Readonly<Partial<Record<number, MoveStatChange>>> = {
  51: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // acid
  94: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // psychic
  231: { side: "defender", stat: "def", stages: -1, probability: 0.3 }, // iron-tail
  232: { side: "attacker", stat: "atk", stages: 1, probability: 0.1 }, // metal-claw
  242: { side: "defender", stat: "def", stages: -1, probability: 0.2 }, // crunch
  247: { side: "defender", stat: "spd", stages: -1, probability: 0.2 }, // shadow-ball
  249: { side: "defender", stat: "def", stages: -1, probability: 0.5 }, // rock-smash
  295: { side: "defender", stat: "spd", stages: -1, probability: 0.5 }, // luster-purge
  306: { side: "defender", stat: "def", stages: -1, probability: 0.5 }, // crush-claw
  309: { side: "attacker", stat: "atk", stages: 1, probability: 0.2 }, // meteor-mash
  405: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // bug-buzz
  411: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // focus-blast
  412: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // energy-ball
  414: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // earth-power
  430: { side: "defender", stat: "spd", stages: -1, probability: 0.1 }, // flash-cannon
  451: { side: "attacker", stat: "spa", stages: 1, probability: 0.7 }, // charge-beam
  465: { side: "defender", stat: "spd", stages: -2, probability: 0.4 }, // seed-flare
  491: { side: "defender", stat: "spd", stages: -2, probability: 1 }, // acid-spray
  534: { side: "defender", stat: "def", stages: -1, probability: 0.5 }, // razor-shell
  552: { side: "attacker", stat: "spa", stages: 1, probability: 0.5 }, // fiery-dance
  612: { side: "attacker", stat: "atk", stages: 1, probability: 1 }, // power-up-punch
  680: { side: "defender", stat: "def", stages: -1, probability: 1 }, // fire-lash
  708: { side: "defender", stat: "def", stages: -1, probability: 0.2 }, // shadow-bone
  710: { side: "defender", stat: "def", stages: -1, probability: 0.2 }, // liquidation
  787: { side: "defender", stat: "spd", stages: -1, probability: 1 }, // apple-acid
  788: { side: "defender", stat: "def", stages: -1, probability: 1 }, // grav-apple
  823: { side: "defender", stat: "def", stages: -1, probability: 1 }, // thunderous-kick
  855: { side: "defender", stat: "spd", stages: -2, probability: 1 }, // lumina-crash
  871: { side: "attacker", stat: "spa", stages: 1, probability: 1 }, // torch-song
}

export function moveStatChange(moveId: number): MoveStatChange | undefined {
  return MOVE_STAT_CHANGES[moveId]
}

