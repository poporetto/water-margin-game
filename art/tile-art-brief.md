# Tile art brief — Water Margin (Suikoden II–style RPG)

## Style and format (applies to everything)

- **Pixel art, 16×16 px per tile.** The game renders a 320×240 screen and scales it ×3, so draw at 16 px, not higher. No anti-aliasing, no soft gradients, no blur; hard pixel edges.
- **View:** top-down three-quarter view, like Suikoden II / SNES-era Chinese RPGs (you see the tops *and* fronts of things).
- **Setting:** Northern Song dynasty China, c. 1120. Grey tiled roofs, white plaster walls with dark timber frames, red-lacquered columns and gates for temples and official halls, thatch for village houses. No later (Ming/Qing) styles such as glazed yellow imperial roofs on ordinary buildings.
- **Palette:** earthy and muted, slightly warm. Keep each tile to roughly 8–16 colours.
- **Delivery:** PNG with transparency, on a grid sheet (16×16 cells, no padding), plus a numbered list saying which cell is which tile. Tall objects go on a separate sheet with transparent backgrounds.
- **Tall objects** stand on one tile but are drawn taller. Make them 16 px wide (or the width given) and the height given, **bottom-aligned**: the bottom 16 px is the tile the object stands on.
- **Seamless:** ground tiles (grass, dirt, water, floors) must tile seamlessly. Give 2–4 variants of each so large areas don't look repeated.

## 1. Ground

| # | Tile | Notes |
|---|---|---|
| 1 | Grass | 4 variants |
| 2 | Grass, darker (shade/long grass) | 2 variants |
| 3 | Flowers in grass | 3 variants |
| 4 | Dirt road / path | 3 variants, plus edge pieces blending into grass (top, bottom, left, right, 4 corners) |
| 5 | Stone paving (city streets, courtyards) | 2 variants, staggered blocks |
| 6 | Sand / beach | 2 variants |
| 7 | Crop field (rows of millet/wheat) | 2 variants |
| 8 | Scorched / dark ground (battlefield, burnt) | 2 variants |
| 9 | Stairs (stone steps going up) | 1 |

## 2. Water

| # | Tile | Notes |
|---|---|---|
| 10 | Shallow water (rivers, ponds) | 2–3 animation frames |
| 11 | Deep water (lakes, the marsh, the sea) | 2–3 animation frames |
| 12 | Reeds standing in water | 2 variants |
| 13 | Shoreline edges | land/water edge for each side and each corner: 4 straight sides, 4 outer corners, 4 inner corners |
| 14 | Wooden bridge / jetty planks | horizontal and vertical versions, plus end pieces |

## 3. Nature (tall objects)

| # | Tile | Size | Notes |
|---|---|---|---|
| 15 | Broadleaf tree | 16×28 | 2 variants, plus a ground shadow |
| 16 | Pine | 16×38 | 2 variants |
| 17 | White poplar (tall, narrow, white trunk) | 16×38 | used as a path marker in the story |
| 18 | Weeping willow | 32×67 | 2 tiles wide; drooping branches; one version with a crow's nest |
| 19 | Bamboo thicket | 16×16 | 2 variants; tiles side by side |
| 20 | Dead tree | 16×16 | |
| 21 | Rock / boulder | 16×16 | 2 variants |
| 22 | Mountain / cliff | 16×16 | rocky cliff with edge pieces where it meets grass (sides and corners) |

**Seasons:** grass, trees, bamboo and mountains appear in several seasons. Please give a **spring/summer** (green), **autumn** (orange-red leaves, yellowed grass), and **snow** (white ground, snow on branches) version of items 1–4 and 15–22. Lower priority: a **southern** variant (lusher, darker green) and a **northern** variant (dry, olive-brown).

## 4. Buildings (exterior)

Buildings are assembled from repeating pieces, so each needs a **left end, middle and right end** (and for roofs, a top/ridge row and a lower eave row).

| # | Tile | Notes |
|---|---|---|
| 23 | Grey tile roof, town house | ridge row + eave row; left/middle/right; the eave overhangs about 6 px over the wall below |
| 24 | Thatch roof, village house | same pieces as 23 |
| 25 | Dark grey tile roof, temple / official hall | same pieces; upturned corners at the ends |
| 26 | Red lacquered roof variant, palace / shrine | same pieces |
| 27 | White plaster wall with timber frame | left/middle/right |
| 28 | Plaster wall with a lattice window | 1 (sits in the wall row) |
| 29 | Red lacquered wall / colonnade | left/middle/right; top edge rises about 2 px |
| 30 | Grey stone wall (city wall, fortress) | left/middle/right, plus a crenellated top |
| 31 | Door, open | wooden double door, dark opening |
| 32 | Door, shut | same, closed with a bar |
| 33 | City gate | 4 tiles wide × 2 tall; gate tower with a roof rising about 13 px above; arched passage the player walks through |
| 34 | Wooden fence | horizontal, vertical, corners and end posts |
| 35 | Well | 16×16, stone ring with a wooden frame |

