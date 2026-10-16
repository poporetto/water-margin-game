# Tile art brief, part 2: what is still missing

Water Margin, a Suikoden II–style RPG set in Northern Song China, c. 1120. This list covers only the tiles that the game still draws with placeholder code. Match the style, palette and line weight of the art already made: grass, roads, water, trees, buildings, interiors and the world-map icons.

## Format (same as the existing sheets)

- **32 × 32 px per tile.** Hard pixel edges, no anti-aliasing or blur. Each tile should use roughly 8–16 colours.
- **View:** top-down three-quarter view, like Suikoden II. You see the tops and the fronts of things.
- **Delivery:** PNG with transparency, on a grid sheet of 32 × 32 cells with no padding. Include a numbered list saying which cell is which tile.
- **Tall objects:** 32 px wide (or the width given) and the height given, **bottom-aligned**. The bottom 32 px is the tile the object stands on.
- **Ground tiles must tile seamlessly.** Give 2–4 variants so large areas don't look repeated.
- **Water sheets use the existing layout.** Copy `water.png` / `deep-water.png`: 47 shoreline shapes × 3 animation frames, with the shapes in the same order.

---

## 1. Seasonal ground (highest priority: these cover the most map)

### 1a. Marsh: Liangshan and the lake shore
The marsh is damp, with yellow-green reedy grass, a slight grey mist tint, and muddy dark earth.

| # | Tile | Notes |
|---|---|---|
| 1 | Grass | 4 variants |
| 2 | Long / dark grass | 2 variants |
| 3 | Flowers in grass | 2 variants (small white and yellow marsh flowers) |
| 4 | Dirt road | 3 variants, plus edges into grass: 4 sides, 4 outer corners, 4 inner corners |
| 5 | Broadleaf tree | 32 × 56, 2 variants |
| 6 | Pine | 32 × 76, 2 variants |

### 1b. South: Jiangzhou, Jieyang Ridge, the Yangtze
The south is lusher, with darker and more saturated greens and reddish earth.

The tiles are the same as 1a, items 1, 4, 5 and 6: grass, dirt road with edges, broadleaf tree and pine.

### 1c. Dusk: evening scenes
The dusk set has warm orange-violet light and long shadows.

The tiles are the same as 1a, items 1, 3, 4 and 5: grass, flowers, dirt road with edges, and broadleaf tree.

### 1d. Autumn
| # | Tile | Notes |
|---|---|---|
| 7 | Dirt road | 3 variants plus edges (as item 4), with fallen leaves at the edges |
| 8 | Crop field, harvest time | 2 variants: golden stubble and sheaves |

### 1e. Snow
| # | Tile | Notes |
|---|---|---|
| 9 | Dirt road under snow | 3 variants plus edges (as item 4), with trodden slush in the middle |
| 10 | Stone paving under snow | 2 variants, staggered blocks with snow in the joints |
| 11 | Grey stone city wall, snow on top | left / middle / right pieces, plus a crenellated top |
| 12 | Hanging red lantern on a post, snowy | 32 × 56 |
| 13 | Reeds standing in icy water | 2 variants |
| 14 | Small rowboat on icy water | 32 × 32 |

## 2. Water outside spring and summer

These are the same 47 shoreline shapes × 3 frames as `water.png` (shallow) and `deep-water.png` (deep), with one pair of sheets for each setting:

| # | Setting | Look |
|---|---|---|
| 15 | Marsh | murky green-brown water, reed stubble along the shore |
| 16 | South | clear blue-green, sandy reddish banks |
| 17 | Autumn | cold steel-blue, leaves floating, yellowed banks |
| 18 | Snow | grey water with thin ice at the edges and snow on the banks |

## 3. City gate, snow and autumn versions

| # | Tile | Size | Notes |
|---|---|---|---|
| 19 | City gate, snow | 128 × 90 | same design as the existing gate (open and shut versions), with snow on the tower roof and the wall tops |
| 20 | City gate, autumn | 128 × 90 | the same, with autumn colours around it |

## 4. Interiors

| # | Tile | Notes |
|---|---|---|
| 21 | Interior wall | 2 rows tall: a plaster upper part and a dark timber dado below. Left end, middle (3 variants, one with a hanging scroll), right end, plus inside and outside corners where walls turn |
| 22 | Doorway seen from inside | an opening in the interior wall leading out, with daylight beyond and a threshold step |
| 23 | Official's raised dais | edge pieces for a raised wooden platform 1–2 steps high: front edge, side edges, and front corners |

## 5. World map (silk-map style, like the existing world icons)

| # | Tile | Notes |
|---|---|---|
| 24 | Sea | darker blue with rows of curling fish-scale waves, 2 frames; plus coast edges in the same 47-shape layout as the water sheets, with an ink outline along the shore |
| 25 | River | blue with white brush-stroke ripples, 2 frames; plus bank edges in the 47-shape layout |
| 26 | Reeds in water | marsh symbol: a few ink reed strokes standing in water, 2 variants |

## 6. One-off

| # | Tile | Notes |
|---|---|---|
| 27 | Vegetable plot | dug earth beds with rows of greens and a wooden edge, connecting on all sides (edges and corners); 2 variants |

## 7. Prisons

| # | Tile | Notes |
|---|---|---|
| 28 | Prison cell bars | heavy dark timber grille standing on a stone floor: a top beam, a sill and squared bars. Pieces for a run across the room (left end, middle, right end) and a run going away from the viewer (top, middle, bottom), plus a gap for the cell door. No grass: this stands indoors |
| 29 | Prisoner's straw pallet | 32 × 32 (2 wide if possible): a straw mat or plank bunk with a rough blanket, for the cells (they currently use the curtained bed) |

## Known issue to fix (not new art)

- **Props sitting on a carpet show a patch of floor.** On carpeted rooms (Chai Jin's hall, the manor halls), every lantern, table, shelf and jar sits on a square of wooden floor with a carpet border around it, because the map cuts a hole in the carpet for each prop. **Fix:** let the carpet run under props, so the prop stands on the carpet itself. If any prop sheet has its own floor painted in, re-export it with a transparent background so the ground beneath shows through.

---

## Priority

1. **Section 1a (marsh) and section 2 (water) for marsh.** Liangshan uses these, and most of the second half of the game happens there.
2. **Section 4 (interior wall and doorway).** You see these in every building.
3. **Snow (1e, the snow water in section 2, and the snow gate).**
4. **Prison bars and pallet (section 7).**
5. **South and autumn.**
6. **World-map sea and river.**
7. **Dusk and the vegetable plot.**
