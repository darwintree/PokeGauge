---
# This section is managed by the CLI. Do not edit manually.
id: "ddeb1f63-6177-4196-9fc1-caf630852bc8"
title: "Research Champions move usage data and join keys"
status: "open"
priority: "medium"
labels: ["WAYFINDER:RESEARCH"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-02T09:41:00Z"
---
## Parent Map
[[20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
What data does Champions Battle expose for move usage, how should usage records be joined to the app's normalized Pokemon and move identities, and what facts are required to support top-6 damaging **Move pick** defaults?

## Context
Existing issue: [[20260701_open_integrate-champions-battle-move-usage-rate-data|Integrate Champions Battle move usage-rate data]] (`2e6ef737-e571-4cd3-8b98-2edd2b38a686`).

This ticket may inspect https://championsbattledata.com/api-rules/ and related responses. It should record source URLs, response shape, update cadence if discoverable, and likely mismatch cases. Produce a linked markdown research summary rather than implementing the integration.
