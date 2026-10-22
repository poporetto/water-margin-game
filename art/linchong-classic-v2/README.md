# Lin Chong — Classic, both story outfits

Walking review: [both outfits animated on game backgrounds](../linchong-classic-motion-v3/in-game.html). The user approved v3 walking on 22 October 2026; both outfits are installed in root and docs builds. The approved standing designs below remain the character references.

**Approved on 21 October 2026:** the user approved both outfits in the game-background preview ("yes looks good!"). Use `official-original.png` and `exile-original.png` as Lin Chong's identity, costume and proportion references for subsequent animation and battle work. Preserve the approved face and detail. The standing designs were approved first; the subsequently approved v3 walking sheets are now installed. Dedicated battle poses remain pending.

Design study requested after the approved Song Jiang v3 walking integration. The user selected **both outfits, matching story progression**. Green instructor precedes exile; blue traveller follows `ch3_exiled` (or chapter > 3), matching the current portrait resolver.

Open `in-game.html` for front, left and back views beside the original Song Jiang Classic on three actual game locations. `compare.html` provides detailed frames and retained originals. These are static design turnarounds, not completed walking animations, and are not installed in the production Lin Chong slot.

Identity follows the project's Panther Head description and existing portraits: long angular face, thick brows, round alert eyes, topknot, close-cropped jaw beard, athletic build. Distinctions from Song Jiang include exposed topknot, short jaw beard rather than hanging goatee, diagonal collar, leather belt, and different costume silhouettes.

Generated with the built-in image generation tool. Initial exile prompt: `generation-prompt.txt`; targeted facial refinement: `face-refinement-prompt.txt`; instructor variant: `official-prompt.txt`. Original PNGs retain the native generated detail and transparency. Portrait references are lossless crops of the game's existing portrait sheets.

`pack.cjs` crops and packs both outfits with a single shared proportional scale, nearest-neighbour once from source, no colour quantization, 192 × 256 frames, 255 px foot baseline, 24 × 32 logical size, density 8. `packing.json` records the crop and scale. The runtime review sheet repeats each standing frame solely for engine compatibility. Its right-facing row is deliberately blank: the one-sided cheek mark and official hair ornament need separately authored right views before movement work.

The exile mark is clearer in the front view than the profile; revisit its contrast when preparing movement. Official side/back silver hair ornaments may also need stronger front-view visibility in the next refinement.

For later battle work: one dynamic, static left-facing Serpent Spear pose per outfit, keeping the same body scale and extending canvas width for the weapon.
