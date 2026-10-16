# Northern Song exterior buildings

Production art for Water Margin, set around 1120. The new exterior set is integrated into spring, summer, autumn, dusk, marsh, southern and northern field maps. Interiors, snow maps and the silk world map keep their existing rendering.

## Art direction

Ordinary buildings use grey unglazed tube tiles or straw thatch above dark timber and warm off-white plaster. Official and religious structures use dark or warm-grey tiles, muted red timber, modest ridge ends and bracket-supported eaves. Windows use simple vertical slats. City gates have rectangular timber-linteled passages; ordinary buildings have no glazed yellow imperial roofs. Masonry textures represent grey facing over substantial city-wall construction.

Historical reference: the Northern Song *Yingzao Fashi* (1103), discussed in [Chinese Architecture and Metaphor: Song Culture in the Yingzao Fashi Building Manual](https://hilo.hawaii.edu/languages/chinese/documents/languages/chinese/Chinese_Architecture_and_Metaphor_Song_Culture_in_the_Yingzao_Fashi_Building_Manual-introchap4-Reduced.pdf). These are stylized game assets informed by that structural vocabulary.

Source artwork was created with the built-in image generator. Original PNGs and exact prompts are in `art/generated-buildings-v1/`; native exports are reproducible with `tools/build-building-tiles.js` using Sharp. Production work includes cropping, palette reduction, binary-alpha normalization, modular packing and regularizing masonry/paving joints.

## Sheets

| PNG | Dimensions | Contents |
|---|---|---|
| building-roofs.png | 192 × 96 | Four roof styles, each with left/middle/right pieces and ridge, repeating slope, eave and short-roof rows |
| building-walls.png | 128 × 64 | 32 wall, doorway, paving, fence and fixture cells |
| building-gate.png | 64 × 96 | Open and closed 64 × 45 gate sprites |

All cells use a 16 px grid. Each tile has at most 16 opaque colours. Transparency is hard alpha, 0 or 255. Display with nearest-neighbour scaling. Coordinate metadata is in `building-index.json`.

## Roof index

Each style occupies three columns, ordered left end, repeatable middle, right end:

1. Town grey tile: columns 0–2, game `^`.
2. Village thatch: columns 3–5, game `z`.
3. Official dark tile: columns 6–8, game `v`.
4. Shrine/palace warm-grey tile: columns 9–11, game `Z`.

Row 0 is the ridge; row 1 repeats on taller roofs; row 2 is the lower slope/eave, 22 px high. Row 4 is a complete short roof, also 22 px high. Eave sprites extend 6 px below their ground tile into the wall row and are drawn in the tall-object pass. Rows 3 and 5 contain those extensions, not independent tiles. Unused space is transparent. The renderer chooses left/middle/right and top/middle/bottom from neighbouring roof characters without changing map layouts.

## Wall and fixture index

Numbered left to right, top to bottom; zero-based coordinates are in the JSON file.

1. Plaster wall, left
2. Plaster wall, middle
3. Plaster wall, right
4. Vertical-slat window
5. Open double door
6. Barred double door
7. Red wall, left
8. Red wall, middle
9. Red wall, right
10. Masonry wall, left
11. Masonry wall, middle
12. Masonry wall, right
13. Battlement, left
14. Battlement, middle
15. Battlement, right
16. Stone paving, variant 1
17. Stone paving, variant 2
18. Horizontal wooden fence
19. Vertical wooden fence
20. Fence, northwest corner
21. Fence, northeast corner
22. Fence, southwest corner
23. Fence, southeast corner
24. Fence post
25. Stone-ring well with lifting frame
26. Upper plaster wall, left
27. Upper plaster wall, middle
28. Upper plaster wall, right
29. Red bracketed column (available asset; interior columns retain their existing art)
30. Red wall with slat window
31. Closed door variant (available asset)
32. Stone footing (available asset)

Exterior `D` doors are visibly open and remain traversable. Lowercase `d` doors are barred and remain solid. Red-wall windows use cell 30. Upper plaster rows avoid repeating a stone footing between wall rows. Fences and wells draw over their ground, preserving transparent gaps.

## Gates

Open source rectangle: (0,0), 64 × 45. Closed source: (0,48), 64 × 45. A sprite consists of 16 px left pier, 32 px passage and 16 px right pier. The renderer repeats passage strips to fit the existing run of `G` map characters. Piers extend onto the adjacent solid `#` or `R` tiles, so no walkable gate tile is obscured by masonry. A two-tile passage plus piers uses the native four-tile width; wider existing map openings expand the middle.

Multi-row gates draw once, aligned to their bottom row. The existing `shut:<map>` flag selects the closed sprite. Gates with guardian statue wings retain their bespoke procedural drawing. Collision rules, event coordinates, map geometry and story flags are unchanged.

## Preview and checks

Serve the repository and open `/tools/building-tiles.html`. The page includes town houses, a thatched village, an official hall, city gates, short roofs and fence corners, plus season and gate-state controls. The current game and local `docs/` publishing copy include the new art; nothing has been deployed remotely.

Checks:

- `node tools/test-building-tiles.js` — dimensions, palettes, transparency, roof selection and 6 px overhangs, gate widths 1/2/4/6, closed-state selection, guardian/season/interior fallbacks and unchanged collision flags.
- `node tools/test-building-browser.js` — desktop/mobile preview, visible gate state changes, real Kaifeng map, keyboard gate traversal and docs build. Requires Playwright, Chromium and a server on port 8765; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an installed browser.
- `node tools/test-starter-tiles.js` and `node tools/validate.js` — existing terrain assets and game data.

Screenshots and browser results are in `output/buildings/`.
