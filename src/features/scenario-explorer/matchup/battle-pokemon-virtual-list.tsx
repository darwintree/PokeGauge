import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual"
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
  type RefObject,
} from "react"

import type { BattlePokemonOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { BattlePokemonPickerItem } from "./battle-pokemon-picker-item"

type BattlePokemonVirtualListProps = {
  options: BattlePokemonOption[]
  value: BattlePokemonId | null
  onSelect: (id: BattlePokemonId) => void
  scrollRef: RefObject<HTMLDivElement | null>
}

export function BattlePokemonVirtualList({
  options,
  value,
  onSelect,
  scrollRef,
}: BattlePokemonVirtualListProps): JSX.Element {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const pendingFocusIndex = useRef<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 65,
    getItemKey: useCallback((index: number) => options[index].id, [options]),
    overscan: 5,
    // Supply the initial window before the portal's scroll container is measured.
    initialRect: { width: 0, height: 700 },
    rangeExtractor: (range) => {
      const indexes = defaultRangeExtractor(range)
      if (focusedIndex != null && !indexes.includes(focusedIndex)) {
        indexes.push(focusedIndex)
        indexes.sort((a, b) => a - b)
      }
      return indexes
    },
  })

  useLayoutEffect(() => {
    virtualizer.scrollToOffset(0)
  }, [virtualizer])

  useLayoutEffect(() => {
    if (pendingFocusIndex.current == null) return
    const button = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-index="${pendingFocusIndex.current}"] button`,
    )
    if (button) {
      button.focus({ preventScroll: true })
      pendingFocusIndex.current = null
    }
  })

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number): void {
    let next: number
    switch (event.key) {
      case "Tab":
        next = index + (event.shiftKey ? -1 : 1)
        break
      case "ArrowDown":
        next = index + 1
        break
      case "ArrowUp":
        next = index - 1
        break
      case "Home":
        next = 0
        break
      case "End":
        next = options.length - 1
        break
      default:
        return
    }
    if (next < 0 || next >= options.length) return
    event.preventDefault()
    pendingFocusIndex.current = next
    setFocusedIndex(next)
    virtualizer.scrollToIndex(next, { align: "auto" })
  }

  return (
    <div
      ref={listRef}
      role="list"
      style={{ height: virtualizer.getTotalSize(), position: "relative" }}
    >
      {virtualizer.getVirtualItems().map((row) => {
        const option = options[row.index]
        return (
          <div
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            role="listitem"
            aria-posinset={row.index + 1}
            aria-setsize={options.length}
            className={cn(
              "absolute top-0 left-0 w-full",
              row.index === options.length - 1 && "[&>button]:border-b-0",
            )}
            style={{ transform: `translateY(${row.start}px)` }}
            onFocusCapture={() => setFocusedIndex(row.index)}
            onKeyDown={(event) => handleKeyDown(event, row.index)}
          >
            <BattlePokemonPickerItem
              option={option}
              current={option.id === value}
              onSelect={() => onSelect(option.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