## 5. Town and outdoor props (tall)

| # | Tile | Size | Notes |
|---|---|---|---|
| 36 | Market stall with awning | 16×26 | 2–3 variants (vegetables, cloth, pottery) |
| 37 | Hanging red lantern on a post | 16×28 | |
| 38 | War banner on a pole, red | 16×41 | plus a yellow version with a red border (Liangshan's "替天行道" banner) |
| 39 | Tavern wine flag (酒旗) on a bamboo pole | 16×38 | dark blue cloth, white border, the character 酒 |
| 40 | Notice board with a little roof | 16×28 | |
| 41 | Stone stele on a tortoise base | 16×31 | |
| 42 | Grave mound with a small headstone | 16×16 | |
| 43 | Army tent | 16×16 | white canvas, red pennant |
| 44 | Small rowboat on water | 16×16 | |
| 45 | Two-man sampan with an arched mat awning and a boatman | 64×28 | 4 tiles wide; upswept bow and stern; boatman in a conical straw hat at the stern oar |
| 46 | Stone statue (guardian lion or figure) | 16×22 | |

## 6. Interiors

| # | Tile | Notes |
|---|---|---|
| 47 | Wooden floorboards | 3 variants |
| 48 | Stone floor | 2 variants |
| 49 | Red carpet | middle, plus edges and corners |
| 50 | Interior wall | 2 rows high: a plaster upper section and a timber dado; left/middle/right |
| 51 | Black void (outside the room) | 1 |
| 52 | Table | 1, with a cup/teapot variant |
| 53 | Counter (shop / inn) | left/middle/right |
| 54 | Bed (curtained) | 2×2 tiles |
| 55 | Shelves with jars and scrolls | 2 variants |
| 56 | Large storage jar | 1 |
| 57 | Small altar table with incense | 1 |
| 58 | Kneeling cushion | 1 |
| 59 | Hall column, red | 16×39, tall |

## 7. Temples and official halls (tall)

| # | Tile | Size | Notes |
|---|---|---|---|
| 60 | Great seated Buddha | 48×43 | 3 tiles wide, gilded, on a lotus base |
| 61 | Offering altar before the Buddha | 48×23 | 3 tiles wide |
| 62 | Bronze incense censer | 16×16 | |
| 63 | The Three Pure Ones (三清), Daoist | 48×42 | 3 seated figures |
| 64 | Goddess statue (Daoist) | 16×58 | standing, red robe |
| 65 | Deity-king statue | 16×58 | standing, gold armour |
| 66 | Daoist altar | 48×23 | candles, incense, a sword |
| 67 | Painted screen behind an official's seat | 48×34 | landscape or tiger painting |
| 68 | Official's raised dais | 16×16 | step pieces |
| 69 | Official's chair (high-backed) | 16×30 | |
| 70 | Judge's desk with brush stand and gavel block | 48×25 | |

## 8. World map (separate style)

The world map is drawn like an **old Chinese map on silk**, not like the field maps. Same 16 px grid, flatter and more painterly.

| # | Tile | Notes |
|---|---|---|
| 71 | Silk ground | pale ochre, faint texture, 3 variants |
| 72 | Road | earth-brown path with an ink edge, connecting in all directions |
| 73 | River | blue with white brush-stroke ripples |
| 74 | Sea | darker blue with rows of curling fish-scale waves |
| 75 | Mountains | blue-green peaks with ink outlines (青綠山水 style), 3 variants |
| 76 | Forest | ink-brush trees, 2 variants |
| 77 | Bridge | over a river |
| 78 | Location icons | **city:** walled gate with a tiled tower, 3×2 tiles; **town:** 3×2; **village:** 2×2 thatch; **manor:** 2×2 tiled; **temple:** red walls, 3×2; **fort:** stone, 3×2; **roadside inn** with a wine flag, 2×2; **ruined monastery**, 3×2; **ridge with a guard-post banner**, 3×2; **forest**, 1×2; **marsh**, 1×2; **island fortress (Liangshan):** a mountain in the water with a gate |

## Priority if you can't do it all

1. Grass, dirt road, water + shoreline edges, trees and pine — what you see most.
2. Houses: roofs, walls, doors, stone paving, city gate.
3. Interiors: wood floor, interior wall, table, counter, bed.
4. Temples and the official hall.
5. World map set.
6. Seasonal variants.
