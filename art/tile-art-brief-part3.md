# Tile art brief, part 3: tiles still drawn by code or by stand-ins

Found during the October 2026 map review (chapters 1–24). Each item below is either drawn by placeholder code, or borrows art made for something else. Same format as `tile-art-brief-remaining.md`: 32 × 32 px tiles, hard pixel edges, Suikoden II three-quarter view, PNG with transparency on a 32 px grid, tall objects bottom-aligned. Match the existing sheets' palette and line weight.

Priority: **1** = seen often or looks clearly wrong now; **2** = seen in a few scenes; **3** = minor.

---

## 1. City gate in an east or west wall (priority 1)

The existing gate art (`building-gate.png`, `gate-autumn.png`, `gate-snow.png`) only shows a gate in a north or south wall. When the wall runs north–south, the code now draws a gate tower itself (`cityGateSideOver` in `js/core/tiles.js`). It works, but is plainer than the drawn gates.

Used in: Dengzhou, Qingzhou, Lingzhou, Dongping, Dongchang, Hangzhou, and the barred gate past the inn below Dulong Ridge.

| # | Tile | Notes |
|---|---|---|
| 1 | Side gate tower, top end | The gatehouse roof seen from above, its ridge running north–south along the wall, 32 wide (may overhang ~8 px each side). Fits on top of a stone wall run (`#`). |
| 2 | Side gate tower, middle | Repeats for a 3-tile passage (gates are 2 or 3 tiles long). Roof covers the passage, so walkers are hidden under it. |
| 3 | Side gate tower, bottom end | The red south gable of the tower and its stone base, standing on the wall below the passage. |
| 4 | Passage floor | Stone road running east–west through the wall, with timber jambs at the north and south ends. 3 variants: top / middle / bottom. |
| 5 | Shut leaves | The two gate leaves closed, seen edge-on on the east and west faces of the wall (Qingzhou is shut in chapter 8). |

Seasons: spring/summer, autumn, snow (to match the three existing gate sheets).

## 2. Prison cell bars that join the cell door (priority 1)

In `part2-objects.png`, the bar pieces (cells 13–19) are shorter than the cell door (cell 20) and narrower than their 32 px tile, so a row of bars and doors shows small gaps and steps. The code now stretches the bars to the door's height, but the seams between pieces still show.

Make one matched set, all the same height as the door, each filling its full 32 px width so neighbours join with no gap:

| # | Tile | Notes |
|---|---|---|
| 1 | Bars, straight run | Horizontal grille, top beam and sill continuous edge to edge |
| 2 | Bars, left end | With an end post on the left |
| 3 | Bars, right end | With an end post on the right |
| 4 | Bars, divider | A post in the middle where two cells meet (a vertical wall of bars runs north from it) |
| 5 | Bars, vertical run | The wall of bars between two cells, seen end-on (runs north–south) |
| 6 | Cell door | Same height and beam/sill line as 1, with the lock; full 32 px wide |
| 7 | Cell door, open | Optional: for the jail-break scenes |

Used in every jail: Daming, Jiangzhou, Zhu Village, Dengzhou, Gaotang, Qingzhou, Huazhou, Dongping, and Liu Gao's cage in Qingfeng Fort.

## 3. Snow versions of outdoor props (priority 1)

These had no snow art, so on snow maps the game drew tiny placeholder boxes. They now borrow the spring art, which shows no snow on them.

| # | Tile | Size | Snow maps that use it |
|---|---|---|---|
| 1 | Tent (`V`) | 48 × 40 (3 × 2 footprint) | Cangzhou (convict camp) |
| 2 | Banner on pole (`Y`) | as spring | Qingfeng Mountain, Kong manor |
| 3 | Notice board (`I`) | as spring | Qingfeng, Chai manor |
| 4 | Well (`p`) | as spring | Cangzhou, Qingfeng |
| 5 | Grave mound (`g`) | as spring | — (ready for winter graveyards) |
| 6 | Wine flag (`J`) | as spring | Yangtze crossing, Qingfeng |
| 7 | Market stall (`u`) | as spring | — |
| 8 | Stone stele (`Q`) | as spring | — |
| 9 | Wattle fence (`F`), outdoors | as the other seasons' fence | Cangzhou, fodder depot, Kong manor, Qingfeng Mountain (still drawn by code) |

## 4. Cave mouth in a cliff face (priority 2)

The cave mouth (`_`) is drawn as a flat black square, which looks like a hole in the grass when it sits below a cliff.

| # | Tile | Notes |
|---|---|---|
| 1 | Cave mouth, in cliff | Dark opening set into the face of the existing cliff art, 2 tiles wide, with rocks around the rim. Summer and snow versions. |

Used in: the tigers' cave on the Yi Ridge (Yishui), the Pangyuan cave behind Qingxi, the Mysterious Lady's grotto (Xuannu).

## 5. Pagodas (priority 1)

There is no pagoda art at all. The Liuhe Pagoda is currently stacked from three ordinary roof-and-wall tiles, and the stone pagoda of East Creek (the one Chao Gai carried across the creek, which gave him his name "Heavenly King") is mentioned in the map but never drawn.

| # | Tile | Size | Notes |
|---|---|---|---|
| 1 | Great pagoda (Liuhe) | 3 × 6 tiles (96 × ~200 px), bottom-aligned on a 3 × 2 base | Octagonal brick-and-timber tower, 5–7 eaved storeys with upturned corners, a door at the bottom centre, finial on top. Autumn; a plain version for other seasons. |
| 2 | Small stone pagoda (East Creek) | 1 × 2 tiles (32 × ~64 px), 1 × 1 base | Grey stone, 3–5 tiers, mossy; summer. Stands by the creek at East Creek village. |
| 3 | Temple pagoda, medium | 2 × 4 tiles (64 × ~128 px), 2 × 2 base | Brick, 5 storeys, for monastery grounds (Wutai, Xiangguo, Baoen); spring/autumn/snow. |
| 4 | Snow caps | — | Snow versions of 1–3, or a separate snow overlay. |

## 6. Monks' sleeping platform (priority 3)

The meditation hall at Mount Wutai uses canopy beds (`k`) in rows, because there is no long platform. A long low wooden platform (kang) with folded quilts would be correct.

| # | Tile | Notes |
|---|---|---|
| 1 | Sleeping platform, left / middle / right | Joins into runs of 3+ tiles, 2 tiles deep |

## 7. Haystacks (priority 3)

The fodder depot (chapter 3, snow) builds its hay ricks from thatched-roof tiles.

| # | Tile | Notes |
|---|---|---|
| 1 | Hay rick | 2 × 2, snow-capped; plus a summer version |

## 8. Water-grating at a city gate (priority 3)

At Hangzhou's Yongjin Gate (Zhang Shun's death, chapter 23), the pools either side of the gate road are plain water.

| # | Tile | Notes |
|---|---|---|
| 1 | Iron water-grating set in a stone channel | 1 × 2, with a small bell on a cord |

---

When art arrives, wire it in `assets/tiles.js` and check with the full-map renderer (see the map-review notes in memory) and `node tools/test-prop-footprints.js`.
