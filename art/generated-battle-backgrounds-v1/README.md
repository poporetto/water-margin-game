# Battle backgrounds — complete set

All 15 required backgrounds are complete: forest, town, field, plains, snow, river, marsh, night, palace, interior, temple, mountain, cave, fire and ridge. Generated with the built-in image tool using the user's layout guide, then exported as opaque 1920×1440 PNGs without cropping. Generation prompts (including the final temple revision), guide, brief and original outputs are retained in this directory. Production files are in `assets/backgrounds/`.

Visual direction: Northern Song China circa 1120, muted painterly HD-2D treatment. Scenery stays in the upper portion; flat ground fills the combat area and continues beneath the menu. The town uses timber framing, plaster, grey tiled roofs and simple cloth shop banners. No characters or interface are baked into the artwork.

The battle and duel engines share a cached image loader and full-screen background renderer. Unavailable themes and images still loading retain procedural artwork, with ground covering the entire screen. The `field` theme now has dedicated artwork rather than borrowing plains.

Preview: tools/battle-backgrounds.html, with optional fighter-position overlays. Verified through tools/test-battle-backgrounds.js and tools/test-battle-backgrounds-browser.js, including actual battle and duel screenshots.

No required backgrounds remain. Optional seasonal/regional variants have not been generated.
