# Wu Song · walking v2 scale correction

User reported stride frames slightly larger than approved standing poses. Native raw strips from v1 are re-exported once with nearest-neighbour sampling: front/back strides at 95% of their prior scale, left strides at 94%. Right row retains v1 exactly because neutral and strides already share a consistent scale.

Original front/left/back neutral PNGs remain byte-identical. Native source master remains unchanged. All adjustments are uniform (same factor in both axes), preserve colours and pose, and retain each prior foot baseline. No palette reduction, recolouring, source regeneration, or separate head splice.

The original poses extend limbs, so their silhouette widths naturally differ. The correction reduces head/body size while preserving that movement.

[Game preview](in-game.html) · [Frame comparison](compare.html). Raw generation prompts/provenance: [v1](../wusong-classic-motion-v1/README.md).

Not installed; movement review only.
