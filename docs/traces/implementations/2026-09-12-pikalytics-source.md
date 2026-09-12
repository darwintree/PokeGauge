# Implementation Trace: Pikalytics usage source

Date: 2026-09-12
Source: User request to add Pikalytics usage data
Language: 简体中文

## Entries

### 1. 使用 Pikalytics AI Markdown 接口

Type: tradeoff

Context:
Pikalytics exposes both rendered HTML pages and AI-optimized Markdown pages. The request did not specify an endpoint or parsing format.

Decision:
Use /ai/pokedex/{format}/{pokemon} and the format index as the upstream interface.

Reason:
The Markdown endpoint is explicitly published by Pikalytics, has stable headings and percentages, and avoids depending on presentation markup.

Follow-up: None

### 2. 格式索引范围

Type: interpretation

Context:
The public AI format index currently lists the best 50 Pokémon rather than a complete machine-readable roster.

Decision:
Expose the 50 Pokémon listed by the index; individual detail pages remain available for those entries.

Reason:
This matches the complete public list available through the selected interface and avoids inventing unsupported pagination.

Follow-up: None
