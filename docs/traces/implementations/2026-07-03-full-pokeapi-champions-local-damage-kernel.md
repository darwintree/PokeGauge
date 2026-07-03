# Implementation Trace: Full PokeAPI Champions Local Damage Kernel

Date: 2026-07-03
Source: .issues/20260703_open_integrate-full-pokeapi-and-champions-move-usage-with-local-damage-kernel.md
Language: English

## Entries

### 1. Statless PokeAPI Pokemon Row

Type: unresolved-implementation-decision

Context:
The issue requires full PokeAPI Pokemon generation, but the current upstream CSV includes `pokemon/10326` without base stat rows. Runtime catalog, stat axes, and the local damage kernel require HP, Atk, Def, SpA, SpD, and Spe for every selectable battle Pokemon.

Decision:
Keep the row visible in generation diagnostics as an unsupported battle identity, but exclude it from generated runtime Pokemon resources.

Reason:
Including a statless Pokemon in the runtime resource map would let users select an identity that cannot compile into formula inputs. Diagnostics preserve the upstream gap without leaking an invalid resource into catalog or kernel code.

Follow-up:
None.
