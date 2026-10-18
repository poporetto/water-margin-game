# Tile refinements

Created with the built-in image-generation tool. The source PNGs and exact `*-prompt.txt` files in this directory preserve the four prompts: long inn counter, Buddhist statues, Taoist Three Pure Ones, and courtyard paving. Production exports are in `assets/tiles/32/*-refined.png`; regenerate with `tools/build-refinement-tiles.js`.

- Counter: 128×56, left cap/repeatable middle/right cap. Runs of three or more `c` cells use one continuous counter; one/two-cell counters and `t` tables keep their original sprites. Collision follows the authored counter run.
- Buddhist statues (`1`) and Taoist Three Pure Ones (`5`): separate 144×104 polychrome sprites with pedestals, occupying five cells across at ground level. All seven existing temple groups have room for this footprint. Taoist goddess (`6`) and deity-king (`7`) retain their original identities and receive raised stone bases. Buddhist offering altar (`2`) and Taoist trigram altar (`8`) retain their distinct artwork. No story or temple assignments were changed.
- Censer (`3`): original bronze design enlarged to 64×64, occupying two cells across and two deep. All six authored censers receive the full footprint, with render sorting aligned to its foot.
- Paving: four 32px cells forming a continuous 64×64 repeat, 16 colours. Snow paving keeps its existing snowy treatment.
- `tools/build-part2-tiles.js` now uses full silhouette bounds for the rowboat and straw pallet instead of clipping them at assumed grid boundaries.
- World-map roads have broken silk-colour edge pixels instead of a continuous dark outline. Red boundary wall material extends under the full roof cap.

Preview: `tools/tile-refinements.html`. Tests: `tools/test-tile-refinements.js`, `tools/test-refinement-browser.js`, plus existing building/prop/world/entrance checks.

## Furniture cleanup and sealed tablet

- Wine jar, tables and small counter exports discard detached neighbouring pixels before fitting and after palette reduction. The source object artwork is retained.
- Runs of official chair cells draw one seat at the first cell, matching the existing official position and keeping the dais walkable.
- The sealed tablet uses a dedicated 64×96 grey stone sprite with dragon crown, seal marks, tortoise and plinth. It is assigned only to `demonhall`; other stelae retain their existing appearance. Its two authored base cells and two-wide story interaction match the new width; the visual height overhangs without blocking extra floor rows.
- The new tablet was created with the built-in image tool. Source: `sealed-tablet.png`; exact prompt: `sealed-tablet-prompt.txt`; export: `assets/tiles/32/sealed-tablet-refined.png`.
- `tools/test-furniture-cleanup.js` verifies clean silhouettes, one seat, tablet rendering dimensions, collision and interaction width.

## Wooden statues and complete boats (latest)

The earlier painted Buddhist and Taoist statue sets are superseded by separate wood-only versions, retaining their religious identities. Production sprites are 144×136: 32px (one tile) taller than before. Ground footprints remain five tiles wide and one deep; the extra visual height does not block floor above them.

The ordinary rowboat and covered sampan now have complete independent source images, avoiding the shared-sheet crop errors. The sampan contains no painted person. Production files: rowboat-complete-refined.png (64×40), sampan-empty-refined.png (128×56), statues-wood-refined.png and taoist-wood-refined.png. Built-in image generation prompts and source PNGs are saved here under those names. Snow rowboats retain their complete snow-covered version.
