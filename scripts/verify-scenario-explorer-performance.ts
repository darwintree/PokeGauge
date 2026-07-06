import { mkdtemp, readFile, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { performance } from "node:perf_hooks"
import { gzipSync } from "node:zlib"
import { build } from "vite"

import {
  getCatalogShell,
  getDefaultMatchupIds,
  getDefaultMoveCategory,
  listAttackers,
  listDefenders,
} from "../src/lib/catalog/index.ts"
import type { SupportedLocale } from "../src/lib/i18n/index.ts"

type CatalogResult = {
  ms: number
  attackers: number
  defenders: number
  moves: number
  defaultMovePickStatus: string
  defaultMoveIds: number[]
}

type InitialAsset = {
  file: string
  bytes: number
  gzipBytes: number
}

const DEFAULT_CATALOG_BUDGET_MS = 500
const DEFAULT_INITIAL_JS_BUDGET_BYTES = 900 * 1024
const DEFAULT_INITIAL_JS_GZIP_BUDGET_BYTES = 250 * 1024
const HARD_TIMEOUT_MS = 15_000

const hardTimeout = setTimeout(() => {
  console.error(`Scenario Explorer performance verification exceeded ${HARD_TIMEOUT_MS}ms.`)
  process.exit(1)
}, HARD_TIMEOUT_MS)

function readPositiveNumberEnv(name: string, fallback: number): number {
  const value = process.env[name]
  if (!value) return fallback

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number, got ${value}`)
  }
  return parsed
}

function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

async function measureCatalog(locale: SupportedLocale): Promise<CatalogResult> {
  const defaults = getDefaultMatchupIds()
  const start = performance.now()
  const [attackers, defenders, catalog] = await Promise.all([
    listAttackers(locale),
    listDefenders(locale),
    getCatalogShell(
      defaults.attackerId,
      defaults.defenderId,
      locale,
      getDefaultMoveCategory(defaults.attackerId),
    ),
  ])

  return {
    ms: Math.round(performance.now() - start),
    attackers: attackers.length,
    defenders: defenders.length,
    moves: catalog.moves.length,
    defaultMovePickStatus: catalog.defaultMovePickStatus,
    defaultMoveIds: catalog.defaultMoveIds,
  }
}

async function measureProductionInitialJs(): Promise<InitialAsset[]> {
  const outDir = await mkdtemp(path.join(tmpdir(), "scenario-explorer-build-"))

  try {
    await build({
      configFile: path.resolve("vite.config.ts"),
      build: {
        outDir,
        emptyOutDir: true,
      },
      logLevel: "warn",
    })

    const indexHtml = await readFile(path.join(outDir, "index.html"), "utf8")
    const jsAssetPaths = [...indexHtml.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)].map(
      ([, source]) => source.replace(/^\//, ""),
    )

    if (jsAssetPaths.length === 0) {
      throw new Error("Production build index.html did not include an initial JavaScript asset.")
    }

    return Promise.all(
      jsAssetPaths.map(async (assetPath) => {
        const filePath = path.join(outDir, assetPath)
        const [file, fileStat] = await Promise.all([readFile(filePath), stat(filePath)])
        return {
          file: assetPath,
          bytes: fileStat.size,
          gzipBytes: gzipSync(file).length,
        }
      }),
    )
  } finally {
    await rm(outDir, { recursive: true, force: true })
  }
}

function assertCatalog(result: CatalogResult, budgetMs: number): string[] {
  const failures: string[] = []
  if (result.ms > budgetMs) {
    failures.push(`catalog initialization took ${result.ms}ms, budget ${budgetMs}ms`)
  }
  if (result.attackers === 0) failures.push("catalog returned no attackers")
  if (result.defenders === 0) failures.push("catalog returned no defenders")
  if (result.moves === 0) failures.push("catalog returned no fixed-power moves")
  return failures
}

function assertInitialJs(
  assets: InitialAsset[],
  rawBudgetBytes: number,
  gzipBudgetBytes: number,
): string[] {
  const failures: string[] = []
  const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0)
  const totalGzipBytes = assets.reduce((sum, asset) => sum + asset.gzipBytes, 0)

  if (totalBytes > rawBudgetBytes) {
    failures.push(
      `initial production JS is ${formatBytes(totalBytes)}, budget ${formatBytes(rawBudgetBytes)}`,
    )
  }
  if (totalGzipBytes > gzipBudgetBytes) {
    failures.push(
      `initial production JS gzip is ${formatBytes(totalGzipBytes)}, budget ${formatBytes(gzipBudgetBytes)}`,
    )
  }

  return failures
}

async function main() {
  const catalogBudgetMs = readPositiveNumberEnv(
    "SCENARIO_EXPLORER_CATALOG_BUDGET_MS",
    DEFAULT_CATALOG_BUDGET_MS,
  )
  const initialJsBudgetBytes = readPositiveNumberEnv(
    "SCENARIO_EXPLORER_INITIAL_JS_BUDGET_BYTES",
    DEFAULT_INITIAL_JS_BUDGET_BYTES,
  )
  const initialJsGzipBudgetBytes = readPositiveNumberEnv(
    "SCENARIO_EXPLORER_INITIAL_JS_GZIP_BUDGET_BYTES",
    DEFAULT_INITIAL_JS_GZIP_BUDGET_BYTES,
  )

  const [catalog, initialJs] = await Promise.all([
    measureCatalog("zh-hans"),
    measureProductionInitialJs(),
  ])
  const failures = [
    ...assertCatalog(catalog, catalogBudgetMs),
    ...assertInitialJs(initialJs, initialJsBudgetBytes, initialJsGzipBudgetBytes),
  ]

  console.log(
    JSON.stringify(
      {
        budgets: {
          catalogMs: catalogBudgetMs,
          initialJsBytes: initialJsBudgetBytes,
          initialJsGzipBytes: initialJsGzipBudgetBytes,
        },
        catalog,
        productionBuild: {
          initialJs,
          totalInitialJsBytes: initialJs.reduce((sum, asset) => sum + asset.bytes, 0),
          totalInitialJsGzipBytes: initialJs.reduce((sum, asset) => sum + asset.gzipBytes, 0),
        },
      },
      null,
      2,
    ),
  )

  if (failures.length > 0) {
    console.error(["Scenario Explorer performance verification failed:", ...failures].join("\n- "))
    process.exitCode = 1
  }
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    clearTimeout(hardTimeout)
  })
