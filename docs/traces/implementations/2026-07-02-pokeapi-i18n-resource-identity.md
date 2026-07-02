# Implementation Trace: PokeAPI i18n resource identity

Date: 2026-07-02
Source: `.issues/20260702_open_introduce-pokeapi-backed-i18n-resource-identity-and-locale-data-access.md`, `docs/traces/2026-07-02-pokeapi-i18n-resource-identity-grill.md`
Language: English

## Entries

### 1. Form-Level Mock Pokemon Ids

Type: unresolved-implementation-decision

Context:
The grill trace requires **Battle Pokemon identity** to preserve form-level battle distinctions and requires **Upstream resource identity** to be numeric, but it does not enumerate the mock ids to use for the existing first-party catalog.

Decision:
Use PokeAPI numeric pokemon resource ids for battle Pokemon ids in the mock catalog: Garchomp `445`, Flutter Mane `987`, Incineroar `727`, Amoonguss `591`, Rillaboom `812`, and Landorus-Therian `10021`.

Reason:
The regular Pokemon ids cover species with no current form split, while `10021` keeps Landorus-Therian distinct at the form-level battle identity required by the trace. Components and scenario state now carry these numeric ids instead of slugs or localized labels.

Follow-up:
None.

### 2. Existing Template Storage Keys

Type: tradeoff

Context:
The implementation changes Pokemon identities from string slugs to numeric ids, but the existing stat-template storage API accepts string owner keys. The issue does not ask to redesign stat-template persistence.

Decision:
Keep the stat-template storage API unchanged and convert `BattlePokemonId` to `String(id)` only at the storage boundary.

Reason:
This preserves the new numeric domain identity everywhere in catalog/scenario state while avoiding unrelated persistence churn. The conversion is a local compatibility adapter, not a second identity scheme.

Follow-up:
None.

### 3. Locale-Only Catalog Reloads

Type: unresolved-implementation-decision

Context:
The resource layer returns locale-specific labels, so the page receives a new catalog object when locale changes. The issue requires scenario state and identity to remain stable across language changes, but does not specify how React state should distinguish locale-only catalog updates from matchup changes.

Decision:
Reset scenario track state only when battle identity or move category changes, not when the catalog object changes only because labels were re-resolved for another locale.

Reason:
This keeps selected numeric move ids, templates, items, and ranges stable when the user switches supported locale, while still rebuilding defaults for an actual matchup/category change.

Follow-up:
None.
