import { type ReactNode, useId } from "react"
import { Search } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function PickerDialog({
  open,
  onOpenChange,
  title,
  searchLabel,
  searchPlaceholder,
  query,
  onQueryChange,
  beforeList,
  bodyClassName,
  empty,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  searchLabel: string
  searchPlaceholder: string
  query: string
  onQueryChange: (query: string) => void
  beforeList?: ReactNode
  bodyClassName?: string
  empty?: ReactNode
  children?: ReactNode
}) {
  const searchId = useId()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 top-auto left-0 h-[min(44rem,calc(100svh-1rem))] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden translate-x-0 translate-y-0 rounded-b-none p-0 sm:top-1/2 sm:left-1/2 sm:h-[min(44rem,calc(100svh-2rem))] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
        <DialogHeader className="border-b px-4 py-3 pr-12">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-col gap-3 p-4">
          <div className="relative shrink-0">
            <Label htmlFor={searchId} className="sr-only">
              {searchLabel}
            </Label>
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={searchId}
              value={query}
              placeholder={searchPlaceholder}
              className="pl-8"
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>
          {beforeList}
          <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", bodyClassName)}>
            {empty != null ? (
              <div className="text-muted-foreground p-6 text-center text-sm">{empty}</div>
            ) : (
              children
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
