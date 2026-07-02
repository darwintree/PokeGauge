---
# This section is managed by the CLI. Do not edit manually.
id: "1e0c7cb0-b78d-448b-817b-cc59ce4d2233"
title: "Introduce PokeAPI-backed i18n resource identity and locale data access"
status: "open"
priority: "medium"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-07-02T07:52:00Z"
updated_at: "2026-07-02T07:52:00Z"
---
## Problem Statement

The calculator currently hardcodes Pokemon species names, move names, and other display strings directly into first-party catalog data. This makes it difficult to support multiple product languages, keeps display labels entangled with battle data, and blocks a clean path to broader data-driven scenario setup. The project needs a lightweight i18n foundation that keeps **Battle Pokemon identity** stable, obtains Pokemon and move names from upstream resource data, and preserves a simple SPA architecture.

## Solution

Introduce a PokeAPI-aligned i18n foundation where Pokemon and move resources are identified internally by upstream numeric resource ids, while localized display strings are resolved from resource data at runtime for the current **Supported locale**. UI copy will use `react-intl`, while Pokemon and move names remain in the data layer behind one unified asynchronous resource access interface. The first implementation may use mock data, but the contract must support the eventual use of real upstream-derived data without changing component-facing behavior.

## User Stories

1. As a player comparing damage scenarios, I want the app to show Pokemon names in my selected language, so that I can understand the matchup without relying on one hardcoded locale.
2. As a player comparing damage scenarios, I want move names to change with the selected language, so that the Scenario Explorer reads naturally in that locale.
3. As a Chinese-speaking player, I want Simplified Chinese resource names, so that the calculator matches my normal play vocabulary.
4. As a Traditional Chinese-speaking player, I want Traditional Chinese resource names, so that the calculator feels native to my reading preferences.
5. As an English-speaking player, I want English resource names, so that I can use the calculator without translated labels.
6. As a Japanese-speaking player, I want Japanese resource names from the standard Japanese locale, so that names appear in expected in-game form.
7. As a player switching languages, I want Pokemon and move names to stay synchronized with the rest of the UI locale, so that the app never mixes languages unexpectedly.
8. As a player returning to the app, I want my last chosen language to persist, so that I do not need to reselect it every session.
9. As a player opening the app for the first time, I want the initial language to follow my browser language when supported, so that the app starts in the most likely useful locale.
10. As a player using unsupported browser settings, I want the app to choose one supported locale deterministically, so that the language state is still stable.
11. As a player exploring matchup results, I want type names and other UI strings to follow the app’s regular UI string system, so that domain tokens outside Pokemon and move names remain consistent.
12. As a maintainer, I want Pokemon and move identities to be independent from localized names, so that changing display language never affects scenario state or persisted selections.
13. As a maintainer, I want a **Battle Pokemon identity** to distinguish form-level battle data, so that species with multiple battle-relevant varieties remain unambiguous.
14. As a maintainer, I want upstream numeric resource ids to be the only internal identity key, so that resource references remain stable across locales.
15. As a maintainer, I want the product not to depend on localized labels as keys, so that renaming or translation changes do not break lookups.
16. As a maintainer, I want Pokemon and move naming to come from resource data rather than local alias tables, so that the data model stays close to upstream contracts.
17. As a maintainer, I want the front end to rely on one unified resource access seam, so that mock data and future real data sources can be swapped without rewriting components.
18. As a maintainer, I want the resource access seam to be asynchronous from the start, so that moving from mock data to remote or generated data does not change call sites.
19. As a maintainer, I want the resource access seam to route by resource type internally, so that the caller uses one entry point while still receiving strong per-resource types.
20. As a maintainer, I want the first version of the resource seam to support only single-resource lookup by id, so that the initial contract stays minimal and easy to verify.
21. As a maintainer, I want components to receive only the current locale’s display string rather than a full names map, so that locale branching stays out of rendering code.
22. As a maintainer, I want UI copy and resource naming to share a single locale truth, so that locale state is not duplicated across systems.
23. As a maintainer, I want the first implementation to be allowed to use mock data, so that the interface can be validated before source-of-truth storage and caching are decided.
24. As a future implementer, I want the i18n foundation to leave room for upstream-derived Pokemon and move data, so that later data ingestion work can plug into an already stable front-end contract.
25. As a reviewer, I want every recorded design decision from the grill trace to be auditable during implementation, so that the delivered system matches the agreed i18n model exactly.

