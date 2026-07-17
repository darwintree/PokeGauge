// PROTOTYPE — minimal Move snapshot list and drill-in editor for an 18rem rail.
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Snapshot = {
  id: number
  template: string
  category: "Physical" | "Special"
  power: number
  accuracy: number
  criticalStage: number
  spreadEligible: boolean
  spread: boolean
}

type MoveSnapshotPrototypeProps = {
  attackerLabel: string
  defenderLabel: string
}

const INITIAL_SNAPSHOTS: Snapshot[] = [
  {
    id: 1,
    template: "Earthquake",
    category: "Physical",
    power: 100,
    accuracy: 100,
    criticalStage: 0,
    spreadEligible: true,
    spread: true,
  },
  {
    id: 2,
    template: "Earthquake",
    category: "Physical",
    power: 100,
    accuracy: 100,
    criticalStage: 3,
    spreadEligible: true,
    spread: false,
  },
  {
    id: 3,
    template: "Gyro Ball",
    category: "Physical",
    power: 0,
    accuracy: 100,
    criticalStage: 0,
    spreadEligible: false,
    spread: false,
  },
]

function snapshotLabel(snapshot: Snapshot): string {
  return snapshot.template
}

function SnapshotStatus({ snapshot }: { snapshot: Snapshot }) {
  if (snapshot.power <= 0) return <Badge variant="destructive">Power required</Badge>
  if (snapshot.accuracy <= 0) return <Badge variant="destructive">Accuracy required</Badge>
  return <Badge variant="secondary">Ready</Badge>
}

function SnapshotSummary({ snapshot }: { snapshot: Snapshot }) {
  const spread = snapshot.spreadEligible
    ? snapshot.spread
      ? "Spread on"
      : "Spread off"
    : "Single-target"
  let critical = "Normal crit"
  if (snapshot.criticalStage === 3) critical = "Guaranteed crit"
  else if (snapshot.criticalStage > 0) critical = "Easy crit"

  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs tabular-nums">
        Power {snapshot.power || "—"} · Accuracy {snapshot.accuracy || "—"}%
      </p>
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline">{snapshot.category}</Badge>
        <Badge variant="outline">{spread}</Badge>
        <Badge variant="outline">{critical}</Badge>
      </div>
    </div>
  )
}

