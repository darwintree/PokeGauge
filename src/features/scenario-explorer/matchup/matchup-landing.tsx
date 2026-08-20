import { useIntl } from "react-intl"

import { BattlePokemonPicker } from "./battle-pokemon-picker"
import type { BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"

type MatchupLandingProps = {
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
  attackerId: BattlePokemonId | null
  defenderId: BattlePokemonId | null
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
}

/** Empty-matchup home: centered attacker / defender pickers. */
export function MatchupLanding({
  attackers,
  defenders,
  attackerId,
  defenderId,
  onAttackerChange,
  onDefenderChange,
}: MatchupLandingProps) {
  const intl = useIntl()

  return (
    <div className="relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--muted)_70%,transparent),transparent_45%)]"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="grid w-full max-w-2xl gap-2 rounded-2xl border-2 border-ink bg-paper p-2 shadow-hud-board sm:grid-cols-2">
          <BattlePokemonPicker
            label={intl.formatMessage({ id: "matchup.attacker" })}
            options={attackers}
            value={attackerId}
            onChange={onAttackerChange}
            spriteSide="back"
            presentation="rail"
            awaiting={attackerId == null && defenderId != null}
          />
          <BattlePokemonPicker
            label={intl.formatMessage({ id: "matchup.defender" })}
            options={defenders}
            value={defenderId}
            onChange={onDefenderChange}
            presentation="rail"
            awaiting={defenderId == null && attackerId != null}
          />
        </div>
      </div>
    </div>
  )
}
