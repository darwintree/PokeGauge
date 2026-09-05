const assetBaseUrl = import.meta.env.VITE_STATIC_ASSET_BASE_URL.replace(/\/+$/, "")

export function staticAssetUrl(sourcePath: string): string {
  return `${assetBaseUrl}/${sourcePath}`
}

export function pokemonSpriteUrl(id: number, side: "front" | "back" = "front"): string {
  const file = side === "back" ? `back/${id}.png` : `${id}.png`
  return staticAssetUrl(`sprites/pokemon/${file}`)
}