function SnapshotFields({
  snapshot,
  onChange,
}: {
  snapshot: Snapshot
  onChange: (patch: Partial<Snapshot>) => void
}) {
  function parseInteger(value: string, max = Number.POSITIVE_INFINITY) {
    return Math.min(max, Math.max(0, Math.trunc(Number(value) || 0)))
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="space-y-1">
        <span className="text-muted-foreground text-xs">Power</span>
        <Input
          type="number"
          min={0}
          step={1}
          value={snapshot.power}
          aria-invalid={snapshot.power <= 0}
          onChange={(event) => onChange({ power: parseInteger(event.target.value) })}
        />
      </label>
      <label className="space-y-1">
        <span className="text-muted-foreground text-xs">Accuracy</span>
        <Input
          type="number"
          min={0}
          max={100}
          step={1}
          value={snapshot.accuracy}
          aria-invalid={snapshot.accuracy <= 0}
          onChange={(event) => onChange({ accuracy: parseInteger(event.target.value, 100) })}
        />
      </label>
      <label className="space-y-1">
        <span className="text-muted-foreground text-xs">Critical stage</span>
        <select
          value={snapshot.criticalStage}
          onChange={(event) => onChange({ criticalStage: Number(event.target.value) })}
          className="border-input bg-background h-8 w-full rounded-lg border px-2 text-sm"
        >
          {[0, 1, 2, 3].map((stage) => (
            <option key={stage} value={stage}>
              +{stage}{stage === 3 ? " · guaranteed" : ""}
            </option>
          ))}
        </select>
      </label>
      {snapshot.spreadEligible ? (
        <div className="space-y-1">
          <span className="text-muted-foreground block text-xs">Spread modifier</span>
          <div className="flex h-8 items-center gap-2">
            <Switch
              checked={snapshot.spread}
              onCheckedChange={(spread) => onChange({ spread })}
            />
            <span className="text-xs">{snapshot.spread ? "On" : "Off"}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SnapshotList({
  snapshots,
  onAdd,
  onEdit,
}: {
  snapshots: Snapshot[]
  onAdd: () => void
  onEdit: (id: number) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium">Move track</h2>
          <p className="text-muted-foreground text-xs">Choose one snapshot to edit.</p>
        </div>
        <Button size="icon-xs" aria-label="Add move" onClick={onAdd}>
          <Plus />
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        {snapshots.map((snapshot) => (
          <button
            key={snapshot.id}
            type="button"
            onClick={() => onEdit(snapshot.id)}
            className="hover:bg-muted flex w-full items-center gap-2 border-b px-2 py-2 text-left last:border-b-0"
          >
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                snapshot.power > 0 && snapshot.accuracy > 0
                  ? "bg-emerald-500"
                  : "bg-destructive",
              )}
            />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {snapshotLabel(snapshot)}
              </span>
              <SnapshotSummary snapshot={snapshot} />
            </div>
            <ChevronRight className="text-muted-foreground size-4 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

function SnapshotEditor({
  snapshot,
  onBack,
  onChange,
  onRemove,
}: {
  snapshot: Snapshot
  onBack: () => void
  onChange: (patch: Partial<Snapshot>) => void
  onRemove: () => void
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  return (
    <div className="space-y-3">
      <Button size="xs" variant="ghost" onClick={onBack}>
        <ChevronLeft />
        All snapshots
      </Button>
      <Card size="sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>{snapshotLabel(snapshot)}</CardTitle>
              <SnapshotSummary snapshot={snapshot} />
            </div>
            <SnapshotStatus snapshot={snapshot} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 border-t pt-3">
          <SnapshotFields snapshot={snapshot} onChange={onChange} />
          {confirmingRemove ? (
            <div className="grid grid-cols-2 gap-1">
              <Button size="xs" variant="destructive" onClick={onRemove}>
                Confirm remove
              </Button>
              <Button size="xs" variant="outline" onClick={() => setConfirmingRemove(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              size="xs"
              variant="destructive"
              onClick={() => setConfirmingRemove(true)}
            >
              <Trash2 />
              Remove snapshot
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function MoveSnapshotPrototype({
  attackerLabel,
  defenderLabel,
}: MoveSnapshotPrototypeProps) {
  const [snapshots, setSnapshots] = useState(INITIAL_SNAPSHOTS)
  const [editingId, setEditingId] = useState<number | null>(null)
  const editingSnapshot = snapshots.find((snapshot) => snapshot.id === editingId)

  function addSnapshot() {
    setSnapshots((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((snapshot) => snapshot.id)) + 1,
        template: "Heavy Slam",
        category: "Physical",
        power: 120,
        accuracy: 100,
        criticalStage: 0,
        spreadEligible: false,
        spread: false,
      },
    ])
  }

  function updateSnapshot(id: number, patch: Partial<Snapshot>) {
    setSnapshots((current) =>
      current.map((snapshot) => (snapshot.id === id ? { ...snapshot, ...patch } : snapshot)),
    )
  }

  function removeSnapshot(id: number) {
    setSnapshots((current) => current.filter((snapshot) => snapshot.id !== id))
    setEditingId(null)
  }

  return (
    <div className="mx-auto min-h-svh max-w-6xl p-4 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <Badge className="w-fit" variant="outline">PROTOTYPE · 18rem rail</Badge>
              <CardTitle>{attackerLabel} → {defenderLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              {editingSnapshot ? (
                <SnapshotEditor
                  snapshot={editingSnapshot}
                  onBack={() => setEditingId(null)}
                  onChange={(patch) => updateSnapshot(editingSnapshot.id, patch)}
                  onRemove={() => removeSnapshot(editingSnapshot.id)}
                />
              ) : (
                <SnapshotList
                  snapshots={snapshots}
                  onAdd={addSnapshot}
                  onEdit={setEditingId}
                />
              )}
            </CardContent>
          </Card>
        </aside>
        <main className="min-w-0 flex-1 space-y-4">
          <header>
            <h1 className="text-xl font-semibold">Damage results</h1>
            <p className="text-muted-foreground text-sm">
              Editing stays in the rail; configured snapshots produce stable result rows.
            </p>
          </header>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Result identity preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="text-sm">
                    <span className="font-medium">{snapshotLabel(snapshot)}</span>
                  </span>
                  {snapshot.power > 0 && snapshot.accuracy > 0 ? (
                    <span className="text-xs tabular-nums">84–99 damage</span>
                  ) : (
                    <span className="text-destructive text-xs">No result until configured</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
