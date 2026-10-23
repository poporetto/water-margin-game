# Character sprite overrides

`songjiang.png` is the approved Classic walking sheet from `art/songjiang-classic-motion-v3/songjiang-walking.png`, installed without resampling or palette changes.

- Sheet: 576 × 1024; cells: 192 × 256.
- Rows: down, left, right, up.
- Columns: neutral, stride A, stride B; the engine plays 0 → 1 → 0 → 2.
- Manifest density: 8; logical character size: 24 × 32.
- Left/right rows preserve the approved v2 artwork. Front/back use the approved v3 trim, eye and brightness refinements with a subtle bob.

The viewport preserves the highest registered sprite density. Map caches and procedural assets retain their own density. Keep the matching file and manifest in `docs/` synchronized for the playable distribution.

Run `tools/test-songjiang-sprite.js` with the development server on port 8765 to check both entry points, actual keyboard movement, idle reset and native-density frame sampling. Playwright is required; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select a local browser.

Approved Classic walking sheets installed on 23 October 2026, all 576 × 1024 at density 8 (same layout as above):

- `wusong.png` from `art/wusong-classic-motion-v2/wusong-walking.png` (the stride scale correction), with the left row replaced by the right row mirrored cell by cell, at the user's request, so both side walks match.
- `chaogai.png`, `likui.png`, `yangzhi.png`, `wuyong.png` from `art/<id>-classic-motion-v1/<id>-walking.png`.
