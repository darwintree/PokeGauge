import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { expect, it } from "vitest"

it("compiles Current and Pikalytics rankings from bulk endpoints and historical Champions details from battle rows", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "usage-compile-"))
  const fixture = path.join(dir, "upstream.mjs")
  writeFileSync(fixture, `
    const calls = [];
    const formats = ["gen9championsvgc2026regmc-1760", "championstournaments-1760", "battledataregmbs3-1760", "championstournamentsregmb-1760"];
    globalThis.fetch = async url => {
      calls.push(url);
      if (url === "https://championsbattledata.com/api") return Response.json({
        defaultSeason: "Current", seasons: ["Current", "M6"], dataVersion: "v1",
        pokemon: [{ name: "Charizard", battleName: "Charizard", summary: { battleSummary: { Current: { Doubles: { top: { move: { position: 1 } } } } } } }],
      });
      if (url.endsWith("?season=M6")) return Response.json({ data: [{ category: "move", name: "Heat Wave", percentage_value: 90, rank: 1, column_position: 1 }] });
      if (url.endsWith("/ai/pokedex")) return new Response("- **Data Date**: 2026-08");
      if (url.endsWith("/pokedex")) return new Response('<select id="format_dd">' + formats.map((id, i) => '<option value="' + id + '"' + (i === 0 ? ' selected' : '') + '>Format</option>').join('') + '</select>');
      if (url.includes("/api/l/")) return Response.json([{ name: "Charizard", rank: "1" }, { name: "Garchomp", rank: "2" }]);
      throw new Error("Unexpected upstream: " + url);
    };
    process.on("exit", () => console.log("REQUESTS=" + JSON.stringify(calls)));
  `)
  const compile = (source: string) => {
    const out = execFileSync(process.execPath, ["--import", "tsx", "--import", fixture, "scripts/build-usage-artifacts.ts", "--source", source, "--out", dir], { encoding: "utf8" })
    return JSON.parse(out.split("REQUESTS=")[1].trim()) as string[]
  }
  try {
    expect(compile("champions")).toEqual([
      "https://championsbattledata.com/api", "https://championsbattledata.com/api/battle/Doubles/Charizard?season=M6",
    ])
    const current = JSON.parse(readFileSync(path.join(dir, "usage/champions/Current.json"), "utf8"))
    const historical = JSON.parse(readFileSync(path.join(dir, "usage/champions/M6.json"), "utf8"))
    expect(current.ranking).toEqual([6])
    expect(historical).toMatchObject({ ranking: [6], pokemon: { 6: { m: [["Heat Wave", 90]] } } })
    expect(compile("pikalytics")).toEqual([
      "https://www.pikalytics.com/pokedex", "https://www.pikalytics.com/ai/pokedex",
      ...["gen9championsvgc2026regmc-1760", "championstournaments-1760", "battledataregmbs3-1760", "championstournamentsregmb-1760"]
        .map(rule => `https://www.pikalytics.com/api/l/2026-08/${rule}`),
    ])
    const pika = JSON.parse(readFileSync(path.join(dir, "usage/pikalytics/championstournaments-1760.json"), "utf8"))
    expect(pika.ranking).toEqual([6, 445])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}, 15_000)
