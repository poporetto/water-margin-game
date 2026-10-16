# Surface source atlas

Generated with the built-in image-generation tool on 2026-10-16. The exact prompt is in prompt.txt. Original art is preserved in surfaces-source.png.

Export with `node tools/build-surface-tiles.js` (requires sharp). The exporter crops the 4×4 grid, resamples to 32px, matches variant mean colours, quantizes each material family to 16 colours, and matches opposite borders across compatible variants. Outputs are individual opaque PNGs, a combined 128×128 atlas, and a numbered JSON index.

Floor textures are shared with furniture underlays. Carpet borders and bridge railings remain neighbour-aware runtime geometry. Crop colours retain the existing autumn/snow fallbacks. Scorched earth uses the new walkable `!` tile for map authoring; existing map layouts were not changed to add burnt areas.
