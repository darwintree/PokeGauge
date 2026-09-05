// Throwaway: small spacing adjustments to the original landing at /?prototype=home.
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"
import { MatchupLanding } from "./matchup-landing"

type Props = { attackers: BattlePokemonOption[]; defenders: BattlePokemonOption[] }
export function HomePrototype({ attackers, defenders }: Props) {
  const [attacker, setAttacker] = useState<BattlePokemonId | null>(null)
  const [defender, setDefender] = useState<BattlePokemonId | null>(null)
  return <div className="home-prototype-small">
    <MatchupLanding attackers={attackers} defenders={defenders} attackerId={attacker} defenderId={defender} onAttackerChange={setAttacker} onDefenderChange={setDefender} />
    <aside className="fixed bottom-3 left-1/2 z-40 flex max-w-[calc(100%-24px)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-ink bg-paper p-3 text-xs shadow-hud-chip" aria-label="首页微调原型">
      <span>首页 · Setup 身份卡</span>
      <Button variant="ghost" size="sm" onClick={() => { setAttacker(attackers.find((o) => Number(o.id) === 6)?.id ?? attackers[0]!.id); setDefender(defenders.find((o) => Number(o.id) === 445)?.id ?? defenders[0]!.id) }}>填入示例</Button>
      <Button variant="ghost" size="sm" onClick={() => { setAttacker(null); setDefender(null) }}>清空</Button>
      <span aria-live="polite">{Number(attacker != null) + Number(defender != null)} / 2 已选</span>
    </aside>
  </div>
}
