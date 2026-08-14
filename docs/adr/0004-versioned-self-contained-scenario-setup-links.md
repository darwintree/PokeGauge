# Versioned self-contained Scenario Setup links

PokeLens shares a Scenario Setup through an explicitly generated, self-contained, versioned URL payload. The canonical share schema is independent of runtime Track state and local persistence, carries only selected domain inputs, and is recalculated with current resources and rules; breaking schema changes may expire an older payload version rather than requiring migration.

## Considered Options

- Reuse the local Scenario snapshot. This couples published links to short-lived runtime, display, candidate-pool, and local-preset state.
- Use a descriptive general-purpose serialization. This is easier to inspect but materially longer than the confirmed compact share contract.
- Use a canonical versioned bit payload. This keeps the common URL portable while freezing the meaning of each supported schema version.
- Store a server-side short link or frozen result. These require infrastructure or historical calculation contracts outside Scenario Setup sharing.

## Consequences

- V1 uses its own frozen encoder and decoder rather than serializing `TrackState`.
- Links preserve selected input semantics, not local identities, candidate pools, display preferences, ordering, historical rules, or results.
- Invalid referenced semantics prevent the whole shared Setup from being applied; a breaking version may be declared expired without a migration path.
