/**
 * PROTOTYPE — Damage Conditions Card redesign v2 (throwaway).
 *
 * Question: 不局限于「卡片」形态,怎样让条件区在满载场景下也清晰可读?
 * 满载(场景 3/6)是设计目标:允许占用更多纵向空间,换取不截断的完整呈现。
 * Run: pnpm dev → http://localhost:5173/?prototype=condition-card
 * Switch variants with ?variant= or the bottom bar (← → keys work too).
 *
 * 五个变体是五种信息架构,不是换皮:
 * - current: 现状基线(卡片,道具仅 16px 图标,挤在行尾 token 簇)
 * - duo:     双栏对阵:行首为 攻/防+道具icon+特性+stage,数值行紧随;战场与其他条件同一行底部条
 * - banner:  战场上移:天气/场地/墙是全场共享条件,抽成整行宽横幅;卡片只留单位条件
 * - ledger:  台账:去卡片化,按条件类型分行(道具/特性/战场),label:value 逐行排列
 * - drawer:  按需展开:默认紧凑卡(道具常驻底部条),点击展开整行宽详情面板
 *
 * ponytail: 「特性/战场/条件详情」等分组标签暂无 i18n key,原型内硬编码中文,落地时补 key。
 * 顶部实测高度:纯卡高显示为 Npx;banner/drawer 有卡外区域时显示 卡+外=总。
 */

import { useEffect, useRef, useState } from "react"
import { useIntl } from "react-intl"
import { ChevronDown, Info, MoreHorizontal } from "lucide-react"

import { TypeBadge } from "@/components/pokemon/type-badge"
import {
  PrototypeSwitcher,
  readPrototypeVariant,
  setPrototypeVariant,
  type PrototypeVariant,
} from "@/components/prototype-switcher"
import type { ScenarioTrack } from "@/lib/damage-calculation"
import type { CatalogMoveOption } from "@/lib/catalog"
import { itemAriaLabel } from "@/lib/held-item"
import type { SupportedLocale } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario"
import type { StatValueChipModel } from "@/lib/stat-preset"
import type { PokemonType } from "@/lib/pokemon"
import { cn } from "@/lib/utils"

import { HeldItemSpriteIcon } from "../../tracks/held-item/held-item-sprite-icon"
import { StatValueChipPair } from "../../tracks/stats/stat-value-chip"
import { DamageScenarioSummary } from "../damage-scenario-summary"
import { DamagePercentAxis, pctToFraction } from "../damage-result-row"

type CardProps = React.ComponentProps<typeof DamageScenarioSummary>

