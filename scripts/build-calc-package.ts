import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import ts from "typescript-calc"

const commit = "e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d"
const version = `0.11.0-pokegauge.${commit.slice(0, 8)}`
const output = resolve(`vendor/smogon-calc-${commit.slice(0, 8)}.tgz`)
const directory = mkdtempSync(join(tmpdir(), "pokegauge-calc-"))

try {
  const archive = join(directory, "source.tar.gz")
  execFileSync("curl", ["-fsSL", `https://codeload.github.com/smogon/damage-calc/tar.gz/${commit}`, "-o", archive])
  const source = join(directory, "source")
  mkdirSync(source)
  execFileSync("tar", ["-xzf", archive, "-C", source, "--strip-components=1"])
  const packageDirectory = join(directory, "package")
  const src = join(source, "calc/src")
  const globals = join(directory, "globals.d.ts")
  writeFileSync(globals, "declare var exports: any;\n")
  const program = ts.createProgram([...ts.sys.readDirectory(src, [".ts"], ["**/test/**", "**/*.test.ts"]), globals], {
    rootDir: src,
    outDir: join(packageDirectory, "dist"),
    target: ts.ScriptTarget.ES2019,
    module: ts.ModuleKind.CommonJS,
    declaration: true,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    types: [],
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => directory,
    getNewLine: () => "\n",
  }))
  program.emit()
  cpSync(join(source, "LICENSE"), join(packageDirectory, "LICENSE"))
  writeFileSync(join(packageDirectory, "package.json"), JSON.stringify({
    name: "@smogon/calc", version, main: "dist/index.js", types: "dist/index.d.ts",
    license: "MIT", repository: "github:smogon/damage-calc", gitHead: commit,
  }, null, 2) + "\n")
  mkdirSync(resolve("vendor"), { recursive: true })
  execFileSync("pnpm", ["pack", "--out", output], { cwd: packageDirectory, stdio: "pipe" })
  console.log(`${output}\nsha256 ${createHash("sha256").update(readFileSync(output)).digest("hex")}`)
} finally {
  rmSync(directory, { recursive: true, force: true })
}
