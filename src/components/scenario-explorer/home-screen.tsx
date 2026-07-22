import { FormattedMessage, useIntl } from "react-intl"

import { SpeciesSelect } from "@/components/scenario-explorer/matchup-selector"
import type { SpeciesOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"

function homeHintId(
  attackerId: BattlePokemonId | null,
  defenderId: BattlePokemonId | null,
): "home.action" | "home.needAttacker" | "home.needDefender" {
  if (attackerId == null && defenderId == null) return "home.action"
  if (attackerId == null) return "home.needAttacker"
  return "home.needDefender"
}

type HomeScreenProps = {
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  attackerId: BattlePokemonId | null
  defenderId: BattlePokemonId | null
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
}

/** Empty-matchup home: typographic hero + bottom instrument rail. */
export function HomeScreen({
  attackers,
  defenders,
  attackerId,
  defenderId,
  onAttackerChange,
  onDefenderChange,
}: HomeScreenProps) {
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
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl md:leading-[0.95]">
            <FormattedMessage id="app.title" />
          </h1>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed sm:text-lg">
            <FormattedMessage id={hint} />
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-30 px-4 sm:bottom-6 sm:px-6">
        <div className="border-border/80 bg-background/95 mx-auto grid max-w-2xl gap-2 rounded-xl border p-2 shadow-[0_18px_50px_-28px_oklch(0_0_0/0.45)] backdrop-blur-md sm:grid-cols-2">
          <SpeciesSelect
            label={intl.formatMessage({ id: "matchup.attacker" })}
            options={attackers}
            value={attackerId}
            onChange={onAttackerChange}
            spriteSide="back"
            presentation="rail"
            awaiting={attackerId == null && defenderId != null}
          />
          <SpeciesSelect
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