const VARIANTS: Array<PrototypeVariant & { note: string }> = [
  { key: "current", name: "Landed (duo)", note: "已落地实现(原 duo 变体):攻/防双栏,道具 icon 居行首,场地与「其他条件」合并卡底条。" },
  { key: "duo", name: "Duo columns", note: "双栏对阵:行首为 攻击/防御+道具icon+特性+stage(右锚),数值行紧随;战场与其他条件合并为一行底部条。" },
  { key: "banner", name: "Field banner", note: "战场上移:天气/场地/墙是全场共享条件,抽成整行宽横幅;卡片只留单位条件(道具带名),明显变矮。" },
  { key: "ledger", name: "Ledger rows", note: "台账:去卡片化,按条件类型分行(道具/特性/战场各一行),label:value 排列;满载时最高但逐行可读。" },
  { key: "drawer", name: "Expand on demand", note: "按需展开:默认紧凑卡,道具常驻底部条;点击展开整行宽详情面板(场景 3/6 已默认展开),高度按需分配。" },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const EMPTY_SETS = { active: [], inactive: [], unsupported: [], neutral: [] }

function provenance(
  entries: Partial<Record<ScenarioTrack, Partial<typeof EMPTY_SETS>>>,
): ScenarioResult["provenance"] {
  return Object.fromEntries(
    Object.entries(entries).map(([track, sets]) => [track, { ...EMPTY_SETS, ...sets }]),
  ) as ScenarioResult["provenance"]
}

function mockMove(label: string, type: PokemonType, power: number, accuracy: number | null): CatalogMoveOption {
  return { id: 0, label, moveName: label, type, category: "special", power, accuracy, isSpread: false }
}

function mockRow(
  moveType: PokemonType,
  prov: ScenarioResult["provenance"],
  opts: { basePower?: number; accuracy?: number | "always-hits"; critical?: boolean } = {},
): ScenarioResult {
  const basePower = opts.basePower ?? 90
  return {
    calculationIdentity: "proto",
    snapshotId: "proto",
    moveId: 0,
    moveType,
    attackerStatId: "proto",
    defenderId: "proto",
    provenance: prov,
    criticalOnly: false,
    moveMechanics: {
      basePower,
      normal: { effectivePower: basePower, phases: [] },
      critical: opts.critical ? { effectivePower: Math.round(basePower * 1.5), phases: [] } : null,
      hitFact: opts.accuracy ?? "always-hits",
      hitProbability: 1,
    },
    minDamage: 100,
    maxDamage: 120,
    avgDamage: 110,
    minPercent: 45.2,
    maxPercent: 53.4,
    avgPercent: 49.1,
    critMinDamage: 150,
    critMaxDamage: 180,
    critMinPercent: 67.8,
    critMaxPercent: 80.1,
  }
}

function chip(label: string, actual: string, band: StatValueChipModel["band"]): StatValueChipModel {
  return { label, actual, sp: "252", nature: "none", band, temporary: false }
}

// ponytail: 原型的展开按钮只演示交互(chevron 旋转/高亮),不真实展开 range 子行。
// current 变体直传 mock 的 noop,按钮可渲染但点击无效果。
const noop = () => {}

// 道具 id 来自 src/lib/resources/generated/held-items.ts(生命宝珠/讲究眼镜/讲究头带/突击背心/进化奇石)
const LIFE_ORB = "247"
const CHOICE_SPECS = "274"
const CHOICE_BAND = "197"
const ASSAULT_VEST = "683"
const EVIOLITE = "581"

const ATK_ABILITIES = [
  { id: 91, label: "适应力", summary: "" },
  { id: 75, label: "强行", summary: "" },
]
const DEF_ABILITIES = [
  { id: 46, label: "再生力", summary: "" },
  { id: 135, label: "多重鳞片", summary: "" },
]

type MockScenario = {
  key: string
  caption: string
  props: CardProps
  plot: { min: number; max: number; tone: "cool" | "warm" | "lethal" }
  ko: { ohko: string; twoHit: string; hot: boolean }
}

function scenario(
  key: string,
  caption: string,
  partial: Partial<CardProps> & { move: CatalogMoveOption; row: ScenarioResult },
  plot: MockScenario["plot"],
  ko: MockScenario["ko"],
): MockScenario {
  return {
    key,
    caption,
    props: {
      attackerStat: { chips: [chip("145", "215", "none")] },
      defender: { chips: [chip("106", "206", "none")] },
      attackerAbilities: [],
      defenderAbilities: [],
      isRangeEnvelope: false,
      showAccuracy: false,
      ...partial,
    },
    plot,
    ko,
  }
}

const SCENARIOS: MockScenario[] = [
  scenario(
    "empty",
    "1. 默认空载:无道具/特性/场地/阶级",
    {
      move: mockMove("十万伏特", "electric", 90, 100),
      row: mockRow("electric", {}),
    },
    { min: 45.2, max: 53.4, tone: "cool" },
    { ohko: "0%", twoHit: "100%", hot: false },
  ),
  scenario(
    "attacker-loaded",
    "2. 典型输出手:攻方道具+特性,+2",
    {
      move: mockMove("流星群", "dragon", 130, 90),
      row: mockRow("dragon", provenance({
        "held-item": { active: [LIFE_ORB] },
        "attacker-ability": { active: ["91"] },
        "attacker-stage": { active: ["2"] },
        "defender-stage": { active: ["0"] },
      }), { basePower: 130, accuracy: 90 }),
      attackerStat: { chips: [chip("182", "252", "heavy")] },
      attackerAbilities: ATK_ABILITIES,
      showAccuracy: true,
    },
    { min: 68.5, max: 80.7, tone: "warm" },
    { ohko: "12.5%", twoHit: "100%", hot: true },
  ),
  scenario(
    "crowded",
    "3. 满负载(range):双方道具+特性+数值区间,雨+电场+反射壁",
    {
      move: mockMove("水炮", "water", 110, 80),
      row: mockRow("water", provenance({
        "held-item": { active: [CHOICE_SPECS] },
        "attacker-ability": { active: ["75"] },
        "weather": { active: ["rain"], neutral: ["sand"] },
        "terrain": { active: ["electric"], inactive: ["grassy"] },
        "attacker-stage": { active: ["1"] },
        "defender-held-item": { active: [ASSAULT_VEST] },
        "defender-ability": { active: ["46"] },
        "screen": { active: ["reflect"] },
        "defender-stage": { active: ["-1"] },
      }), { basePower: 110, accuracy: 80, critical: true }),
      attackerStat: { chips: [chip("140", "200", "none"), chip("150", "220", "some")], expandable: true, onToggle: noop },
      defender: { chips: [chip("110", "205", "none"), chip("120", "220", "some")], expandable: true, onToggle: noop },
      attackerAbilities: ATK_ABILITIES,
      defenderAbilities: DEF_ABILITIES,
      isRangeEnvelope: true,
      showAccuracy: true,
    },
    { min: 100.1, max: 117.9, tone: "lethal" },
    { ohko: "93.8%", twoHit: "100%", hot: true },
  ),
  scenario(
    "items-focus",
    "4. 道具对峙:讲究头带 vs 进化奇石,无其他条件",
    {
      move: mockMove("近身战", "fighting", 120, 100),
      row: mockRow("fighting", provenance({
        "held-item": { active: [CHOICE_BAND] },
        "defender-held-item": { active: [EVIOLITE] },
      }), { basePower: 120 }),
      attackerStat: { chips: [chip("160", "230", "some")] },
    },
    { min: 55.0, max: 64.8, tone: "cool" },
    { ohko: "0%", twoHit: "97.7%", hot: false },
  ),
  scenario(
    "range-envelope",
    "5. Range 包络行:有范围注释与中性来源",
    {
      move: mockMove("打落", "dark", 65, 100),
      row: mockRow("dark", provenance({
        "held-item": { active: [CHOICE_BAND] },
        "terrain": { neutral: ["misty"] },
      }), { basePower: 65 }),
      attackerStat: { chips: [chip("120", "190", "none"), chip("182", "252", "heavy")], expandable: true, onToggle: noop },
      defender: { chips: [chip("90", "180", "none"), chip("120", "230", "some")], expandable: true, onToggle: noop },
      isRangeEnvelope: true,
    },
    { min: 38.0, max: 88.2, tone: "warm" },
    { ohko: "0%", twoHit: "56.3%", hot: false },
  ),
  scenario(
    "extreme",
    "6. 极限满载(range):双道具+双特性+数值区间+天气场地墙+双阶级+CT",
    {
      move: mockMove("水炮", "water", 110, 80),
      row: mockRow("water", provenance({
        "held-item": { active: [CHOICE_SPECS] },
        "attacker-ability": { active: ["75"] },
        "weather": { active: ["rain"], neutral: ["sand"] },
        "terrain": { active: ["electric"], inactive: ["grassy"], neutral: ["misty"] },
        "attacker-stage": { active: ["2"] },
        "defender-held-item": { active: [ASSAULT_VEST] },
        "defender-ability": { active: ["46"] },
        "screen": { active: ["reflect"], unsupported: ["light-screen"] },
        "defender-stage": { active: ["-1"] },
      }), { basePower: 110, accuracy: 80, critical: true }),
      attackerStat: { chips: [chip("140", "200", "none"), chip("150", "220", "some")], expandable: true, onToggle: noop },
      defender: { chips: [chip("110", "205", "none"), chip("120", "220", "some")], expandable: true, onToggle: noop },
      attackerAbilities: ATK_ABILITIES,
      defenderAbilities: DEF_ABILITIES,
      isRangeEnvelope: true,
      showAccuracy: true,
    },
    { min: 100.1, max: 117.9, tone: "lethal" },
    { ohko: "93.8%", twoHit: "100%", hot: true },
  ),
]

// ---------------------------------------------------------------------------
// Shared atoms(变体间只共享原子级零件,不共享布局)
// ---------------------------------------------------------------------------

type Token = { track: string; id: string }

const FIELD_TRACKS: ScenarioTrack[] = ["weather", "terrain", "screen"]
const SIDE_TRACKS: Record<"attack" | "defense", ScenarioTrack[]> = {
  attack: ["held-item", "attacker-ability"],
  defense: ["defender-held-item", "defender-ability"],
}

function tokenLabel(
  track: string,
  id: string,
  props: CardProps,
  intl: ReturnType<typeof useIntl>,
): string {
  if (track === "held-item" || track === "defender-held-item") {
    return itemAriaLabel(id, intl.locale as SupportedLocale)
  }
  if (track === "attacker-ability" || track === "defender-ability") {
    const options = track === "attacker-ability" ? props.attackerAbilities : props.defenderAbilities
    return options.find((option) => String(option.id) === id)?.label ?? id
  }
  if (track === "weather") return intl.formatMessage({ id: `track.weather.${id}` })
  if (track === "terrain") return intl.formatMessage({ id: `track.terrain.${id}` })
  if (track === "screen") return intl.formatMessage({ id: `track.screen.${id}` })
  return id
}

// ponytail: prototype 的 mock 不含 hidden-neutral 特性/道具,跳过原组件里的隐藏过滤。
function tokensOf(props: CardProps, tracks: ScenarioTrack[]): Token[] {
  return tracks.flatMap((track) =>
    (props.row.provenance[track]?.active ?? [])
      .filter((id) => id !== "none" && id !== "0")
      .map((id) => ({ track, id })),
  )
}

function sideTokens(props: CardProps, side: "attack" | "defense"): Token[] {
  return tokensOf(props, SIDE_TRACKS[side])
}

function fieldTokens(props: CardProps): Token[] {
  return tokensOf(props, FIELD_TRACKS)
}

function itemToken(props: CardProps, side: "attack" | "defense"): Token | undefined {
  return sideTokens(props, side).find((token) => token.track.includes("held-item"))
}

function abilityTokens(props: CardProps, side: "attack" | "defense"): Token[] {
  return sideTokens(props, side).filter((token) => token.track.includes("ability"))
}

function otherEntries(props: CardProps): Array<{ track: string; state: string; id: string }> {
  return (Object.entries(props.row.provenance) as Array<[string, (typeof EMPTY_SETS)?]>)
    .flatMap(([track, sets]) =>
      (["inactive", "unsupported", "neutral"] as const).flatMap((state) =>
        (sets?.[state] ?? [])
          .filter((id) => id !== "none" && id !== "0")
          .map((id) => ({ track, state, id })),
      ),
    )
}

function activeStage(props: CardProps, track: "attacker-stage" | "defender-stage"): number {
  const id = (props.row.provenance[track]?.active ?? []).find((value) => value !== "none")
  return Number(id ?? 0)
}

function stageText(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

/** 数值 chip 组 + 区间展开按钮(expandable 时),展开态由本地 state 演示。 */
function RangedChips({ stat, side }: { stat: CardProps["attackerStat"]; side: "offense" | "defense" }) {
  const intl = useIntl()
  const [expanded, setExpanded] = useState(false)
  const toggleLabel = intl.formatMessage({
    id: expanded
      ? side === "offense" ? "damage.row.collapseOffense" : "damage.row.collapseDefense"
      : side === "offense" ? "damage.row.expandOffense" : "damage.row.expandDefense",
  })
  return (
    <StatValueChipPair
      chips={stat.chips}
      compact
      expandable={stat.expandable}
      expanded={stat.expandable && expanded}
      onToggle={stat.expandable ? () => setExpanded((value) => !value) : undefined}
      toggleLabel={toggleLabel}
    />
  )
}

/** 道具 chip:图标+名称,道具显著性的基础单元。lg 用于独占一行的场景。 */
function NamedItemChip({ id, size = "md", className }: { id: string; size?: "md" | "lg"; className?: string }) {
  const intl = useIntl()
  const label = itemAriaLabel(id, intl.locale as SupportedLocale)
  return (
    <span
      title={label}
      className={cn(
        "flex min-w-0 items-center gap-1 rounded-[5px] bg-token-bg pl-0.5 pr-1.5 font-extrabold leading-none text-ink",
        size === "lg" ? "h-5 text-[10px]" : "h-4 text-[9px]",
        className,
      )}
    >
      <HeldItemSpriteIcon id={id} className={size === "lg" ? "size-4" : "size-3.5"} />
      <span className="truncate">{label}</span>
    </span>
  )
}

/** 非道具条件 token 的小 chip(天气/场地/墙/特性)。 */
function TextChip({ token, props }: { token: Token; props: CardProps }) {
  const intl = useIntl()
  const label = tokenLabel(token.track, token.id, props, intl)
  return (
    <span
      title={label}
      className="max-w-[5rem] truncate rounded-[5px] bg-token-bg px-1 text-[9px] font-extrabold leading-4 text-ink"
    >
      {label}
    </span>
  )
}

function IdentityLine({ label, stat, side, children }: {
  label: string
  stat: CardProps["attackerStat"]
  side: "offense" | "defense"
  children?: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[10.5px]">
      <span className="w-[26px] shrink-0 text-[8.5px] text-muted-foreground">{label}</span>
      <RangedChips stat={stat} side={side} />
      {children ? <span className="ml-auto flex shrink-0 items-center gap-1">{children}</span> : null}
    </div>
  )
}

function StageRail({ attack, defense, attackLabel, defenseLabel }: {
  attack: number
  defense: number
  attackLabel: string
  defenseLabel: string
}) {
  return (
    <div className="flex h-full flex-col border-r border-hairline">
      {([[attackLabel, attack], [defenseLabel, defense]] as const).map(([label, value]) => (
        <span
          key={label}
          title={`${label} ${stageText(value)}`}
          className="flex flex-1 items-center justify-center text-[12px] font-extrabold tabular-nums text-ink"
        >
          {value !== 0 ? stageText(value) : <span className="sr-only">{`${label} 0`}</span>}
        </span>
      ))}
    </div>
  )
}

/** 卡头:属性徽章 + 招式名 + 等效威力 + 命中 + 公式入口。bare=true 去掉边框与横 padding(ledger 用)。 */
function CardHeader({ props, bare = false }: { props: CardProps; bare?: boolean }) {
  const intl = useIntl()
  const mechanics = props.row.moveMechanics
  const branch = mechanics.normal ?? mechanics.critical
  const accuracy = mechanics.hitFact === "always-hits"
    ? intl.formatMessage({ id: "damage.conditions.alwaysHits" })
    : `${mechanics.hitFact}%`
  return (
    <div className={cn(
      "flex items-center gap-1 py-1",
      bare ? "border-b border-hairline px-0.5" : "border-b border-card-border px-2",
    )}>
      <span className="flex min-w-0 items-center gap-1">
        <TypeBadge type={props.row.moveType} />
        <span className="truncate text-[12px] font-extrabold">{props.move.label}</span>
      </span>
      <strong
        title={intl.formatMessage({ id: "damage.conditions.effectivePower" })}
        className="ml-auto text-[13px] font-extrabold leading-4 tabular-nums"
      >
        {branch?.effectivePower}
      </strong>
      {props.showAccuracy && (
        <>
          <span aria-hidden className="text-[10.5px] text-muted-foreground">·</span>
          <span title={intl.formatMessage({ id: "damage.conditions.accuracy" })} className="text-[10.5px] tabular-nums">
            {accuracy}
          </span>
        </>
      )}
      {/* ponytail: 静态占位;落地的 winner 复用原 DamageFormulaTooltip */}
      <Info className="size-3 shrink-0 text-muted-foreground" />
    </div>
  )
}

/** 「其他条件(N)」折叠列表,与现状一致的 details 形态。 */
function OtherConditions({ props, bare = false }: { props: CardProps; bare?: boolean }) {
  const intl = useIntl()
  const entries = otherEntries(props)
  const count = entries.length + Number(props.isRangeEnvelope)
  if (count === 0) return null
  return (
    <details className={cn(
      "py-0.5 text-[10px] text-muted-foreground",
      bare ? "px-0.5" : "border-t border-dashed border-card-border px-2",
    )}>
      <summary className="flex cursor-pointer list-none items-center gap-1 text-[9px] leading-none font-bold text-hud-muted hover:text-ink [&::-webkit-details-marker]:hidden [&::marker]:hidden">
        <MoreHorizontal className="size-2.5 shrink-0" aria-hidden />
        {intl.formatMessage({ id: "damage.conditions.other" }, { count })}
      </summary>
      <div className="space-y-1 pt-1 text-ink">
        {props.isRangeEnvelope && <p>{intl.formatMessage({ id: "damage.rangeEnvelope" })}</p>}
        {entries.map(({ track, state, id }) => (
          <p key={`${track}:${state}:${id}`}>
            {intl.formatMessage({ id: `damage.sources.${state}` })}
            {" · "}
            {tokenLabel(track, id, props, intl)}
          </p>
        ))}
      </div>
    </details>
  )
}

/** 台账行:label:value,ledger 变体与 drawer 详情面板共用。 */
function LedgerRow({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <span className="w-7 shrink-0 text-[8.5px] font-bold text-muted-foreground">{label}</span>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">{children}</span>
    </div>
  )
}

/** 攻/防 mini 前缀(道具对峙、特性对峙时区分归属)。 */
function SideMark({ side }: { side: "attack" | "defense" }) {
  return (
    <span className="shrink-0 text-[8px] font-bold text-hud-muted">
      {side === "attack" ? "攻" : "防"}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

function CurrentCard(props: CardProps) {
  return <DamageScenarioSummary {...props} />
}

/** B · duo:双栏对阵。行首:攻击/防御 + 道具icon + 特性 + stage(右锚);数值行紧随。战场与其他条件合并为一行底部条。 */
function DuoCard(props: CardProps) {
  const intl = useIntl()
  const [otherOpen, setOtherOpen] = useState(false)
  const attackLabel = intl.formatMessage({ id: "damage.row.attack" })
  const defenseLabel = intl.formatMessage({ id: "damage.row.defense" })
  const field = fieldTokens(props)
  const entries = otherEntries(props)
  const otherCount = entries.length + Number(props.isRangeEnvelope)
  const panels = [
    { side: "attack" as const, chipSide: "offense" as const, label: attackLabel, stage: activeStage(props, "attacker-stage"), stat: props.attackerStat },
    { side: "defense" as const, chipSide: "defense" as const, label: defenseLabel, stage: activeStage(props, "defender-stage"), stat: props.defender },
  ]
  return (
    <article className="w-full rounded-[10px] border border-card-border bg-muted/60 md:w-[14.75rem]">
      <CardHeader props={props} />
      <div className="grid grid-cols-2 divide-x divide-hairline">
        {panels.map(({ side, chipSide, label, stage, stat }) => {
          const item = itemToken(props, side)
          const abilities = abilityTokens(props, side)
          return (
            <div key={side} className="min-w-0 space-y-0.5 px-1.5 py-1">
              <div className="flex h-4 items-center gap-1">
                <span className="text-[8.5px] text-muted-foreground">{label}</span>
                {item && (
                  <span
                    className="grid size-4 shrink-0 place-items-center"
                    title={itemAriaLabel(item.id, intl.locale as SupportedLocale)}
                  >
                    <HeldItemSpriteIcon id={item.id} className="size-4" />
                  </span>
                )}
                {abilities.map((token) => (
                  <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />
                ))}
                {stage !== 0 && (
                  <b className="ml-auto text-[10px] font-extrabold tabular-nums text-ink">{stageText(stage)}</b>
                )}
              </div>
              <RangedChips stat={stat} side={chipSide} />
            </div>
          )
        })}
      </div>
      {(field.length > 0 || otherCount > 0) && (
        <div className="border-t border-dashed border-card-border px-2 py-0.5">
          <div className="flex flex-wrap items-center gap-1">
            {field.map((token) => (
              <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />
            ))}
            {otherCount > 0 && (
              <button
                type="button"
                aria-expanded={otherOpen}
                onClick={() => setOtherOpen((value) => !value)}
                className="ml-auto flex shrink-0 items-center gap-0.5 text-[9px] font-bold leading-none text-hud-muted hover:text-ink"
              >
                <MoreHorizontal className="size-2.5" aria-hidden />
                {intl.formatMessage({ id: "damage.conditions.other" }, { count: otherCount })}
                <ChevronDown className={cn("size-2.5 transition-transform", otherOpen && "rotate-180 text-ink")} aria-hidden />
              </button>
            )}
          </div>
          {otherOpen && otherCount > 0 && (
            <div className="space-y-1 pt-1 text-[10px] text-ink">
              {props.isRangeEnvelope && <p>{intl.formatMessage({ id: "damage.rangeEnvelope" })}</p>}
              {entries.map(({ track, state, id }) => (
                <p key={`${track}:${state}:${id}`}>
                  {intl.formatMessage({ id: `damage.sources.${state}` })}
                  {" · "}
                  {tokenLabel(track, id, props, intl)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

/** C · banner:战场条件抽成整行宽横幅(页面级渲染,见 FieldStrip),卡内只剩单位条件。 */
function BannerCard(props: CardProps) {
  const intl = useIntl()
  const attackLabel = intl.formatMessage({ id: "damage.row.attack" })
  const defenseLabel = intl.formatMessage({ id: "damage.row.defense" })
  return (
    <article className="w-full rounded-[10px] border border-card-border bg-muted/60 md:w-[14.75rem]">
      <CardHeader props={props} />
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)]">
        <StageRail
          attack={activeStage(props, "attacker-stage")}
          defense={activeStage(props, "defender-stage")}
          attackLabel={attackLabel}
          defenseLabel={defenseLabel}
        />
        <div className="space-y-0.5 px-2 py-1">
          <IdentityLine label={attackLabel} stat={props.attackerStat} side="offense">
            {sideTokens(props, "attack").map((token) => (
              token.track.includes("held-item")
                ? <NamedItemChip key={`${token.track}:${token.id}`} id={token.id} />
                : <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />
            ))}
          </IdentityLine>
          <IdentityLine label={defenseLabel} stat={props.defender} side="defense">
            {sideTokens(props, "defense").map((token) => (
              token.track.includes("held-item")
                ? <NamedItemChip key={`${token.track}:${token.id}`} id={token.id} />
                : <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />
            ))}
          </IdentityLine>
        </div>
      </div>
      <OtherConditions props={props} />
    </article>
  )
}

/** banner 变体的整行宽战场横幅,渲染在结果行 grid 上方。 */
function FieldStrip({ props }: { props: CardProps }) {
  const tokens = fieldTokens(props)
  if (tokens.length === 0) return null
  return (
    <div className="mb-1 flex items-center gap-1.5 rounded-[8px] border border-dashed border-card-border bg-muted/40 px-2 py-1">
      <span className="shrink-0 text-[8.5px] font-bold text-hud-muted">战场</span>
      {tokens.map((token) => (
        <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />
      ))}
    </div>
  )
}

/** D · ledger:去卡片化台账,按条件类型分行;只渲染非空行,高度随负载自适应。 */
function LedgerCard(props: CardProps) {
  const intl = useIntl()
  const attackLabel = intl.formatMessage({ id: "damage.row.attack" })
  const defenseLabel = intl.formatMessage({ id: "damage.row.defense" })
  const items = (["attack", "defense"] as const)
    .map((side) => ({ side, token: itemToken(props, side) }))
    .filter((entry) => entry.token)
  const abilities = (["attack", "defense"] as const)
    .flatMap((side) => abilityTokens(props, side).map((token) => ({ side, token })))
  const field = fieldTokens(props)
  const attackStage = activeStage(props, "attacker-stage")
  const defenseStage = activeStage(props, "defender-stage")
  return (
    <div className="w-full md:w-[14.75rem]">
      <CardHeader props={props} bare />
      <div className="divide-y divide-hairline/60">
        <LedgerRow label={attackLabel}>
          <RangedChips stat={props.attackerStat} side="offense" />
          {attackStage !== 0 && <b className="text-[10px] font-extrabold tabular-nums">{stageText(attackStage)}</b>}
        </LedgerRow>
        <LedgerRow label={defenseLabel}>
          <RangedChips stat={props.defender} side="defense" />
          {defenseStage !== 0 && <b className="text-[10px] font-extrabold tabular-nums">{stageText(defenseStage)}</b>}
        </LedgerRow>
        {items.length > 0 && (
          <LedgerRow label="道具">
            {items.map(({ side, token }) => (
              <span key={`${side}:${token!.id}`} className="flex min-w-0 items-center gap-0.5">
                <SideMark side={side} />
                <NamedItemChip id={token!.id} size="lg" />
              </span>
            ))}
          </LedgerRow>
        )}
        {abilities.length > 0 && (
          <LedgerRow label="特性">
            {abilities.map(({ side, token }) => (
              <span key={`${side}:${token.id}`} className="flex min-w-0 items-center gap-0.5">
                <SideMark side={side} />
                <TextChip token={token} props={props} />
              </span>
            ))}
          </LedgerRow>
        )}
        {field.length > 0 && (
          <LedgerRow label="战场">
            {field.map((token) => (
              <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />
            ))}
          </LedgerRow>
        )}
      </div>
      <OtherConditions props={props} bare />
    </div>
  )
}

/** E · drawer:默认紧凑卡(道具常驻底部条),onToggle 展开整行宽详情面板(DetailPanel)。 */
function DrawerCard(props: CardProps & { open?: boolean; onToggle?: () => void }) {
  const intl = useIntl()
  const attackLabel = intl.formatMessage({ id: "damage.row.attack" })
  const defenseLabel = intl.formatMessage({ id: "damage.row.defense" })
  const items = [itemToken(props, "attack"), itemToken(props, "defense")].filter(Boolean) as Token[]
  const hiddenCount =
    abilityTokens(props, "attack").length +
    abilityTokens(props, "defense").length +
    fieldTokens(props).length +
    otherEntries(props).length +
    Number(props.isRangeEnvelope)
  return (
    <article className="w-full rounded-[10px] border border-card-border bg-muted/60 md:w-[14.75rem]">
      <CardHeader props={props} />
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)]">
        <StageRail
          attack={activeStage(props, "attacker-stage")}
          defense={activeStage(props, "defender-stage")}
          attackLabel={attackLabel}
          defenseLabel={defenseLabel}
        />
        <div className="space-y-0.5 px-2 py-1">
          <IdentityLine label={attackLabel} stat={props.attackerStat} side="offense" />
          <IdentityLine label={defenseLabel} stat={props.defender} side="defense" />
        </div>
      </div>
      {(items.length > 0 || hiddenCount > 0) && (
        <div className="flex items-center gap-1 border-t border-dashed border-card-border px-2 py-0.5">
          {items.map((token) => (
            <NamedItemChip key={`${token.track}:${token.id}`} id={token.id} />
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              aria-expanded={props.open}
              onClick={props.onToggle}
              className="ml-auto flex shrink-0 items-center gap-0.5 text-[9px] font-bold leading-none text-hud-muted hover:text-ink"
            >
              条件详情({hiddenCount})
              <ChevronDown className={cn("size-2.5 transition-transform", props.open && "rotate-180 text-ink")} aria-hidden />
            </button>
          )}
        </div>
      )}
    </article>
  )
}

/** drawer 展开面板:整行宽,三栏(攻/防/战场与其他),复用台账行。 */
function DetailPanel({ props }: { props: CardProps }) {
  const intl = useIntl()
  const attackLabel = intl.formatMessage({ id: "damage.row.attack" })
  const defenseLabel = intl.formatMessage({ id: "damage.row.defense" })
  const entries = otherEntries(props)
  const columns = [
    { side: "attack" as const, label: attackLabel, stage: activeStage(props, "attacker-stage") },
    { side: "defense" as const, label: defenseLabel, stage: activeStage(props, "defender-stage") },
  ]
  return (
    <div className="grid grid-cols-3 gap-4 rounded-[10px] border border-card-border bg-muted/40 px-3 py-2">
      {columns.map(({ side, label, stage }) => {
        const item = itemToken(props, side)
        const abilities = abilityTokens(props, side)
        return (
          <div key={side} className="min-w-0">
            <p className="text-[8.5px] font-bold text-hud-muted">{label}</p>
            <div className="divide-y divide-hairline/60">
              <LedgerRow label="道具">
                {item ? <NamedItemChip id={item.id} size="lg" /> : <span className="text-[9px] text-hud-muted">无</span>}
              </LedgerRow>
              <LedgerRow label="特性">
                {abilities.length > 0
                  ? abilities.map((token) => <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />)
                  : <span className="text-[9px] text-hud-muted">无</span>}
              </LedgerRow>
              <LedgerRow label="阶级">
                {stage !== 0
                  ? <b className="text-[10px] font-extrabold tabular-nums">{stageText(stage)}</b>
                  : <span className="text-[9px] text-hud-muted">0</span>}
              </LedgerRow>
            </div>
          </div>
        )
      })}
      <div className="min-w-0">
        <p className="text-[8.5px] font-bold text-hud-muted">战场与其他</p>
        <div className="divide-y divide-hairline/60">
          <LedgerRow label="战场">
            {fieldTokens(props).length > 0
              ? fieldTokens(props).map((token) => <TextChip key={`${token.track}:${token.id}`} token={token} props={props} />)
              : <span className="text-[9px] text-hud-muted">无</span>}
          </LedgerRow>
          {(entries.length > 0 || props.isRangeEnvelope) && (
            <LedgerRow label="其他">
              <span className="text-[9px] leading-4 text-muted-foreground">
                {props.isRangeEnvelope && <span className="block">{intl.formatMessage({ id: "damage.rangeEnvelope" })}</span>}
                {entries.map(({ track, state, id }) => (
                  <span key={`${track}:${state}:${id}`} className="block">
                    {intl.formatMessage({ id: `damage.sources.${state}` })}
                    {" · "}
                    {tokenLabel(track, id, props, intl)}
                  </span>
                ))}
              </span>
            </LedgerRow>
          )}
        </div>
      </div>
    </div>
  )
}

const CARD_COMPONENTS: Record<string, React.ComponentType<CardProps>> = {
  current: CurrentCard,
  duo: DuoCard,
  banner: BannerCard,
  ledger: LedgerCard,
}

// ---------------------------------------------------------------------------
// 仿结果行环境:卡片 + 简化 plot + KO 列,复刻真实行的 grid 与密度
// ---------------------------------------------------------------------------

function FakePlot({ plot }: { plot: MockScenario["plot"] }) {
  const left = `${pctToFraction(plot.min) * 100}%`
  const width = `${(pctToFraction(plot.max) - pctToFraction(plot.min)) * 100}%`
  return (
    <div className="relative h-10 min-w-0">
      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-hairline" aria-hidden />
      <div
        className={cn("absolute top-1/2 h-7 -translate-y-1/2 rounded-full border border-ink", `damage-tone--${plot.tone}`)}
        style={{ left, width }}
      />
      <div
        className="pointer-events-none absolute -bottom-5 overflow-visible whitespace-nowrap text-[9.5px] font-extrabold tabular-nums"
        style={{ left, width }}
      >
        {plot.min.toFixed(1)}% ~ {plot.max.toFixed(1)}%
      </div>
    </div>
  )
}

function FakeKO({ ko }: { ko: MockScenario["ko"] }) {
  return (
    <div className="grid grid-cols-2 text-center text-[12px] font-extrabold tabular-nums">
      <span>
        {ko.hot ? (
          <span className="inline-block rounded-[8px] border-2 border-ink bg-signal-yellow px-1.5 py-px shadow-hud-chip">
            {ko.ohko}
          </span>
        ) : (
          <span className={ko.ohko === "0%" ? "text-hud-muted" : undefined}>{ko.ohko}</span>
        )}
      </span>
      <span>{ko.twoHit}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ConditionCardPrototype() {
  const [variant, setVariant] = useState(() => readPrototypeVariant(VARIANTS, "current"))
  // drawer 变体:满负载场景默认展开,直接呈现「满载也能完整展示」的目标态
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ crowded: true, extreme: true })
  const [heights, setHeights] = useState<string[]>([])
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const extraRefs = useRef<Array<HTMLDivElement | null>>([])

  function changeVariant(next: string) {
    setVariant(next)
    setPrototypeVariant(next)
  }

  const active = VARIANTS.find((item) => item.key === variant) ?? VARIANTS[0]
  const Card = CARD_COMPONENTS[active.key] ?? CurrentCard

  // 变体/展开态变化后量测:卡高;banner 的横幅、drawer 的面板计入「外部区域」
  useEffect(() => {
    setHeights(SCENARIOS.map((_, index) => {
      const card = cardRefs.current[index]?.offsetHeight ?? 0
      const extra = extraRefs.current[index]?.offsetHeight ?? 0
      return extra > 0 ? `${card}+${extra}=${card + extra}px` : `${card}px`
    }))
  }, [variant, expanded])

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 pb-24">
      <header className="space-y-2">
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          Prototype · Damage Conditions Card
        </p>
        <h1 className="text-lg font-extrabold">条件卡重设计:满载场景也能完整展示</h1>
        <p className="text-sm text-muted-foreground">
          变体 <span className="font-bold text-ink">{active.key}</span>:{active.note}
        </p>
        <p className="text-[11px] font-bold tabular-nums text-hud-muted">
          实测高度(场景 1→6):{heights.length > 0 ? heights.join(" / ") : "…"}
        </p>
      </header>

      <section className="overflow-hidden rounded-[14px] border-2 border-ink bg-paper shadow-hud-panel">
        <DamagePercentAxis />
        <div className="space-y-4 px-3 py-4">
          {SCENARIOS.map((s, index) => (
            <div key={s.key}>
              <p className="pb-1 text-[9px] font-bold text-hud-muted">{s.caption}</p>
              {active.key === "banner" && (
                <div ref={(el) => { extraRefs.current[index] = el }}>
                  <FieldStrip props={s.props} />
                </div>
              )}
              <div className="grid min-h-[4.5rem] grid-cols-[14.75rem_minmax(0,1fr)_9rem] items-center gap-3">
                <div ref={(el) => { cardRefs.current[index] = el }}>
                  {active.key === "drawer" ? (
                    <DrawerCard
                      {...s.props}
                      open={expanded[s.key] ?? false}
                      onToggle={() => setExpanded((prev) => ({ ...prev, [s.key]: !prev[s.key] }))}
                    />
                  ) : (
                    <Card {...s.props} />
                  )}
                </div>
                <FakePlot plot={s.plot} />
                <FakeKO ko={s.ko} />
              </div>
              {active.key === "drawer" && expanded[s.key] && (
                <div ref={(el) => { extraRefs.current[index] = el }} className="mt-2">
                  <DetailPanel props={s.props} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={changeVariant} />
    </main>
  )
}