## Implementation Decisions

- The feature introduces one highest-level seam: a unified asynchronous resource access interface that accepts a resource type and numeric id, routes internally by resource type, and returns a strong type narrowed to that resource.
- The interface contract is defined around single-resource lookup only. Search, list, pagination, and bulk resource queries are out of the initial contract.
- Internal resource identity for Pokemon and move entities is the corresponding PokeAPI numeric resource id only. Slugs and localized labels are not persistent keys.
- Pokemon naming and move naming are treated as resource data, not as UI message catalog entries.
- UI copy uses `react-intl`.
- Pokemon and move names are resolved in the data layer from the current locale, while UI copy is resolved by `react-intl`; both consume the same locale truth.
- The locale truth is singular. No second locale store is introduced for resource naming.
- Supported locales are `zh-hans`, `zh-hant`, `en`, and `ja`.
- Japanese naming uses `ja` rather than `ja-hrkt`.
- Runtime behavior does not include locale fallback design for resource names in the first version. The chosen locale is expected to have the required localized resource strings.
- Type names and other non-resource UI strings do not move into the PokeAPI resource model. They continue through the same maintenance path as other product UI strings.
- The initial locale selection matches supported browser language where possible, then persists the user’s manual selection for future sessions.
- The initial implementation may be backed by mock data. Storage location, caching strategy, and real upstream transport are explicitly deferred.
- The resource layer returns the current locale’s single display string to callers instead of exposing the full localization map.
- For Pokemon, the contract must preserve form-level battle distinctions required by **Battle Pokemon identity** rather than collapsing everything to species-level identity.
- Existing first-party catalog data that currently embeds localized Pokemon and move labels will need to stop treating those labels as authoritative identity or source-of-truth names.

## Testing Decisions

- A good test verifies externally observable behavior at the resource seam and consuming domain seams, not internal storage layout, mock source shape, or implementation-specific lookup helpers.
- The primary seam to test is the unified asynchronous resource access interface. This is the highest seam and should absorb most feature tests.
- Resource seam tests should verify:
  - lookup by numeric id
  - per-resource-type routing
  - strong resource-specific return behavior
  - current-locale string resolution for Pokemon and move resources
  - rejection or failure behavior for unknown ids or unsupported resource types
- Locale integration tests should verify:
  - supported locale switching changes Pokemon and move display strings
  - UI copy and resource names stay synchronized under one locale truth
  - browser-language initialization selects a supported locale deterministically
  - manual locale choice persists and wins on subsequent loads
- Domain-facing tests should verify that scenario state and identity remain stable when locale changes, proving that localized strings are not used as keys.
- Existing prior art should be taken from current catalog, scenario pipeline, and calc-adapter tests that already prefer behavior-oriented assertions around stable identifiers and row output rather than implementation details.
- The implementation checklist must include a line-by-line audit against the grill trace to confirm every recorded decision has been implemented.

## Out of Scope

- Deciding where upstream-derived data is cached or stored.
- Designing raw-versus-normalized repository cache structure.
- Implementing live PokeAPI fetching.
- Implementing bulk resource import, search, or list APIs.
- Defining fallback chains for missing localized resource names.
- Moving type names into the PokeAPI-backed resource model.
- Solving image asset strategy.
- Extending the i18n foundation to all future domain resources beyond Pokemon and move.
- Optimizing for bundle size or lookup performance beyond what is required for the initial clean contract.

## Further Notes

- This PRD is based on the grill trace at `docs/traces/2026-07-02-pokeapi-i18n-resource-identity-grill.md`.
- The implementation should preserve the project glossary terms **Battle Pokemon identity**, **Upstream resource identity**, and **Supported locale**.
- The user explicitly accepted a mock-first path for the data source while deferring all caching and source-of-truth decisions.