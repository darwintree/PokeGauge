# Pokémon Champions Item Inventory and Priority Data

Checked on **2026-07-30**. This note supports held-item implementation planning; it does not change a product contract or product code.

## Executive result

- Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` contains **583 item records**: 249 standard, 284 `Past`, 45 `Future`, 3 `Unobtainable`, and 2 `CAP`.
- A source-level review finds **375/583 implementation-relevant held items**. Of these, **148 appear in the current Champions usage file** and **227 have a real held effect but do not appear there**.
- The other **208** are deliberately excluded: 28 capture-only balls, 100 TRs, 20 Natural Gift-only Berries, 15 fossils, 42 evolution/form/training materials, and 3 treasure items.
- Instantiating Showdown's `Dex.mod('champions')` yields **148 currently standard Champions held items**: **75 Mega Stones** and **73 non-Mega items**. Every one appears in the June usage data.
- Of those 148, **43 have an explicit ordinary-hit damage/stat/effectiveness hook** relevant to a damage calculator. The 75 Mega Stones select a battle form whose stats, typing, and ability can change damage, but should normally be modeled through the selected Mega form rather than as 75 generic damage modifiers.
- The June 2026 cutoff-0 `gen9championsvgc2026regmb` bulk file covers 1,163,315 battles, 305 Pokémon/form rows, and 149 item keys: all 148 legal held items plus `nothing`.
- Top 10 by aggregate team-slot exposure are **Focus Sash, Sitrus Berry, Life Orb, Leftovers, Choice Scarf, Light Clay, Staraptite, White Herb, Chople Berry, and Swampertite**.

## Sources and provenance

Only Pokémon Showdown source and bulk statistics generated from Showdown battles are used:

- [Showdown `data/items.ts` at the checked commit](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/items.ts): all base item identities and mechanics.
- [Showdown `sim/dex-items.ts`](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/dex-items.ts): `ItemData`, inherited item construction, and generated Fling data for Berries, Plates, Drives, Mega Stones, and Memories.
- [Champions item overrides](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/mods/champions/items.ts): Champions-specific standardness and behavior.
- [Showdown format definition](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/config/formats.ts) and [Champions rulesets](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/mods/champions/rulesets.ts): the VGC 2026 Regulation M-B format uses the `champions` mod and `Flat Rules`, which includes `Obtainable` and Item Clause.
- [June 2026 cutoff-0 chaos JSON](https://www.smogon.com/stats/2026-06/chaos/gen9championsvgc2026regmb-0.json.gz): per-form `usage` and weighted `Items` counts; `info.number of battles = 1,163,315`.

Rate-limit discipline: the Showdown source was downloaded once as a repository archive, the compressed chaos file was downloaded once, and all joins and checks were performed locally. No per-item or per-Pokémon requests were made.

## Definitions

### “All items”

All top-level entries in Showdown's base `Items` table. Showdown does not expose a separate `isHeldItem` flag; these are the item identities accepted by its data model. The inventory therefore intentionally includes historical items, future Champions items, CAP items, Poké Balls, and items with no competitive held effect. The `isNonstandard` field is reported rather than silently deleting those records.

### “Implementation-relevant held item”

Keep an item when Pokémon Showdown gives it an intrinsic competitive effect while held: damage/stat/type/accuracy/critical changes; status, healing, order, switching, weather, terrain, screens, trapping, hazards, contact, or item-removal behavior; form/Mega/Primal changes; or Z-Move, Plate, Drive, Memory, Gem, and Berry mechanics.

Do **not** keep an item merely because it can be selected as a generic Fling or Natural Gift payload. Showdown automatically generates Fling power for all Berries, Plates, Drives, Mega Stones, and Memories in [`sim/dex-items.ts` lines 146–150](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/dex-items.ts#L146-L150); that generated metadata is not evidence of an independent held effect.

The review checks both each item block and simulator lookups by item ID. This matters because several real effects are intentionally implemented elsewhere:

- Binding Band and Grip Claw alter partial-trapping damage/duration in [`data/conditions.ts` lines 222–232](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/conditions.ts#L222-L232).
- Damp Rock, Heat Rock, Smooth Rock, and Icy Rock alter weather duration in [`data/conditions.ts`](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/conditions.ts#L474-L705).
- Blunder Policy activates in the accuracy pipeline in [`sim/battle-actions.ts` lines 735–750](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle-actions.ts#L735-L750).
- Protective Pads suppresses contact in [`sim/battle.ts` lines 1289–1297](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/sim/battle.ts#L1289-L1297); Heavy-Duty Boots, Light Clay, and Terrain Extender are likewise consumed by move/condition code rather than their item blocks.
- Rusted Sword and Rusted Shield are protected from removal in their item blocks and trigger Crowned form changes in [`data/conditions.ts` lines 882–925](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/conditions.ts#L882-L925).

This produces an exact **375-item include set**: the 148 current Champions items listed below plus the following 227 useful-but-unobserved items.

<details>
<summary>Expand the 227 implementation-relevant items absent from current usage</summary>

Ability Shield, Absolite Z, Absorb Bulb, Adamant Crystal, Adamant Orb, Adrenaline Orb, Aguav Berry, Air Balloon, Aloraichium Z, Apicot Berry, Assault Vest, Baxcalibrite, Berry, Berry Juice, Berserk Gene, Binding Band, Bitter Berry, Black Sludge, Blue Orb, Blunder Policy, Booster Energy, Bug Gem, Bug Memory, Buginium Z, Burn Drive, Burnt Berry, Cell Battery, Chill Drive, Choice Band, Choice Specs, Clear Amulet, Cornerstone Mask, Covert Cloak, Crucibellite, Custap Berry, Dark Gem, Dark Memory, Darkinium Z, Darkranite, Decidium Z, Deep Sea Scale, Deep Sea Tooth, Destiny Knot, Diancite, Douse Drive, Draco Plate, Dragon Gem, Dragon Memory, Dragonium Z, Dread Plate, Earth Plate, Eevium Z, Eject Button, Eject Pack, Electric Gem, Electric Memory, Electric Seed, Electrium Z, Enigma Berry, Eviolite, Fairium Z, Fairy Gem, Fairy Memory, Fighting Gem, Fighting Memory, Fightinium Z, Figy Berry, Fire Gem, Fire Memory, Firium Z, Fist Plate, Flame Orb, Flame Plate, Float Stone, Flying Gem, Flying Memory, Flyinium Z, Full Incense, Ganlon Berry, Garchompite Z, Ghost Gem, Ghost Memory, Ghostium Z, Gold Berry, Golisopite, Grass Gem, Grass Memory, Grassium Z, Grassy Seed, Grip Claw, Griseous Core, Griseous Orb, Ground Gem, Ground Memory, Groundium Z, Hearthflame Mask, Heatranite, Heavy-Duty Boots, Iapapa Berry, Ice Berry, Ice Gem, Ice Memory, Icicle Plate, Icium Z, Incinium Z, Insect Plate, Iron Plate, Jaboca Berry, Kee Berry, Kommonium Z, Lagging Tail, Lansat Berry, Latiasite, Latiosite, Lax Incense, Leek, Liechi Berry, Loaded Dice, Lucarionite Z, Lucky Punch, Luminous Moss, Lunalium Z, Lustrous Globe, Lustrous Orb, Lycanium Z, Macho Brace, Magearnite, Mago Berry, Mail, Maranga Berry, Marshadium Z, Meadow Plate, Metal Powder, Mewnium Z, Mewtwonite X, Mewtwonite Y, Micle Berry, Mimikium Z, Mind Plate, Mint Berry, Miracle Berry, Mirror Herb, Misty Seed, Mystery Berry, Normal Gem, Normalium Z, Odd Incense, PRZ Cure Berry, PSN Cure Berry, Petaya Berry, Pikanium Z, Pikashunium Z, Pink Bow, Pixie Plate, Poison Gem, Poison Memory, Poisonium Z, Polkadot Bow, Power Anklet, Power Band, Power Belt, Power Bracer, Power Herb, Power Lens, Power Weight, Primarium Z, Protective Pads, Psychic Gem, Psychic Memory, Psychic Seed, Psychium Z, Punching Glove, Quick Powder, Razor Claw, Razor Fang, Red Card, Red Orb, Ring Target, Rock Gem, Rock Incense, Rock Memory, Rockium Z, Rocky Helmet, Room Service, Rose Incense, Rowap Berry, Rusted Shield, Rusted Sword, Safety Goggles, Salac Berry, Salamencite, Sea Incense, Shock Drive, Sky Plate, Snorlium Z, Snowball, Solganium Z, Soul Dew, Splash Plate, Spooky Plate, Starf Berry, Steel Gem, Steel Memory, Steelium Z, Stick, Sticky Barb, Stone Plate, Tapunium Z, Tatsugirinite, Terrain Extender, Thick Club, Throat Spray, Toxic Orb, Toxic Plate, Ultranecrozium Z, Utility Umbrella, Vile Vial, Water Gem, Water Memory, Waterium Z, Wave Incense, Weakness Policy, Wellspring Mask, Wiki Berry, Zap Plate, Zeraorite, Zygardite.

</details>

The exact **208-item exclusion set** is:

- **Capture-only balls (28):** Beast Ball, Cherish Ball, Dive Ball, Dream Ball, Dusk Ball, Fast Ball, Friend Ball, Great Ball, Heal Ball, Heavy Ball, Level Ball, Love Ball, Lure Ball, Luxury Ball, Master Ball, Moon Ball, Nest Ball, Net Ball, Park Ball, Poke Ball, Premier Ball, Quick Ball, Repeat Ball, Safari Ball, Sport Ball, Strange Ball, Timer Ball, Ultra Ball.
- **TR records (100):** TR00–TR99.
- **Natural Gift-only Berries (20):** Belue Berry, Bluk Berry, Cornn Berry, Durin Berry, Grepa Berry, Hondew Berry, Kelpsy Berry, Magost Berry, Nanab Berry, Nomel Berry, Pamtre Berry, Pinap Berry, Pomeg Berry, Qualot Berry, Rabuta Berry, Razz Berry, Spelon Berry, Tamato Berry, Watmel Berry, Wepear Berry. Their item blocks set `isBerry` and `naturalGift`, but `onEat: false`; they provide no independent held effect.
- **Fossils (15):** Armor Fossil, Claw Fossil, Cover Fossil, Dome Fossil, Fossilized Bird, Fossilized Dino, Fossilized Drake, Fossilized Fish, Helix Fossil, Jaw Fossil, Old Amber, Plume Fossil, Root Fossil, Sail Fossil, Skull Fossil.
- **Evolution/form/training materials (42):** Auspicious Armor, Berry Sweet, Bottle Cap, Chipped Pot, Clover Sweet, Cracked Pot, Dawn Stone, Dragon Scale, Dubious Disc, Dusk Stone, Electirizer, Fire Stone, Flower Sweet, Galarica Cuff, Galarica Wreath, Gold Bottle Cap, Ice Stone, Leaf Stone, Love Sweet, Magmarizer, Malicious Armor, Masterpiece Teacup, Metal Alloy, Moon Stone, Oval Stone, Prism Scale, Protector, Reaper Cloth, Ribbon Sweet, Sachet, Shiny Stone, Star Sweet, Strawberry Sweet, Sun Stone, Sweet Apple, Syrupy Apple, Tart Apple, Thunder Stone, Unremarkable Teacup, Up-Grade, Water Stone, Whipped Dream.
- **Treasure-only items (3):** Big Nugget, Pretty Feather, Rare Bone.

All excluded records have no independent held effect in an ordinary competitive battle. Their only possible meaning is generic item presence, Fling/Natural Gift payload, or a special-format rule rather than an item effect the calculator should implement.

Boundary decisions:

- **TRs:** `Broken Record Mod` deliberately turns a held TR into a fifth move, prevents its removal, and changes Knock Off/Fling behavior in [`data/rulesets.ts` lines 2447–2529](https://github.com/smogon/pokemon-showdown/blob/71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa/data/rulesets.ts#L2447-L2529). This is a named custom rule, not an intrinsic TR effect in Champions or ordinary Showdown battles, so TR00–TR99 remain excluded.
- **Payload-only Berries:** they remain valid Natural Gift inputs and generic Berries for moves such as Fling, Bug Bite, Pluck, and Stuff Cheeks. They are excluded because `onEat: false` gives them no item-specific held result.
- **Generic item presence:** any held identity can affect Knock Off or be removed/swapped. That does not make fossils, treasure, or evolution materials separate implementations. Item-specific removal rules such as Mail, Mega Stones, Z-Crystals, Plates, Memories, Drives, Primal Orbs, and Rusted items do qualify.
- **Historical, Future, and CAP mechanics:** these stay included when they have a real held effect. Showdown standardness and current Champions usage control priority/availability, not whether the mechanic exists.

### “Currently available in Champions”

Instantiate Showdown's inherited `champions` mod and keep items where the resolved `isNonstandard` is empty:

```text
Dex.mod('champions').items.all().filter(item => !item.isNonstandard)
```

Do not count only the rows that explicitly set `isNonstandard: null` in the override file. That file is incremental:

- 76 rows explicitly set `null`: 75 Mega Stones plus Spell Tag.
- Standard base items omitted from the override file remain standard through inheritance.
- White Herb overrides Champions event timing without restating `isNonstandard`, so it also inherits its standard status.

The resolved result is 148 items, not 76.

## All 583 Showdown items

<details>
<summary>Expand the complete inventory grouped by Showdown standardness</summary>

**Standard (249):** Ability Shield, Absorb Bulb, Adamant Crystal, Adamant Orb, Adrenaline Orb, Aguav Berry, Air Balloon, Apicot Berry, Aspear Berry, Assault Vest, Auspicious Armor, Babiri Berry, Beast Ball, Berry Sweet, Big Nugget, Big Root, Binding Band, Black Belt, Black Glasses, Black Sludge, Blunder Policy, Booster Energy, Bottle Cap, Bright Powder, Cell Battery, Charcoal, Charti Berry, Cheri Berry, Chesto Berry, Chilan Berry, Chipped Pot, Choice Band, Choice Scarf, Choice Specs, Chople Berry, Clear Amulet, Clover Sweet, Coba Berry, Colbur Berry, Cornerstone Mask, Covert Cloak, Cracked Pot, Custap Berry, Damp Rock, Dawn Stone, Destiny Knot, Dive Ball, Draco Plate, Dragon Fang, Dragon Scale, Dread Plate, Dream Ball, Dubious Disc, Dusk Ball, Dusk Stone, Earth Plate, Eject Button, Eject Pack, Electirizer, Electric Seed, Enigma Berry, Eviolite, Expert Belt, Fairy Feather, Fast Ball, Figy Berry, Fire Stone, Fist Plate, Flame Orb, Flame Plate, Float Stone, Flower Sweet, Focus Band, Focus Sash, Friend Ball, Galarica Cuff, Galarica Wreath, Ganlon Berry, Gold Bottle Cap, Grassy Seed, Great Ball, Grepa Berry, Grip Claw, Griseous Core, Griseous Orb, Haban Berry, Hard Stone, Heal Ball, Hearthflame Mask, Heat Rock, Heavy Ball, Heavy-Duty Boots, Hondew Berry, Iapapa Berry, Ice Stone, Icicle Plate, Icy Rock, Insect Plate, Iron Ball, Iron Plate, Jaboca Berry, Kasib Berry, Kebia Berry, Kee Berry, Kelpsy Berry, King's Rock, Lagging Tail, Lansat Berry, Leaf Stone, Leftovers, Leppa Berry, Level Ball, Liechi Berry, Life Orb, Light Ball, Light Clay, Loaded Dice, Love Ball, Love Sweet, Lum Berry, Luminous Moss, Lure Ball, Lustrous Globe, Lustrous Orb, Luxury Ball, Magmarizer, Magnet, Mago Berry, Malicious Armor, Maranga Berry, Master Ball, Masterpiece Teacup, Meadow Plate, Mental Herb, Metal Alloy, Metal Coat, Metronome, Micle Berry, Mind Plate, Miracle Seed, Mirror Herb, Misty Seed, Moon Ball, Moon Stone, Muscle Band, Mystic Water, Nest Ball, Net Ball, Never-Melt Ice, Normal Gem, Occa Berry, Oran Berry, Oval Stone, Passho Berry, Payapa Berry, Pecha Berry, Persim Berry, Petaya Berry, Pixie Plate, Poison Barb, Poke Ball, Pomeg Berry, Power Anklet, Power Band, Power Belt, Power Bracer, Power Herb, Power Lens, Power Weight, Premier Ball, Pretty Feather, Prism Scale, Protective Pads, Protector, Psychic Seed, Punching Glove, Qualot Berry, Quick Ball, Quick Claw, Rare Bone, Rawst Berry, Razor Claw, Razor Fang, Reaper Cloth, Red Card, Repeat Ball, Ribbon Sweet, Rindo Berry, Ring Target, Rocky Helmet, Room Service, Roseli Berry, Rowap Berry, Rusted Shield, Rusted Sword, Safari Ball, Safety Goggles, Salac Berry, Scope Lens, Sharp Beak, Shed Shell, Shell Bell, Shiny Stone, Shuca Berry, Silk Scarf, Silver Powder, Sitrus Berry, Sky Plate, Smooth Rock, Snowball, Soft Sand, Soul Dew, Spell Tag, Splash Plate, Spooky Plate, Sport Ball, Starf Berry, Star Sweet, Sticky Barb, Stone Plate, Strawberry Sweet, Sun Stone, Sweet Apple, Syrupy Apple, Tamato Berry, Tanga Berry, Tart Apple, Terrain Extender, Throat Spray, Thunder Stone, Timer Ball, Toxic Orb, Toxic Plate, Twisted Spoon, Ultra Ball, Unremarkable Teacup, Up-Grade, Utility Umbrella, Wacan Berry, Water Stone, Weakness Policy, Wellspring Mask, White Herb, Wide Lens, Wiki Berry, Wise Glasses, Yache Berry, Zap Plate, Zoom Lens.

**Past (284):** Abomasite, Absolite, Aerodactylite, Aggronite, Alakazite, Aloraichium Z, Altarianite, Ampharosite, Armor Fossil, Audinite, Banettite, Beedrillite, Belue Berry, Berry Juice, Blastoisinite, Blazikenite, Blue Orb, Bluk Berry, Bug Gem, Buginium Z, Bug Memory, Burn Drive, Cameruptite, Charizardite X, Charizardite Y, Chill Drive, Claw Fossil, Cornn Berry, Cover Fossil, Dark Gem, Darkinium Z, Dark Memory, Decidium Z, Deep Sea Scale, Deep Sea Tooth, Diancite, Dome Fossil, Douse Drive, Dragon Gem, Dragonium Z, Dragon Memory, Durin Berry, Eevium Z, Electric Gem, Electric Memory, Electrium Z, Fairium Z, Fairy Gem, Fairy Memory, Fighting Gem, Fighting Memory, Fightinium Z, Fire Gem, Fire Memory, Firium Z, Flying Gem, Flying Memory, Flyinium Z, Fossilized Bird, Fossilized Dino, Fossilized Drake, Fossilized Fish, Full Incense, Galladite, Garchompite, Gardevoirite, Gengarite, Ghost Gem, Ghostium Z, Ghost Memory, Glalitite, Grass Gem, Grassium Z, Grass Memory, Ground Gem, Groundium Z, Ground Memory, Gyaradosite, Helix Fossil, Heracronite, Houndoominite, Ice Gem, Ice Memory, Icium Z, Incinium Z, Jaw Fossil, Kangaskhanite, Kommonium Z, Latiasite, Latiosite, Lax Incense, Leek, Lopunnite, Lucarionite, Lucky Punch, Lunalium Z, Lycanium Z, Macho Brace, Magost Berry, Mail, Manectite, Marshadium Z, Mawilite, Medichamite, Metagrossite, Metal Powder, Mewnium Z, Mewtwonite X, Mewtwonite Y, Mimikium Z, Nanab Berry, Nomel Berry, Normalium Z, Odd Incense, Old Amber, Pamtre Berry, Pidgeotite, Pikanium Z, Pikashunium Z, Pinap Berry, Pinsirite, Plume Fossil, Poison Gem, Poisonium Z, Poison Memory, Primarium Z, Psychic Gem, Psychic Memory, Psychium Z, Quick Powder, Rabuta Berry, Razz Berry, Red Orb, Rock Gem, Rock Incense, Rockium Z, Rock Memory, Root Fossil, Rose Incense, Sablenite, Sachet, Sail Fossil, Salamencite, Sceptilite, Scizorite, Sea Incense, Sharpedonite, Shock Drive, Skull Fossil, Slowbronite, Snorlium Z, Solganium Z, Spelon Berry, Steel Gem, Steelium Z, Steelixite, Steel Memory, Stick, Swampertite, Tapunium Z, Thick Club, TR00, TR01, TR02, TR03, TR04, TR05, TR06, TR07, TR08, TR09, TR10, TR11, TR12, TR13, TR14, TR15, TR16, TR17, TR18, TR19, TR20, TR21, TR22, TR23, TR24, TR25, TR26, TR27, TR28, TR29, TR30, TR31, TR32, TR33, TR34, TR35, TR36, TR37, TR38, TR39, TR40, TR41, TR42, TR43, TR44, TR45, TR46, TR47, TR48, TR49, TR50, TR51, TR52, TR53, TR54, TR55, TR56, TR57, TR58, TR59, TR60, TR61, TR62, TR63, TR64, TR65, TR66, TR67, TR68, TR69, TR70, TR71, TR72, TR73, TR74, TR75, TR76, TR77, TR78, TR79, TR80, TR81, TR82, TR83, TR84, TR85, TR86, TR87, TR88, TR89, TR90, TR91, TR92, TR93, TR94, TR95, TR96, TR97, TR98, TR99, Tyranitarite, Ultranecrozium Z, Venusaurite, Water Gem, Waterium Z, Water Memory, Watmel Berry, Wave Incense, Wepear Berry, Whipped Dream, Berry, Berserk Gene, Bitter Berry, Burnt Berry, Gold Berry, Ice Berry, Mint Berry, Miracle Berry, Mystery Berry, Pink Bow, Polkadot Bow, PRZ Cure Berry, PSN Cure Berry.

**Future (45):** Absolite Z, Barbaracite, Baxcalibrite, Chandelurite, Chesnaughtite, Chimechite, Clefablite, Crabominite, Darkranite, Delphoxite, Dragalgite, Dragoninite, Drampanite, Eelektrossite, Emboarite, Excadrite, Falinksite, Feraligite, Floettite, Froslassite, Garchompite Z, Glimmoranite, Golisopite, Golurkite, Greninjite, Hawluchanite, Heatranite, Lucarionite Z, Magearnite, Malamarite, Meganiumite, Meowsticite, Pyroarite, Raichunite X, Raichunite Y, Scolipite, Scovillainite, Scraftinite, Skarmorite, Staraptite, Starminite, Tatsugirinite, Victreebelite, Zeraorite, Zygardite.

**Unobtainable (3):** Cherish Ball, Park Ball, Strange Ball.

**CAP (2):** Crucibellite, Vile Vial.

</details>

The reviewed implementation scope has **375 names**: the 148 current Champions items and 227 useful-but-unobserved items enumerated above. The other 208 inventory records are explicitly excluded.

## Current Champions items and damage-calculator relevance

### Resolved legal pool

- **75 Mega Stones:** Abomasite, Absolite, Aerodactylite, Aggronite, Alakazite, Altarianite, Ampharosite, Audinite, Banettite, Barbaracite, Beedrillite, Blastoisinite, Blazikenite, Cameruptite, Chandelurite, Charizardite X, Charizardite Y, Chesnaughtite, Chimechite, Clefablite, Crabominite, Delphoxite, Dragalgite, Dragoninite, Drampanite, Eelektrossite, Emboarite, Excadrite, Falinksite, Feraligite, Floettite, Froslassite, Galladite, Garchompite, Gardevoirite, Gengarite, Glalitite, Glimmoranite, Golurkite, Greninjite, Gyaradosite, Hawluchanite, Heracronite, Houndoominite, Kangaskhanite, Lopunnite, Lucarionite, Malamarite, Manectite, Mawilite, Medichamite, Meganiumite, Meowsticite, Metagrossite, Pidgeotite, Pinsirite, Pyroarite, Raichunite X, Raichunite Y, Sablenite, Sceptilite, Scizorite, Scolipite, Scovillainite, Scraftinite, Sharpedonite, Skarmorite, Slowbronite, Staraptite, Starminite, Steelixite, Swampertite, Tyranitarite, Venusaurite, Victreebelite.
- **73 non-Mega items:** Aspear Berry, Babiri Berry, Big Root, Black Belt, Black Glasses, Bright Powder, Charcoal, Charti Berry, Cheri Berry, Chesto Berry, Chilan Berry, Choice Scarf, Chople Berry, Coba Berry, Colbur Berry, Damp Rock, Dragon Fang, Expert Belt, Fairy Feather, Focus Band, Focus Sash, Haban Berry, Hard Stone, Heat Rock, Icy Rock, Iron Ball, Kasib Berry, Kebia Berry, King's Rock, Leftovers, Leppa Berry, Life Orb, Light Ball, Light Clay, Lum Berry, Magnet, Mental Herb, Metal Coat, Metronome, Miracle Seed, Muscle Band, Mystic Water, Never-Melt Ice, Occa Berry, Oran Berry, Passho Berry, Payapa Berry, Pecha Berry, Persim Berry, Poison Barb, Quick Claw, Rawst Berry, Rindo Berry, Roseli Berry, Scope Lens, Sharp Beak, Shed Shell, Shell Bell, Shuca Berry, Silk Scarf, Silver Powder, Sitrus Berry, Smooth Rock, Soft Sand, Spell Tag, Tanga Berry, Twisted Spoon, Wacan Berry, White Herb, Wide Lens, Wise Glasses, Yache Berry, Zoom Lens.

### Direct ordinary-hit damage inputs (43)

These items have a resolved Showdown hook that changes move power, final damage, an attacking stat, incoming damage, or Ground effectiveness:

- **Outgoing power/stat (23):** Black Belt, Black Glasses, Charcoal, Dragon Fang, Expert Belt, Fairy Feather, Hard Stone, Life Orb, Light Ball, Magnet, Metal Coat, Miracle Seed, Muscle Band, Mystic Water, Never-Melt Ice, Poison Barb, Sharp Beak, Silk Scarf, Silver Powder, Soft Sand, Spell Tag, Twisted Spoon, Wise Glasses.
- **Incoming damage/effectiveness (19):** Babiri Berry, Charti Berry, Chilan Berry, Chople Berry, Coba Berry, Colbur Berry, Haban Berry, Iron Ball, Kasib Berry, Kebia Berry, Occa Berry, Passho Berry, Payapa Berry, Rindo Berry, Roseli Berry, Shuca Berry, Tanga Berry, Wacan Berry, Yache Berry.
- **Turn-history dependent (1):** Metronome. Its damage modifier lives inside the item's volatile `condition`, not as a top-level item hook.

Separate but calculator-relevant categories:

- **Mega form selection (75):** a stone changes the combat identity. Use the selected Mega form's stats, typing, and ability; do not also apply a generic stone damage multiplier.
- **Accuracy/critical probability (4):** Bright Powder, Scope Lens, Wide Lens, Zoom Lens.
- **Survival rather than raw damage (2):** Focus Band and Focus Sash change whether an otherwise lethal hit leaves 1 HP.
- **Derived speed/ground state:** Choice Scarf and Iron Ball can affect speed-based moves; Iron Ball also removes Ground immunity.
- **Fling:** all 148 resolved items expose Fling metadata after item construction, but Fling first runs `TakeItem`. A compatible Mega Stone cannot be removed; other holders/items can make the held item a move-specific base-power input.

The remaining items affect healing, status, switching, move order, move locking, screens/weather duration, item removal, PP, or other battle state without changing the raw damage of an ordinary resolved hit.

## Usage calculation and Mega handling

For each Showdown Pokémon/form row \(P\) and held-item key \(I\):

```text
item_share(P,I) = item_weight(P,I) / Σ all item_weight(P,*)
score(I) = ΣP [usage(P) × item_share(P,I)]
```

`nothing` remains in the denominator because holding no item is a legitimate observed state, but it is not emitted as an item. Its aggregate exposure is 2.394%; the 148 item scores sum to 597.568%, and all form usages sum to 599.962%, approximately six team slots per battle team.

Mega forms need no identity repair in this dataset:

- The chaos file has 76 Mega-form rows and 75 distinct Mega Stone keys; male and female Mega Meowstic share Meowsticite.
- Every Mega-form row has exactly one item key: its stone.
- All 75 legal stones occur. Base-form rows may also contain stones, including off-species selections; the ranking preserves those observed weights rather than inventing a legality correction.

Scores are aggregate team-slot exposure weights, not mutually exclusive percentages, so they do not sum to 100%.

## Full 148-item Champions ranking

**1–25:** 1. Focus Sash 67.590%; 2. Sitrus Berry 61.273%; 3. Life Orb 47.602%; 4. Leftovers 45.327%; 5. Choice Scarf 40.441%; 6. Light Clay 18.933%; 7. Staraptite 16.069%; 8. White Herb 14.776%; 9. Chople Berry 12.985%; 10. Swampertite 12.218%; 11. Metagrossite 11.767%; 12. Fairy Feather 10.784%; 13. Colbur Berry 10.619%; 14. Raichunite Y 10.386%; 15. Mental Herb 10.294%; 16. Charizardite Y 9.937%; 17. Floettite 9.206%; 18. Charcoal 8.984%; 19. Mawilite 8.273%; 20. Mystic Water 8.242%; 21. Black Glasses 7.952%; 22. Kasib Berry 7.693%; 23. Roseli Berry 7.138%; 24. Expert Belt 4.931%; 25. Wide Lens 4.835%.

**26–50:** 26. Sceptilite 4.749%; 27. Eelektrossite 4.453%; 28. Delphoxite 4.082%; 29. Froslassite 3.974%; 30. Aerodactylite 3.935%; 31. Pyroarite 3.793%; 32. Scraftinite 3.583%; 33. Coba Berry 3.512%; 34. Tyranitarite 3.483%; 35. Gengarite 3.376%; 36. Passho Berry 3.286%; 37. Damp Rock 3.269%; 38. Occa Berry 3.172%; 39. Lum Berry 2.934%; 40. Blazikenite 2.768%; 41. Dragalgite 2.601%; 42. Shuca Berry 2.417%; 43. Venusaurite 2.416%; 44. Dragoninite 2.380%; 45. Raichunite X 2.297%; 46. Blastoisinite 2.152%; 47. Bright Powder 2.127%; 48. Sharp Beak 2.003%; 49. Silk Scarf 1.930%; 50. Gardevoirite 1.865%.

**51–75:** 51. Scovillainite 1.824%; 52. Metal Coat 1.690%; 53. Meganiumite 1.641%; 54. Never-Melt Ice 1.569%; 55. Magnet 1.524%; 56. Malamarite 1.478%; 57. Cameruptite 1.378%; 58. Spell Tag 1.190%; 59. Quick Claw 1.187%; 60. Scizorite 1.173%; 61. Soft Sand 1.120%; 62. Dragon Fang 1.095%; 63. Heat Rock 1.039%; 64. Glimmoranite 1.026%; 65. Miracle Seed 1.016%; 66. Scope Lens 0.959%; 67. Kangaskhanite 0.940%; 68. Falinksite 0.908%; 69. Iron Ball 0.895%; 70. Lucarionite 0.883%; 71. Babiri Berry 0.857%; 72. Drampanite 0.840%; 73. Lopunnite 0.818%; 74. Gyaradosite 0.811%; 75. Scolipite 0.743%.

**76–100:** 76. Shell Bell 0.743%; 77. Muscle Band 0.732%; 78. Crabominite 0.731%; 79. Starminite 0.731%; 80. Yache Berry 0.710%; 81. King's Rock 0.699%; 82. Haban Berry 0.687%; 83. Aggronite 0.683%; 84. Garchompite 0.681%; 85. Chandelurite 0.675%; 86. Charti Berry 0.671%; 87. Barbaracite 0.656%; 88. Big Root 0.643%; 89. Wacan Berry 0.634%; 90. Charizardite X 0.631%; 91. Twisted Spoon 0.588%; 92. Black Belt 0.575%; 93. Golurkite 0.562%; 94. Ampharosite 0.542%; 95. Clefablite 0.526%; 96. Greninjite 0.503%; 97. Abomasite 0.494%; 98. Kebia Berry 0.449%; 99. Hawluchanite 0.440%; 100. Banettite 0.402%.

**101–125:** 101. Hard Stone 0.370%; 102. Steelixite 0.358%; 103. Chesnaughtite 0.357%; 104. Skarmorite 0.343%; 105. Light Ball 0.340%; 106. Feraligite 0.327%; 107. Altarianite 0.325%; 108. Excadrite 0.320%; 109. Alakazite 0.319%; 110. Wise Glasses 0.294%; 111. Rindo Berry 0.282%; 112. Zoom Lens 0.276%; 113. Slowbronite 0.271%; 114. Galladite 0.266%; 115. Heracronite 0.265%; 116. Metronome 0.262%; 117. Chimechite 0.261%; 118. Meowsticite 0.256%; 119. Chesto Berry 0.244%; 120. Manectite 0.237%; 121. Poison Barb 0.207%; 122. Sablenite 0.206%; 123. Houndoominite 0.198%; 124. Beedrillite 0.197%; 125. Audinite 0.187%.

**126–148:** 126. Pidgeotite 0.179%; 127. Victreebelite 0.166%; 128. Smooth Rock 0.165%; 129. Icy Rock 0.162%; 130. Glalitite 0.150%; 131. Pinsirite 0.136%; 132. Sharpedonite 0.129%; 133. Medichamite 0.111%; 134. Emboarite 0.097%; 135. Focus Band 0.096%; 136. Absolite 0.082%; 137. Payapa Berry 0.078%; 138. Persim Berry 0.074%; 139. Silver Powder 0.070%; 140. Shed Shell 0.040%; 141. Rawst Berry 0.016%; 142. Tanga Berry 0.014%; 143. Chilan Berry 0.009%; 144. Leppa Berry 0.008%; 145. Oran Berry 0.005%; 146. Aspear Berry 0.005%; 147. Cheri Berry 0.004%; 148. Pecha Berry 0.002%.

## Planning interpretation

Use raw exposure to order the 148 observed items, but do not use absence from one monthly file as an exclusion rule. The 227 unobserved items remain in the long-term implementation scope. Then separate implementation shape:

1. high-exposure ordinary damage hooks already representable by the calculator;
2. shared families: type boosters, resistance Berries, accuracy modifiers, healing/survival;
3. Mega Stones through existing form selection rather than stone-specific formula code;
4. stateful effects such as Metronome, White Herb, screens, weather duration, and PP;
5. move-specific mechanics such as Fling.

For the top 25 specifically:

- **Direct raw damage:** Life Orb, Chople Berry, Fairy Feather, Colbur Berry, Charcoal, Mystic Water, Black Glasses, Kasib Berry, Roseli Berry, Expert Belt.
- **Mega form inputs:** Staraptite, Swampertite, Metagrossite, Raichunite Y, Charizardite Y, Floettite, Mawilite.
- **Accuracy/KO probability rather than raw damage:** Focus Sash, Wide Lens.
- **Battle-state only for a normal single hit:** Sitrus Berry, Leftovers, Choice Scarf, Light Clay, White Herb, Mental Herb.

This means implementation should not proceed strictly from rank 1 downward: one shared type-booster implementation covers five direct-damage items in the top 25 and all 18 type boosters in the legal pool.

## Assumptions, gaps, and refresh rule

- This is a **Showdown proxy**, not official Pokémon Champions telemetry or an official product legality statement.
- The checked Showdown commit is a moving source snapshot. A later commit can change both the `champions` overrides and inherited base item status.
- The cutoff-0 file intentionally includes every recorded team, including off-meta and malformed-but-accepted item choices. It is appropriate for exposure, not for claiming strategic viability.
- Usage is a priority signal only. It does not define whether an item has a real held effect; that decision comes from the pinned item table and simulator semantics.
- Refresh from one later monthly bulk file after it is published, and rerun whenever the Showdown Champions mod changes.

## Reproduction outline

1. Download one Showdown source archive and record its master commit.
2. Load the source with `tsx`; call `Dex.items.all()` for the 583-record inventory.
3. Call `Dex.mod('champions').items.all()` and retain `!item.isNonstandard`; assert 148 results, split into 75 `megaStone` and 73 other items.
4. Read the single compressed cutoff-0 chaos JSON locally.
5. For every form, normalize each item weight by the sum of **all** `Items` weights, including `nothing`; aggregate by canonical item key.
6. Assert: 1,163,315 battles; 305 form rows; 149 observed keys; one key is `nothing`; the other 148 exactly equal the resolved Champions legal set; no unmatched key; 76 Mega-form rows and 75 unique Mega Stone keys.
7. Sort descending by aggregate score, then item name.
8. Independently review all 583 base item records for intrinsic held callbacks/properties and base-simulator item-ID lookups. Exclude only the six enumerated categories above.
9. Assert: 375 included + 208 excluded = 583; 148 observed included + 227 unobserved included = 375; all four sets contain unique IDs and their intersections are empty.
