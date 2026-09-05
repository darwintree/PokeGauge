// THROWAWAY: compare role treatments on the validated compact identity strip. /?variant=A|B|C.
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react"
import { Swords, Shield } from "lucide-react"
import { PrototypeSwitcher } from "@/components/prototype-switcher"
import { BattlePokemonPicker } from "./battle-pokemon-picker"
import "./matchup-cards.prototype.css"

type Props = {
  attacker: ComponentProps<typeof BattlePokemonPicker>
  defender: ComponentProps<typeof BattlePokemonPicker>
}
const VARIANTS = ["A", "B", "C"] as const
type Variant = typeof VARIANTS[number]
const NAMES = { A: "名称铭牌", B: "精灵徽章", C: "侧边角色条" }
function readVariant(): Variant {
  const value = new URLSearchParams(location.search).get("variant")
  return value === "B" || value === "C" ? value : "A"
}

export function VariantA({ attacker, defender }: Props) {
  return <div className="matchup-proto-base matchup-proto-a grid grid-cols-2">
    <div className="prototype-identity-cell"><BattlePokemonPicker {...attacker} /><span className="prototype-role-mark prototype-role-attacker" aria-hidden>ATK</span></div>
    <div className="prototype-identity-cell"><BattlePokemonPicker {...defender} /><span className="prototype-role-mark prototype-role-defender" aria-hidden>DEF</span></div>
  </div>
}
export function VariantB({ attacker, defender }: Props) {
  return <div className="matchup-proto-base matchup-proto-b grid grid-cols-2">
    <div className="prototype-identity-cell"><BattlePokemonPicker {...attacker} /><span className="prototype-role-mark prototype-role-attacker" aria-hidden><Swords /></span></div>
    <div className="prototype-identity-cell"><BattlePokemonPicker {...defender} /><span className="prototype-role-mark prototype-role-defender" aria-hidden><Shield /></span></div>
  </div>
}
export function VariantC({ attacker, defender }: Props) {
  return <div className="matchup-proto-base matchup-proto-c grid grid-cols-2">
    <div className="prototype-identity-cell prototype-side-attacker"><BattlePokemonPicker {...attacker} /></div>
    <div className="prototype-identity-cell prototype-side-defender"><BattlePokemonPicker {...defender} /></div>
  </div>
}

export function MatchupCardsPrototype(props: Props) {
  const [variant, setVariant] = useState(readVariant)
  const [height, setHeight] = useState(0)
  const region = useRef<HTMLDivElement>(null)
  const cycle = useCallback((direction: number) => {
    setVariant((current) => {
      const next = VARIANTS[(VARIANTS.indexOf(current) + direction + 3) % 3]
      const url = new URL(location.href)
      url.searchParams.set("variant", next)
      history.replaceState(null, "", url)
      return next
    })
  }, [])
  useEffect(() => {
    const onPop = () => setVariant(readVariant())
    window.addEventListener("popstate", onPop)
    const observer = new ResizeObserver(() => setHeight(Math.round(region.current?.getBoundingClientRect().height ?? 0)))
    if (region.current) observer.observe(region.current)
    return () => { observer.disconnect(); window.removeEventListener("popstate", onPop) }
  }, [])
  const state = {
    variant, height,
    attacker: { id: props.attacker.value, label: props.attacker.options.find((p) => p.id === props.attacker.value)?.label, spriteSide: "back" },
    defender: { id: props.defender.value, label: props.defender.options.find((p) => p.id === props.defender.value)?.label, spriteSide: "front" },
  }
  return <>
    <div ref={region} className="matchup-cards-prototype" data-variant={variant}>
      {variant === "A" && <VariantA {...props} />}
      {variant === "B" && <VariantB {...props} />}
      {variant === "C" && <VariantC {...props} />}
    </div>
    <PrototypeSwitcher label={`${variant} · ${NAMES[variant]} · ${height}px`} onCycle={cycle} state={state} />
  </>
}
