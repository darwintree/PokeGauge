---
# This section is managed by the CLI. Do not edit manually.
id: "ddeb1f63-6177-4196-9fc1-caf630852bc8"
title: "Research Champions move usage data and join keys"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:RESEARCH", "WAYFINDER:CLAIMED"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-03T05:17:00Z"
---
## Parent Map
[[../20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
What data does Champions Battle expose for move usage, how should usage records be joined to the app's normalized Pokemon and move identities, and what facts are required to support top-6 damaging **Move pick** defaults?

## Context
Existing issue: [[../20260701_open_integrate-champions-battle-move-usage-rate-data|Integrate Champions Battle move usage-rate data]] (`2e6ef737-e571-4cd3-8b98-2edd2b38a686`).

This ticket may inspect https://championsbattledata.com/api-rules/ and related responses. It should record source URLs, response shape, update cadence if discoverable, and likely mismatch cases. Produce a linked markdown research summary rather than implementing the integration.

## Resolution

Research summary: [Champions Move Usage Data and Join Keys](../../docs/research/2026-07-03-champions-move-usage-join-keys.md).

Champions Battle Data exposes usage through `/api`, `/api/battle/:format/:name`, metadata rows, and static CSV assets. Move usage rows are ranked English names with usage percentages; they do not include PokeAPI ids, type, category, power, or accuracy. The app should therefore import Champions rows into generated local records and join them to normalized PokeAPI numeric ids at generation time.

For Pokemon, join Champions form-specific names such as `Paldean Tauros Aqua Breed` and `Rotom Wash` to normalized `BattlePokemonId` values, with manual override diagnostics for name mismatches. For moves, join Champions `category === "move"` rows by normalized English move name to `move.id`, then attach PokeAPI move metadata.

Top-6 damaging **Move pick** defaults should use `Doubles` rows for the selected season, preserve Champions rank order, filter to normalized moves with `category` of `physical | special` and positive numeric `power`, then select the first 6. Status moves such as `Protect` appear in Champions usage rows and must not count toward the top-6 damaging default.

No exact update cadence was discoverable. The site author says data will refresh automatically, and live responses expose cache/ETag headers, so implementation should capture source season/path/ETag facts in a developer-run generator rather than runtime fetching.
