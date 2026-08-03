import { FormattedMessage, useIntl } from "react-intl"

import { BattlePokemonPicker } from "@/components/scenario-explorer/battle-pokemon-picker"
import type { BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"

function homeHintId(
  attackerId: BattlePokemonId | null,
  defenderId: BattlePokemonId | null,
): "home.action" | "home.needAttacker" | "home.needDefender" {
  if (attackerId == null && defenderId == null) return "home.action"
  if (attackerId == null) return "home.needAttacker"
  return "home.needDefender"
}

type MatchupLandingProps = {
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
  attackerId: BattlePokemonId | null
  defenderId: BattlePokemonId | null
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
}

/** Empty-matchup home: typographic hero + bottom instrument rail. */
export function MatchupLanding({
  attackers,
  defenders,
  attackerId,
  defenderId,
  onAttackerChange,
  onDefenderChange,
}: MatchupLandingProps) {
  const intl = useIntl()
  const hint = homeHintId(attackerId, defenderId)

  return (
    <div className="relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--muted)_70%,transparent),transparent_45%)]"
      />

      <div className="relative flex flex-1 flex-col justify-center px-4 pb-36 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl md:leading-[0.95]">
            <FormattedMessage id="app.title" />
          </h1>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed sm:text-lg">
            <FormattedMessage id={hint} />
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-30 px-4 sm:bottom-6 sm:px-6">
        <div className="mx-auto grid max-w-2xl gap-2 rounded-2xl border-2 border-ink bg-paper p-2 shadow-hud-board sm:grid-cols-2">
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
