import { ArrowRight, History } from "lucide-react"
import { useIntl } from "react-intl"

import { BattlePokemonPicker } from "./battle-pokemon-picker"
import { Button } from "@/components/ui/button"
import type { BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"

type MatchupLandingProps = {
  attackers: BattlePokemonOption[]
  defenders: BattlePokemonOption[]
  attackerId: BattlePokemonId | null
  defenderId: BattlePokemonId | null
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  resumeMatchup?: {
    attackerLabel: string
    defenderLabel: string
    onResume: () => void
  }
}

/** Empty-matchup home: centered attacker / defender pickers. */
export function MatchupLanding({
  attackers,
  defenders,
  attackerId,
  defenderId,
  onAttackerChange,
  onDefenderChange,
  resumeMatchup,
}: MatchupLandingProps) {
  const intl = useIntl()

  return (
    <div className="relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--muted)_70%,transparent),transparent_45%)]"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-3xl space-y-5">
          <section>
            <h1 className="text-center text-xl font-extrabold tracking-tight">
              {intl.formatMessage({ id: "matchup.new" })}
            </h1>
            <div className="mt-3 grid gap-2 rounded-2xl border-2 border-ink bg-paper p-2 shadow-hud-board sm:grid-cols-2">
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
          </section>

          {resumeMatchup && (
            <Button
              type="button"
              variant="outline"
              className="h-auto w-full justify-between rounded-xl border-2 border-ink bg-paper px-4 py-3 text-left shadow-hud-chip hover:bg-signal-yellow"
              onClick={resumeMatchup.onResume}
            >
              <span className="flex min-w-0 items-center gap-3">
                <History className="size-5 shrink-0" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-hud-muted">
                    {intl.formatMessage({ id: "matchup.last" })}
                  </span>
                  <span className="block truncate font-extrabold">
                    {resumeMatchup.attackerLabel} vs {resumeMatchup.defenderLabel}
                  </span>
                </span>
              </span>
              <span className="ml-4 flex shrink-0 items-center gap-1 font-extrabold">
                {intl.formatMessage({ id: "matchup.resume" })}
                <ArrowRight aria-hidden />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
